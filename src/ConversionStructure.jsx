import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec3 aPosition;
attribute vec3 aColor;
attribute float aSeed;
uniform mat4 uViewProjection;
uniform float uTime;
uniform float uScroll;
uniform float uPointerActive;
uniform vec2 uPointer;
uniform float uFocus;
uniform float uPointScale;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec3 point = aPosition;
  float funnel = smoothstep(0.12, 0.31, uScroll) * (1.0 - smoothstep(0.37, 0.54, uScroll));
  float branching = smoothstep(0.48, 0.65, uScroll) * (1.0 - smoothstep(0.74, 0.91, uScroll));
  float returnFlow = smoothstep(0.82, 0.98, uScroll);

  float vertical = clamp((point.y + 1.2) / 2.4, 0.0, 1.0);
  float waist = 0.36 + vertical * 0.9;
  point.xz *= mix(1.0, waist, funnel);
  point.y *= mix(1.0, 1.25, funnel);
  point.x += sin(point.y * 2.5 + aSeed * 9.0 + uTime * 0.22) * funnel * 0.11;

  float lane = floor(aSeed * 3.0) - 1.0;
  point.x += lane * (0.28 + abs(point.y) * 0.22) * branching;
  point.z += sin(aSeed * 19.0 + uTime * 0.25) * branching * 0.12;
  point = mix(point, aPosition, returnFlow);

  float shimmer = sin(uTime * (0.42 + aSeed * 0.8) + aSeed * 87.0);
  point *= 1.0 + shimmer * 0.014;
  point.z += sin(aSeed * 31.0 + uTime * 0.31) * 0.018;

  vec4 clip = uViewProjection * vec4(point, 1.0);
  vec2 projected = clip.xy / clip.w;
  float cursorDistance = distance(projected, uPointer);
  float cursorPull = exp(-cursorDistance * cursorDistance * 17.0) * uPointerActive;
  point += normalize(point + vec3(0.001, 0.001, 0.0)) * cursorPull * (0.12 + aSeed * 0.07);
  point.z += cursorPull * 0.16;
  clip = uViewProjection * vec4(point, 1.0);

  float angle = atan(aPosition.z, aPosition.x) / 6.2831853 + 0.5;
  float focusAngle = mod(max(uFocus, 0.0), 8.0) / 8.0;
  float angleDelta = abs(fract(angle - focusAngle + 0.5) - 0.5);
  float focusLight = (1.0 - smoothstep(0.035, 0.19, angleDelta)) * step(0.0, uFocus);
  vColor = aColor * (0.74 + shimmer * 0.10 + focusLight * 0.48 + cursorPull * 0.42);
  vAlpha = 0.35 + aSeed * 0.45 + focusLight * 0.12;
  gl_Position = clip;
  gl_PointSize = uPointScale * (0.68 + aSeed * 0.8 + cursorPull * 1.9) * (1.0 / max(0.72, clip.w * 0.33));
}`;

const fragmentShader = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 point = gl_PointCoord - vec2(0.5);
  float distanceFromCenter = length(point);
  if (distanceFromCenter > 0.5) discard;
  float core = 1.0 - smoothstep(0.05, 0.5, distanceFromCenter);
  float halo = 1.0 - smoothstep(0.12, 0.5, distanceFromCenter);
  vec3 color = vColor * (0.55 + core * 1.25);
  gl_FragColor = vec4(color, (core * 0.76 + halo * 0.14) * vAlpha);
}`;

const identity = () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

function multiply(a, b) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] = a[row] * b[column * 4] + a[4 + row] * b[column * 4 + 1] + a[8 + row] * b[column * 4 + 2] + a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

function rotateX(angle) {
  const m = identity(), c = Math.cos(angle), s = Math.sin(angle);
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c;
  return m;
}

function rotateY(angle) {
  const m = identity(), c = Math.cos(angle), s = Math.sin(angle);
  m[0] = c; m[2] = -s; m[8] = s; m[10] = c;
  return m;
}

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2), range = 1 / (near - far), m = new Float32Array(16);
  m[0] = f / aspect; m[5] = f; m[10] = (near + far) * range; m[11] = -1; m[14] = near * far * 2 * range;
  return m;
}

function translation(x, y, z) {
  const m = identity(); m[12] = x; m[13] = y; m[14] = z; return m;
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Bode particle shader failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Bode particle program failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeParticles(count) {
  const random = seeded(20261101), positions = new Float32Array(count * 3), colors = new Float32Array(count * 3), seeds = new Float32Array(count);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y), theta = goldenAngle * i;
    const depth = 0.42 + Math.pow(random(), 0.42) * 0.76;
    const jitter = (random() - 0.5) * 0.035;
    const index = i * 3;
    positions[index] = (Math.cos(theta) * ring + jitter) * depth * 1.45;
    positions[index + 1] = (y + jitter) * depth * 1.45;
    positions[index + 2] = (Math.sin(theta) * ring + jitter) * depth * 1.45;

    const tone = random();
    const brightness = 0.68 + random() * 0.32;
    if (tone < 0.48) {
      colors[index] = 0.50 * brightness; colors[index + 1] = 0.82 * brightness; colors[index + 2] = 0.62 * brightness;
    } else if (tone < 0.77) {
      colors[index] = 0.76 * brightness; colors[index + 1] = 0.85 * brightness; colors[index + 2] = 0.79 * brightness;
    } else {
      colors[index] = 0.26 * brightness; colors[index + 1] = 0.62 * brightness; colors[index + 2] = 0.42 * brightness;
    }
    seeds[i] = random();
  }
  return { positions, colors, seeds };
}

export default function ConversionStructure() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: 0 });
  const focusRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: true, powerPreference: "low-power" });
    if (!gl) return undefined;

    const program = createProgram(gl);
    if (!program) return undefined;

    const count = window.innerWidth < 760 ? 2600 : 5200;
    const particles = makeParticles(count);
    const buffers = [gl.createBuffer(), gl.createBuffer(), gl.createBuffer()];
    [particles.positions, particles.colors, particles.seeds].forEach((data, index) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[index]);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    });
    const attributes = ["aPosition", "aColor", "aSeed"].map(name => gl.getAttribLocation(program, name));
    const uniforms = Object.fromEntries(["uViewProjection", "uTime", "uScroll", "uPointerActive", "uPointer", "uFocus", "uPointScale"].map(name => [name, gl.getUniformLocation(program, name)]));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const story = canvas.closest(".home-experience");
    const pointer = pointerRef.current;
    const view = identity();
    view[14] = -5.1;
    let width = 1, height = 1, frame = 0, startTime = 0, active = true;
    let motionAllowed = !reducedMotion.matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.35 : 1.65);
      width = Math.max(1, Math.round(rect.width * pixelRatio));
      height = Math.max(1, Math.round(rect.height * pixelRatio));
      canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const onPointerMove = event => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
      pointer.active = pointer.x >= -1 && pointer.x <= 1 && pointer.y >= -1 && pointer.y <= 1 ? 1 : 0;
    };
    const onPointerOut = event => { if (!event.relatedTarget) pointer.active = 0; };
    const onMotionChange = event => { motionAllowed = !event.matches; };
    const onFocus = event => {
      const value = event.target?.closest?.("[data-structure-focus]")?.getAttribute("data-structure-focus");
      if (value != null) focusRef.current = Number(value);
    };
    const onHoverFocus = event => {
      const value = event.target?.closest?.("[data-structure-focus]")?.getAttribute("data-structure-focus");
      if (value != null) focusRef.current = Number(value);
    };
    const onHoverClear = event => {
      const from = event.target?.closest?.("[data-structure-focus]");
      const to = event.relatedTarget?.closest?.("[data-structure-focus]");
      if (from && from !== to) focusRef.current = -1;
    };
    const onBlur = event => {
      if (event.target?.closest?.("[data-structure-focus]") && !event.relatedTarget?.closest?.("[data-structure-focus]")) focusRef.current = -1;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    reducedMotion.addEventListener?.("change", onMotionChange);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    document.addEventListener("pointerover", onHoverFocus);
    document.addEventListener("pointerout", onHoverClear);

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.clearColor(0, 0, 0, 0);
    attributes.forEach((location, index) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[index]);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, index === 2 ? 1 : 3, gl.FLOAT, false, 0, 0);
    });

    const animate = timestamp => {
      if (!startTime) startTime = timestamp;
      const elapsed = motionAllowed ? (timestamp - startTime) / 1000 : 0;
      const rect = story?.getBoundingClientRect();
      const scroll = rect ? Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight))) : 0;
      const aspect = width / height;
      const projection = perspective(Math.PI / 3.0, aspect, 0.1, 24);
      const rotation = multiply(rotateY(elapsed * 0.11 + pointer.x * 0.08), rotateX(Math.sin(elapsed * 0.2) * 0.06 - pointer.y * 0.08));
      const desktop = window.innerWidth >= 760;
      const offset = desktop ? 0.88 : 0;
      const viewProjection = multiply(projection, multiply(view, multiply(translation(offset, 0, 0), rotation)));

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(uniforms.uViewProjection, false, viewProjection);
      gl.uniform1f(uniforms.uTime, elapsed);
      gl.uniform1f(uniforms.uScroll, scroll);
      gl.uniform1f(uniforms.uPointerActive, pointer.active * (motionAllowed ? 1 : 0));
      gl.uniform2f(uniforms.uPointer, pointer.x, pointer.y);
      gl.uniform1f(uniforms.uFocus, focusRef.current);
      gl.uniform1f(uniforms.uPointScale, Math.min(width, height) * (desktop ? 0.006 : 0.005));
      gl.drawArrays(gl.POINTS, 0, count);

      if (active && !document.hidden) frame = window.requestAnimationFrame(animate);
    };

    const start = () => { if (active && !document.hidden && !frame) frame = window.requestAnimationFrame(animate); };
    const stop = () => { if (frame) window.cancelAnimationFrame(frame); frame = 0; };
    const onVisibility = () => document.hidden ? stop() : start();
    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false; stop(); observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      reducedMotion.removeEventListener?.("change", onMotionChange);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
      document.removeEventListener("pointerover", onHoverFocus);
      document.removeEventListener("pointerout", onHoverClear);
      document.removeEventListener("visibilitychange", onVisibility);
      buffers.forEach(buffer => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
    };
  }, []);

  return <div className="conversion-structure" aria-hidden="true">
    <canvas ref={canvasRef} className="conversion-structure-canvas" />
  </div>;
}


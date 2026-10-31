import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
uniform mat4 uMvp;
uniform mat4 uModel;
varying vec3 vNormal;
varying vec3 vColor;
void main() {
  vec4 worldPosition = uModel * vec4(aPosition, 1.0);
  vNormal = normalize(mat3(uModel) * aNormal);
  vColor = aColor;
  gl_Position = uMvp * vec4(aPosition, 1.0);
}`;

const fragmentSource = `
precision mediump float;
uniform vec3 uLightDirection;
varying vec3 vNormal;
varying vec3 vColor;
void main() {
  vec3 normal = normalize(vNormal);
  float diffuse = max(dot(normal, normalize(uLightDirection)), 0.0);
  float edgeLight = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
  vec3 color = vColor * (0.28 + diffuse * 0.68) + vec3(0.20, 0.34, 0.25) * edgeLight * 0.22;
  gl_FragColor = vec4(color, 1.0);
}`;

function identity() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function multiply(a, b) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

function rotateX(angle) {
  const c = Math.cos(angle), s = Math.sin(angle), m = identity();
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c;
  return m;
}

function rotateY(angle) {
  const c = Math.cos(angle), s = Math.sin(angle), m = identity();
  m[0] = c; m[2] = -s; m[8] = s; m[10] = c;
  return m;
}

function rotateZ(angle) {
  const c = Math.cos(angle), s = Math.sin(angle), m = identity();
  m[0] = c; m[1] = s; m[4] = -s; m[5] = c;
  return m;
}

function translate(x, y, z) {
  const m = identity();
  m[12] = x; m[13] = y; m[14] = z;
  return m;
}

function scale(value) {
  const m = identity();
  m[0] = value; m[5] = value; m[10] = value;
  return m;
}

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2), range = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect; m[5] = f;
  m[10] = (near + far) * range; m[11] = -1;
  m[14] = near * far * 2 * range;
  return m;
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

function makeMesh(gl, vertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return { buffer, count: vertices.length / 9 };
}

function pushVertex(out, position, normal, color) {
  out.push(...position, ...normal, ...color);
}

function makeTorus(gl, radius, tube, color, segments = 112, sides = 8) {
  const data = [];
  const point = (u, v) => {
    const c = Math.cos(v), s = Math.sin(v), cu = Math.cos(u), su = Math.sin(u);
    return {
      position: [(radius + tube * c) * cu, (radius + tube * c) * su, tube * s],
      normal: [c * cu, c * su, s]
    };
  };
  for (let i = 0; i < segments; i += 1) {
    const u0 = i / segments * Math.PI * 2, u1 = (i + 1) / segments * Math.PI * 2;
    for (let j = 0; j < sides; j += 1) {
      const v0 = j / sides * Math.PI * 2, v1 = (j + 1) / sides * Math.PI * 2;
      const a = point(u0, v0), b = point(u1, v0), c = point(u1, v1), d = point(u0, v1);
      pushVertex(data, a.position, a.normal, color); pushVertex(data, b.position, b.normal, color); pushVertex(data, c.position, c.normal, color);
      pushVertex(data, a.position, a.normal, color); pushVertex(data, c.position, c.normal, color); pushVertex(data, d.position, d.normal, color);
    }
  }
  return makeMesh(gl, data);
}

function makeSphere(gl, radius, color, segments = 14, rings = 9) {
  const data = [];
  const point = (u, v) => {
    const normal = [Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v)];
    return { position: normal.map(value => value * radius), normal };
  };
  for (let row = 0; row < rings; row += 1) {
    const v0 = row / rings * Math.PI, v1 = (row + 1) / rings * Math.PI;
    for (let col = 0; col < segments; col += 1) {
      const u0 = col / segments * Math.PI * 2, u1 = (col + 1) / segments * Math.PI * 2;
      const a = point(u0, v0), b = point(u1, v0), c = point(u1, v1), d = point(u0, v1);
      pushVertex(data, a.position, a.normal, color); pushVertex(data, b.position, b.normal, color); pushVertex(data, c.position, c.normal, color);
      pushVertex(data, a.position, a.normal, color); pushVertex(data, c.position, c.normal, color); pushVertex(data, d.position, d.normal, color);
    }
  }
  return makeMesh(gl, data);
}

function makeCube(gl) {
  const data = [];
  const faces = [
    { n: [0, 0, 1], c: [0.19, 0.36, 0.26], p: [[-0.53, -0.53, 0.53], [0.53, -0.53, 0.53], [0.53, 0.53, 0.53], [-0.53, 0.53, 0.53]] },
    { n: [0, 0, -1], c: [0.20, 0.23, 0.21], p: [[0.53, -0.53, -0.53], [-0.53, -0.53, -0.53], [-0.53, 0.53, -0.53], [0.53, 0.53, -0.53]] },
    { n: [1, 0, 0], c: [0.27, 0.31, 0.28], p: [[0.53, -0.53, 0.53], [0.53, -0.53, -0.53], [0.53, 0.53, -0.53], [0.53, 0.53, 0.53]] },
    { n: [-1, 0, 0], c: [0.15, 0.20, 0.17], p: [[-0.53, -0.53, -0.53], [-0.53, -0.53, 0.53], [-0.53, 0.53, 0.53], [-0.53, 0.53, -0.53]] },
    { n: [0, 1, 0], c: [0.31, 0.36, 0.32], p: [[-0.53, 0.53, 0.53], [0.53, 0.53, 0.53], [0.53, 0.53, -0.53], [-0.53, 0.53, -0.53]] },
    { n: [0, -1, 0], c: [0.12, 0.16, 0.13], p: [[-0.53, -0.53, -0.53], [0.53, -0.53, -0.53], [0.53, -0.53, 0.53], [-0.53, -0.53, 0.53]] }
  ];
  faces.forEach(({ n, c, p }) => {
    [[0, 1, 2], [0, 2, 3]].forEach(indices => indices.forEach(index => pushVertex(data, p[index], n, c)));
  });
  return makeMesh(gl, data);
}

function makeCubeEdges(gl) {
  const data = [], size = 0.53;
  const points = [];
  for (let z of [-size, size]) for (let y of [-size, size]) for (let x of [-size, size]) points.push([x, y, z]);
  const edgeColor = [0.55, 0.69, 0.59];
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const differingAxes = points[i].filter((v, axis) => v !== points[j][axis]).length;
      if (differingAxes === 1) {
        pushVertex(data, points[i], [0, 0, 1], edgeColor);
        pushVertex(data, points[j], [0, 0, 1], edgeColor);
      }
    }
  }
  return makeMesh(gl, data);
}

function applyAttributes(gl, program, mesh) {
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
  const stride = 9 * Float32Array.BYTES_PER_ELEMENT;
  const position = gl.getAttribLocation(program, "aPosition");
  const normal = gl.getAttribLocation(program, "aNormal");
  const color = gl.getAttribLocation(program, "aColor");
  gl.enableVertexAttribArray(position);
  gl.enableVertexAttribArray(normal);
  gl.enableVertexAttribArray(color);
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, stride, 0);
  gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.vertexAttribPointer(color, 3, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
}

const ringSpecs = [
  { tiltX: 0.92, tiltY: 0.12, tiltZ: -0.24, speed: 0.14, color: [0.61, 0.69, 0.63] },
  { tiltX: -0.28, tiltY: 1.02, tiltZ: 0.68, speed: -0.11, color: [0.35, 0.68, 0.47] },
  { tiltX: 1.34, tiltY: -0.44, tiltZ: -0.91, speed: 0.08, color: [0.36, 0.42, 0.38] }
];

export default function ConversionStructure() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: true, powerPreference: "low-power" });
    if (!gl) return undefined;

    const program = createProgram(gl);
    if (!program) return undefined;

    const ringMeshes = ringSpecs.map(spec => makeTorus(gl, 1.55, 0.018, spec.color));
    const cube = makeCube(gl);
    const cubeEdges = makeCubeEdges(gl);
    const nodes = ringSpecs.map((spec, index) => makeSphere(gl, index === 1 ? 0.062 : 0.047, spec.color));
    const pvLocation = gl.getUniformLocation(program, "uMvp");
    const modelLocation = gl.getUniformLocation(program, "uModel");
    const lightLocation = gl.getUniformLocation(program, "uLightDirection");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let startedAt = 0;
    let width = 0;
    let height = 0;
    let rotationX = 0;
    let rotationY = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
      width = Math.max(1, Math.round(rect.width * ratio));
      height = Math.max(1, Math.round(rect.height * ratio));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const view = identity();
    view[14] = -5.1;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.useProgram(program);
    gl.uniform3f(lightLocation, -0.42, 0.76, 0.84);

    const drawMesh = (mesh, model, projection, mode = gl.TRIANGLES) => {
      applyAttributes(gl, program, mesh);
      gl.uniformMatrix4fv(modelLocation, false, model);
      gl.uniformMatrix4fv(pvLocation, false, multiply(projection, multiply(view, model)));
      gl.drawArrays(mode, 0, mesh.count);
    };

    const render = timestamp => {
      if (!startedAt) startedAt = timestamp;
      const elapsed = reducedMotion ? 0 : (timestamp - startedAt) / 1000;
      const target = pointerRef.current;
      rotationX += (target.y * 0.23 - rotationX) * 0.035;
      rotationY += (target.x * 0.31 - rotationY) * 0.035;
      const root = multiply(rotateY(rotationY + elapsed * 0.105), rotateX(rotationX + Math.sin(elapsed * 0.21) * 0.035));
      const projection = perspective(Math.PI / 4.15, width / height, 0.1, 30);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      ringSpecs.forEach((spec, index) => {
        const orientation = multiply(rotateZ(spec.tiltZ), multiply(rotateY(spec.tiltY), rotateX(spec.tiltX)));
        const spin = rotateZ(elapsed * spec.speed + index * 0.42);
        const ringModel = multiply(root, multiply(spin, orientation));
        drawMesh(ringMeshes[index], ringModel, projection);

        const nodeAngle = elapsed * (spec.speed * 1.55) + index * 2.15;
        const nodeAt = multiply(ringModel, translate(Math.cos(nodeAngle) * 1.55, Math.sin(nodeAngle) * 1.55, 0));
        drawMesh(nodes[index], multiply(nodeAt, scale(1)), projection);
      });

      const cubeModel = multiply(root, multiply(rotateY(-elapsed * 0.16), rotateX(0.18 + Math.sin(elapsed * 0.25) * 0.025)));
      drawMesh(cube, cubeModel, projection);
      drawMesh(cubeEdges, cubeModel, projection, gl.LINES);

      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };

    render(0);
    if (!reducedMotion) frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      [...ringMeshes, ...nodes, cube, cubeEdges].forEach(mesh => gl.deleteBuffer(mesh.buffer));
      gl.deleteProgram(program);
    };
  }, []);

  const moveCamera = event => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2
    };
  };

  const resetCamera = () => { pointerRef.current = { x: 0, y: 0 }; };

  return <div className="conversion-structure" onPointerMove={moveCamera} onPointerLeave={resetCamera} role="img" aria-label="An animated three-dimensional structure of customer-journey rings around a central Bode cube.">
    <canvas ref={canvasRef} className="conversion-structure-canvas" aria-hidden="true" />
    <div className="structure-index" aria-hidden="true"><span>BODE / 01</span><span>COMMERCE PATH</span></div>
    <ol className="structure-stages" aria-label="The four stages of the customer journey">
      <li><b>01</b><span>Discover</span></li>
      <li><b>02</b><span>Consider</span></li>
      <li><b>03</b><span>Purchase</span></li>
      <li><b>04</b><span>Return</span></li>
    </ol>
  </div>;
}


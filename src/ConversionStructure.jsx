import { useEffect, useRef } from "react";

const vertex = `
attribute vec3 aPoint;
attribute float aSeed;
attribute vec3 aTone;
uniform float uTime;
uniform float uScroll;
uniform float uAspect;
uniform vec2 uPointer;
uniform float uMotion;
uniform float uPointScale;
varying vec3 vTone;
varying float vAlpha;
void main(){
  vec3 p=aPoint;
  float drift=sin(uTime*.26+aSeed*17.0)*.014*uMotion;
  p.x+=drift;
  p.z+=cos(uTime*.21+aSeed*13.0)*.012*uMotion;
  float branch=smoothstep(.22,.91,uScroll)*smoothstep(.22,.91,aSeed);
  p.x+=sign(p.x+.001)*branch*.19;
  p.z+=sin(aSeed*31.0+uTime*.12)*.045*uMotion;
  float nearCursor=exp(-dot(p.xy-uPointer*.62,p.xy-uPointer*.62)*5.5);
  p.xy+=uPointer*nearCursor*.045;
  float yaw=uTime*.055+uPointer.x*.19;
  float pitch=uPointer.y*.12;
  float x=p.x*cos(yaw)-p.z*sin(yaw);
  float z=p.x*sin(yaw)+p.z*cos(yaw);
  float y=p.y*cos(pitch)-z*sin(pitch);
  z=p.y*sin(pitch)+z*cos(pitch);
  float depth=3.9-z*.17;
  vec2 clip=vec2(x*uAspect,y)/depth;
  gl_Position=vec4(clip,z*.16,1.0);
  gl_PointSize=clamp(uPointScale*(.55+aSeed*1.55)*(1.0+nearCursor*.85),.65,3.4);
  vTone=aTone*(.65+nearCursor*.35+sin(uTime*.38+aSeed*22.0)*.07*uMotion);
  vAlpha=.28+aSeed*.64;
}`;
const fragment = `
precision mediump float;
varying vec3 vTone;
varying float vAlpha;
void main(){
  vec2 p=gl_PointCoord-.5;
  float d=length(p);
  if(d>.5) discard;
  float edge=1.0-smoothstep(.18,.5,d);
  float core=1.0-smoothstep(.02,.23,d);
  gl_FragColor=vec4(vTone*(.68+core*.58),edge*vAlpha*.78);
}`;
const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function compile(gl,type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){gl.deleteShader(sh);return null}return sh}
function makeProgram(gl){const v=compile(gl,gl.VERTEX_SHADER,vertex),f=compile(gl,gl.FRAGMENT_SHADER,fragment);if(!v||!f)return null;const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){gl.deleteProgram(p);return null}return p}
function dataFor(count){
 const points=new Float32Array(count*3),seeds=new Float32Array(count),tones=new Float32Array(count*3);
 let seed=11873;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const strands=26;
 for(let i=0;i<count;i++){
  const strand=i%strands,step=Math.floor(i/strands),t=step/Math.max(1,Math.ceil(count/strands)-1);
  const phase=strand/strands*Math.PI*2;
  const turns=t*Math.PI*4.7+phase+Math.sin(t*Math.PI*7+phase)*.34;
  const width=.22+.44*Math.pow(Math.sin(Math.PI*t),.72)+.13*Math.sin(t*Math.PI*2+phase);
  const fork=(strand%3===0?1:strand%3===1?-1:0)*Math.max(0,t-.44)*.84;
  const j=(rand()-.5)*.11;
  const k=i*3;
  points[k]=Math.cos(turns)*width+fork+j;
  points[k+1]=(t-.5)*3.7+(rand()-.5)*.065;
  points[k+2]=Math.sin(turns)*width*.72+Math.sin(t*Math.PI*2+phase)*.08+(rand()-.5)*.08;
  seeds[i]=rand();
  const hue=rand();
  const dim=.72+rand()*.28;
  if(hue<.56){tones[k]=.56*dim;tones[k+1]=.79*dim;tones[k+2]=.43*dim}
  else if(hue<.90){tones[k]=.72*dim;tones[k+1]=.78*dim;tones[k+2]=.76*dim}
  else{tones[k]=.53*dim;tones[k+1]=.49*dim;tones[k+2]=.69*dim}
 }
 return {points,seeds,tones}
}
export default function ConversionStructure(){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const gl=canvas.getContext("webgl",{alpha:true,antialias:false,powerPreference:"low-power"});
  if(!gl)return;
  const program=makeProgram(gl);if(!program)return;
  const mobile=matchMedia("(max-width: 700px)").matches;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const count=mobile?4200:10800, data=dataFor(count),buffers=[];
  const attributes=["points","seeds","tones"];
  const locations={};
  attributes.forEach((key,i)=>{const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data[key],gl.STATIC_DRAW);const name=["aPoint","aSeed","aTone"][i],loc=gl.getAttribLocation(program,name);locations[name]=loc;gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,i===1?1:3,gl.FLOAT,false,0,0)});
  const uniforms={};["uTime","uScroll","uAspect","uPointer","uMotion","uPointScale"].forEach(n=>uniforms[n]=gl.getUniformLocation(program,n));
  const pointer={x:0,y:0}, bounds={top:0,height:1};let frame=0,live=true,visible=true,start=performance.now();
  const updatePointer=e=>{const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/Math.max(1,r.width)-.5)*2;pointer.y=(.5-(e.clientY-r.top)/Math.max(1,r.height))*2};
  const touch=e=>{if(e.touches[0])updatePointer(e.touches[0])};
  const measure=()=>{const r=canvas.getBoundingClientRect();bounds.top=window.scrollY+r.top;bounds.height=Math.max(1,r.height)};
  const scroll=()=>{measure();schedule()};
  const resize=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,mobile?1:1.35);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));gl.viewport(0,0,canvas.width,canvas.height);schedule()};
  const draw=now=>{
   frame=0;if(!live||!visible)return;
   const rect=canvas.getBoundingClientRect(),vh=window.innerHeight;
   if(rect.bottom<-100||rect.top>vh+100){visible=false;return}
   const progress=Math.max(0,Math.min(1,(window.scrollY+vh-bounds.top)/(vh+bounds.height)));
   gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
   gl.uniform1f(uniforms.uTime,(now-start)/1000);gl.uniform1f(uniforms.uScroll,progress);gl.uniform1f(uniforms.uAspect,canvas.width/Math.max(1,canvas.height));
   gl.uniform2f(uniforms.uPointer,pointer.x,pointer.y);gl.uniform1f(uniforms.uMotion,reduced?0:1);gl.uniform1f(uniforms.uPointScale,mobile?1.45:1.25);
   gl.drawArrays(gl.POINTS,0,count);
   if(!reduced)frame=requestAnimationFrame(draw);
  };
  const schedule=()=>{visible=true;if(!frame&&live)frame=requestAnimationFrame(draw)};
  const observer=new IntersectionObserver(items=>{visible=items[0].isIntersecting;if(visible)schedule();else if(frame){cancelAnimationFrame(frame);frame=0}},{rootMargin:"120px"});
  observer.observe(canvas);canvas.addEventListener("pointermove",updatePointer,{passive:true});canvas.addEventListener("touchmove",touch,{passive:true});window.addEventListener("scroll",scroll,{passive:true});window.addEventListener("resize",resize);document.addEventListener("visibilitychange",scroll);resize();measure();
  return()=>{live=false;observer.disconnect();if(frame)cancelAnimationFrame(frame);canvas.removeEventListener("pointermove",updatePointer);canvas.removeEventListener("touchmove",touch);window.removeEventListener("scroll",scroll);window.removeEventListener("resize",resize);document.removeEventListener("visibilitychange",scroll);buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteProgram(program);gl.getExtension("WEBGL_lose_context")?.loseContext()};
 },[]);
 return <canvas ref={ref} className="conversion-structure" aria-hidden="true" />;
}

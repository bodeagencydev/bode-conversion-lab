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
  float along=clamp((aPoint.y+1.85)/3.7,0.0,1.0);
  vec3 p=aPoint;
  float journey=smoothstep(.12,.23,uScroll)*(1.0-smoothstep(.29,.39,uScroll));
  float services=smoothstep(.31,.42,uScroll)*(1.0-smoothstep(.49,.59,uScroll));
  float projects=smoothstep(.51,.62,uScroll)*(1.0-smoothstep(.68,.78,uScroll));
  float method=smoothstep(.70,.80,uScroll)*(1.0-smoothstep(.88,.96,uScroll));
  float finale=smoothstep(.89,.99,uScroll);

  float lane4=floor(aSeed*4.0);
  float node4=lane4-1.5;
  vec3 route=vec3(mix(-1.55,1.55,along),sin(along*3.14159*2.0+lane4*.72)*.47+node4*.11,sin(along*6.283+lane4)*.31);
  route.xy+=vec2(cos(aSeed*73.0+uTime*.15),sin(aSeed*91.0+uTime*.17))*.055*uMotion;

  float lane6=floor(aSeed*6.0)-2.5;
  vec3 service=vec3(lane6*.43+sin(along*6.283+lane6)*.16,(along-.5)*3.25,cos(along*6.283+lane6*.8)*.18);
  service.x+=sin(uTime*.24+along*9.0+lane6)*.035*uMotion;

  float card=floor(aSeed*3.0)-1.0;
  float localX=fract(aSeed*47.17)-.5;
  float localY=(along-.5)*1.6;
  vec3 gallery=vec3(card*.98+localX*1.05+localY*.14,localY, -.2+abs(card)*-.11+localX*.13);
  gallery.x+=sin(uTime*.17+aSeed*21.0)*.018*uMotion;

  vec3 process=vec3((along-.5)*3.25,sin(along*6.283)*.66,cos(along*6.283)*.43);
  process+=vec3(0.0,cos(aSeed*35.0+uTime*.12)*.04*uMotion,sin(aSeed*42.0+uTime*.13)*.05*uMotion);

  float thread=floor(aSeed*5.0)-2.0;
  vec3 exitFlow=vec3((along-.5)*3.5,sin(along*5.2+thread*.52)*(.34+abs(thread)*.07),cos(along*5.2+thread*.52)*.32);

  p=mix(p,route,journey);
  p=mix(p,service,services);
  p=mix(p,gallery,projects);
  p=mix(p,process,method);
  p=mix(p,exitFlow,finale);

  float yaw=uTime*.035+uPointer.x*.16+uScroll*.27;
  float pitch=uPointer.y*.11+sin(uTime*.12)*.035*uMotion;
  float x=p.x*cos(yaw)-p.z*sin(yaw);
  float z=p.x*sin(yaw)+p.z*cos(yaw);
  float y=p.y*cos(pitch)-z*sin(pitch);
  z=p.y*sin(pitch)+z*cos(pitch);
  float depth=3.85-z*.17;
  vec2 clip=vec2(x/max(.56,uAspect),y)/depth;
  clip.x+=uPointer.x*.035;
  gl_Position=vec4(clip,z*.16,1.0);
  float cursor=exp(-dot(p.xy-uPointer*.55,p.xy-uPointer*.55)*5.5);
  gl_PointSize=clamp(uPointScale*(.58+aSeed*1.42+cursor*.8),.65,3.2);
  float signal=sin(uTime*.33+aSeed*23.0)*.06*uMotion;
  vTone=aTone*(.65+cursor*.35+signal);
  vAlpha=.30+aSeed*.60;
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
  gl_FragColor=vec4(vTone*(.62+core*.56),edge*vAlpha*.74);
}`;
function compile(gl,type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.error("Bode world shader error:",gl.getShaderInfoLog(sh));gl.deleteShader(sh);return null}return sh}
function makeProgram(gl){const v=compile(gl,gl.VERTEX_SHADER,vertex),f=compile(gl,gl.FRAGMENT_SHADER,fragment);if(!v||!f)return null;const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){console.error("Bode world program error:",gl.getProgramInfoLog(p));gl.deleteProgram(p);return null}return p}
function dataFor(count){
 const points=new Float32Array(count*3),seeds=new Float32Array(count),tones=new Float32Array(count*3);
 let seed=11873;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const strands=26;
 for(let i=0;i<count;i++){
  const strand=i%strands,step=Math.floor(i/strands),t=step/Math.max(1,Math.ceil(count/strands)-1);
  const phase=strand/strands*Math.PI*2,turns=t*Math.PI*4.7+phase+Math.sin(t*Math.PI*7+phase)*.34;
  const width=.22+.44*Math.pow(Math.sin(Math.PI*t),.72)+.13*Math.sin(t*Math.PI*2+phase),fork=(strand%3===0?1:strand%3===1?-1:0)*Math.max(0,t-.44)*.84,j=(rand()-.5)*.11,k=i*3;
  points[k]=Math.cos(turns)*width+fork+j;
  points[k+1]=(t-.5)*3.7+(rand()-.5)*.065;
  points[k+2]=Math.sin(turns)*width*.72+Math.sin(t*Math.PI*2+phase)*.08+(rand()-.5)*.08;
  seeds[i]=rand();const hue=rand(),dim=.72+rand()*.28;
  if(hue<.52){tones[k]=.58*dim;tones[k+1]=.81*dim;tones[k+2]=.48*dim}
  else if(hue<.87){tones[k]=.77*dim;tones[k+1]=.82*dim;tones[k+2]=.81*dim}
  else{tones[k]=.55*dim;tones[k+1]=.51*dim;tones[k+2]=.7*dim}
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
  const mobile=matchMedia("(max-width: 700px)").matches,reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const count=mobile?3800:9000,data=dataFor(count),buffers=[],uniforms={};
  [["points","aPoint",3],["seeds","aSeed",1],["tones","aTone",3]].forEach(([key,name,size])=>{const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data[key],gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0)});
  ["uTime","uScroll","uAspect","uPointer","uMotion","uPointScale"].forEach(n=>uniforms[n]=gl.getUniformLocation(program,n));
  const pointer={x:0,y:0};let frame=0,live=true,lastTime=performance.now();
  const updatePointer=e=>{pointer.x=(e.clientX/Math.max(1,window.innerWidth)-.5)*2;pointer.y=(.5-e.clientY/Math.max(1,window.innerHeight))*2};
  const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,mobile?1:1.35);canvas.width=Math.max(1,Math.round(window.innerWidth*dpr));canvas.height=Math.max(1,Math.round(window.innerHeight*dpr));gl.viewport(0,0,canvas.width,canvas.height);schedule()};
  const scroll=()=>schedule();
  const draw=now=>{
   frame=0;if(!live||document.hidden)return;
   const span=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   const progress=Math.max(0,Math.min(1,window.scrollY/span));
   gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
   gl.uniform1f(uniforms.uTime,(now-lastTime)/1000);gl.uniform1f(uniforms.uScroll,progress);gl.uniform1f(uniforms.uAspect,canvas.width/Math.max(1,canvas.height));
   gl.uniform2f(uniforms.uPointer,pointer.x,pointer.y);gl.uniform1f(uniforms.uMotion,reduced?0:1);gl.uniform1f(uniforms.uPointScale,mobile?1.3:1.15);
   gl.drawArrays(gl.POINTS,0,count);
   if(!reduced)frame=requestAnimationFrame(draw);
  };
  const schedule=()=>{if(!frame&&live&&!document.hidden)frame=requestAnimationFrame(draw)};
  window.addEventListener("pointermove",updatePointer,{passive:true});window.addEventListener("scroll",scroll,{passive:true});window.addEventListener("resize",resize);document.addEventListener("visibilitychange",scroll);
  resize();
  return()=>{live=false;if(frame)cancelAnimationFrame(frame);window.removeEventListener("pointermove",updatePointer);window.removeEventListener("scroll",scroll);window.removeEventListener("resize",resize);document.removeEventListener("visibilitychange",scroll);buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteProgram(program);gl.getExtension("WEBGL_lose_context")?.loseContext()};
 },[]);
 return <canvas ref={ref} className="conversion-structure" aria-hidden="true" />;
}

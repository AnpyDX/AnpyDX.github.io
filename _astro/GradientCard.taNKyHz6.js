import{j as E}from"./jsx-runtime.D_zvdyIk.js";import{r as A}from"./index.CtnuBGm6.js";const x=60,P=1e3/x;function L(){const l=A.useRef(null);return A.useEffect(()=>{const o=l.current,e=o.getContext("webgl");if(!e){console.error("Ouch! WebGL 在当前浏览器不可用");return}const S=`
      attribute vec2 aPosition;
      varying vec2 vTexCoord;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        vTexCoord = 0.5 * aPosition + 0.5;
      }
    `,T=`
      precision mediump float;
      uniform float uTime;
      varying vec2 vTexCoord;
      vec3 palette(float t) {
        vec3 a = vec3(0.6, 0.6, 0.6);
        vec3 b = vec3(0.4, 0.4, 0.4);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(6.28318 * (c * t + d));
      }
      void main() {
        vec3 color = palette(0.2 * uTime + vTexCoord.x + 0.1 * vTexCoord.y);
        gl_FragColor = vec4(color, 1.0);
      }
    `,u=(r,n,f)=>{const a=r.createShader(f);return a?(r.shaderSource(a,n),r.compileShader(a),r.getShaderParameter(a,r.COMPILE_STATUS)?a:(console.error("着色器编译错误:",r.getShaderInfoLog(a)),r.deleteShader(a),null)):(console.error("着色器创建失败"),null)},c=u(e,S,e.VERTEX_SHADER),s=u(e,T,e.FRAGMENT_SHADER);if(!c||!s)return;const t=e.createProgram();if(e.attachShader(t,c),e.attachShader(t,s),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS)){console.error("程序链接失败:",e.getProgramInfoLog(t));return}e.useProgram(t);const R=new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),m=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,m),e.bufferData(e.ARRAY_BUFFER,R,e.STATIC_DRAW);const v=e.getAttribLocation(t,"aPosition");e.vertexAttribPointer(v,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(v);const p=e.getUniformLocation(t,"uTime");e.clearColor(0,0,0,1);const i=()=>{const r=o.clientWidth,n=o.clientHeight;(o.width!==r||o.height!==n)&&(o.width=r,o.height=n,e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight))};i(),window.addEventListener("resize",i);let d=0,h=performance.now();const g=r=>{if(d=requestAnimationFrame(g),r-h<P)return;h=r,i();const f=r/1e3;e.uniform1f(p,f),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,6)};return d=requestAnimationFrame(g),()=>{cancelAnimationFrame(d),window.removeEventListener("resize",i),e.deleteBuffer(m),e.deleteProgram(t),e.deleteShader(c),e.deleteShader(s)}},[]),E.jsx("canvas",{ref:l,style:{width:"100%",height:"100%",display:"block",borderRadius:"5px"}})}export{L as default};

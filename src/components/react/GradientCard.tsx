import { useRef, useEffect } from 'react';

const TARGET_FPS = 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

function GradientCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('Ouch! WebGL 在当前浏览器不可用');
      return;
    }

    const vsSource = `
      attribute vec2 aPosition;
      varying vec2 vTexCoord;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        vTexCoord = 0.5 * aPosition + 0.5;
      }
    `;

    const fsSource = `
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
    `;

    const compileShader = (gl: WebGLRenderingContext, source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) {
        console.error("着色器创建失败");
        return null;
      }
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('着色器编译错误:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('程序链接失败:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1, -1,
       1,  1,
      -1,  1
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    const uTime = gl.getUniformLocation(program, 'uTime');

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const resize = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId = 0;
    let lastRenderTime = performance.now();

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);

      const elapsed = now - lastRenderTime;
      if (elapsed < FRAME_INTERVAL) {
        return;
      }

      lastRenderTime = now;

      resize();

      const timeInSeconds = now / 1000;
      gl.uniform1f(uTime, timeInSeconds);

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);

      gl.deleteBuffer(vertexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        borderRadius: '5px'
      }}
    />
  );
};

export default GradientCard;
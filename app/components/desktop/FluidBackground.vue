<!-- components/desktop/FluidBackground.vue -->
<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-700"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const canvasRef = ref<HTMLCanvasElement | null>(null)

let gl: WebGLRenderingContext | null = null
let animationFrameId: number
let program: WebGLProgram | null = null

let uResLoc: WebGLUniformLocation | null = null
let uMouseLoc: WebGLUniformLocation | null = null
let uVelLoc: WebGLUniformLocation | null = null
let uSpinLoc: WebGLUniformLocation | null = null
let uTimeLoc: WebGLUniformLocation | null = null
let uDarkLoc: WebGLUniformLocation | null = null
let uRipplePosLoc: WebGLUniformLocation | null = null
let uRippleTimeLoc: WebGLUniformLocation | null = null
let uPressPosLoc: WebGLUniformLocation | null = null
let uPressIntensityLoc: WebGLUniformLocation | null = null

const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, spin: 0 }
const press = { x: 0, y: 0, targetX: 0, targetY: 0, intensity: 0, isDown: false }
const ripple = { x: 0, y: 0, time: -10 }
let isDarkMode = false
let currentDarkVal = 1.0

const vsSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fsSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_velocity;
  uniform float u_spin;
  uniform float u_time;
  uniform float u_dark;
  uniform vec2 u_ripple_pos;
  uniform float u_ripple_time;
  uniform vec2 u_press_pos;
  uniform float u_press_intensity;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    vec2 mouseNorm = u_mouse / u_resolution.xy;
    mouseNorm.x *= u_resolution.x / u_resolution.y;

    vec2 pressNorm = u_press_pos / u_resolution.xy;
    pressNorm.x *= u_resolution.x / u_resolution.y;

    float distToMouse = distance(st, mouseNorm);
    float mouseForce = smoothstep(0.35, 0.0, distToMouse);
    vec2 directionalWake = u_velocity * mouseForce * 0.05;

    float twirlAngle = u_spin * exp(-distToMouse * 8.5);
    vec2 twirledST = rotate2d(twirlAngle) * (st - mouseNorm) + mouseNorm;

    vec2 rPos = u_ripple_pos / u_resolution.xy;
    rPos.x *= u_resolution.x / u_resolution.y;
    float rDist = distance(twirledST, rPos);
    float rAge = u_time - u_ripple_time;

    vec2 rippleDisp = vec2(0.0);
    if (rAge > 0.0 && rAge < 3.0) {
      float rRadius = rAge * 0.42;
      float waveDist = abs(rDist - rRadius);
      float ringThickness = 0.05 + rAge * 0.03;
      float ringMask = smoothstep(ringThickness, 0.0, waveDist);

      float waveOscillation = sin((rDist - rRadius) * 44.0 - rAge * 14.0);
      float decay = exp(-rAge * 1.6) / (1.0 + rRadius * 2.2);

      vec2 dir = normalize(twirledST - rPos + vec2(0.0001));
      rippleDisp = dir * waveOscillation * ringMask * decay * 0.18;
    }

    float distToPress = distance(twirledST, pressNorm);
    vec2 pressDelta = twirledST - pressNorm;
    vec2 pressSwirlDir = vec2(-pressDelta.y, pressDelta.x);

    float pressWave = sin(distToPress * 36.0 - u_time * 12.0) * smoothstep(0.45, 0.0, distToPress) * u_press_intensity * 0.18;
    float pressSwirl = smoothstep(0.38, 0.0, distToPress) * u_press_intensity * 0.22;

    vec2 warp = vec2(
      snoise(twirledST * 1.5 + vec2(u_time * 0.07, u_time * 0.03)),
      snoise(twirledST * 1.5 + vec2(-u_time * 0.05, u_time * 0.09))
    );

    vec2 finalUV = twirledST + warp * 0.16 + directionalWake + rippleDisp + pressSwirlDir * pressSwirl + pressDelta * pressWave;

    float n1 = snoise(finalUV * 1.6 + u_time * 0.05);
    float n2 = snoise(finalUV * 2.8 - u_time * 0.07);
    float n3 = snoise(finalUV * 0.9 + vec2(n1, n2));

    vec3 darkBg = vec3(0.04, 0.06, 0.12);
    vec3 darkC1 = vec3(0.48, 0.22, 0.92);
    vec3 darkC2 = vec3(0.02, 0.71, 0.83);
    vec3 darkC3 = vec3(0.92, 0.28, 0.60);

    vec3 lightBg = vec3(0.92, 0.94, 0.98);
    vec3 lightC1 = vec3(0.96, 0.38, 0.48);
    vec3 lightC2 = vec3(0.25, 0.68, 0.95);
    vec3 lightC3 = vec3(0.96, 0.68, 0.22);

    vec3 bg = mix(lightBg, darkBg, u_dark);
    vec3 c1 = mix(lightC1, darkC1, u_dark);
    vec3 c2 = mix(lightC2, darkC2, u_dark);
    vec3 c3 = mix(lightC3, darkC3, u_dark);

    vec3 color = bg;
    color = mix(color, c1, smoothstep(-0.4, 0.6, n1) * 0.65);
    color = mix(color, c2, smoothstep(-0.3, 0.7, n2) * 0.55);
    color = mix(color, c3, smoothstep(-0.2, 0.8, n3) * 0.45);

    float pressGlow = smoothstep(0.35, 0.0, distToPress) * u_press_intensity * 0.25;
    vec3 glowColor = mix(vec3(0.3, 0.75, 1.0), vec3(0.75, 0.35, 1.0), u_dark);
    color += glowColor * pressGlow;

    float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.022;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`

const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null
  return shader
}

const initWebGL = () => {
  if (!canvasRef.value) return
  gl = canvasRef.value.getContext("webgl", { alpha: false, powerPreference: "high-performance" })
  if (!gl) return

  gl.getExtension("KHR_parallel_shader_compile")

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
  if (!vs || !fs) return

  program = gl.createProgram()
  if (!program) return

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

  const posLoc = gl.getAttribLocation(program, "position")
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  uResLoc = gl.getUniformLocation(program, "u_resolution")
  uMouseLoc = gl.getUniformLocation(program, "u_mouse")
  uVelLoc = gl.getUniformLocation(program, "u_velocity")
  uSpinLoc = gl.getUniformLocation(program, "u_spin")
  uTimeLoc = gl.getUniformLocation(program, "u_time")
  uDarkLoc = gl.getUniformLocation(program, "u_dark")
  uRipplePosLoc = gl.getUniformLocation(program, "u_ripple_pos")
  uRippleTimeLoc = gl.getUniformLocation(program, "u_ripple_time")
  uPressPosLoc = gl.getUniformLocation(program, "u_press_pos")
  uPressIntensityLoc = gl.getUniformLocation(program, "u_press_intensity")

  resizeCanvas()
}

const resizeCanvas = () => {
  if (!canvasRef.value || !gl) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = window.innerWidth * dpr
  const height = window.innerHeight * dpr

  canvasRef.value.width = width
  canvasRef.value.height = height
  gl.viewport(0, 0, width, height)
}

const render = (time: number) => {
  if (!gl || !program) return

  const seconds = time * 0.001
  const prevX = mouse.x
  const prevY = mouse.y

  mouse.x += (mouse.targetX - mouse.x) * 0.08
  mouse.y += (mouse.targetY - mouse.y) * 0.08

  const dx = mouse.x - prevX
  const dy = mouse.y - prevY

  mouse.vx += (dx - mouse.vx) * 0.1
  mouse.vy += (dy - mouse.vy) * 0.1

  const rawSpin = (mouse.vx * dy - mouse.vy * dx) * 0.015
  mouse.spin += (rawSpin - mouse.spin) * 0.05
  mouse.spin = Math.max(-0.6, Math.min(0.6, mouse.spin))

  press.x += (press.targetX - press.x) * 0.15
  press.y += (press.targetY - press.y) * 0.15

  press.intensity += ((press.isDown ? 1.0 : 0.0) - press.intensity) * 0.1
  currentDarkVal += ((isDarkMode ? 1.0 : 0.0) - currentDarkVal) * 0.05

  gl.uniform2f(uResLoc, canvasRef.value!.width, canvasRef.value!.height)
  gl.uniform2f(uMouseLoc, mouse.x * (canvasRef.value!.width / window.innerWidth), (window.innerHeight - mouse.y) * (canvasRef.value!.height / window.innerHeight))
  gl.uniform2f(uVelLoc, mouse.vx * 0.05, -mouse.vy * 0.05)
  gl.uniform1f(uSpinLoc, mouse.spin)
  gl.uniform1f(uTimeLoc, seconds)
  gl.uniform1f(uDarkLoc, currentDarkVal)
  gl.uniform2f(uRipplePosLoc, ripple.x * (canvasRef.value!.width / window.innerWidth), (window.innerHeight - ripple.y) * (canvasRef.value!.height / window.innerHeight))
  gl.uniform1f(uRippleTimeLoc, ripple.time)
  gl.uniform2f(uPressPosLoc, press.x * (canvasRef.value!.width / window.innerWidth), (window.innerHeight - press.y) * (canvasRef.value!.height / window.innerHeight))
  gl.uniform1f(uPressIntensityLoc, press.intensity)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
  animationFrameId = requestAnimationFrame(render)
}

const handlePointerMove = (e: PointerEvent) => {
  mouse.targetX = e.clientX
  mouse.targetY = e.clientY
  if (press.isDown) {
    press.targetX = e.clientX
    press.targetY = e.clientY
  }
}

const handlePointerUp = () => {
  press.isDown = false
}

// 🚀 Expose ripple trigger method to parent component
const triggerRipple = (x: number, y: number) => {
  press.isDown = true
  press.targetX = x
  press.targetY = y
  ripple.x = x
  ripple.y = y
  ripple.time = performance.now() * 0.001
}

defineExpose({
  triggerRipple,
})

let themeObserver: MutationObserver | null = null
const checkTheme = () => {
  isDarkMode = document.documentElement.classList.contains("dark")
}

onMounted(() => {
  if (import.meta.client) {
    checkTheme()
    themeObserver = new MutationObserver(checkTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    mouse.x = mouse.targetX = window.innerWidth / 2
    mouse.y = mouse.targetY = window.innerHeight / 2
    press.x = press.targetX = window.innerWidth / 2
    press.y = press.targetY = window.innerHeight / 2

    initWebGL()
    if (program) animationFrameId = requestAnimationFrame(render)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener("resize", resizeCanvas)
    window.removeEventListener("pointermove", handlePointerMove)
    window.removeEventListener("pointerup", handlePointerUp)
    if (themeObserver) themeObserver.disconnect()
  }
})
</script>

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../../store'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m = m*m; m = m*m;
    vec3 x3 = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x3) - 0.5;
    vec3 ox = floor(x3 + 0.5);
    vec3 a0 = x3 - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = vUv;
    float aspect = uResolution.x / uResolution.y;
    st.x *= aspect;

    vec2 mouse = uMouse;
    mouse.x *= aspect;

    float dist = distance(st, mouse);
    vec2 warp = st + (mouse - st) * (0.08 / (dist + 0.08));

    float t = uTime;

    float n1 = snoise(warp * 2.0 + t * 0.12);
    float n2 = snoise(warp * 4.0 - t * 0.18);
    float n3 = snoise(warp * 7.0 + t * 0.08);
    float n = n1 + 0.5 * n2 + 0.25 * n3;

    vec3 base   = vec3(0.96, 0.96, 0.98);
    vec3 blue   = vec3(0.78, 0.88, 1.00);
    vec3 pink   = vec3(1.00, 0.82, 0.88);
    vec3 violet = vec3(0.86, 0.78, 1.00);
    vec3 peach  = vec3(1.00, 0.88, 0.78);
    vec3 mint   = vec3(0.78, 1.00, 0.94);

    vec3 col = base;
    col = mix(col, blue,   smoothstep(-1.0, 1.0, n1) * 0.45);
    col = mix(col, pink,   smoothstep(-0.5, 0.8, sin(n * 3.0 + t * 0.5)) * 0.4);
    col = mix(col, violet, smoothstep(-0.2, 1.0, cos(n * 2.0 - t * 0.35)) * 0.35);
    col = mix(col, peach,  smoothstep(-0.8, 0.5, sin(n * 2.5 + t * 0.7)) * 0.3);
    col = mix(col, mint,   smoothstep( 0.0, 1.0, cos(n * 4.0 + t * 0.2)) * 0.2);

    // Сильный glow от курсора — видимая реакция
    float glow = exp(-dist * 2.5) * 0.25;
    col = mix(col, violet, glow);

    // Лёгкая виньетка к краям
    vec2 center = vUv - 0.5;
    float vignette = 1.0 - dot(center, center) * 0.5;
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function PearlShader() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const { viewport } = useThree()
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5))

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  }), [])

  useFrame(({ clock }) => {
    if (!matRef.current) return

    const { mouse, windowSize } = useAppStore.getState()

    const nx = mouse.x / windowSize.w
    const ny = 1.0 - mouse.y / windowSize.h

    smoothMouse.current.x += (nx - smoothMouse.current.x) * 0.08
    smoothMouse.current.y += (ny - smoothMouse.current.y) * 0.08

    matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    matRef.current.uniforms.uResolution.value.set(windowSize.w, windowSize.h)
    matRef.current.uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y)
  })

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../../store'

const vertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vEyeDir;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    float noise=snoise(position*2.0+uTime*1.5)*0.12;
    float noise2=snoise(position*4.0-uTime*2.0)*0.05;
    vec3 newPos=position+normal*(noise+noise2);

    vNormal=normalize(normalMatrix*normal);
    vWorldPos=(modelMatrix*vec4(newPos,1.0)).xyz;
    vEyeDir=normalize(cameraPosition-vWorldPos);

    gl_Position=projectionMatrix*modelViewMatrix*vec4(newPos,1.0);
  }
`

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vEyeDir;

  vec3 thinFilm(float cosTheta, float thickness){
    float d = thickness * cosTheta;
    vec3 c;
    c.r = 0.5 + 0.5 * cos(6.2832 * (d * 1.0 + 0.0));
    c.g = 0.5 + 0.5 * cos(6.2832 * (d * 1.0 + 0.33));
    c.b = 0.5 + 0.5 * cos(6.2832 * (d * 1.0 + 0.67));
    return c;
  }

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vEyeDir);

    float fresnel = pow(1.0 - max(dot(V, N), 0.0), 3.0);

    // Светлая хромированная основа
    vec3 reflected = reflect(-V, N);
    float envGrad = reflected.y * 0.5 + 0.5;
    vec3 env = mix(vec3(0.88, 0.90, 0.96), vec3(0.98, 0.97, 1.0), envGrad);

    // Iridescence — мягкий перелив
    float thickness = 2.0 + sin(uTime * 0.2) * 0.5;
    float cosA = max(dot(V, N), 0.0);
    vec3 irid = thinFilm(cosA, thickness);

    // Пастельный — приглушаем перелив
    irid = mix(vec3(0.92), irid, 0.45);

    // Перелив по краям, центр — чистый хром
    vec3 col = mix(env, irid, fresnel * 0.6 + 0.1);

    // Чёткие блики
    vec3 L1 = normalize(vec3(2.0, 3.0, 2.0));
    vec3 L2 = normalize(vec3(-2.0, 1.5, 3.0));
    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);
    float s1 = pow(max(dot(N, H1), 0.0), 180.0);
    float s2 = pow(max(dot(N, H2), 0.0), 80.0);
    col += vec3(1.0) * s1 * 0.45;
    col += vec3(0.95, 0.92, 1.0) * s2 * 0.2;

    // Rim glow — мягкий радужный край
    col += irid * pow(fresnel, 2.0) * 0.35;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function HeroSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const setSphereHovered = useAppStore((s) => s.setSphereHovered)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current || !matRef.current) return
    const t = clock.getElapsedTime()

    matRef.current.uniforms.uTime.value = t

    // Дыхание
    const breathe = Math.sin(t * 0.8) * 0.03 + 1.0
    meshRef.current.scale.setScalar(breathe)

    // Вращение
    meshRef.current.rotation.y = t * 0.12
    meshRef.current.rotation.x = Math.sin(t * 0.08) * 0.1

    // Лёгкое следование за мышью
    const targetX = 1.5 + pointer.x * 0.3
    const targetY = pointer.y * 0.2
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02
  })

  return (
    <mesh
      ref={meshRef}
      position={[1.5, 0, 0]}
      onPointerEnter={() => setSphereHovered(true)}
      onPointerLeave={() => setSphereHovered(false)}
    >
      <sphereGeometry args={[0.9, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
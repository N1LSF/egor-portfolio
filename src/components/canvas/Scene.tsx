import { Canvas } from '@react-three/fiber'
import PearlBackground from './PearlShader'
import HeroSphere from './HeroSphere'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
      }}
    >
      <PearlBackground />
      <HeroSphere />
    </Canvas>
  )
}
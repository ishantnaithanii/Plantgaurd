import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'

function createParticleMotion(index) {
  let seed = index + 1543
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  return {
    x: (random() - 0.5) * 5.2,
    y: (random() - 0.5) * 4.8,
    z: (random() - 0.5) * 2,
    size: 0.055 + random() * 0.075,
    speed: 0.25 + random() * 0.55,
    phase: random() * Math.PI * 2,
    rotationSpeed: (random() - 0.5) * 0.7,
  }
}

function createLeafShape() {
  const shape = new THREE.Shape()
  shape.moveTo(0, 1.8)
  shape.bezierCurveTo(0.35, 1.45, 1.45, 0.9, 1.28, 0.05)
  shape.bezierCurveTo(1.12, -0.75, 0.4, -1.45, 0, -1.8)
  shape.bezierCurveTo(-0.4, -1.45, -1.12, -0.75, -1.28, 0.05)
  shape.bezierCurveTo(-1.45, 0.9, -0.35, 1.45, 0, 1.8)
  return shape
}

function getBrandColors() {
  const styles = getComputedStyle(document.documentElement)
  const isDark = document.documentElement.classList.contains('dark')
  return {
    leaf: styles
      .getPropertyValue(isDark ? '--brand-400' : '--brand-700')
      .trim(),
    particle: styles.getPropertyValue('--brand-500').trim(),
    vein: styles
      .getPropertyValue(isDark ? '--brand-200' : '--brand-300')
      .trim(),
  }
}

function FloatingParticle({ geometry, index, color }) {
  const particleRef = useRef()
  const elapsedTime = useRef(0)
  const motion = useMemo(() => createParticleMotion(index), [index])

  useFrame((_, delta) => {
    const particle = particleRef.current
    elapsedTime.current += delta
    const elapsed = elapsedTime.current * motion.speed + motion.phase
    particle.position.x = motion.x + Math.sin(elapsed) * 0.18
    particle.position.y = motion.y + Math.sin(elapsed * 0.8) * 0.25
    particle.position.z = motion.z + Math.cos(elapsed) * 0.12
    particle.rotation.z += delta * motion.rotationSpeed
    particle.rotation.x += delta * motion.rotationSpeed * 0.4
  })

  return (
    <mesh
      ref={particleRef}
      geometry={geometry}
      position={[motion.x, motion.y, motion.z]}
      scale={motion.size}
      rotation={[index * 0.3, index * 0.2, motion.phase]}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        transparent
        opacity={0.72}
      />
    </mesh>
  )
}

function LeafScene({ colors }) {
  const leafRef = useRef()
  const cursor = useThree((state) => state.pointer)

  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(createLeafShape(), {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.06,
        bevelThickness: 0.045,
        curveSegments: 24,
        steps: 1,
      }),
    [],
  )
  const veinGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.52, 0.17),
      new THREE.Vector3(0, -0.65, 0.17),
      new THREE.Vector3(0, 0.25, 0.17),
      new THREE.Vector3(0, 1.55, 0.17),
    ])
    return new THREE.TubeGeometry(curve, 32, 0.018, 8, false)
  }, [])
  const particles = useMemo(() => Array.from({ length: 25 }, (_, i) => i), [])

  useFrame((_, delta) => {
    const leaf = leafRef.current
    leaf.rotation.y += delta * 0.18
    leaf.rotation.x = THREE.MathUtils.lerp(leaf.rotation.x, cursor.y * 0.12, 0.04)
    leaf.rotation.z = THREE.MathUtils.lerp(leaf.rotation.z, -cursor.x * 0.12, 0.04)
  })

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color={colors.vein} />
      {particles.map((index) => (
        <FloatingParticle
          key={index}
          geometry={geometry}
          index={index}
          color={colors.particle}
        />
      ))}
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.28}>
        <group ref={leafRef} scale={0.82}>
          <mesh geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={colors.leaf}
              roughness={0.42}
              metalness={0.02}
            />
          </mesh>
          <mesh geometry={veinGeometry}>
            <meshStandardMaterial color={colors.vein} roughness={0.65} />
          </mesh>
        </group>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export default function Hero3D() {
  const [colors, setColors] = useState(getBrandColors)

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(getBrandColors()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="h-[320px] w-full" aria-label="Floating 3D green leaf">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 42 }} dpr={[1, 1.5]}>
        <LeafScene colors={colors} />
      </Canvas>
    </div>
  )
}

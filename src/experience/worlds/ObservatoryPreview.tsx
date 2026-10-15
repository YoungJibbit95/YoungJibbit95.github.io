import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import { getWorld } from '../SceneRegistry'
import type { WorldSceneProps } from '../worldTypes'

const points = getWorld('observatory').hotspots

export default function ObservatoryPreview({ onFocus, selectedId }: WorldSceneProps) {
  const stars = useMemo(() => {
    const buffer = new Float32Array(110 * 3)
    for (let index = 0; index < 110; index++) {
      buffer[index * 3] = ((index * 61) % 131) / 3 - 22
      buffer[index * 3 + 1] = ((index * 37) % 107) / 5 - 11
      buffer[index * 3 + 2] = ((index * 83) % 129) / 3 - 35
    }
    return buffer
  }, [])

  return (
    <>
      <color attach="background" args={['#080e1d']} />
      <fog attach="fog" args={['#080e1d', 42, 98]} />
      <ambientLight intensity={0.48} />
      <directionalLight position={[10, 14, 8]} color="#c6eaf7" intensity={1.8} />
      <pointLight position={[0, 4, -7]} intensity={55} color="#a891ff" />
      <gridHelper args={[68, 30, '#42557e', '#1b2845']} position={[0, -8, -12]} />
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#c4c9f2"
          size={0.075}
          transparent
          opacity={0.58}
          depthWrite={false}
        />
      </points>
      <Line
        points={points.map((spot) => [...spot.position] as [number, number, number])}
        color="#a891ff"
        lineWidth={1.75}
        transparent
        opacity={0.44}
      />
      {points.map((spot, index) => (
        <group key={spot.id} position={[...spot.position]}>
          <mesh
            name={'observatory-' + spot.id}
            rotation={[0.1, index * 0.8, 0.2]}
            onClick={(event) => {
              if (event.delta > 6) return
              event.stopPropagation()
              onFocus(spot.id)
            }}
          >
            {index === 2 ? (
              <dodecahedronGeometry args={[2.15, 1]} />
            ) : (
              <icosahedronGeometry args={[index === 0 ? 1.85 : 1.55, 2]} />
            )}
            <meshStandardMaterial
              color={index === 0 ? '#91e3e5' : index === 1 ? '#a891ff' : '#f3b867'}
              roughness={0.36}
              metalness={0.45}
              emissive={selectedId === spot.id ? '#a891ff' : '#25304f'}
              emissiveIntensity={selectedId === spot.id ? 0.85 : 0.24}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0.3, index * 0.6]}>
            <torusGeometry args={[3.1, 0.025, 6, 125]} />
            <meshBasicMaterial color="#99aecb" transparent opacity={0.66} />
          </mesh>
          <mesh rotation={[Math.PI / 3.3, index * 0.3, 0]}>
            <torusGeometry args={[4.15, 0.015, 6, 128]} />
            <meshBasicMaterial color="#a891ff" transparent opacity={0.25} />
          </mesh>
          <pointLight
            color={index === 2 ? '#f3b867' : '#a891ff'}
            intensity={selectedId === spot.id ? 18 : 7}
            distance={17}
          />
        </group>
      ))}
    </>
  )
}

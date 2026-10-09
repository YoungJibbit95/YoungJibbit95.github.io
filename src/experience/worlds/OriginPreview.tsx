import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import { getWorld } from '../SceneRegistry'
import type { WorldSceneProps } from '../worldTypes'

const points = getWorld('origin').hotspots

export default function OriginPreview({ onFocus, selectedId }: WorldSceneProps) {
  const distant = useMemo(() => {
    const positions = new Float32Array(120 * 3)
    for (let index = 0; index < 120; index++) {
      positions[index * 3] = ((index * 71) % 139) / 3 - 23
      positions[index * 3 + 1] = ((index * 43) % 109) / 4 - 13
      positions[index * 3 + 2] = ((index * 97) % 127) / 3 - 34
    }
    return positions
  }, [])

  return (
    <>
      <color attach="background" args={['#070914']} />
      <fog attach="fog" args={['#070914', 34, 92]} />
      <ambientLight intensity={0.34} />
      <directionalLight position={[-8, 11, 9]} color="#a9ddff" intensity={2.4} />
      <pointLight position={[-9, 3, -8]} color="#78e8e8" intensity={65} />
      <pointLight position={[10, 4, -18]} color="#a891ff" intensity={80} />
      <gridHelper args={[65, 26, '#3e6874', '#182b38']} position={[0, -7, -10]} />
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[distant, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#9ebbd1" size={0.09} transparent opacity={0.65} depthWrite={false} />
      </points>
      <Line
        points={points.map((spot) => [...spot.position] as [number, number, number])}
        color="#78e8e8"
        lineWidth={1.6}
        transparent
        opacity={0.48}
      />
      {points.map((spot, index) => (
        <group key={spot.id} position={[...spot.position]}>
          <mesh
            name={spot.id}
            onClick={(event) => {
              if (event.delta > 6) return
              event.stopPropagation()
              onFocus(spot.id)
            }}
          >
            {index === 1 ? (
              <octahedronGeometry args={[1.65, 1]} />
            ) : (
              <icosahedronGeometry args={[index === 0 ? 1.6 : 2.25, 2]} />
            )}
            <meshStandardMaterial
              color={index === 0 ? '#78e8e8' : index === 1 ? '#f3b867' : '#a891ff'}
              metalness={0.5}
              roughness={0.24}
              emissive={selectedId === spot.id ? '#78e8e8' : '#173342'}
              emissiveIntensity={selectedId === spot.id ? 0.8 : 0.25}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.3, index * 0.45, 0]}>
            <torusGeometry args={[3.2, 0.024, 6, 110]} />
            <meshBasicMaterial color="#97dfe8" transparent opacity={0.55} depthWrite={false} />
          </mesh>
          <mesh rotation={[0.1, 1.1, index * 0.8]}>
            <torusGeometry args={[3.95, 0.013, 5, 116]} />
            <meshBasicMaterial color="#a891ff" transparent opacity={0.32} depthWrite={false} />
          </mesh>
          <pointLight
            intensity={selectedId === spot.id ? 12 : 4}
            distance={13}
            color={index === 1 ? '#f3b867' : '#78e8e8'}
          />
        </group>
      ))}
    </>
  )
}

import { memo } from 'react'
import type { ProjectId, SemanticLevel } from '../../src/experience/observatory/contracts'

export const cosmicProjectColors: Record<ProjectId, string> = {
  nexus: '#78E8E8',
  cerebri: '#B6A0ED',
  novacore: '#EBC18A',
  nemisis: '#D897B0',
  adventura: '#93D3C2',
  yjse: '#AFBFF0',
  jarvis: '#A891FF',
}

function Orbit({
  radius,
  tilt = 0,
  color,
  arc = Math.PI * 2,
}: {
  radius: number
  tilt?: number
  color: string
  arc?: number
}) {
  return (
    <mesh rotation={[Math.PI / 2 + tilt, tilt * 0.6, 0]}>
      <torusGeometry args={[radius, 0.65, 5, 52, arc]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

/** Compact authored signatures only. Full project-world redesign is outside this slice. */
export const CosmicProjectMarker = memo(function CosmicProjectMarker({
  id,
  selected = false,
  level,
}: {
  id: ProjectId
  selected?: boolean
  level: SemanticLevel
}) {
  const color = cosmicProjectColors[id]
  if (level !== 'macro') return null
  return (
    <group name={'cosmic-signature-' + id} scale={selected ? 1.1 : 1}>
      {id === 'cerebri' ? (
        <>
          <Orbit radius={29} tilt={0.24} color={color} arc={Math.PI * 1.6} />
          <Orbit radius={20} tilt={-0.4} color={color} arc={Math.PI * 1.4} />
          <Orbit radius={10} tilt={0.65} color="#E9EDF4" arc={Math.PI * 1.7} />
        </>
      ) : null}
      {id === 'novacore' ? (
        <>
          <Orbit radius={23} tilt={0.4} color={color} arc={Math.PI * 1.85} />
          {Array.from({ length: 7 }, (_, index) => (
            <group key={index} rotation-y={(index * Math.PI * 2) / 7}>
              <mesh position={[23, 0, 0]} rotation={[0.3, 0, 0.35]}>
                <boxGeometry args={[18, 3, 5]} />
                <meshStandardMaterial
                  color="#51405b"
                  emissive={color}
                  emissiveIntensity={0.25}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
            </group>
          ))}
          <mesh>
            <octahedronGeometry args={[10, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        </>
      ) : null}
      {id === 'nemisis' ? (
        <group rotation={[0.3, -0.35, 0.15]}>
          {[-1, 0, 1].map((index) => (
            <mesh
              key={index}
              position={[index * 13, index === 0 ? 6 : 0, 0]}
              rotation-x={Math.PI / 2}
            >
              <coneGeometry args={[index === 0 ? 9 : 5, index === 0 ? 54 : 32, 4]} />
              <meshStandardMaterial
                color="#3c2847"
                emissive={color}
                emissiveIntensity={0.35}
                metalness={0.75}
                roughness={0.3}
              />
            </mesh>
          ))}
          <Orbit radius={28} tilt={0.2} color={color} arc={Math.PI * 0.85} />
        </group>
      ) : null}
      {id === 'adventura' ? (
        <group rotation={[0.2, 0.4, 0]}>
          {Array.from({ length: 9 }, (_, index) => (
            <mesh
              key={index}
              position={[
                Math.cos(index * 1.1) * (13 + index),
                (index - 4) * 5,
                Math.sin(index * 1.1) * (13 + index),
              ]}
            >
              <boxGeometry args={[index % 3 === 0 ? 12 : 7, 6, 9]} />
              <meshStandardMaterial
                color="#243b4b"
                emissive={color}
                emissiveIntensity={0.3}
                metalness={0.4}
                roughness={0.4}
              />
            </mesh>
          ))}
          <Orbit radius={30} tilt={0.3} color={color} arc={Math.PI * 1.3} />
        </group>
      ) : null}
      {id === 'yjse' ? (
        <group rotation={[0.1, 0.5, -0.2]}>
          {[-1, 0, 1].map((index) => (
            <group key={index} position={[index * 5, index * 12, 0]}>
              <mesh>
                <boxGeometry args={[36 - Math.abs(index) * 8, 1.2, 23]} />
                <meshStandardMaterial
                  color="#293158"
                  emissive={color}
                  emissiveIntensity={0.18}
                  metalness={0.6}
                  roughness={0.3}
                />
              </mesh>
              <mesh position={[0, 1, 11.5]}>
                <boxGeometry args={[36 - Math.abs(index) * 8, 0.5, 0.7]} />
                <meshBasicMaterial color={color} toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>
      ) : null}
      {id === 'jarvis' ? (
        <>
          <Orbit radius={28} tilt={0.8} color={color} arc={Math.PI * 1.8} />
          <group rotation-y={1.8}>
            <Orbit radius={23} tilt={-0.7} color="#78B6D9" arc={Math.PI * 1.65} />
          </group>
          <mesh scale={[0.6, 2, 0.6]}>
            <octahedronGeometry args={[10, 0]} />
            <meshBasicMaterial color="#b6a6ee" toneMapped={false} />
          </mesh>
        </>
      ) : null}
    </group>
  )
})

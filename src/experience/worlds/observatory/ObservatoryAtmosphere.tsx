import { memo, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { BlockBatch } from './ProjectArchitecture'

/** Vast, interrupted meridians mark depth without drawing invented software links. */
export const ObservatoryAtmosphere = memo(function ObservatoryAtmosphere() {
  const compact = useThree((state) => state.size.width < 768)
  const foreground = useMemo(
    () => [
      { position: [-95, 8, 0] as const, scale: [14, 275, 65] as const },
      { position: [82, -76, 0] as const, scale: [14, 106, 65] as const },
      { position: [-5, -123, 0] as const, scale: [194, 12, 65] as const },
      { position: [-50, 139, 0] as const, scale: [104, 14, 65] as const },
      { position: [-80, 8, 25] as const, scale: [2, 230, 10] as const, tone: 1.7 },
    ],
    [],
  )
  const distant = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        position: [-620 + i * 125, -70 + Math.sin(i * 1.3) * 80, -1060 - (i % 3) * 130] as const,
        scale: [18, 200 + (i % 4) * 55, 46] as const,
        rotation: [0, -0.3, 0.08] as const,
        tone: 0.7 + (i % 3) * 0.1,
      })),
    [],
  )
  const markers = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) => {
        const angle = (index / 48) * Math.PI * 2
        return {
          position: [Math.cos(angle) * 540, -130, Math.sin(angle) * 540 - 230] as const,
          scale: [index % 4 === 0 ? 2 : 1, index % 4 === 0 ? 21 : 9, 3] as const,
          rotation: [0, -angle, 0] as const,
          tone: 0.7 + (index % 3) * 0.1,
        }
      }),
    [],
  )
  const stars = useMemo(() => {
    const count = compact ? 90 : 150
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = ((i * 137) % 1800) - 900
      positions[i * 3 + 1] = ((i * 89) % 720) - 310
      positions[i * 3 + 2] = -((i * 173) % 1350) - 300
    }
    return positions
  }, [compact])
  return (
    <group name="observatory-atmosphere">
      <group position={[0, -130, -230]} rotation={[-Math.PI / 2, 0, 0.18]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, i * 2.2]}>
            <torusGeometry args={[540 + i * 9, i === 0 ? 1.5 : 0.6, 5, 110, 1.7]} />
            <meshBasicMaterial color={i === 0 ? '#637078' : '#354550'} />
          </mesh>
        ))}
      </group>
      <BlockBatch blocks={markers} color="#617781" />
      <group position={[-310, -70, 170]} rotation={[0, -0.3, -0.08]}>
        <BlockBatch blocks={foreground} color="#293e48" />
      </group>
      <BlockBatch blocks={distant} color="#1e303a" />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.8} color="#afc2ca" transparent opacity={0.48} depthWrite={false} />
      </points>
    </group>
  )
})

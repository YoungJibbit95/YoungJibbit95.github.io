import { memo, useLayoutEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Color, InstancedMesh, Object3D } from 'three'
import type { ProjectId } from '../../observatory/contracts'
import type { Vec3 } from '../../worldTypes'

interface Block {
  position: Vec3
  scale: Vec3
  rotation?: Vec3
  tone?: number
}

/** Shared box geometry; each architectural layer is a single instanced draw. */
export const BlockBatch = memo(function BlockBatch({
  blocks,
  color,
  emissive = false,
}: {
  blocks: readonly Block[]
  color: string
  emissive?: boolean
}) {
  const ref = useRef<InstancedMesh>(null)
  const invalidate = useThree((state) => state.invalidate)
  useLayoutEffect(() => {
    if (!ref.current) return
    const transform = new Object3D()
    const tint = new Color()
    blocks.forEach((block, index) => {
      transform.position.set(...block.position)
      transform.scale.set(...block.scale)
      transform.rotation.set(...(block.rotation ?? [0, 0, 0]))
      transform.updateMatrix()
      ref.current!.setMatrixAt(index, transform.matrix)
      tint.set(color).multiplyScalar(block.tone ?? 0.78 + (index % 4) * 0.09)
      ref.current!.setColorAt(index, tint)
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    ref.current.computeBoundingSphere()
    invalidate()
  }, [blocks, color, invalidate])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, blocks.length]}>
      <boxGeometry />
      <meshStandardMaterial
        color="white"
        roughness={0.58}
        metalness={0.3}
        emissive={emissive ? color : '#11151b'}
        emissiveIntensity={emissive ? 0.38 : 0.08}
      />
    </instancedMesh>
  )
})

function frame(x: number, y: number, z: number, width: number, height: number): Block[] {
  return [
    { position: [x - width / 2, y, z], scale: [5, height, 12] },
    { position: [x + width / 2, y, z], scale: [5, height, 12] },
    { position: [x, y + height / 2, z], scale: [width + 5, 5, 12] },
    { position: [x, y - height / 2, z], scale: [width + 5, 5, 12] },
  ]
}

function mainBlocks(id: ProjectId): Block[] {
  switch (id) {
    case 'nexus':
      return [
        ...frame(-16, 4, 0, 28, 56),
        ...frame(18, -8, -19, 28, 48),
        { position: [0, -23, 8], scale: [77, 5, 40] },
        { position: [0, 25, -14], scale: [76, 5, 17] },
        { position: [6, 7, 12], scale: [9, 10, 9], tone: 1.5 },
      ]
    case 'cerebri':
      return Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return {
          position: [Math.cos(a) * 34, Math.sin(a) * 34, (i % 3) * 3] as Vec3,
          scale: [5, i % 4 === 0 ? 16 : 10, 14] as Vec3,
          rotation: [0, 0, a - Math.PI / 2] as Vec3,
          tone: i % 4 === 0 ? 1.4 : 0.8,
        }
      })
    case 'novacore':
      return Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return {
          position: [Math.cos(a) * 29, Math.sin(a) * 29, 0] as Vec3,
          scale: [10, 26, 30] as Vec3,
          rotation: [0.18, 0, a + 0.3] as Vec3,
          tone: 0.65 + (i % 3) * 0.25,
        }
      })
    case 'nemisis':
      return [
        ...Array.from({ length: 7 }, (_, i) => ({
          position: [(i - 3) * 11, 2 - Math.abs(i - 3) * 3, -i * 4] as Vec3,
          scale: [5, 56 - Math.abs(i - 3) * 8, 26] as Vec3,
          rotation: [0.18, -0.1, -0.62] as Vec3,
          tone: 0.7 + i * 0.06,
        })),
        { position: [0, -22, 0], scale: [85, 5, 22], rotation: [0, -0.32, 0] },
      ]
    case 'adventura':
      return Array.from({ length: 35 }, (_, i) => {
        const x = (i % 7) - 3
        const z = Math.floor(i / 7) - 2
        const h = 6 + Math.max(0, 4 - Math.abs(x) - Math.abs(z)) * 9
        return {
          position: [x * 11, -22 + h / 2, z * 11] as Vec3,
          scale: [10.6, h, 10.6] as Vec3,
          tone: 0.58 + h / 58,
        }
      })
    case 'yjse':
      return Array.from({ length: 15 }, (_, i) => {
        const tier = Math.floor(i / 5)
        return {
          position: [(i % 5) * 13 - 26 + tier * 6, tier * 18 - 20, -tier * 19] as Vec3,
          scale: [11.8, 4, 36] as Vec3,
          tone: 0.6 + tier * 0.3,
        }
      })
    case 'jarvis':
      return Array.from({ length: 23 }, (_, i) => {
        const a = (i / 22) * Math.PI * 1.7 - Math.PI * 0.35
        return {
          position: [Math.cos(a) * 31, Math.sin(a) * 37, Math.sin(a * 2) * 14] as Vec3,
          scale: [6, 15, 9] as Vec3,
          rotation: [0, a * 0.3, a - Math.PI / 2] as Vec3,
          tone: 0.75 + (i % 3) * 0.12,
        }
      })
  }
}

function detailBlocks(id: ProjectId, micro: boolean): Block[] {
  const index = ['nexus', 'cerebri', 'novacore', 'nemisis', 'adventura', 'yjse', 'jarvis'].indexOf(
    id,
  )
  const count = micro ? 40 : 12
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + index * 0.41
    const radius = micro ? 43 : 49
    if (micro && id === 'nexus')
      return {
        position: [-31 + (i % 8) * 8, -21 + Math.floor(i / 8) * 10, 8] as Vec3,
        scale: [1.2, 7, 1.5] as Vec3,
        tone: i % 4 === 0 ? 1.25 : 0.65,
      }
    if (micro && id === 'adventura')
      return {
        position: [((i * 7) % 57) - 28, 10 + (i % 4) * 3, ((i * 11) % 41) - 20] as Vec3,
        scale: [3, 3, 3] as Vec3,
        tone: 0.55 + (i % 5) * 0.15,
      }
    if (micro && id === 'yjse')
      return {
        position: [-30 + (i % 8) * 9, 17, -59 + Math.floor(i / 8) * 8] as Vec3,
        scale: [5, 2, 5] as Vec3,
        tone: 0.65 + (i % 3) * 0.3,
      }
    if (micro && id === 'nemisis')
      return {
        position: [-34 + (i % 8) * 10, -18 + Math.floor(i / 8) * 8, 15 - (i % 8) * 4] as Vec3,
        scale: [5, 1, 2] as Vec3,
        rotation: [0.18, -0.1, -0.62] as Vec3,
        tone: 0.8,
      }
    return {
      position: [Math.cos(a) * radius, Math.sin(a) * radius * 0.64, -16 + (i % 3) * 9] as Vec3,
      scale: micro ? ([1.2, 4 + (i % 5), 2.2] as Vec3) : ([3, 3, 6] as Vec3),
      rotation: [0, 0, a] as Vec3,
      tone: 0.62 + (i % 4) * 0.14,
    }
  })
}

/** These forms are illustrative project portraits, not diagrams of deployed internals. */
export const ProjectArchitecture = memo(function ProjectArchitecture({
  id,
  color,
  selected,
  level,
}: {
  id: ProjectId
  color: string
  selected: boolean
  level: 'macro' | 'meso' | 'micro'
}) {
  const compact = useThree((state) => state.size.width < 768)
  const blocks = useMemo(() => mainBlocks(id), [id])
  const meso = useMemo(() => detailBlocks(id, false).slice(0, compact ? 8 : 12), [id, compact])
  const micro = useMemo(() => detailBlocks(id, true).slice(0, compact ? 24 : 40), [id, compact])
  if (level === 'meso') return <BlockBatch blocks={meso} color={color} />
  if (level === 'micro') return <BlockBatch blocks={micro} color={color} emissive={selected} />
  return (
    <group>
      <BlockBatch blocks={blocks} color={color} emissive={selected} />
      {id === 'cerebri' && (
        <group rotation={[0.3, -0.35, 0]}>
          <mesh>
            <torusGeometry args={[25, 2.8, 6, 48, Math.PI * 1.65]} />
            <meshStandardMaterial color="#d6c5a5" roughness={0.55} metalness={0.4} />
          </mesh>
          <mesh rotation={[0, 0, 0.6]}>
            <boxGeometry args={[3, 47, 4]} />
            <meshStandardMaterial color="#eadbc1" roughness={0.5} />
          </mesh>
        </group>
      )}
      {id === 'novacore' && (
        <mesh rotation={[0.32, 0.1, 0.2]}>
          <octahedronGeometry args={[16, 0]} />
          <meshStandardMaterial color="#ebc18f" roughness={0.5} metalness={0.4} />
        </mesh>
      )}
      {id === 'jarvis' && (
        <mesh rotation={[0.1, 0.8, 0.6]}>
          <torusGeometry args={[19, 2.4, 6, 42, Math.PI * 1.65]} />
          <meshStandardMaterial color="#bbb7da" roughness={0.55} />
        </mesh>
      )}
    </group>
  )
})

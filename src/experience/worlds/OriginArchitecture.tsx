import { memo, useEffect, useMemo } from 'react'
import { BufferGeometry, DoubleSide, ExtrudeGeometry, Float32BufferAttribute, Shape } from 'three'

const STONE = '#e3e6d5'
const CUT = '#626f60'
const SIGNAL = '#d7e775'

/** Shared strata geometry has one owner and is released when the world unmounts. */
function useGeometry(factory: () => BufferGeometry, dependencies: readonly unknown[]) {
  const geometry = useMemo(factory, dependencies)
  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}

function foldGeometry(side: -1 | 1) {
  const positions: number[] = []
  const indices: number[] = []
  const length = 48
  const width = 16
  for (let i = 0; i <= length; i++) {
    const t = i / length
    const height = 5 + Math.sin(t * Math.PI) * 29
    for (let j = 0; j <= width; j++) {
      const u = j / width
      positions.push(
        side * (0.6 + Math.sin(u * Math.PI * 0.57) * 20 + Math.sin(t * Math.PI) * 1.8),
        -12 + Math.sin(u * Math.PI * 0.5) * height,
        21 - t * 64 + Math.sin(u * Math.PI) * 6,
      )
      if (i < length && j < width) {
        const a = i * (width + 1) + j
        indices.push(a, a + 1, a + width + 1, a + 1, a + width + 2, a + width + 1)
      }
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function leafGeometry(side: -1 | 1, horizon: boolean) {
  const shape = new Shape()
  const w = horizon ? 5.8 : 8.6
  const floor = horizon ? -12.4 : -13.45
  shape.moveTo(side * 0.16, floor)
  shape.lineTo(side * w, floor)
  if (horizon) {
    shape.lineTo(side * w, 1.5)
    shape.bezierCurveTo(side * w * 0.82, 3.2, side * w * 0.38, 4.6, side * 0.16, 4.7)
  } else {
    shape.lineTo(side * w, 13.6)
    shape.bezierCurveTo(side * w * 0.79, 12.8, side * w * 0.43, 5.4, side * 0.16, 2.4)
  }
  shape.closePath()
  return new ExtrudeGeometry(shape, {
    depth: horizon ? 2.8 : 3.2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.14,
    bevelThickness: 0.12,
    curveSegments: 18,
  })
}

/** Continuous curved mineral surfaces flank a thick, physically split threshold. */
export const OriginFold = memo(function OriginFold({ side }: { side: -1 | 1 }) {
  const surface = useGeometry(() => foldGeometry(side), [side])
  const leaf = useGeometry(() => leafGeometry(side, false), [side])
  return (
    <group>
      {[0, 1, 2, 3, 4, 5].map((layer) => (
        <mesh
          key={layer}
          geometry={surface}
          position={[side * layer * 0.42, -layer * 0.46, 0]}
          castShadow={layer === 0}
        >
          <meshStandardMaterial
            color={layer === 0 ? STONE : layer % 2 ? '#b4beaa' : '#8d9d85'}
            side={DoubleSide}
            roughness={0.87}
          />
        </mesh>
      ))}
      <mesh geometry={leaf} castShadow>
        <meshStandardMaterial attach="material-0" color={STONE} roughness={0.82} />
        <meshStandardMaterial attach="material-1" color={CUT} roughness={0.91} />
      </mesh>
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={index} position={[side * (2.2 + index * 1.16), -9.3, 3.38]}>
          <boxGeometry args={[0.055, index === 0 ? 1.25 : 0.6, 0.035]} />
          <meshStandardMaterial color="#8b9471" roughness={0.65} metalness={0.25} />
        </mesh>
      ))}
      <mesh position={[side * 0.28, -5.3, 3.37]}>
        <boxGeometry args={[0.11, 15.4, 0.06]} />
        <meshStandardMaterial color={SIGNAL} roughness={0.65} />
      </mesh>
    </group>
  )
})

function ringGeometry(radius: number, width: number, start: number, end: number, depth: number) {
  const shape = new Shape()
  const segments = 56
  for (let i = 0; i <= segments; i++) {
    const angle = start + (i / segments) * (end - start)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  for (let i = segments; i >= 0; i--) {
    const angle = start + (i / segments) * (end - start)
    shape.lineTo(Math.cos(angle) * (radius - width), Math.sin(angle) * (radius - width))
  }
  shape.closePath()
  return new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelThickness: 0.1,
    bevelSize: 0.12,
    curveSegments: 16,
  })
}

export const OriginHorizonFrame = memo(function OriginHorizonFrame() {
  const ring = useGeometry(() => ringGeometry(14.6, 3.2, -0.02, Math.PI + 0.02, 2.2), [])
  return (
    <group position={[0, -12.4, -1.4]}>
      {[0, 1, 2, 3, 4].map((layer) => (
        <mesh
          key={layer}
          geometry={ring}
          position={[0, -layer * 0.38, -layer * 2.7]}
          scale={[1 + layer * 0.065, 1 + layer * 0.065, 1]}
          castShadow={layer === 0}
        >
          <meshStandardMaterial
            attach="material-0"
            color={layer % 2 ? '#bac5af' : STONE}
            roughness={0.85}
          />
          <meshStandardMaterial attach="material-1" color={CUT} roughness={0.9} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5].map((step) => (
        <mesh key={step} position={[0, -0.3 + step * 0.27, -3.2 - step * 2.4]} receiveShadow>
          <boxGeometry args={[20 - step * 0.9, 0.5, 2.6]} />
          <meshStandardMaterial color={step % 2 ? '#c3ccb6' : STONE} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
})

export const OriginHorizonLeaf = memo(function OriginHorizonLeaf({ side }: { side: -1 | 1 }) {
  const leaf = useGeometry(() => leafGeometry(side, true), [side])
  return (
    <group>
      <mesh geometry={leaf} castShadow>
        <meshStandardMaterial attach="material-0" color="#a3b299" roughness={0.86} />
        <meshStandardMaterial attach="material-1" color={CUT} roughness={0.92} />
      </mesh>
      {[0, 1, 2, 3].map((line) => (
        <mesh key={line} position={[side * 3, -8 + line * 3.2, 2.96]}>
          <boxGeometry args={[5.3, 0.055, 0.04]} />
          <meshStandardMaterial color="#7d8c72" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
})

const roadX = (z: number) =>
  z >= 8 ? -28 - (z - 8) * 0.22 : z >= -16 ? -28 + ((8 - z) / 24) * 37 : 9 + ((-16 - z) / 60) * 51
const groundY = (z: number) => -13 + Math.max(0, Math.min(1, (-z - 8) / 90)) * 5

function ribbonGeometry() {
  const positions: number[] = []
  const indices: number[] = []
  for (let i = 0; i <= 120; i++) {
    const z = 100 - i * 1.8
    const x = roadX(z)
    const width = z > 8 ? 1.4 : 1.2
    positions.push(x - width, groundY(z) + 0.045, z, x + width, groundY(z) + 0.045, z)
    if (i < 120) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function groundGeometry() {
  const positions: number[] = []
  const indices: number[] = []
  for (let z = 0; z <= 60; z++) {
    for (let x = 0; x <= 40; x++) {
      const px = -320 + x * 16
      const pz = 230 - z * 9
      positions.push(px, groundY(pz) - 0.08, pz)
      if (z < 60 && x < 40) {
        const a = z * 41 + x
        indices.push(a, a + 1, a + 41, a + 1, a + 42, a + 41)
      }
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function bankGeometry(side: -1 | 1) {
  const shape = new Shape()
  for (let i = 0; i <= 60; i++) {
    const z = 120 - i * 5
    const x = roadX(z) + side * (43 + Math.sin(z * 0.028) * 11 + Math.sin(z * 0.063) * 3)
    if (i === 0) shape.moveTo(x, -z)
    else shape.lineTo(x, -z)
  }
  shape.lineTo(side * 440, 180)
  shape.lineTo(side * 440, -120)
  shape.closePath()
  const geometry = new ExtrudeGeometry(shape, { depth: 1.5, bevelEnabled: false, steps: 1 })
  geometry.rotateX(-Math.PI / 2)
  return geometry
}

const ContourBank = memo(function ContourBank({ side }: { side: -1 | 1 }) {
  const bank = useGeometry(() => bankGeometry(side), [side])
  return (
    <group>
      {[0, 1, 2, 3, 4, 5].map((layer) => (
        <mesh
          key={layer}
          geometry={bank}
          position={[side * layer * 5.6, -14 + layer * 1.42, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            attach="material-0"
            color={layer % 2 ? '#8c9a80' : '#9da98f'}
            roughness={1}
          />
          <meshStandardMaterial attach="material-1" color="#a5b296" roughness={1} />
        </mesh>
      ))}
    </group>
  )
})

/** Continuous ground and cut banks hold all three unchanged landmark coordinates. */
export const OriginArchitecture = memo(function OriginArchitecture() {
  const ground = useGeometry(groundGeometry, [])
  const ribbon = useGeometry(ribbonGeometry, [])
  return (
    <group>
      <mesh geometry={ground} receiveShadow>
        <meshStandardMaterial color="#87967c" roughness={1} />
      </mesh>
      <ContourBank side={-1} />
      <ContourBank side={1} />
      <mesh geometry={ribbon} receiveShadow>
        <meshStandardMaterial color={SIGNAL} side={DoubleSide} roughness={0.94} />
      </mesh>
      <group position={[9, -12.8, -16]}>
        {[0, 1, 2].map((layer) => (
          <mesh key={layer} position={[0, layer * 0.53, 0]} receiveShadow>
            <boxGeometry args={[32 - layer * 1.4, 0.52, 28 - layer * 1.5]} />
            <meshStandardMaterial color={layer === 2 ? STONE : '#aebba2'} roughness={0.92} />
          </mesh>
        ))}
        <mesh position={[0, 1.36, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.035, 26]} />
          <meshStandardMaterial color={SIGNAL} roughness={0.85} />
        </mesh>
      </group>
      <group position={[60, -9.4, -82]}>
        {[0, 1, 2, 3].map((layer) => (
          <mesh key={layer} position={[0, layer * 0.6, 0]} scale={[1, 1, 0.75]} receiveShadow>
            <cylinderGeometry args={[22 - layer * 0.8, 22 - layer * 0.8, 0.5, 64]} />
            <meshStandardMaterial color={layer === 3 ? STONE : '#adbaa1'} roughness={0.93} />
          </mesh>
        ))}
      </group>
    </group>
  )
})

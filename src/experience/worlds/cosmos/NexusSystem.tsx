import { memo, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  PerspectiveCamera,
  Sprite,
  SRGBColorSpace,
  Vector3,
} from 'three'
import type { SemanticLevel } from '../../observatory/contracts'
import { useExperienceStore } from '../../../store/experienceStore'

const RuntimeLabel = memo(function RuntimeLabel({
  text,
  position,
}: {
  text: string
  position: [number, number, number]
}) {
  const sprite = useRef<Sprite>(null)
  const point = useMemo(() => new Vector3(), [])
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 80
    const context = canvas.getContext('2d')!
    context.font = '500 36px Arial, sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = 'rgba(7,9,20,0.88)'
    context.fillRect(
      250 - context.measureText(text).width / 2,
      8,
      context.measureText(text).width + 12,
      64,
    )
    context.fillStyle = '#E9EDF4'
    context.fillText(text, 256, 40)
    const map = new CanvasTexture(canvas)
    map.colorSpace = SRGBColorSpace
    return map
  }, [text])
  useEffect(() => () => texture.dispose(), [texture])
  useFrame(({ camera, size }) => {
    if (!sprite.current) return
    sprite.current.getWorldPosition(point)
    const distance = camera.position.distanceTo(point)
    const height =
      (distance * Math.tan(((camera as PerspectiveCamera).fov * Math.PI) / 360) * 2 * 29) /
      size.height
    sprite.current.scale.set(height * 6.4, height, 1)
  })
  return (
    <sprite ref={sprite} position={position} renderOrder={9}>
      <spriteMaterial map={texture} depthTest={false} depthWrite={false} toneMapped={false} />
    </sprite>
  )
})

const CoreHalo = memo(function CoreHalo() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const context = canvas.getContext('2d')!
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(160,220,255,0.65)')
    gradient.addColorStop(0.25, 'rgba(100,135,220,0.2)')
    gradient.addColorStop(1, 'rgba(80,80,160,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)
    return new CanvasTexture(canvas)
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <sprite scale={[75, 75, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
})

function sailGeometry(inner: number, outer: number, start: number, span: number, rise: number) {
  const positions: number[] = []
  const indices: number[] = []
  const steps = 28
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const angle = start + t * span
    const lift = Math.sin(t * Math.PI) * rise
    for (const radius of [inner, outer])
      positions.push(Math.cos(angle) * radius, lift, Math.sin(angle) * radius)
    if (i < steps) {
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

function lightPaths(open: boolean) {
  const positions: number[] = []
  for (let client = 0; client < 4; client++) {
    const angle = (client * Math.PI) / 2 + 0.35
    const reach = open ? 42 : 33
    const a = [Math.cos(angle) * 8, 0, Math.sin(angle) * 8]
    const b = [Math.cos(angle) * reach, 8 + (client % 2) * 4, Math.sin(angle) * reach]
    positions.push(...a, ...b)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return geometry
}

const ClientSail = memo(function ClientSail({
  index,
  selected,
}: {
  index: number
  selected: boolean
}) {
  const angle = (index * Math.PI) / 2 + 0.1
  const inner = 21
  const outer = 37
  const span = index % 2 === 0 ? 1.16 : 0.76
  const root = useRef<Group>(null)
  const reducedMotion = useExperienceStore((state) => state.motion !== 'full')
  const scratch = useMemo(() => ({ center: new Vector3(), open: false, amount: 0 }), [])
  const geometry = useMemo(
    () => sailGeometry(inner, outer, angle, span, 10 + index * 1.3),
    [inner, outer, angle, span, index],
  )
  const rim = useMemo(
    () => sailGeometry(outer - 0.8, outer, angle, span, 10 + index * 1.3),
    [outer, angle, span, index],
  )
  useEffect(
    () => () => {
      geometry.dispose()
      rim.dispose()
    },
    [geometry, rim],
  )
  useFrame(({ camera, invalidate }, delta) => {
    if (!root.current?.parent) return
    root.current.parent.getWorldPosition(scratch.center)
    const distance = camera.position.distanceTo(scratch.center)
    scratch.open = selected && distance <= (scratch.open ? 176 : 172)
    const destination = scratch.open ? 1 : 0
    scratch.amount = reducedMotion
      ? destination
      : scratch.amount + (destination - scratch.amount) * (1 - Math.exp(-Math.min(delta, 0.05) * 7))
    if (Math.abs(destination - scratch.amount) < 0.001) scratch.amount = destination
    const direction = angle + span / 2
    root.current.position.set(
      Math.cos(direction) * scratch.amount * 9,
      (index % 2 ? -3 : 3) + scratch.amount * (index % 2 ? -6 : 6),
      Math.sin(direction) * scratch.amount * 9,
    )
    if (scratch.amount !== destination) invalidate()
  })
  return (
    <group ref={root} position-y={index % 2 ? -3 : 3} name={'nexus-client-sail-' + index}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={index % 2 ? '#242652' : '#171e40'}
          metalness={0.7}
          roughness={0.28}
          emissive={index % 2 ? '#242652' : '#171e40'}
          emissiveIntensity={0.45}
          side={DoubleSide}
        />
      </mesh>
      <mesh geometry={rim}>
        <meshBasicMaterial
          color={index % 2 ? '#A891FF' : '#78E8E8'}
          toneMapped={false}
          side={DoubleSide}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>
    </group>
  )
})

/** Four client sails around a shared luminous core; a spatial illustration, not live sync. */
export const NexusSystem = memo(function NexusSystem({
  selected = false,
  level,
}: {
  selected?: boolean
  level: SemanticLevel
}) {
  const open = selected && level === 'micro'
  const paths = useMemo(() => lightPaths(open), [open])
  const detail = useRef<Group>(null)
  const center = useMemo(() => new Vector3(), [])
  const close = useRef(false)
  useEffect(() => () => paths.dispose(), [paths])
  useFrame(({ camera }) => {
    if (!detail.current) return
    detail.current.getWorldPosition(center)
    close.current = selected && camera.position.distanceTo(center) <= (close.current ? 176 : 172)
    detail.current.visible = close.current
  })
  if (level === 'meso')
    return (
      <group name="nexus-orbital-structure">
        <mesh rotation={[Math.PI / 2, 0.18, 0.3]}>
          <torusGeometry args={[48, 0.18, 5, 72, Math.PI * 1.65]} />
          <meshBasicMaterial color="#7d70bb" transparent opacity={0.65} toneMapped={false} />
        </mesh>
      </group>
    )
  if (level === 'micro')
    return (
      <group ref={detail} name="nexus-runtime-detail" visible={false}>
        <RuntimeLabel text="@nexus/core" position={[0, 14, 0]} />
        {['Nexus Main', 'Nexus Mobile', 'Nexus Code', 'Nexus Code Mobile'].map((text, index) => (
          <RuntimeLabel
            key={text}
            text={text}
            position={[
              Math.cos((index * Math.PI) / 2 + 0.35) * 37,
              14,
              Math.sin((index * Math.PI) / 2 + 0.35) * 37,
            ]}
          />
        ))}
        <lineSegments geometry={paths}>
          <lineBasicMaterial color="#78E8E8" transparent opacity={0.8} toneMapped={false} />
        </lineSegments>
        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            rotation={[Math.PI / 2, index * 0.65, index * 0.28]}
            position-y={index * 2 - 2}
          >
            <torusGeometry args={[11 + index * 3, 0.12, 5, 56, Math.PI * 1.75]} />
            <meshBasicMaterial color={index === 0 ? '#78E8E8' : '#A891FF'} toneMapped={false} />
          </mesh>
        ))}
        {[0, 1, 2, 3].map((index) => (
          <mesh
            key={index}
            position={[
              Math.cos((index * Math.PI) / 2 + 0.35) * 30,
              7,
              Math.sin((index * Math.PI) / 2 + 0.35) * 30,
            ]}
            rotation={[0, (-index * Math.PI) / 2, 0]}
          >
            <boxGeometry args={[index % 2 ? 3 : 9, 0.8, index % 2 ? 8 : 4]} />
            <meshBasicMaterial color="#b8b3df" toneMapped={false} />
          </mesh>
        ))}
      </group>
    )
  return (
    <group name="nexus-stellar-system">
      <CoreHalo />
      {[0, 1, 2, 3].map((index) => (
        <ClientSail key={index} index={index} selected={selected} />
      ))}
      <mesh rotation={[0.1, Math.PI / 4, 0.16]}>
        <octahedronGeometry args={[8.5, 0]} />
        <meshBasicMaterial color="#d0eefa" toneMapped={false} />
      </mesh>
      <mesh rotation={[0.1, Math.PI / 4, 0.16]}>
        <octahedronGeometry args={[12, 0]} />
        <meshBasicMaterial
          color="#78E8E8"
          wireframe
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, -0.1, 0.16]}>
        <torusGeometry args={[17, 0.5, 6, 64]} />
        <meshBasicMaterial color="#a891ff" transparent opacity={0.8} toneMapped={false} />
      </mesh>
    </group>
  )
})

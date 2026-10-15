import { memo, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
  Group,
  Mesh,
  PerspectiveCamera,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
} from 'three'
import type { SemanticLevel } from '../../observatory/contracts'
import { useExperienceStore } from '../../../store/experienceStore'
import { advanceExplosion, getDiscoveryOpen, getExplodedPosition } from './explodedView'
import { nexusSemantics, type NexusClient } from './nexusSemantic'

const RuntimeLabel = memo(function RuntimeLabel({
  id,
  text,
  role,
}: {
  id: string
  text: string
  role: string
}) {
  const sprite = useRef<Sprite>(null)
  const point = useMemo(() => new Vector3(), [])
  const viewPoint = useMemo(() => new Vector3(), [])
  const label = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 104
    const context = canvas.getContext('2d')!
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.strokeStyle = '#070914'
    context.lineWidth = 7
    context.lineJoin = 'round'
    context.shadowColor = '#070914'
    context.shadowBlur = 7
    context.font = id === 'core' ? '500 35px monospace' : '500 36px Arial, sans-serif'
    context.strokeText(text, 256, 30)
    context.fillStyle = id === 'core' ? '#ecf4ff' : '#E9EDF4'
    context.fillText(text, 256, 30)
    const nameWidth = context.measureText(text).width
    context.font = '400 34px Arial, sans-serif'
    context.strokeText(role, 256, 76)
    context.fillStyle = '#bfc9e2'
    context.fillText(role, 256, 76)
    const map = new CanvasTexture(canvas)
    map.colorSpace = SRGBColorSpace
    return { map, width: (Math.max(nameWidth, context.measureText(role).width) + 14) / 512 }
  }, [id, text, role])
  useEffect(() => () => label.map.dispose(), [label])
  useFrame(({ camera, size }) => {
    if (!sprite.current) return
    sprite.current.getWorldPosition(point)
    const distance = -viewPoint.copy(point).applyMatrix4(camera.matrixWorldInverse).z
    const height =
      (distance * Math.tan(((camera as PerspectiveCamera).fov * Math.PI) / 360) * 2 * 44) /
      size.height
    sprite.current.scale.set((height * 512) / 104, height, 1)
    point.project(camera)
    const x = ((point.x + 1) * size.width) / 2
    const y = ((1 - point.y) * size.height) / 2
    const halfWidth = ((44 * 512) / 104) * label.width * 0.5 + 10
    const safeX = Math.max(halfWidth, Math.min(size.width - halfWidth, x))
    const safeY = Math.max(30, Math.min(size.height - 30, y))
    sprite.current.center.set(0.5 + (x - safeX) / ((44 * 512) / 104), 0.5 + (safeY - y) / 44)
  })
  return (
    <sprite
      ref={sprite}
      name={'nexus-label-' + id}
      renderOrder={9}
      userData={{
        label: text,
        role,
        glyphWidth: label.width,
        glyphHeight: 0.88,
        nameFontRatio: (id === 'core' ? 35 : 36) / 104,
        roleFontRatio: 34 / 104,
      }}
    >
      <spriteMaterial
        map={label.map}
        fog={false}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  )
})

const CoreStar = memo(function CoreStar({ selected }: { selected: boolean }) {
  const root = useRef<Group>(null)
  const halo = useRef<Sprite>(null)
  const material = useRef<SpriteMaterial>(null)
  const reducedMotion = useExperienceStore((state) => state.motion !== 'full')
  const scratch = useMemo(() => ({ center: new Vector3(), open: false, amount: 0 }), [])
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const context = canvas.getContext('2d')!
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(245,245,255,0.95)')
    gradient.addColorStop(0.16, 'rgba(173,211,255,0.72)')
    gradient.addColorStop(0.43, 'rgba(119,147,234,0.2)')
    gradient.addColorStop(1, 'rgba(80,80,160,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)
    return new CanvasTexture(canvas)
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  useFrame(({ camera, invalidate }, delta) => {
    if (!root.current || !material.current || !halo.current) return
    root.current.getWorldPosition(scratch.center)
    scratch.open = getDiscoveryOpen(
      selected,
      camera.position.distanceTo(scratch.center),
      scratch.open,
    )
    scratch.amount = advanceExplosion(scratch.amount, scratch.open, delta, reducedMotion)
    material.current.opacity = 0.75 + scratch.amount * 0.2
    halo.current.scale.setScalar(70 + scratch.amount * 8)
    if (scratch.amount !== Number(scratch.open)) invalidate()
  })
  return (
    <group ref={root} name="nexus-core-star">
      <sprite ref={halo} scale={[70, 70, 1]}>
        <spriteMaterial
          ref={material}
          map={texture}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <mesh>
        <sphereGeometry args={[5.7, 24, 16]} />
        <meshBasicMaterial color="#edf4ff" toneMapped={false} />
      </mesh>
    </group>
  )
})

/** Workspace layers and editor seams remain distinguishable without hue alone. */
const ClientPlanet = memo(function ClientPlanet({
  client,
  selected,
}: {
  client: NexusClient
  selected: boolean
}) {
  const root = useRef<Group>(null)
  const upper = useRef<Mesh>(null)
  const lower = useRef<Mesh>(null)
  const reducedMotion = useExperienceStore((state) => state.motion !== 'full')
  const scratch = useMemo(
    () => ({
      center: new Vector3(),
      open: false,
      amount: 0,
      position: [0, 0, 0] as [number, number, number],
    }),
    [],
  )
  const radius = client.platform === 'desktop' ? 6.5 : 5
  useFrame(({ camera, invalidate }, delta) => {
    if (!root.current?.parent) return
    root.current.parent.getWorldPosition(scratch.center)
    scratch.open = getDiscoveryOpen(
      selected,
      camera.position.distanceTo(scratch.center),
      scratch.open,
    )
    scratch.amount = advanceExplosion(scratch.amount, scratch.open, delta, reducedMotion)
    root.current.position.fromArray(getExplodedPosition(client, scratch.amount, scratch.position))
    if (upper.current) {
      upper.current.position.y = scratch.amount * 2.4
      if (client.kind === 'workspace') {
        upper.current.position.x = -scratch.amount * radius * 0.8
        upper.current.position.z = -scratch.amount * radius * 0.65
        upper.current.rotation.x = -scratch.amount * 0.55
      }
    }
    if (lower.current) lower.current.position.y = -scratch.amount * 2.4
    if (scratch.amount !== Number(scratch.open)) invalidate()
  })
  return (
    <group ref={root} position={[...client.closed]} name={'nexus-client-' + client.id}>
      <group rotation={[0.18, 0.1, client.kind === 'code' ? Math.PI / 2 - 0.35 : -0.25]}>
        <mesh ref={upper} name={'nexus-shell-upper-' + client.id}>
          <sphereGeometry args={[radius, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={client.kind === 'workspace' ? '#324e66' : '#494263'}
            emissive={client.color}
            emissiveIntensity={0.22}
            metalness={0.38}
            roughness={0.52}
          />
        </mesh>
        <mesh ref={lower} name={'nexus-shell-lower-' + client.id}>
          <sphereGeometry args={[radius, 20, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial
            color={client.kind === 'workspace' ? '#233447' : '#2c294a'}
            emissive={client.color}
            emissiveIntensity={0.12}
            metalness={0.38}
            roughness={0.52}
          />
        </mesh>
        {client.kind === 'workspace' ? (
          <group>
            <mesh position-y={-1.1}>
              <boxGeometry args={[radius * 1.12, 0.55, radius * 0.88]} />
              <meshBasicMaterial color={client.color} toneMapped={false} />
            </mesh>
            <mesh position={[radius * 0.14, 1.1, radius * 0.14]}>
              <boxGeometry args={[radius * 0.92, 0.55, radius * 0.7]} />
              <meshBasicMaterial color="#d0e7ee" toneMapped={false} />
            </mesh>
          </group>
        ) : (
          <mesh rotation-y={Math.PI / 4} scale={[1, 0.48, 1]}>
            <octahedronGeometry args={[radius * 0.88, 0]} />
            <meshBasicMaterial color={client.color} toneMapped={false} />
          </mesh>
        )}
        <mesh rotation={[client.platform === 'desktop' ? Math.PI / 2 : 0, 0.25, 0]}>
          <torusGeometry args={[radius + 1.1, client.platform === 'desktop' ? 0.4 : 0.2, 5, 40]} />
          <meshBasicMaterial color={client.color} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
})

const RuntimeStructure = memo(function RuntimeStructure({ selected }: { selected: boolean }) {
  const root = useRef<Group>(null)
  const reducedMotion = useExperienceStore((state) => state.motion !== 'full')
  const scratch = useMemo(
    () => ({
      center: new Vector3(),
      open: false,
      amount: 0,
      position: [0, 0, 0] as [number, number, number],
    }),
    [],
  )
  const paths = useMemo(() => {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(24), 3))
    return geometry
  }, [])
  useEffect(() => () => paths.dispose(), [paths])
  useFrame(({ camera, invalidate }, delta) => {
    if (!root.current) return
    root.current.getWorldPosition(scratch.center)
    scratch.open = getDiscoveryOpen(
      selected,
      camera.position.distanceTo(scratch.center),
      scratch.open,
    )
    scratch.amount = advanceExplosion(scratch.amount, scratch.open, delta, reducedMotion)
    root.current.visible = scratch.open
    const points = paths.getAttribute('position')
    nexusSemantics.clients.forEach((client, index) => {
      const position = getExplodedPosition(client, scratch.amount, scratch.position)
      const length = Math.hypot(...position)
      points.setXYZ(
        index * 2,
        (position[0] * 9) / length,
        (position[1] * 9) / length,
        (position[2] * 9) / length,
      )
      points.setXYZ(index * 2 + 1, ...position)
      const label = root.current!.getObjectByName('nexus-label-anchor-' + client.id)
      if (label)
        label.position.set(
          position[0],
          // The workspace lid rises above the body; keep its name above that lid.
          position[1] + (client.closed[1] > 0 ? (client.kind === 'workspace' ? 22 : 15) : -15),
          position[2],
        )
    })
    points.needsUpdate = true
    paths.computeBoundingSphere()
    if (scratch.amount !== Number(scratch.open)) invalidate()
  })
  return (
    <group ref={root} name="nexus-runtime-detail" visible={false}>
      <group position={[0, 12, 0]}>
        <RuntimeLabel id="core" text={nexusSemantics.core.label} role="Gemeinsame Runtime" />
      </group>
      {nexusSemantics.clients.map((client) => (
        <group key={client.id} name={'nexus-label-anchor-' + client.id}>
          <RuntimeLabel id={client.id} text={client.label} role={client.role} />
        </group>
      ))}
      <lineSegments geometry={paths} name="nexus-core-relations">
        <lineBasicMaterial color="#b5c9ee" transparent opacity={0.6} toneMapped={false} />
      </lineSegments>
    </group>
  )
})

/** One shared star and four identifiable client planets; no live network is implied. */
export const NexusSystem = memo(function NexusSystem({
  selected = false,
  level,
}: {
  selected?: boolean
  level: SemanticLevel
}) {
  if (level === 'micro') return <RuntimeStructure selected={selected} />
  if (level === 'meso') return null
  return (
    <group name="nexus-stellar-system">
      <CoreStar selected={selected} />
      {nexusSemantics.clients.map((client) => (
        <ClientPlanet key={client.id} client={client} selected={selected} />
      ))}
    </group>
  )
})

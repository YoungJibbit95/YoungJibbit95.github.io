import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, RoundedBox } from '@react-three/drei'
import {
  CanvasTexture,
  CatmullRomCurve3,
  Object3D,
  PMREMGenerator,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { observatoryProjects } from '../../../src/experience/observatory/data'
import type { ProjectId } from '../../../src/experience/observatory/contracts'
import '@fontsource-variable/manrope'
import './style.css'

type Room = 'origin' | 'observatory'
const animateCamera = () => !matchMedia('(prefers-reduced-motion: reduce)').matches
type Pose = { position: [number, number, number]; target: [number, number, number] }
const stations: { id: ProjectId; position: [number, number, number]; color: string }[] = [
  { id: 'nexus', position: [-18, 0, 8], color: '#e3c59a' },
  { id: 'novacore', position: [22, 0, -20], color: '#ce7450' },
  { id: 'cerebri', position: [-22, 0, -46], color: '#b1c8b8' },
  { id: 'nemisis', position: [24, 0, -70], color: '#d4966b' },
  { id: 'adventura', position: [-20, 0, -95], color: '#a4b77c' },
  { id: 'yjse', position: [21, 0, -121], color: '#dbcba5' },
  { id: 'jarvis', position: [-19, 0, -145], color: '#9fbfbd' },
]
const shortNames = {
  nexus: 'Nexus',
  novacore: 'NovaCore',
  cerebri: 'Cerebri',
  nemisis: 'Nemisis',
  adventura: 'Adventura',
  yjse: 'YjsE',
  jarvis: 'YJarvis',
}
function overview(compact: boolean, room: Room): Pose {
  if (room === 'origin')
    return { position: compact ? [25, 20, 53] : [43, 29, 62], target: [0, 9, 0] }
  return compact
    ? { position: [8, 24, 72], target: [-18, 14, 8] }
    : { position: [74, 53, 95], target: [0, 11, -53] }
}
function focusPose(id: ProjectId, compact: boolean, detail = false): Pose {
  const p = stations.find((s) => s.id === id)!.position
  return {
    position: [
      p[0] + (detail ? 15 : 25),
      detail ? 20 : 29,
      p[2] + (compact ? 45 : detail ? 29 : 43),
    ],
    target: [p[0], detail ? 12 : 10, p[2]],
  }
}

function usePlaque(title: string, subtitle = '') {
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 768
    c.height = 256
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#e5d8bd'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.fillStyle = '#243433'
    ctx.font = '600 70px Manrope, sans-serif'
    ctx.fillText(title, 42, 108)
    ctx.fillStyle = '#47574c'
    ctx.font = '27px Manrope, sans-serif'
    ctx.fillText(subtitle, 44, 172)
    const t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    return t
  }, [title, subtitle])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}
function Plaque({
  title,
  subtitle,
  position,
  scale = 1,
}: {
  title: string
  subtitle?: string
  position: [number, number, number]
  scale?: number
}) {
  const map = usePlaque(title, subtitle)
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[17, 5.66]} />
      <meshBasicMaterial map={map} />
    </mesh>
  )
}
function Beam({
  from,
  to,
  radius = 0.18,
  color = '#52625c',
}: {
  from: number[]
  to: number[]
  radius?: number
  color?: string
}) {
  const a = new Vector3(...from)
  const b = new Vector3(...to)
  const delta = b.clone().sub(a)
  const middle = a.clone().add(b).multiplyScalar(0.5)
  return (
    <mesh
      position={middle}
      quaternion={new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        delta.clone().normalize(),
      )}
    >
      <cylinderGeometry args={[radius, radius, delta.length(), 8]} />
      <meshStandardMaterial color={color} roughness={0.43} metalness={0.55} />
    </mesh>
  )
}
function Rib({ z }: { z: number }) {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-48, 0, z),
        new Vector3(-45, 36, z),
        new Vector3(-27, 51, z),
        new Vector3(0, 56, z),
        new Vector3(27, 51, z),
        new Vector3(45, 36, z),
        new Vector3(48, 0, z),
      ]),
    [z],
  )
  return (
    <mesh>
      <tubeGeometry args={[curve, 44, 0.5, 8, false]} />
      <meshStandardMaterial color="#52615b" roughness={0.6} metalness={0.5} />
    </mesh>
  )
}
function TaskLight({ z }: { z: number }) {
  const target = useMemo(() => {
    const t = new Object3D()
    t.position.set(0, 0, z)
    return t
  }, [z])
  return (
    <>
      <primitive object={target} />
      <spotLight
        position={[0, 45, z]}
        target={target}
        angle={0.82}
        penumbra={0.55}
        intensity={3200}
        color="#ffe0ab"
        distance={100}
      />
    </>
  )
}
function useGrain(wood = false) {
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 256
    const ctx = c.getContext('2d')!
    const data = ctx.createImageData(256, 256)
    for (let y = 0; y < 256; y++)
      for (let x = 0; x < 256; x++) {
        const hash = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
        const noise = hash - Math.floor(hash)
        const value = wood
          ? 128 + 35 * Math.sin(y * 0.6 + Math.sin(x * 0.016) * 2) + noise * 20
          : 110 + noise * 35
        const i = (y * 256 + x) * 4
        data.data[i] = value
        data.data[i + 1] = value
        data.data[i + 2] = value
        data.data[i + 3] = 255
      }
    ctx.putImageData(data, 0, 0)
    const t = new CanvasTexture(c)
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(wood ? 2 : 10, wood ? 1 : 10)
    return t
  }, [wood])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}
function Workshop({ room }: { room: Room }) {
  const grain = useGrain()
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, -62]} receiveShadow>
        <planeGeometry args={[230, 340]} />
        <meshStandardMaterial
          color="#233b3b"
          roughness={0.74}
          metalness={0.1}
          bumpMap={grain}
          bumpScale={0.25}
        />
      </mesh>
      {[-180, -144, -108, -72, -36, 0, 36].map((z) => (
        <Rib key={z} z={z} />
      ))}
      <mesh position={[-49, 21, -75]}>
        <boxGeometry args={[1.5, 44, 218]} />
        <meshStandardMaterial color="#314340" roughness={0.9} />
      </mesh>
      {Array.from({ length: 23 }, (_, i) => (
        <mesh key={i} position={[-47.9, 19, 27 - i * 9]}>
          <boxGeometry args={[0.35, 35, 0.32]} />
          <meshStandardMaterial color="#68766b" roughness={0.65} />
        </mesh>
      ))}
      <mesh position={[0, 26, -184]}>
        <boxGeometry args={[98, 54, 1]} />
        <meshStandardMaterial color="#203433" />
      </mesh>
      <Plaque
        title="YoungJibbit95"
        subtitle="Gedanken. Werkzeuge. Eigene Welten."
        position={[0, 33, -183.3]}
        scale={2.6}
      />
      {[-38, 38].map((x) => (
        <group key={x}>
          <mesh position={[x, 1, -70]}>
            <boxGeometry args={[0.18, 0.15, 224]} />
            <meshBasicMaterial color="#b39968" />
          </mesh>
          <Beam from={[x, 44, 38]} to={[x, 44, -183]} radius={0.22} />
        </group>
      ))}
      {[-151, -88, -25].map((z) => (
        <group key={z}>
          <mesh position={[0, 46, z]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[45, 0.25, 1.5]} />
            <meshBasicMaterial color="#f4dbad" />
          </mesh>
          <TaskLight z={z} />
        </group>
      ))}
      <ambientLight intensity={room === 'origin' ? 0.32 : 0.3} color="#b1c9d0" />
      <hemisphereLight args={['#d6eceb', '#504d3b', 0.85]} />
      <directionalLight
        position={[45, 70, 45]}
        intensity={2.8}
        color="#ffdeb0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-180}
        shadow-bias={-0.0003}
      />
    </group>
  )
}
function Bench({
  children,
  title,
  color,
  open,
  onSelect,
}: {
  children: ReactNode
  title: string
  color: string
  open: boolean
  onSelect: () => void
}) {
  const grain = useGrain(true)
  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <RoundedBox args={[25, 2.1, 17]} radius={0.6} position={[0, 7.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#927356" roughness={0.75} bumpMap={grain} bumpScale={0.1} />
      </RoundedBox>
      {[-9, 9].map((x) => (
        <mesh key={x} position={[x, 3.2, 0]} castShadow>
          <boxGeometry args={[2, 7, 14]} />
          <meshStandardMaterial color="#273c3b" metalness={0.4} roughness={0.48} />
        </mesh>
      ))}
      <mesh position={[0, 7.7, 8.6]}>
        <boxGeometry args={[22, 0.35, 0.16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Plaque
        title={title}
        subtitle={open ? 'Einblick geöffnet' : 'Ein Werk entsteht'}
        position={[0, 4.3, 8.7]}
        scale={0.68}
      />
      <Beam from={[-10, 8, -5]} to={[-10, 24, -5]} radius={0.25} color="#a89874" />
      <Beam from={[-10, 24, -5]} to={[-1, 24, -5]} radius={0.25} color="#a89874" />
      <mesh position={[-1, 23.8, -5]}>
        <cylinderGeometry args={[1.3, 3.4, 1.2, 24]} />
        <meshStandardMaterial color="#b4aa8a" metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[-1, 23.1, -5]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 24]} />
        <meshBasicMaterial color="#ffe5b6" side={2} />
      </mesh>
      {children}
    </group>
  )
}
function Apparatus({ id, open, color }: { id: ProjectId; open: boolean; color: string }) {
  if (id === 'nexus')
    return (
      <group position={[0, 9, 0]}>
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[3.2, 3.2, 6, 40]} />
          <meshStandardMaterial color="#a5c1ba" metalness={0.4} roughness={0.32} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <Beam from={[0, 3, 0]} to={[0, 3, open ? 9 : 5]} radius={0.12} color="#ccb079" />
            <RoundedBox
              position={[0, open ? 6 : 4, open ? 9 : 5]}
              rotation={[open ? -0.3 : 0.05, 0, 0]}
              args={[6.5, 7, 0.7]}
              radius={0.4}
              castShadow
            >
              <meshStandardMaterial color={color} roughness={0.47} metalness={0.25} />
            </RoundedBox>
            {Array.from({ length: 5 }, (_, j) => (
              <mesh key={j} position={[0, (open ? 6 : 4) - 2 + j * 0.85, (open ? 9 : 5) + 0.5]}>
                <boxGeometry args={[4.5, 0.14, 0.07]} />
                <meshBasicMaterial color="#314b47" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    )
  if (id === 'nemisis')
    return (
      <group position={[0, 10, 0]}>
        {[-4, 4].map((x) => (
          <Beam key={x} from={[x, 0, -7]} to={[x, 0, 7]} radius={0.32} color="#c0b28a" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[0, i * 0.7, -5 + i * (open ? 4 : 2.5)]} rotation={[-0.4, 0, 0]}>
            <RoundedBox args={[12, 6, 0.55]} radius={0.2} castShadow>
              <meshStandardMaterial
                color={i % 2 ? color : '#759790'}
                metalness={0.4}
                roughness={0.38}
              />
            </RoundedBox>
            <mesh position={[0, 0, 0.32]}>
              <ringGeometry args={[1.2, 1.42, 32]} />
              <meshBasicMaterial color="#e7d3a8" />
            </mesh>
          </group>
        ))}
      </group>
    )
  if (id === 'novacore')
    return (
      <group position={[0, 13, 0]} rotation={[0, -0.35, Math.PI / 2]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, (i - 2) * (open ? 3.3 : 1.8), 0]} castShadow>
            <torusGeometry args={[i === 2 ? 2.6 : 4.2, 0.6, 12, 48]} />
            <meshStandardMaterial
              color={i % 2 ? '#c5c8af' : color}
              roughness={0.28}
              metalness={0.68}
            />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 19, 24]} />
          <meshStandardMaterial color="#9daea9" roughness={0.3} metalness={0.75} />
        </mesh>
      </group>
    )
  if (id === 'cerebri')
    return (
      <group position={[0, 10, 0]}>
        {Array.from({ length: 7 }, (_, i) => (
          <group
            key={i}
            position={[(i - 3) * 2.5, open ? Math.sin(i) * 1.3 + 5 : 5, 0]}
            rotation={[0, 0, open ? (i - 3) * 0.08 : 0]}
          >
            <RoundedBox args={[1.5, 10, 8]} radius={0.3} castShadow>
              <meshStandardMaterial color={i % 2 ? '#b9c5b2' : '#749790'} roughness={0.8} />
            </RoundedBox>
            <mesh position={[0, 5.1, 1]}>
              <boxGeometry args={[1.4, 0.12, 2]} />
              <meshBasicMaterial color="#f4d195" />
            </mesh>
          </group>
        ))}
      </group>
    )
  if (id === 'adventura')
    return (
      <group position={[0, 9, 0]}>
        {Array.from({ length: 49 }, (_, i) => {
          const x = i % 7,
            z = Math.floor(i / 7),
            h = 1 + (Math.sin(x * 0.9) * Math.cos(z * 0.8) + 1) * 2
          return (
            <mesh key={i} position={[(x - 3) * 2, h / 2, (z - 3) * 1.8]} castShadow>
              <boxGeometry args={[1.98, h, 1.78]} />
              <meshStandardMaterial color={h > 3.5 ? '#9aaa78' : '#5b8580'} roughness={0.88} />
            </mesh>
          )
        })}
        {open && (
          <mesh position={[0, 10, 0]}>
            <boxGeometry args={[14, 0.3, 13]} />
            <meshStandardMaterial color="#d7cb9d" wireframe />
          </mesh>
        )}
      </group>
    )
  if (id === 'yjse')
    return (
      <group position={[0, 10, 0]} rotation={[-0.28, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, i * (open ? 4 : 1.8), -i * 2]}>
            <RoundedBox args={[18, 0.5, 10]} radius={0.25} castShadow>
              <meshStandardMaterial color={i % 2 ? '#9aafa2' : '#d8c69c'} roughness={0.6} />
            </RoundedBox>
            {Array.from({ length: 8 }, (_, j) => (
              <mesh key={j} position={[((j % 4) - 1.5) * 3.7, 0.4, (Math.floor(j / 4) - 0.5) * 4]}>
                <boxGeometry args={[2.5, 0.35, 2.5]} />
                <meshStandardMaterial color={j % 3 ? '#637f76' : '#b07853'} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    )
  return (
    <group position={[0, 14, 0]}>
      <RoundedBox args={[8, 9, 6]} radius={2} smoothness={6} castShadow>
        <meshStandardMaterial color="#73918a" metalness={0.3} roughness={0.5} />
      </RoundedBox>
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[(i - 5) * 0.52, 0, 3.08]}>
          <boxGeometry args={[0.18, open ? 3 + Math.sin(i) * 2 : 5, 0.12]} />
          <meshStandardMaterial color="#152f31" />
        </mesh>
      ))}
      <mesh position={[5, 0, open ? 4 : 0]}>
        <torusGeometry args={[2, 0.2, 8, 32]} />
        <meshStandardMaterial color="#cfba8d" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}
function Station({
  station,
  opened,
  select,
}: {
  station: (typeof stations)[number]
  opened: boolean
  select: () => void
}) {
  return (
    <group position={station.position}>
      <Bench title={shortNames[station.id]} color={station.color} open={opened} onSelect={select}>
        <Apparatus id={station.id} color={station.color} open={opened} />
      </Bench>
    </group>
  )
}
function Origin({ opened, activate }: { opened: boolean; activate: () => void }) {
  return (
    <group>
      <Bench title="Ein Gedanke" color="#f0bb70" open={opened} onSelect={activate}>
        <group position={[0, 13, 0]}>
          {[-1, 1].map((side) => (
            <RoundedBox
              key={side}
              position={[side * (opened ? 6 : 2.9), 0, 0]}
              args={[5.5, 8, 9]}
              radius={0.8}
              castShadow
            >
              <meshStandardMaterial color="#b4c9be" metalness={0.42} roughness={0.31} />
            </RoundedBox>
          ))}
          <mesh>
            <sphereGeometry args={[1.5, 32, 24]} />
            <meshStandardMaterial
              color="#f6bd62"
              emissive="#c78b30"
              emissiveIntensity={opened ? 1.2 : 0.2}
              roughness={0.36}
            />
          </mesh>
        </group>
      </Bench>
      {opened &&
        [0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 0.05, -15 - i * 12]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.4, 8]} />
            <meshBasicMaterial color="#e7bd78" />
          </mesh>
        ))}
      <Plaque
        title="Von einer Frage"
        subtitle="zu einem eigenen System"
        position={[0, 24, -75]}
        scale={2}
      />
    </group>
  )
}
function Rig({ pose, onReady }: { pose: Pose; onReady: () => void }) {
  const controls = useRef<CameraControls>(null)
  const { gl, camera, invalidate } = useThree()
  useEffect(() => {
    controls.current?.setLookAt(
      ...pose.position,
      ...pose.target,
      !matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
    invalidate()
  }, [pose, invalidate])
  useEffect(() => {
    const diagnostics = () => ({
      position: camera.position.toArray(),
      target: controls.current?.getTarget(new Vector3()).toArray(),
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      frame: gl.info.render.frame,
    })
    Object.assign(window, { g2dC: { diagnostics, controls } })
    return () => {
      delete (window as unknown as { g2dC?: unknown }).g2dC
    }
  }, [gl, camera])
  const painted = useRef(false)
  useFrame(() => {
    if (!painted.current) {
      painted.current = true
      requestAnimationFrame(onReady)
    }
  })
  return (
    <CameraControls
      ref={controls}
      minDistance={12}
      maxDistance={230}
      maxPolarAngle={Math.PI * 0.49}
      minPolarAngle={0.12}
      smoothTime={animateCamera() ? 0.55 : 0}
    />
  )
}
function Reflections() {
  const { gl, scene, invalidate } = useThree()
  useEffect(() => {
    const room = new RoomEnvironment()
    const pmrem = new PMREMGenerator(gl)
    const environment = pmrem.fromScene(room, 0.04)
    const previous = scene.environment
    scene.environment = environment.texture
    scene.environmentIntensity = 0.55
    invalidate()
    room.dispose()
    pmrem.dispose()
    return () => {
      scene.environment = previous
      environment.dispose()
    }
  }, [gl, scene, invalidate])
  return null
}
function App() {
  const compact = innerWidth <= 900
  const [room, setRoom] = useState<Room>('observatory')
  const [selected, setSelected] = useState<ProjectId | null>(null)
  const [opened, setOpened] = useState(false)
  const [ready, setReady] = useState(false)
  const [pose, setPose] = useState<Pose>(() => overview(compact, 'observatory'))
  const selectedProject = observatoryProjects.find((p) => p.id === selected)
  function choose(id: ProjectId) {
    setSelected(id)
    setOpened(false)
    setPose(focusPose(id, compact))
  }
  function reset() {
    setSelected(null)
    setOpened(false)
    setPose(overview(compact, room))
  }
  function switchRoom(next: Room) {
    setRoom(next)
    setSelected(null)
    setOpened(false)
    setPose(overview(compact, next))
  }
  function discover() {
    setOpened(!opened)
    if (selected) setPose(focusPose(selected, compact, true))
  }
  return (
    <main
      className="night-workshop"
      data-ready={ready}
      data-world={room}
      data-selected={selected || ''}
      data-opened={opened}
    >
      <header>
        <a href="/?atlas=preview">YoungJibbit95.</a>
        <nav aria-label="Welten">
          <button aria-pressed={room === 'origin'} onClick={() => switchRoom('origin')}>
            Ursprung
          </button>
          <button aria-pressed={room === 'observatory'} onClick={() => switchRoom('observatory')}>
            Werkstatt
          </button>
        </nav>
        <span className="concept-label">Richtung C</span>
      </header>
      <section
        className="stage"
        aria-label="Räumliche Werkstatt"
        tabIndex={0}
        onKeyDown={(e) => {
          const controls = (window as any).g2dC?.controls.current
          if (e.key === 'Escape') reset()
          if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault()
            controls?.truck(
              e.key === 'ArrowLeft' ? -5 : e.key === 'ArrowRight' ? 5 : 0,
              e.key === 'ArrowUp' ? 5 : e.key === 'ArrowDown' ? -5 : 0,
              animateCamera(),
            )
          }
        }}
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          shadows
          camera={{ position: pose.position, fov: 48, near: 0.1, far: 600 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#10262b']} />
          <fog attach="fog" args={['#10262b', 140, 420]} />
          <Suspense fallback={null}>
            <Reflections />
            <Workshop room={room} />
            {room === 'observatory' ? (
              stations.map((station) => (
                <Station
                  key={station.id}
                  station={station}
                  opened={opened && selected === station.id}
                  select={() => choose(station.id)}
                />
              ))
            ) : (
              <Origin opened={opened} activate={() => setOpened((v) => !v)} />
            )}
          </Suspense>
          <Rig pose={pose} onReady={() => setReady(true)} />
        </Canvas>
        {!selected && (
          <div className="intro">
            <p>{room === 'origin' ? 'Der Anfang' : 'Werkstatt nach Mitternacht'}</p>
            <h1>
              {room === 'origin'
                ? 'Jede Welt beginnt mit einer Frage.'
                : compact
                  ? 'Ideen werden Systeme.'
                  : 'Hier werden Ideen zu Systemen.'}
            </h1>
            <span>
              {room === 'origin'
                ? 'Öffne den Gedanken. Folge seiner Spur.'
                : 'Sieben Projekte. Ein Ort zum Weiterdenken.'}
            </span>
          </div>
        )}
        {!ready && (
          <div role="status" className="loading">
            Die Werkstatt wird sichtbar…
          </div>
        )}
        <details className="camera-tools" open={!compact}>
          <summary>Ansicht</summary>
          <div>
            <button onClick={reset}>Überblick</button>
            <button
              aria-label="Näher heran"
              onClick={() => (window as any).g2dC?.controls.current?.dolly(10, animateCamera())}
            >
              +
            </button>
            <button
              aria-label="Weiter zurück"
              onClick={() => (window as any).g2dC?.controls.current?.dolly(-10, animateCamera())}
            >
              −
            </button>
          </div>
        </details>
        <p className="gesture-hint">Ziehen, um dich umzusehen. Eine Station wählen.</p>
      </section>
      <div className="discovery" aria-live="polite">
        {room === 'origin' ? (
          <>
            <div>
              <span>Eine illustrative Signalkette</span>
              <h2>{opened ? 'Aus einer Idee wird ein Weg.' : 'Was möchtest du bauen?'}</h2>
            </div>
            <button className="primary" onClick={() => setOpened((v) => !v)}>
              {opened ? 'Gedanken schließen' : 'Gedanken öffnen'}
            </button>
            {opened && (
              <button onClick={() => switchRoom('observatory')}>Den Projekten folgen</button>
            )}
          </>
        ) : selectedProject ? (
          <>
            <div>
              <span>{selectedProject.category}</span>
              <h2>{selectedProject.name}</h2>
              <p>{opened ? selectedProject.evidence[0].claim : selectedProject.question}</p>
              {opened && (
                <a href={selectedProject.evidence[0].url} target="_blank" rel="noreferrer">
                  Quellenbeleg ansehen ↗
                </a>
              )}
            </div>
            <button className="primary" onClick={discover}>
              {opened ? 'Einblick schließen' : 'Aufbau entdecken'}
            </button>
            <button className="close" aria-label="Projekt schließen" onClick={reset}>
              ×
            </button>
          </>
        ) : (
          <>
            <div>
              <span>Wähle deinen Einstieg</span>
              <h2>Was steckt hinter den Projekten?</h2>
            </div>
            <button className="primary" onClick={() => choose('nexus')}>
              Bei Nexus beginnen ↗
            </button>
          </>
        )}
        {room === 'observatory' && (
          <select
            className="mobile-project-select"
            aria-label="Anderes Projekt"
            value={selected || ''}
            onChange={(e) => choose(e.target.value as ProjectId)}
          >
            <option value="" disabled>
              Projekt wählen
            </option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {shortNames[s.id]}
              </option>
            ))}
          </select>
        )}
      </div>
      <nav className="project-strip" aria-label="Alle Projekte">
        {stations.map((s) => (
          <button
            key={s.id}
            aria-pressed={selected === s.id}
            onClick={() => {
              if (room !== 'observatory') setRoom('observatory')
              choose(s.id)
            }}
          >
            {shortNames[s.id]}
          </button>
        ))}
      </nav>
      <p className="interpretation">
        Räumliche Interpretation der Projekte. Keine Simulation ihrer Laufzeit.
      </p>
    </main>
  )
}
createRoot(document.getElementById('root')!).render(<App />)

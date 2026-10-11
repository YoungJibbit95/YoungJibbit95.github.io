import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import {
  BufferGeometry,
  Float32BufferAttribute,
  Shape,
  ExtrudeGeometry,
  CanvasTexture,
  RepeatWrapping,
  Vector3,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
} from 'three'
import type CameraControlsImpl from 'camera-controls'
import { observatoryProjects } from '../../../src/experience/observatory/data'
import '@fontsource-variable/manrope'
import '@fontsource/jetbrains-mono/400.css'
import './style.css'

type View = 'overview' | 'approach' | 'detail'
type World = 'origin' | 'observatory'
type Point = [number, number, number]
const WHITE = '#dce2d8'
const DARK = '#414c44'
const ACCENT = '#dbe36d'
const SITES: { id: string; p: Point; number: string; short: string }[] = [
  { id: 'nexus', p: [-20, 0, 12], number: '01', short: 'Nexus' },
  { id: 'cerebri', p: [-28, 0, -28], number: '02', short: 'Cerebri' },
  { id: 'novacore', p: [19, 0, -7], number: '03', short: 'NovaCore' },
  { id: 'nemisis', p: [45, 0, -37], number: '04', short: 'Nemisis' },
  { id: 'adventura', p: [21, 0, 39], number: '05', short: 'Adventura' },
  { id: 'yjse', p: [-12, 0, -66], number: '06', short: 'YjsE' },
  { id: 'jarvis', p: [-61, 0, -42], number: '07', short: 'YJarvis' },
]

// Every shape is authored here. No external textures, model or environment downloads.
function stoneTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const context = canvas.getContext('2d')!
  const data = context.createImageData(128, 128)
  let seed = 109
  for (let i = 0; i < data.data.length; i += 4) {
    seed = (1664525 * seed + 1013904223) >>> 0
    const value = 160 + (seed % 90)
    data.data[i] = data.data[i + 1] = data.data[i + 2] = value
    data.data[i + 3] = 255
  }
  context.putImageData(data, 0, 0)
  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(3, 3)
  return texture
}
const TEXTURE = stoneTexture()

function arcGeometry(
  rx: number,
  rz: number,
  width: number,
  start: number,
  end: number,
  depth: number,
) {
  const shape = new Shape()
  const segments = 48
  for (let i = 0; i <= segments; i++) {
    const angle = start + ((end - start) * i) / segments
    const x = Math.cos(angle) * rx
    const y = Math.sin(angle) * rz
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  for (let i = segments; i >= 0; i--) {
    const angle = start + ((end - start) * i) / segments
    shape.lineTo(Math.cos(angle) * (rx - width), Math.sin(angle) * (rz - width))
  }
  shape.closePath()
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.14,
    bevelThickness: 0.12,
    bevelSegments: 2,
    curveSegments: 24,
  })
  geometry.rotateX(-Math.PI / 2)
  return geometry
}

function Ribbon({ origin = false }: { origin?: boolean }) {
  const geometry = useMemo(() => {
    const vertices: number[] = []
    const indices: number[] = []
    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      const z = 80 - t * 180
      const x = Math.sin(t * Math.PI * 2.2) * 11 + (origin ? 0 : 3)
      const y = -0.1 + Math.sin(t * Math.PI) * 0.5
      vertices.push(x - 1.1, y, z, x + 1.1, y, z)
      if (i < 100) {
        const n = i * 2
        indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2)
      }
    }
    const result = new BufferGeometry()
    result.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    result.setIndex(indices)
    result.computeVertexNormals()
    return result
  }, [origin])
  // Geometry supplied through a mesh prop is owned here, not by R3F's child tree.
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={ACCENT} roughness={0.8} side={2} />
    </mesh>
  )
}

function Arc({
  rx,
  rz,
  width = 2,
  start = 0,
  end = Math.PI * 1.85,
  depth = 1,
  y = 0,
  color = WHITE,
}: {
  rx: number
  rz: number
  width?: number
  start?: number
  end?: number
  depth?: number
  y?: number
  color?: string
}) {
  const geometry = useMemo(
    () => arcGeometry(rx, rz, width, start, end, depth),
    [rx, rz, width, start, end, depth],
  )
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry} position-y={y} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.83} bumpMap={TEXTURE} bumpScale={0.06} />
    </mesh>
  )
}

function Slab({
  position,
  size,
  color = WHITE,
  rotate = 0,
}: {
  position: Point
  size: Point
  color?: string
  rotate?: number
}) {
  return (
    <mesh position={position} rotation-y={rotate} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.82} bumpMap={TEXTURE} bumpScale={0.025} />
    </mesh>
  )
}

function Plinth({ variant = 0 }: { variant?: number }) {
  return (
    <group>
      {Array.from({ length: 3 }, (_, i) => (
        <Arc
          key={i}
          rx={19.5 - i * 0.8}
          rz={16 - i * 0.6}
          width={15}
          start={0.1 + variant * 0.12}
          end={Math.PI * 2 - 0.08 + variant * 0.12}
          depth={0.7}
          y={-2.2 + i * 0.8}
          color={i % 2 ? '#83917d' : '#b5c0ad'}
        />
      ))}
    </group>
  )
}

function Terrain() {
  const geometries = useMemo(
    () =>
      [-1, 1].flatMap((side) =>
        Array.from({ length: 7 }, (_, layer) => {
          const shape = new Shape()
          for (let i = 0; i <= 60; i++) {
            const z = -170 + i * 6
            const width = 69 + layer * 6 + Math.sin(z * 0.025) * 18 + Math.sin(z * 0.057) * 4
            if (i === 0) shape.moveTo(width * side, z)
            else shape.lineTo(width * side, z)
          }
          shape.lineTo(side * 420, 190)
          shape.lineTo(side * 420, -170)
          shape.closePath()
          const geometry = new ExtrudeGeometry(shape, {
            depth: 1.8 + layer * 0.65,
            bevelEnabled: true,
            bevelSize: 0.3,
            bevelThickness: 0.2,
            bevelSegments: 2,
            curveSegments: 32,
          })
          geometry.rotateX(-Math.PI / 2)
          return { geometry, y: -3.7 + layer * 1.7, layer }
        }),
      ),
    [],
  )
  useEffect(() => () => geometries.forEach(({ geometry }) => geometry.dispose()), [geometries])
  return (
    <group>
      {geometries.map(({ geometry, y, layer }, index) => (
        <mesh key={index} geometry={geometry} position-y={y} castShadow receiveShadow>
          <meshStandardMaterial
            color={layer % 2 ? '#9aa891' : '#bbc7b0'}
            roughness={0.94}
            bumpMap={TEXTURE}
            bumpScale={0.08}
          />
        </mesh>
      ))}
    </group>
  )
}

function Nexus({ open }: { open: boolean }) {
  return (
    <group>
      {[0, 1, 2, 3].map((quadrant) => (
        <group key={quadrant} rotation-y={(quadrant * Math.PI) / 2}>
          {[0, 1, 2, 3].map((layer) => (
            <Arc
              key={layer}
              rx={13 + layer * 0.45}
              rz={11 + layer * 0.45}
              width={3.2}
              start={0.14}
              end={Math.PI / 2 - 0.14}
              depth={1.55}
              y={layer * 1.9}
              color={layer % 2 ? '#d0d8cc' : WHITE}
            />
          ))}
          <group position-y={open ? 10 : 7.8} position-x={open ? 15 : 0}>
            <Arc
              rx={15.5}
              rz={13.5}
              width={8}
              start={0.12}
              end={Math.PI / 2 - 0.12}
              depth={0.75}
              color={WHITE}
            />
          </group>
          <Slab position={[8, 0.7, 0]} size={[10, 0.4, 1]} color={ACCENT} />
        </group>
      ))}
      <mesh position={[0, 2.4, 0]} castShadow>
        <cylinderGeometry args={[3.3, 3.3, 5, 64]} />
        <meshStandardMaterial color={DARK} roughness={0.48} />
      </mesh>
      <Arc
        rx={3.9}
        rz={3.9}
        width={0.7}
        depth={0.2}
        start={0}
        end={Math.PI * 2}
        y={5}
        color={ACCENT}
      />
    </group>
  )
}

function Architecture({ id, open }: { id: string; open: boolean }) {
  if (id === 'nexus') return <Nexus open={open} />
  if (id === 'cerebri')
    return (
      <group>
        {Array.from({ length: 7 }, (_, i) => (
          <group key={i} rotation-y={i * 0.28}>
            <Arc
              rx={13 - i * 0.9}
              rz={12 - i * 0.8}
              width={2}
              start={0.1}
              end={Math.PI * 1.55}
              depth={1.2}
              y={i * 1.8}
            />
          </group>
        ))}
      </group>
    )
  if (id === 'novacore')
    return (
      <group rotation-y={-0.35}>
        {Array.from({ length: 5 }, (_, i) => (
          <group key={i} position-z={i * 3.6 - 7}>
            <Slab position={[-8, 5, 0]} size={[2, 10, 2]} />
            <Slab position={[8, 5, 0]} size={[2, 10, 2]} />
            <Slab position={[0, 10, 0]} size={[18, 2, 2]} />
          </group>
        ))}
        <Slab position={[0, 0.6, 0]} size={[3, 0.5, 19]} color={ACCENT} />
      </group>
    )
  if (id === 'nemisis')
    return (
      <group rotation-y={0.7}>
        {[-1, 1].map((side) => (
          <group key={side} position-x={side * 5}>
            {[0, 1, 2, 3].map((i) => (
              <Slab
                key={i}
                position={[side * i * 0.8, 1.5 + i * 2, 0]}
                size={[2.5, 1.5, 27 - i * 2]}
              />
            ))}
          </group>
        ))}
        <Slab position={[0, 0.8, 0]} size={[2, 0.4, 26]} color={ACCENT} />
      </group>
    )
  if (id === 'adventura')
    return (
      <group>
        {Array.from({ length: 6 }, (_, i) => (
          <Slab
            key={i}
            position={[i * 1.4 - 4, i * 1.2, i * 0.5]}
            size={[26 - i * 3, 1, 21 - i * 2.5]}
            color={i % 2 ? '#a6b899' : '#ccd3bd'}
          />
        ))}
        <Slab position={[1.5, 7, 2]} size={[4, 0.4, 5]} color={ACCENT} />
      </group>
    )
  if (id === 'yjse')
    return (
      <group rotation-y={0.18}>
        {Array.from({ length: 3 }, (_, i) => (
          <group key={i} position={[0, i * 3, 0]}>
            <Slab position={[0, 0, 0]} size={[23, 1.1, 17]} />
            {[0, 1, 2, 3].map((j) => (
              <Slab
                key={j}
                position={[j * 5 - 7.5, 0.7, 0]}
                size={[3.8, 0.4, 14]}
                color={i === 2 && j === 1 ? ACCENT : '#869480'}
              />
            ))}
          </group>
        ))}
      </group>
    )
  return (
    <group>
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} rotation-y={Math.PI * -0.2 + i * 0.11}>
          <Arc
            rx={7 + Math.sin((i / 7) * Math.PI) * 5}
            rz={7 + Math.sin((i / 7) * Math.PI) * 5}
            width={1.8}
            start={0.15}
            end={Math.PI * 1.7}
            depth={1}
            y={i * 1.6}
            color={i === 7 ? ACCENT : WHITE}
          />
        </group>
      ))}
    </group>
  )
}

function Observatory({
  selected,
  open,
  select,
}: {
  selected: string
  open: boolean
  select: (id: string) => void
}) {
  return (
    <group>
      <Terrain />
      <Ribbon />
      {SITES.map((site, index) => (
        <group key={site.id} position={site.p}>
          <Plinth variant={index} />
          <group
            onClick={(event) => {
              event.stopPropagation()
              select(site.id)
            }}
            onPointerOver={(event) => {
              event.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = ''
            }}
          >
            <Architecture id={site.id} open={open && selected === 'nexus'} />
          </group>
        </group>
      ))}
      <Slab position={[31, -0.5, -23]} size={[3.5, 0.4, 30]} color={ACCENT} rotate={-0.73} />
    </group>
  )
}

function Fold({ side, open }: { side: number; open: boolean }) {
  const geometry = useMemo(() => {
    const positions: number[] = []
    const indices: number[] = []
    for (let i = 0; i <= 80; i++) {
      const t = i / 80
      const z = 29 - t * 79
      const x = side * (7 + Math.sin(t * Math.PI * 1.3) * 10)
      const height = 3 + Math.sin(t * Math.PI) * 28
      for (let j = 0; j <= 16; j++) {
        const u = j / 16
        positions.push(
          x + side * Math.sin(u * Math.PI * 0.63) * 16,
          u * height,
          z + Math.sin(u * Math.PI) * 5,
        )
        if (i < 80 && j < 16) {
          const n = i * 17 + j
          indices.push(n, n + 1, n + 17, n + 1, n + 18, n + 17)
        }
      }
    }
    const result = new BufferGeometry()
    result.setAttribute('position', new Float32BufferAttribute(positions, 3))
    result.setIndex(indices)
    result.computeVertexNormals()
    return result
  }, [side])
  // All seven fold meshes share this component-owned buffer; release it once.
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <group position-x={open ? side * 10 : 0} rotation-y={open ? side * -0.12 : 0}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={WHITE}
          side={2}
          roughness={0.86}
          bumpMap={TEXTURE}
          bumpScale={0.065}
        />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          geometry={geometry}
          scale={[1 + i * 0.012, 1, 1]}
          position-x={side * i * 0.5}
          position-y={-i * 0.38}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={i % 2 ? '#9baa9a' : '#c0cabb'} side={2} roughness={0.86} />
        </mesh>
      ))}
    </group>
  )
}

function Origin({ open }: { open: boolean }) {
  return (
    <group>
      <Ribbon origin />
      <Fold side={-1} open={open} />
      <Fold side={1} open={open} />
      <group position={[0, 0, -65]}>
        <Nexus open={false} />
      </group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 39, -3, 30]}>
          <Arc
            rx={32}
            rz={50}
            width={17}
            start={-0.3}
            end={Math.PI * 1.4}
            depth={2}
            color="#aab6a2"
          />
          <Arc rx={31} rz={48} width={17} start={-0.3} end={Math.PI * 1.4} depth={1} y={2.1} />
        </group>
      ))}
    </group>
  )
}

declare global {
  interface Window {
    bCapture?: () => unknown
    bReady?: boolean
    bFrames?: number
    bCamera?: CameraControlsImpl
  }
}
function Camera({
  world,
  view,
  selected,
  open,
}: {
  world: World
  view: View
  selected: string
  open: boolean
}) {
  const controls = useRef<CameraControlsImpl>(null)
  const { gl, scene, camera, size, invalidate } = useThree()
  const compact = size.width < 700
  useEffect(() => {
    let position: Point
    let target: Point
    if (world === 'origin') {
      position = compact ? [19, 40, 144] : [79, 47, 108]
      target = compact ? [0, 7, -13] : [-1, 7, -10]
      if (view !== 'overview') {
        position = compact ? [2, 18, 54] : [21, 20, 49]
        target = [0, 9, -29]
      }
    } else if (view === 'overview') {
      position = compact ? [42, 62, 121] : [100, 71, 135]
      target = compact ? [-15, 13, -7] : [-13, 1, -21]
    } else {
      const point = SITES.find((site) => site.id === selected)!.p
      const offset: Point =
        view === 'detail'
          ? compact
            ? [30, 58, 64]
            : [29, 29, 35]
          : compact
            ? [34, 48, 73]
            : [40, 32, 51]
      position = point.map((n, i) => n + offset[i]) as Point
      target = [point[0], compact ? 1 : 4, point[2]]
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    controls.current?.setLookAt(...position, ...target, !reduced)
    invalidate()
  }, [world, view, selected, compact, invalidate, open])
  useEffect(() => {
    window.bCapture = () => {
      gl.render(scene, camera)
      const target = new Vector3()
      controls.current?.getTarget(target)
      const context = gl.getContext()
      const bytes = new Uint8Array(gl.domElement.width * gl.domElement.height * 4)
      context.readPixels(
        0,
        0,
        gl.domElement.width,
        gl.domElement.height,
        context.RGBA,
        context.UNSIGNED_BYTE,
        bytes,
      )
      let colored = 0
      const colors = new Set<string>()
      for (let i = 0; i < bytes.length; i += 100) {
        if (bytes[i] !== bytes[i + 1] || bytes[i + 1] !== bytes[i + 2]) colored++
        colors.add(`${bytes[i] >> 4},${bytes[i + 1] >> 4},${bytes[i + 2] >> 4}`)
      }
      return {
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        programs: gl.info.programs?.length,
        position: camera.position.toArray(),
        target: target.toArray(),
        sampledColoredPixels: colored,
        sampledColorBuckets: colors.size,
        width: gl.domElement.width,
        height: gl.domElement.height,
      }
    }
    window.bCamera = controls.current ?? undefined
    return () => {
      delete window.bCapture
      delete window.bCamera
    }
  }, [gl, scene, camera])
  const projected = useRef(new Vector3())
  useFrame(() => {
    window.bReady = true
    window.bFrames = (window.bFrames || 0) + 1
    document.querySelectorAll<HTMLElement>('[data-anchor]').forEach((element) => {
      const point = element.dataset.anchor!.split(',').map(Number)
      projected.current.set(point[0], point[1], point[2]).project(camera)
      const x = (projected.current.x * 0.5 + 0.5) * size.width
      const y = (-projected.current.y * 0.5 + 0.5) * size.height
      const behindIntro =
        view === 'overview' && y < (compact ? 280 : 310) && x < (compact ? size.width : 590)
      const edgeInset = element.offsetWidth / 2 + 16
      element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
      element.style.visibility =
        projected.current.z > 1 ||
        behindIntro ||
        x < edgeInset ||
        x > size.width - edgeInset ||
        y < 94 ||
        y > size.height - 140
          ? 'hidden'
          : 'visible'
    })
  })
  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={18}
      maxDistance={330}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI * 0.47}
      smoothTime={0.38}
      draggingSmoothTime={0.12}
    />
  )
}

function App() {
  const [world, setWorld] = useState<World>(
    new URLSearchParams(location.search).get('world') === 'origin' ? 'origin' : 'observatory',
  )
  const [view, setView] = useState<View>('overview')
  const [selected, setSelected] = useState('nexus')
  const [open, setOpen] = useState(false)
  const [register, setRegister] = useState(false)
  useEffect(() => {
    if (!register) return
    const previous = document.activeElement
    document.querySelector<HTMLButtonElement>('#project-register button')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRegister(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [register])
  const project = observatoryProjects.find((item) => item.id === selected)!
  const select = (id: string) => {
    setSelected(id)
    setView('approach')
    setOpen(false)
    setRegister(false)
  }
  const changeWorld = (next: World) => {
    setWorld(next)
    setView('overview')
    setOpen(false)
    setRegister(false)
  }
  const overview = () => {
    setView('overview')
    setOpen(false)
    setRegister(false)
  }
  return (
    <main>
      <a className="skip" href="#project-index">
        Zu den Projektinformationen
      </a>
      <div
        className="scene"
        role="region"
        aria-label="Räumlicher Schnittwerk-Entwurf"
        inert={register}
      >
        <Canvas
          shadows
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [130, 108, 160], fov: 43, near: 0.1, far: 750 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = PCFSoftShadowMap
            gl.toneMapping = ACESFilmicToneMapping
            gl.toneMappingExposure = 0.93
          }}
        >
          <color attach="background" args={['#c4cebb']} />
          <ambientLight intensity={0.4} color="#dae5da" />
          <hemisphereLight args={['#f6fae8', '#55604e', 0.85]} />
          <directionalLight
            position={[-60, 95, 45]}
            intensity={2.5}
            color="#fffde9"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-140}
            shadow-camera-right={140}
            shadow-camera-top={140}
            shadow-camera-bottom={-140}
            shadow-camera-far={300}
            shadow-bias={-0.0004}
          />
          <directionalLight position={[70, 40, -70]} intensity={0.7} color="#dcebef" />
          <mesh rotation-x={-Math.PI / 2} position-y={-4.9} receiveShadow>
            <planeGeometry args={[1700, 1700]} />
            <meshStandardMaterial
              color="#727f69"
              roughness={1}
              bumpMap={TEXTURE}
              bumpScale={0.03}
            />
          </mesh>
          <Suspense fallback={null}>
            {world === 'origin' ? (
              <Origin open={open} />
            ) : (
              <Observatory
                selected={view === 'overview' ? '' : selected}
                open={open}
                select={select}
              />
            )}
          </Suspense>
          <Camera world={world} view={view} selected={selected} open={open} />
        </Canvas>
      </div>
      {world === 'observatory' && (
        <div className="spatial-labels" inert={register}>
          {SITES.filter((site) => view === 'overview' || site.id === selected).map((site) => (
            <button
              key={site.id}
              data-anchor={`${site.p[0]},${15 + (site.id === 'jarvis' ? 5 : 0)},${site.p[2]}`}
              className={`site-label ${view !== 'overview' ? 'selected' : ''}`}
              onClick={() => select(site.id)}
            >
              {site.short}
              <b>↗</b>
            </button>
          ))}
          {open && selected === 'nexus' && (
            <span className="core-label" data-anchor="-20,7,12">
              @nexus/core
            </span>
          )}
        </div>
      )}
      <header>
        <a className="brand" href="/">
          YoungJibbit95.
        </a>
        <nav aria-label="Welten">
          <button aria-pressed={world === 'origin'} onClick={() => changeWorld('origin')}>
            Ursprung
          </button>
          <button aria-pressed={world === 'observatory'} onClick={() => changeWorld('observatory')}>
            Sternwarte
          </button>
        </nav>
        <span className="study">Entwurf B / Schnittwerk</span>
      </header>
      <section className={`intro ${view !== 'overview' ? 'compact' : ''}`} aria-live="polite">
        <p className="place">
          {world === 'origin' ? 'Ursprung' : view === 'overview' ? 'Sternwarte' : project.category}
        </p>
        <h1>
          {world === 'origin' ? (
            <>
              Jede Frage
              <br />
              öffnet einen Weg.
            </>
          ) : view === 'overview' ? (
            <>
              Eine Landschaft.
              <br />
              Sieben offene Fragen.
            </>
          ) : (
            project.name
          )}
        </h1>
        {view === 'overview' && (
          <p className="dek">
            {world === 'origin'
              ? 'Gedanken bekommen Raum. Und führen zu dem, was ich baue.'
              : 'Näher kommen. Schichten öffnen. Zusammenhänge entdecken.'}
          </p>
        )}
      </section>
      {world === 'observatory' && view !== 'overview' && (
        <article className="dossier" aria-label="Projektentdeckung" inert={register}>
          <p>
            {open && selected === 'nexus'
              ? 'Vier Clients. Ein gemeinsamer Kern.'
              : project.question}
          </p>
          {open && selected === 'nexus' ? (
            <>
              <div className="client-list">
                <span>Desktop</span>
                <span>Mobile</span>
                <span>Code Desktop</span>
                <span>Code Mobile</span>
              </div>
              <p className="fact">
                React und TypeScript verbinden vier öffentliche Clients über @nexus/core. Cloud und
                Sync sind geplant oder privat.
              </p>
            </>
          ) : (
            <p className="fact">{project.evidence[0].claim}</p>
          )}
          <span className="status">{project.status}</span>
          <a href={project.evidence[0].url} target="_blank" rel="noreferrer">
            Geprüfte Quelle ↗
          </a>
        </article>
      )}
      <footer>
        <div className="position">
          <span>
            {view === 'overview' ? 'Übersicht' : view === 'approach' ? 'Annäherung' : 'Entdeckung'}
          </span>
          <p>Ziehen zum Erkunden · Scrollen zum Nähern</p>
        </div>
        <div className="actions">
          {view !== 'overview' && <button onClick={overview}>Zur Übersicht</button>}
          {world === 'origin' ? (
            <button
              className="primary"
              onClick={() => {
                if (open) changeWorld('observatory')
                else {
                  setOpen(true)
                  setView('approach')
                }
              }}
            >
              {open ? 'Zur Sternwarte ↗' : 'Den Weg öffnen ↗'}
            </button>
          ) : view === 'overview' ? (
            <button className="primary" onClick={() => select('nexus')}>
              Nexus erkunden ↗
            </button>
          ) : (
            <button
              className="primary"
              onClick={() => {
                setOpen(!open)
                setView(open ? 'approach' : 'detail')
              }}
            >
              {open
                ? 'Schichten schließen'
                : selected === 'nexus'
                  ? 'Den Kern freilegen ↗'
                  : 'Näher betrachten ↗'}
            </button>
          )}
          {world === 'observatory' && (
            <button
              aria-expanded={register}
              aria-controls="project-register"
              onClick={() => setRegister(!register)}
            >
              Projekte {register ? '−' : '+'}
            </button>
          )}
        </div>
      </footer>
      {register && (
        <aside id="project-register" className="register">
          <h2>Sieben Projekte</h2>
          {SITES.map((site) => (
            <button key={site.id} onClick={() => select(site.id)}>
              <span>{site.number}</span>
              {site.short}
              <span>↗</span>
            </button>
          ))}
        </aside>
      )}
      <details id="project-index" className="semantic">
        <summary>Projekttexte und Entwurfsgrenzen</summary>
        <p>
          Isolierter visueller Prototyp B. Alle Gebäude, Wege und Abmessungen sind Illustrationen.
          Ein Weg ist keine behauptete Software-Abhängigkeit. Die Schichtenbewegung stellt keine
          laufende Software dar.
        </p>
        {observatoryProjects.map((item) => (
          <article key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.evidence[0].claim}</p>
            <p>{item.evidence[0].limits}</p>
            <a href={item.evidence[0].url}>Quellennachweis</a>
          </article>
        ))}
      </details>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

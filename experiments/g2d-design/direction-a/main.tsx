import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree, useLoader, type ThreeEvent } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei/core/CameraControls'
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  ExtrudeGeometry,
  Group,
  MeshStandardMaterial,
  RepeatWrapping,
  Shape,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from 'three'
import type CameraControlsImpl from 'camera-controls'
import { observatoryProjects } from '../../../src/experience/observatory/data'
import type { ProjectId } from '../../../src/experience/observatory/contracts'
import '@fontsource-variable/manrope'
import '@fontsource/jetbrains-mono/400.css'
import './style.css'

type World = 'origin' | 'observatory'
type Scale = 'overview' | 'approach' | 'detail'
type Visit = { world: World; scale: Scale; selected: ProjectId; open: boolean }
type Point = [number, number, number]
type Pose = { eye: Point; target: Point }
type HistoryEntry = { visit: Visit; pose: Pose }

const projects = observatoryProjects
const placements: Point[] = [
  [-10, 0, 5],
  [4, 0, -9],
  [21, 0, -5],
  [35, 0, -12],
  [39, 0, 8],
  [50, 0, -23],
  [9, 0, -30],
]
const names = ['Nexus', 'Cerebri', 'NovaCore', 'Nemisis', 'Adventura', 'YjsE', 'YJarvis']
const distinctions = [
  'Vier Flügel, ein Kern',
  'Zeit in Schichten',
  'Ein freigelegtes Fundament',
  'Richtung und Bewegung',
  'Eine gestufte Landschaft',
  'Flache Ebenen',
  'Ein geschützter Innenraum',
]
const initial: Visit = { world: 'origin', scale: 'overview', selected: 'nexus', open: false }
const box = new BoxGeometry(1, 1, 1)
const copper = new MeshStandardMaterial({ color: '#803d2b', roughness: 0.39, metalness: 0.55 })
const copperLight = new MeshStandardMaterial({ color: '#c3714c', roughness: 0.4, metalness: 0.35 })
const dark = new MeshStandardMaterial({ color: '#27312e', roughness: 0.57, metalness: 0.35 })
const joint = new MeshStandardMaterial({ color: '#695c4d', roughness: 0.94 })

// Original deterministic material; no stock texture, image generation or asset download.
function stoneMaterial() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const context = canvas.getContext('2d')!
  const data = context.createImageData(256, 256)
  let seed = 72645
  for (let y = 0; y < 256; y++)
    for (let x = 0; x < 256; x++) {
      seed = (1664525 * seed + 1013904223) >>> 0
      const n = (seed / 4294967296 - 0.5) * 15
      const vein = Math.sin(y * 0.031 + Math.sin(x * 0.025) * 2) * 1.5
      const i = (y * 256 + x) * 4
      data.data[i] = 194 + n + vein
      data.data[i + 1] = 192 + n + vein
      data.data[i + 2] = 182 + n + vein
      data.data[i + 3] = 255
    }
  context.putImageData(data, 0, 0)
  const map = new CanvasTexture(canvas)
  map.colorSpace = SRGBColorSpace
  map.wrapS = map.wrapT = RepeatWrapping
  map.repeat.set(0.35, 0.35)
  return new MeshStandardMaterial({
    color: '#e0dfd3',
    map,
    bumpMap: map,
    bumpScale: 0.02,
    roughness: 0.91,
    metalness: 0,
  })
}
const stone = stoneMaterial()
const pale = new MeshStandardMaterial({ color: '#b9b5a7', roughness: 0.96 })

function archGeometry(outer = 7, inner = 4.4, spring = 9, depth = 2) {
  const s = new Shape()
  s.moveTo(-outer, 0)
  s.lineTo(-outer, spring)
  s.absarc(0, spring, outer, Math.PI, 0, true)
  s.lineTo(outer, 0)
  s.lineTo(inner, 0)
  s.lineTo(inner, spring)
  s.absarc(0, spring, inner, 0, Math.PI, false)
  s.lineTo(-inner, 0)
  s.closePath()
  const g = new ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.09,
    bevelThickness: 0.09,
    curveSegments: 56,
  })
  g.translate(0, 0, -depth / 2)
  return g
}
const monumentalArch = archGeometry(9, 5.9, 10.5, 3.5)
const chamberArch = archGeometry(5.5, 3.5, 5.4, 1.6)
const revealArch = archGeometry(5.5, 4.95, 5.4, 0.3)

function Block({
  position,
  scale,
  material = stone,
  rotation = [0, 0, 0],
}: {
  position: Point
  scale: Point
  material?: MeshStandardMaterial
  rotation?: Point
}) {
  return (
    <mesh
      geometry={box}
      material={material}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  )
}

function Plaque({
  text,
  sub = '',
  position,
  width = 3,
  height = 1,
  ink = '#312e25',
  background = '#e8decb',
}: {
  text: string
  sub?: string
  position: Point
  width?: number
  height?: number
  ink?: string
  background?: string
}) {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 768
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = background
    ctx.fillRect(0, 0, 768, 256)
    ctx.fillStyle = ink
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `${text.length > 16 ? 44 : 57}px sans-serif`
    ctx.fillText(text, 384, sub ? 92 : 128, 710)
    if (sub) {
      ctx.font = '29px sans-serif'
      ctx.fillText(sub, 384, 173, 710)
    }
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 2
    return texture
  }, [text, sub, ink, background])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  )
}

function PortalBlades({ open }: { open: boolean }) {
  const ref = useRef<Group>(null)
  const invalidate = useThree((s) => s.invalidate)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => invalidate(), [open, invalidate])
  useFrame((_, dt) => {
    if (!ref.current) return
    let active = false
    ref.current.children.forEach((blade, i) => {
      const goal = open ? (i % 2 ? -1 : 1) * Math.PI * 0.47 : 0
      const delta = goal - blade.rotation.y
      if (Math.abs(delta) > 0.0001) {
        blade.rotation.y = reduced ? goal : blade.rotation.y + delta * Math.min(dt * 5, 1)
        active = true
      }
    })
    if (active) invalidate()
  })
  return (
    <group ref={ref} position={[0, 0, -1.2]}>
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} position={[-5.1 + i * 1.46, 5.4, 0]}>
          <Block
            position={[0, 0, 0]}
            scale={[1.37, 10.8, 0.42]}
            material={i % 2 ? copper : copperLight}
          />
          <Block position={[0, 0, 0.25]} scale={[0.035, 10.1, 0.05]} material={dark} />
        </group>
      ))}
    </group>
  )
}

function Origin({ opened, choose }: { opened: boolean; choose: () => void }) {
  return (
    <group>
      <group position={[3, 0, 0]} rotation={[0, -0.1, 0]}>
        <mesh geometry={monumentalArch} material={stone} castShadow receiveShadow />
        <group position={[0, 0, -5]} scale={[0.93, 1, 0.4]}>
          <mesh geometry={monumentalArch} material={pale} castShadow receiveShadow />
        </group>
        <group position={[0, 0, -12]} scale={[0.83, 0.9, 0.35]}>
          <mesh geometry={monumentalArch} material={stone} castShadow receiveShadow />
        </group>
        <group
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            choose()
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = ''
          }}
        >
          <PortalBlades open={opened} />
        </group>
        <Block position={[0, -1.2, -6]} scale={[24, 2.4, 19]} />
        {Array.from({ length: 9 }, (_, i) => (
          <Block
            key={i}
            position={[0, -1.2 - i * 0.1, 4.5 + i * 1.3]}
            scale={[14 + i * 0.5, 2.4 - i * 0.2, 1.32]}
            material={i % 3 ? pale : stone}
          />
        ))}
        <Block position={[0, -0.1, -11]} scale={[11, 0.2, 22]} material={copper} />
        <Block position={[0, 2.1, -22]} scale={[3.8, 4.2, 1.6]} material={dark} />
        <Block position={[0, 2.1, -21.15]} scale={[2.8, 2.4, 0.03]} material={copperLight} />
        <group position={[5.6, 4, 2]} onClick={choose}>
          <Plaque
            text={opened ? 'Durch den Ursprung' : 'Portal öffnen'}
            position={[0, 0, 0]}
            width={3}
            height={0.8}
          />
        </group>
      </group>
      <group position={[-22, 0, -9]} rotation={[0, 0.35, 0]}>
        <Block position={[0, 4.1, 0]} scale={[3, 13, 4]} />
        <Block position={[0, 11, 0]} scale={[3, 0.2, 4]} material={copper} />
      </group>
      <Block position={[29, 4, -25]} scale={[7, 8, 7]} />
      {Array.from({ length: 11 }, (_, i) => (
        <Block
          key={i}
          position={[24 + i * 2.8, 0.8 + i * 0.27, -30]}
          scale={[1.8, 1.6 + i * 0.54, 9]}
        />
      ))}
    </group>
  )
}

function ProductArtifact() {
  const map = useLoader(TextureLoader, '/media/nexus/dashboard.png')
  map.colorSpace = SRGBColorSpace
  return (
    <mesh position={[0, 3.25, -0.87]}>
      <planeGeometry args={[4.8, 2.484]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  )
}

function CoreSculpture({ index, open }: { index: number; open: boolean }) {
  // Art-directed metaphors only; numbers and geometry are not live project telemetry.
  if (index === 0)
    return (
      <group>
        <Block position={[0, 3.25, -1.05]} scale={[5.15, 3.4, 0.3]} material={dark} />
        <Block position={[0, 1, -1.2]} scale={[2.4, 2, 1.4]} material={copperLight} />
        {[0, 1, 2, 3].map((i) => (
          <group
            key={i}
            position={[
              (i % 2 ? 1 : -1) * (open ? 3 : 1.26),
              i < 2 ? 2.05 : 4.35,
              open ? 0.1 : -0.5,
            ]}
            rotation={[0, (i % 2 ? -0.3 : 0.3) * (open ? 1 : 0), 0]}
          >
            <Block position={[0, 0, 0]} scale={[open ? 1.05 : 2.48, 2.15, 0.3]} material={copper} />
            {open && (
              <Plaque
                text={['Nexus Main', 'Nexus Mobile', 'Nexus Code', 'Nexus Code Mobile'][i]}
                position={[0, 0, 0.16]}
                width={1}
                height={0.45}
                background="#703520"
                ink="#f0e4d2"
              />
            )}
          </group>
        ))}
        {open && (
          <Suspense fallback={null}>
            <ProductArtifact />
          </Suspense>
        )}
        {open && (
          <Plaque
            text="Nexus Main v6 Beta"
            sub="Originalaufnahme"
            position={[0, 1.25, -0.2]}
            width={2.4}
            height={0.6}
            background="#35342c"
            ink="#eadfcc"
          />
        )}
      </group>
    )
  if (index === 1)
    return (
      <group position={[0, 3, -1.3]} rotation={[0, 0.15, 0.16]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0, i * 0.37 - 1.6, 0]} castShadow receiveShadow>
            <torusGeometry args={[1.7 + i * 0.075, 0.12, 8, 56, Math.PI * (open ? 1.4 : 1.9)]} />
            <primitive object={i % 2 ? copper : dark} attach="material" />
          </mesh>
        ))}
      </group>
    )
  if (index === 2)
    return (
      <group position={[0, 2.6, -1.4]}>
        {Array.from({ length: 12 }, (_, i) => (
          <group key={i} rotation={[0, (Math.PI / 6) * i, 0]}>
            <Block
              position={[1.9, 0, 0]}
              scale={[0.24, 4.6, 1.1]}
              rotation={[0.2, 0.3, 0]}
              material={i % 3 ? copper : dark}
            />
          </group>
        ))}
        <Block position={[0, -1.9, 0]} scale={[3.9, 0.25, 3.9]} material={copperLight} />
      </group>
    )
  if (index === 3)
    return (
      <group position={[0, 2.7, -1]}>
        {Array.from({ length: 7 }, (_, i) => (
          <Block
            key={i}
            position={[(i - 3) * 0.47, 0, Math.abs(i - 3) * 0.35]}
            scale={[0.19, 4.2 - Math.abs(i - 3) * 0.35, 3.7]}
            rotation={[0, -0.16, -0.2]}
            material={copper}
          />
        ))}
      </group>
    )
  if (index === 4)
    return (
      <group>
        {Array.from({ length: 5 }, (_, x) =>
          Array.from({ length: 4 }, (_, z) => (
            <Block
              key={`${x}${z}`}
              position={[(x - 2) * 1, (0.9 + Math.sin(x * 0.7 + z) * 0.45) * 1.7, -z * 0.9]}
              scale={[0.94, (0.9 + Math.sin(x * 0.7 + z) * 0.45) * 3.4, 0.85]}
              material={(x + z) % 3 ? copper : stone}
            />
          )),
        )}
      </group>
    )
  if (index === 5)
    return (
      <group position={[0, 2.6, -1]}>
        {[0, 1, 2].map((i) => (
          <Block
            key={i}
            position={[(i - 1) * 0.55, i * 0.9 - 0.9, -i * 0.7]}
            scale={[4, 0.16, 2.4]}
            material={copperLight}
          />
        ))}
      </group>
    )
  return (
    <group position={[0, 2.8, -1.3]}>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={i}
          position={[(i - 3) * 0.42, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[1.8 + Math.sin(i * 0.5) * 0.2, 0.11, 8, 48, Math.PI * 1.68]} />
          <primitive object={copper} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

function Chamber({
  index,
  selected,
  detail,
  choose,
}: {
  index: number
  selected: boolean
  detail: boolean
  choose: (id: ProjectId) => void
}) {
  const point = placements[index]
  return (
    <group position={point}>
      <group
        onClick={(e) => {
          e.stopPropagation()
          choose(projects[index].id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        {index === 0 || index === 1 || index === 6 ? (
          <group scale={index === 6 ? [0.78, 1.24, 1] : index === 1 ? [0.9, 1.08, 1] : [1, 1, 1]}>
            <mesh geometry={chamberArch} material={stone} castShadow receiveShadow />
            {[0, 1, 2, 3].map((i) => (
              <group key={i} position={[0, 0, -1.6 - i * 1.1]}>
                <mesh
                  geometry={revealArch}
                  material={i % 2 ? joint : copper}
                  castShadow
                  receiveShadow
                />
              </group>
            ))}
          </group>
        ) : index === 2 ? (
          <group>
            <Block position={[-4.4, 5.8, 0]} scale={[1.5, 11.6, 2.2]} />
            <Block position={[4.4, 5.8, 0]} scale={[1.5, 11.6, 2.2]} />
            <Block position={[0, 11.2, 0]} scale={[10.5, 1.7, 2.2]} />
            {[-3.5, -1.2, 1.2, 3.5].map((x) => (
              <Block key={x} position={[x, 10.2, -2.4]} scale={[0.18, 0.8, 7]} material={copper} />
            ))}
          </group>
        ) : index === 3 ? (
          <group>
            <Block position={[-4.1, 4.7, 0]} scale={[1.4, 9.7, 3]} rotation={[0, 0, -0.15]} />
            <Block position={[4.1, 4.7, 0]} scale={[1.4, 9.7, 3]} rotation={[0, 0, 0.15]} />
            <Block
              position={[0, 9.6, -1]}
              scale={[7.4, 1.8, 6]}
              rotation={[-0.08, 0, 0]}
              material={copper}
            />
          </group>
        ) : index === 4 ? (
          <group>
            {[-1, 1].map((sign) => (
              <group key={sign}>
                {[0, 1, 2].map((i) => (
                  <Block
                    key={i}
                    position={[sign * (5 - i * 0.75), 1.5 + i * 2.7, -i * 0.7]}
                    scale={[2.1, 3, 4.5]}
                  />
                ))}
              </group>
            ))}
            <Block position={[0, 9.2, -2]} scale={[6.2, 0.7, 7.5]} />
          </group>
        ) : (
          <group>
            <Block position={[-4.3, 4, 0]} scale={[0.7, 8, 4]} />
            <Block position={[4.3, 4, 0]} scale={[0.7, 8, 4]} />
            {[0, 1, 2].map((i) => (
              <Block
                key={i}
                position={[(i - 1) * 0.7, 7.6 + i * 1.2, -i * 0.8]}
                scale={[10.8, 0.45, 7]}
                material={i === 1 ? copper : stone}
              />
            ))}
          </group>
        )}
        <Block position={[0, 5, -6]} scale={[10.8, 10, 0.5]} material={dark} />
        <Block position={[0, -0.32, -1.5]} scale={[11.5, 0.64, 12]} />
        <Block position={[0, 0.03, -1.2]} scale={[6.5, 0.08, 9]} material={joint} />
        <CoreSculpture index={index} open={detail && selected} />
        <Block
          position={[0, 0.055, 3.1]}
          scale={[3.5, 0.08, 0.15]}
          material={selected ? copperLight : copper}
        />
      </group>
      <group onClick={() => choose(projects[index].id)}>
        <Plaque
          text={names[index]}
          sub={
            index === 0
              ? 'Arbeit & Planung'
              : index === 6
                ? 'Lokale Assistenz'
                : index === 1
                  ? 'Arbeit & Planung'
                  : 'Weltenbau'
          }
          position={[0, 8.4, 1.01]}
          width={2.4}
          height={0.82}
        />
      </group>
      {selected && detail && (
        <Plaque
          text={distinctions[index]}
          sub="Räumliche Interpretation"
          position={[0, 6.3, 0.3]}
          width={3.1}
          height={0.9}
        />
      )}
    </group>
  )
}

function Observatory({ visit, choose }: { visit: Visit; choose: (id: ProjectId) => void }) {
  return (
    <group>
      {projects.map((p, i) => (
        <Chamber
          key={p.id}
          index={i}
          selected={visit.selected === p.id && visit.scale !== 'overview'}
          detail={visit.scale === 'detail'}
          choose={choose}
        />
      ))}
      <Block position={[28, -1.5, -13]} scale={[106, 1.8, 72]} />
      {Array.from({ length: 13 }, (_, i) => (
        <Block
          key={i}
          position={[-25 + i * 8, -0.54, 18 - i * 0.1]}
          scale={[0.075, 0.05, 40]}
          material={joint}
        />
      ))}
      <Block position={[-30, 7.8, -16]} scale={[4, 20.4, 18]} />
      <Block position={[-26, 19, -18]} scale={[12, 2, 20]} />
      <Block position={[-13, 10, -39]} scale={[3, 20, 10]} />
      <Block position={[39, 10, -39]} scale={[3, 20, 10]} />
      <Block position={[13, 20, -39]} scale={[57, 1.3, 10]} />
      {Array.from({ length: 9 }, (_, i) => (
        <Block
          key={i}
          position={[-12 + i * 6.4, 19.1, -37]}
          scale={[0.27, 0.45, 13]}
          material={copper}
        />
      ))}
      <Block position={[24, -0.35, 12.1]} scale={[99, 0.07, 0.16]} material={copper} />
    </group>
  )
}

function getPose(visit: Visit, mobile: boolean): Pose {
  if (visit.world === 'origin')
    return visit.scale === 'overview'
      ? mobile
        ? { eye: [21, 12.4, 43], target: [2, 8.7, 0] }
        : { eye: [29, 16, 36], target: [-3, 7.6, -2] }
      : mobile
        ? { eye: [7, 7.4, 23], target: [3, 7, -4] }
        : { eye: [13, 7.8, 20], target: [1, 7.1, -5] }
  if (visit.scale === 'overview')
    return mobile
      ? { eye: [-21, 10.3, 31], target: [-2, 6.1, -1] }
      : { eye: [-36, 22.6, 43], target: [16, 5.7, -8] }
  const p = placements[projects.findIndex((p) => p.id === visit.selected)]
  return visit.scale === 'detail'
    ? {
        eye: [p[0] + (mobile ? 0.8 : 5.5), 5.7, p[2] + (mobile ? 21.6 : 17.8)],
        target: [p[0] - (mobile ? 0 : 2), 4.8, p[2] - 1.7],
      }
    : {
        eye: [p[0] + (mobile ? 1.6 : 10.6), 7.5, p[2] + (mobile ? 26.3 : 23)],
        target: [p[0], 5, p[2] - 1.5],
      }
}

function Rig({
  visit,
  controls,
  restore,
  mobile,
}: {
  visit: Visit
  controls: React.RefObject<CameraControlsImpl | null>
  restore: Pose | null
  mobile: boolean
}) {
  const { gl, camera, scene, invalidate } = useThree()
  const last = useRef<Pose | null>(null)
  const sleeping = useRef(true)
  useEffect(() => {
    const c = controls.current
    if (!c) return
    const pose = restore ?? getPose(visit, mobile)
    const animate =
      last.current !== null && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    c.setLookAt(...pose.eye, ...pose.target, animate)
    last.current = pose
    invalidate()
  }, [visit, restore, mobile, controls, invalidate])
  useEffect(() => {
    const sample = () => {
      const target = controls.current?.getTarget(new Vector3()) ?? new Vector3()
      const output = document.querySelector<HTMLOutputElement>('#renderer-evidence')
      if (output)
        output.value = JSON.stringify({
          calls: gl.info.render.calls,
          triangles: gl.info.render.triangles,
          geometries: gl.info.memory.geometries,
          textures: gl.info.memory.textures,
          frame: gl.info.render.frame,
          eye: camera.position.toArray(),
          target: target.toArray(),
          world: visit.world,
          scale: visit.scale,
          selected: visit.selected,
          canvasCount: document.querySelectorAll('canvas').length,
          sleeping: sleeping.current,
        })
    }
    document.addEventListener('aperture:sample', sample)
    return () => document.removeEventListener('aperture:sample', sample)
  }, [camera, controls, gl, visit])
  useFrame(() => {
    const output = document.querySelector<HTMLOutputElement>('#renderer-evidence')
    if (output && gl.info.render.frame > 0) output.dataset.ready = 'true'
  })
  useEffect(() => {
    scene.background = new Color('#d7d8cd')
  }, [scene])
  return (
    <CameraControls
      ref={controls}
      makeDefault
      onWake={() => {
        sleeping.current = false
      }}
      onSleep={() => {
        sleeping.current = true
      }}
      smoothTime={0.42}
      minDistance={5}
      maxDistance={125}
      minPolarAngle={0.24}
      maxPolarAngle={Math.PI / 2.04}
      dollySpeed={0.6}
      truckSpeed={1.2}
    />
  )
}

function App() {
  const [visit, setVisit] = useState<Visit>(initial)
  const [restore, setRestore] = useState<Pose | null>(null)
  const [past, setPast] = useState<HistoryEntry[]>([])
  const [mobile, setMobile] = useState(window.innerWidth < 640)
  const [read, setRead] = useState(false)
  const controls = useRef<CameraControlsImpl>(null)
  const focus = useRef<HTMLButtonElement>(null)
  const wasReading = useRef(false)
  const selected = projects.find((p) => p.id === visit.selected)!
  useEffect(() => {
    if (!read) {
      if (wasReading.current) focus.current?.focus()
      wasReading.current = false
      return
    }
    wasReading.current = true
    const panel = document.querySelector<HTMLElement>('#project-reading')!
    panel.querySelector<HTMLButtonElement>('button')?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setRead(false)
        focus.current?.focus()
      }
      if (e.key !== 'Tab') return
      const targets = [...panel.querySelectorAll<HTMLElement>('button,a[href]')]
      const first = targets[0]
      const last = targets.at(-1)!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [read])
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const change = () => setMobile(mq.matches)
    mq.addEventListener('change', change)
    return () => mq.removeEventListener('change', change)
  }, [])
  const go = useCallback(
    (next: Visit) => {
      const c = controls.current
      const pose = c
        ? {
            eye: c.getPosition(new Vector3()).toArray() as Point,
            target: c.getTarget(new Vector3()).toArray() as Point,
          }
        : getPose(visit, mobile)
      setPast((entries) => [...entries, { visit, pose }])
      setRestore(null)
      setVisit(next)
      setRead(false)
      document.body.style.cursor = ''
    },
    [visit, mobile],
  )
  const back = () => {
    const previous = past.at(-1)
    if (!previous) return
    setPast((entries) => entries.slice(0, -1))
    setVisit(previous.visit)
    setRestore(previous.pose)
    setRead(false)
  }
  const choose = useCallback(
    (id: ProjectId) => go({ world: 'observatory', scale: 'approach', selected: id, open: true }),
    [go],
  )
  const openOrigin = useCallback(
    () =>
      go(
        visit.open
          ? { world: 'observatory', scale: 'overview', selected: 'nexus', open: true }
          : { ...visit, scale: 'approach', open: true },
      ),
    [visit, go],
  )
  const title =
    visit.world === 'origin'
      ? visit.open
        ? 'Jede Idee öffnet einen Raum.'
        : 'Aus Ideen werden Orte.'
      : visit.scale === 'overview'
        ? 'Ein Archiv im Werden.'
        : selected.name
  const keyboard = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('button,a,select')) return
    const c = controls.current
    if (!c) return
    const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      c.truck(-2, 0, animate)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      c.truck(2, 0, animate)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      c.forward(2, animate)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      c.forward(-2, animate)
    }
    if (e.key === 'Escape') {
      setRead(false)
      focus.current?.focus()
    }
  }
  return (
    <main className={`archive ${visit.world} ${visit.scale} ${read ? 'reading' : ''}`}>
      <a
        className="skip-link"
        href="#project-reading"
        inert={read}
        onClick={(e) => {
          e.preventDefault()
          setRead(true)
        }}
      >
        Projektinformationen lesen
      </a>
      <header inert={read}>
        <a className="wordmark" href="/">
          YoungJibbit95<span>.</span>
        </a>
        <nav aria-label="Räume">
          <button
            aria-current={visit.world === 'origin' ? 'page' : undefined}
            onClick={() => go(initial)}
          >
            Ursprung
          </button>
          <button
            aria-current={visit.world === 'observatory' ? 'page' : undefined}
            onClick={() =>
              go({ world: 'observatory', scale: 'overview', selected: 'nexus', open: true })
            }
          >
            Projekte
          </button>
        </nav>
        <span className="concept-name">The Aperture Archive</span>
      </header>
      <section
        inert={read}
        className="stage"
        aria-label="Interaktive Archivarchitektur. Ziehen zum Drehen, Rad zum Zoomen, Pfeiltasten zum Bewegen."
        tabIndex={0}
        onKeyDown={keyboard}
      >
        <Canvas
          shadows
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{
            position: getPose(initial, mobile).eye,
            fov: mobile ? 46 : 43,
            near: 0.1,
            far: 240,
          }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.17} />
          <hemisphereLight args={['#e6eadd', '#584c43', 1.35]} />
          <directionalLight
            position={[16, 31, 19]}
            intensity={3.4}
            color="#fff3de"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-70}
            shadow-camera-right={90}
            shadow-camera-top={65}
            shadow-camera-bottom={-50}
            shadow-camera-far={150}
            shadow-bias={-0.0003}
            shadow-normalBias={0.025}
          />
          <directionalLight position={[-30, 9, -15]} intensity={0.5} color="#c5d7d9" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]} receiveShadow>
            <planeGeometry args={[500, 500]} />
            <primitive object={pale} attach="material" />
          </mesh>
          <Suspense fallback={null}>
            {visit.world === 'origin' ? (
              <Origin opened={visit.open} choose={openOrigin} />
            ) : (
              <Observatory visit={visit} choose={choose} />
            )}
          </Suspense>
          <Rig visit={visit} controls={controls} restore={restore} mobile={mobile} />
        </Canvas>
      </section>
      <section className="introduction" aria-live="polite">
        <p className="location">
          {visit.world === 'origin'
            ? 'Ursprung'
            : visit.scale === 'overview'
              ? 'Die Projektkammern'
              : selected.category.toLocaleLowerCase('de')}
        </p>
        <h1>{title}</h1>
        <p>
          {visit.world === 'origin'
            ? 'Eigene Werkzeuge, Systeme und Welten. Gebaut, um sie zu verstehen.'
            : visit.scale === 'overview'
              ? 'Sieben Projekte. Jede Kammer bewahrt eine andere Frage.'
              : selected.question.replaceAll(' – ', '. ')}
        </p>
      </section>
      {visit.world === 'observatory' && (
        <label className="project-selector" inert={read}>
          Projektkammer
          <select
            aria-label="Projektkammer auswählen"
            value={visit.scale === 'overview' ? '' : visit.selected}
            onChange={(e) => choose(e.target.value as ProjectId)}
          >
            <option disabled value="">
              Projekt auswählen
            </option>
            {projects.map((project, i) => (
              <option key={project.id} value={project.id}>
                {names[i]}
              </option>
            ))}
          </select>
        </label>
      )}
      {visit.world === 'observatory' && (
        <nav inert={read} className="project-index" aria-label="Projektkammern">
          {projects.map((p, i) => (
            <button
              key={p.id}
              aria-pressed={visit.scale !== 'overview' && visit.selected === p.id}
              onClick={() => choose(p.id)}
            >
              {names[i]}
            </button>
          ))}
        </nav>
      )}
      <footer inert={read} className="exploration">
        <div className="orientation">
          <button disabled={!past.length} onClick={back} aria-label="Zur vorherigen Kamera zurück">
            ← Zurück
          </button>
          {visit.scale !== 'overview' && (
            <button onClick={() => go({ ...visit, scale: 'overview' })}>Übersicht</button>
          )}
          <span className="gesture">Ziehen & entdecken</span>
        </div>
        <div className="primary-action">
          {visit.world === 'origin' ? (
            <button className="enter" ref={focus} onClick={openOrigin}>
              {visit.open ? 'Projekte betreten' : 'Portal öffnen'}
              <span aria-hidden="true">↗</span>
            </button>
          ) : visit.scale === 'overview' ? (
            <button className="enter" onClick={() => choose('nexus')}>
              Nexus entdecken<span aria-hidden="true">↗</span>
            </button>
          ) : visit.scale === 'approach' ? (
            <button ref={focus} className="enter" onClick={() => go({ ...visit, scale: 'detail' })}>
              Kammer öffnen<span aria-hidden="true">↗</span>
            </button>
          ) : (
            <button
              ref={focus}
              className="enter"
              aria-expanded={read}
              aria-controls="project-reading"
              onClick={() => setRead(!read)}
            >
              {read ? 'Text schließen' : 'Projekt lesen'}
              <span aria-hidden="true">{read ? '−' : '+'}</span>
            </button>
          )}
        </div>
      </footer>
      <article
        role={read ? 'dialog' : undefined}
        aria-modal={read ? true : undefined}
        aria-label="Projektinformationen"
        id="project-reading"
        className={read ? 'project-reading open' : 'project-reading'}
      >
        <button
          className="close-reading"
          onClick={() => {
            setRead(false)
            focus.current?.focus()
          }}
        >
          Schließen
        </button>
        <p className="location">{selected.status}</p>
        <h2>{selected.name}</h2>
        <p>{selected.description.replaceAll(' – ', '. ')}</p>
        <p className="stack">{selected.stack.join(' / ')}</p>
        <p>{selected.evidence[0].claim}</p>
        <p className="limits">{selected.evidence[0].limits}</p>
        <a href={selected.evidence[0].url} target="_blank" rel="noreferrer">
          Quelltext und Belege ↗
        </a>
        {selected.id === 'nexus' && (
          <figure>
            <img
              src="/media/nexus/dashboard.png"
              width={1600}
              height={828}
              alt="Originalaufnahme des Nexus Main v6 Beta Dashboards"
              loading="lazy"
            />
            <figcaption>
              Nexus Main v6 Beta. Historische Originalaufnahme von nexusproject.dev, keine
              Darstellung des aktuellen Repository-Builds.
            </figcaption>
          </figure>
        )}
      </article>
      <output id="renderer-evidence" aria-hidden="true" hidden />
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

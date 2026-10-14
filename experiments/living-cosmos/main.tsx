import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useThree } from '@react-three/fiber'
import { CameraControls, Html } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import { Vector3 } from 'three'
import { CosmicEnvironment, cosmos, type CosmosVariant } from './CosmicEnvironment'
import { NexusSystem } from './NexusSystem'
import { CosmicProjectMarker } from './CosmicProjectMarker'
import { observatoryProjects } from '../../src/experience/observatory/data'
import {
  observatoryArrival,
  observatoryOverview,
  projectPose,
} from '../../src/experience/observatory/camera'
import type { CameraPose } from '../../src/experience/worldTypes'
import '@fontsource-variable/manrope'
import '@fontsource/jetbrains-mono/400.css'
import './style.css'

const nexus = observatoryProjects[0]
const compact = window.innerWidth < 768
const initial = compact ? observatoryArrival(nexus) : observatoryOverview
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Scene({
  variant,
  selected,
  controls,
  pose,
}: {
  variant: CosmosVariant
  selected: boolean
  controls: React.RefObject<CameraControlsImpl | null>
  pose: CameraPose
}) {
  const { invalidate, camera, gl, scene } = useThree()
  useEffect(() => {
    if (!controls.current) return
    const c = controls.current
    void c.setLookAt(...pose.position, ...pose.target, !reduced)
    if ('fov' in camera) {
      camera.fov = pose.fov
      camera.updateProjectionMatrix()
    }
    invalidate()
  }, [pose, camera, controls, invalidate])
  useEffect(() => {
    const audit = () => {
      gl.render(scene, camera)
      document.documentElement.dataset.rendered = 'true'
      document.documentElement.dataset.drawCalls = String(gl.info.render.calls)
    }
    const id = window.setTimeout(audit, 300)
    return () => window.clearTimeout(id)
  }, [camera, gl, scene])
  return (
    <>
      <color attach="background" args={[cosmos.void]} />
      <ambientLight intensity={0.75} color="#9ca6df" />
      <directionalLight position={[200, 500, 400]} intensity={2.4} color="#b8d4ff" />
      <directionalLight position={[-300, 100, -500]} intensity={1.5} color="#a28edc" />
      <CosmicEnvironment variant={variant} />
      {observatoryProjects.map((project) => (
        <group key={project.id} position={[...project.position]}>
          {project.id === 'nexus' ? (
            <>
              <NexusSystem selected={selected} level="macro" />
              <NexusSystem selected={selected} level="meso" />
              {selected ? <NexusSystem selected level="micro" /> : null}
            </>
          ) : (
            <CosmicProjectMarker id={project.id} level="macro" />
          )}
          {!selected || project.id === 'nexus' ? (
            <Html position={[0, 59, 0]} center zIndexRange={[1, 0]}>
              <span className="cosmos-label">
                {project.id === 'nexus' ? 'Nexus' : project.name}
              </span>
            </Html>
          ) : null}
        </group>
      ))}
      <CameraControls
        ref={controls}
        makeDefault
        minDistance={20}
        maxDistance={3600}
        smoothTime={reduced ? 0 : 0.6}
        draggingSmoothTime={0}
        dollySpeed={0.8}
      />
    </>
  )
}

function App() {
  const [variant, setVariant] = useState<CosmosVariant>(
    new URLSearchParams(location.search).get('variant') === 'meridian' ? 'meridian' : 'nebula',
  )
  const [pose, setPose] = useState(initial)
  const [selected, setSelected] = useState(false)
  const controls = useRef<CameraControlsImpl>(null)
  const previous = useRef<CameraPose>(initial)
  const enter = () => {
    if (controls.current)
      previous.current = {
        position: controls.current.getPosition(new Vector3()).toArray(),
        target: controls.current.getTarget(new Vector3()).toArray(),
        fov: pose.fov,
        zoom: 1,
      }
    setSelected(true)
    setPose(projectPose(nexus, compact, true))
  }
  return (
    <main>
      <div
        className="cosmos-stage"
        aria-label="Interaktive Sternwarte: Ziehen dreht, Mausrad oder Pinch zoomt."
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [...initial.position], fov: 48, near: 0.1, far: 16000 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
        >
          <Scene variant={variant} selected={selected} controls={controls} pose={pose} />
        </Canvas>
      </div>
      <header>
        <a href="/atlas/observatory/">YoungJibbit95</a>
        <span>Sternwarte</span>
        <a href="https://github.com/YoungJibbit95" rel="noreferrer">
          GitHub ↗
        </a>
      </header>
      <section className="cosmos-intro" aria-live="polite">
        <p>{selected ? 'Ein gemeinsamer Kern' : 'Sieben Projekte. Ein Kosmos.'}</p>
        <h1>
          {selected ? (
            'Nexus'
          ) : (
            <>
              Ideen sind
              <br />
              verbunden.
            </>
          )}
        </h1>
        <p className="cosmos-description">
          {selected
            ? 'Vier Clients teilen eine Grundlage. Entdecke den Zusammenhang.'
            : 'Bewege dich zwischen Workspaces, Engines und neuen Welten.'}
        </p>
        {selected ? (
          <button
            onClick={() => {
              setPose(previous.current)
              setSelected(false)
            }}
          >
            Zurück zur Karte
          </button>
        ) : (
          <button onClick={enter}>
            Nexus erkunden <span>↗</span>
          </button>
        )}
      </section>
      {selected ? (
        <aside className="cosmos-dossier">
          <span>Workspace & Code</span>
          <h2>
            Eine Idee.
            <br />
            Vier Blickwinkel.
          </h2>
          <p>Nexus Main, Nexus Mobile, Nexus Code und Nexus Code Mobile teilen @nexus/core.</p>
          <a href={nexus.evidence[0].url}>Projektquelle ↗</a>
        </aside>
      ) : null}
      <nav className="cosmos-tools" aria-label="Darstellung">
        <button aria-pressed={variant === 'nebula'} onClick={() => setVariant('nebula')}>
          Nebelraum
        </button>
        <button aria-pressed={variant === 'meridian'} onClick={() => setVariant('meridian')}>
          Stille Weite
        </button>
        <button
          onClick={() => {
            setPose(observatoryOverview)
            setSelected(false)
          }}
        >
          Übersicht
        </button>
      </nav>
      <p className="cosmos-note">
        {selected ? 'Räumliche Illustration der Projektarchitektur' : 'Ziehen · Zoomen · Entdecken'}
      </p>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

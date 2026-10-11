import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { CameraRig } from './CameraRig'
import { bindSpatialInput } from './InteractionRouter'
import { getWorld } from './SceneRegistry'
import type { AvailableWorldId, CameraBridge, CameraPose } from './worldTypes'
import type { ObservatorySceneInput } from './observatory/contracts'

const Origin = lazy(() => getWorld('origin').loadScene())
const Observatory = lazy(() => getWorld('observatory').loadScene())

interface CanvasProps {
  observatory?: ObservatorySceneInput
  world: AvailableWorldId
  selectedId: string | null
  initialPose: CameraPose
  reducedMotion: boolean
  onCamera: (camera: CameraBridge | null) => void
  onRest: (pose: CameraPose) => void
  onInterrupt: () => void
  onFocus: (id: string) => void
  onFailure: () => void
  onSceneReady: (world: AvailableWorldId) => void
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree()
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault()
      onFailure()
    }
    gl.domElement.addEventListener('webglcontextlost', lost)
    return () => gl.domElement.removeEventListener('webglcontextlost', lost)
  }, [gl, onFailure])
  return null
}

/** Diagnostic output samples real renderer counters on demand frames; it schedules no frames. */
function RendererMetrics({
  target,
  world,
}: {
  target: RefObject<HTMLOutputElement | null>
  world: AvailableWorldId
}) {
  const gl = useThree((state) => state.gl)
  const sample = useCallback(() => {
    if (!target.current) return
    target.current.value = JSON.stringify({
      world,
      frame: gl.info.render.frame,
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      programs: gl.info.programs?.length ?? 0,
    })
  }, [gl, target, world])
  useFrame(sample)
  useEffect(() => {
    // R3F frees old scene resources on idle, after the last demand frame.
    // Explicit diagnostics must read those current counters without rendering.
    const output = target.current
    output?.addEventListener('atlas:sample-renderer', sample)
    return () => output?.removeEventListener('atlas:sample-renderer', sample)
  }, [sample, target])
  return null
}

/**
 * Lazy scene completion must schedule a frame when using frameloop="demand".
 * Report readiness only after the renderer has finished at least one frame
 * with the newly committed scene. Browser pixel checks remain the visual gate.
 */
function SceneRenderReady({
  world,
  onReady,
}: {
  world: AvailableWorldId
  onReady: (world: AvailableWorldId) => void
}) {
  const { gl, invalidate, size } = useThree()
  const baselineFrame = useRef<number | null>(null)

  useEffect(() => {
    baselineFrame.current = gl.info.render.frame
    invalidate()
    return () => {
      baselineFrame.current = null
    }
  }, [gl, invalidate, world, size.width, size.height])

  useFrame((state) => {
    const baseline = baselineFrame.current
    if (baseline === null) return
    if (state.gl.info.render.frame > baseline) {
      baselineFrame.current = null
      onReady(world)
    } else {
      state.invalidate()
    }
  })
  return null
}

function CameraHost({
  camera,
  initialPose,
  reducedMotion,
  world,
  onCamera,
  onRest,
  onInterrupt,
}: {
  camera: RefObject<CameraBridge | null>
  initialPose: CameraPose
  reducedMotion: boolean
  world: AvailableWorldId
  onCamera: CanvasProps['onCamera']
  onRest: CanvasProps['onRest']
  onInterrupt: CanvasProps['onInterrupt']
}) {
  useEffect(() => () => onCamera(null), [onCamera])
  return (
    <CameraRig
      ref={camera}
      bounds={getWorld(world).bounds}
      initialPose={initialPose}
      reducedMotion={reducedMotion}
      onReady={() => onCamera(camera.current)}
      onRest={onRest}
      onManualStart={onInterrupt}
    />
  )
}

/** One persistent Canvas, one CameraControls instance; only the active scene is mounted. */
export default function WorldCanvas(props: CanvasProps) {
  const { world, selectedId, onFocus, onInterrupt } = props
  const host = useRef<HTMLDivElement>(null)
  const camera = useRef<CameraBridge>(null)
  const metrics = useRef<HTMLOutputElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!host.current) return
    return bindSpatialInput(host.current, onInterrupt)
  }, [onInterrupt])

  return (
    <div className="atlas-v3__canvas" data-testid="atlas-canvas" ref={host}>
      <Canvas
        shadows="soft"
        camera={{ position: [...props.initialPose.position], fov: 51, near: 0.1, far: 6000 }}
        dpr={[1, 1.5]}
        frameloop={visible ? 'demand' : 'never'}
        gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
      >
        <ContextGuard onFailure={props.onFailure} />
        <RendererMetrics target={metrics} world={world} />
        <CameraHost
          camera={camera}
          initialPose={props.initialPose}
          reducedMotion={props.reducedMotion}
          world={world}
          onCamera={props.onCamera}
          onRest={props.onRest}
          onInterrupt={onInterrupt}
        />
        <Suspense fallback={null}>
          {world === 'origin' ? (
            <Origin onFocus={onFocus} selectedId={selectedId} />
          ) : (
            <Observatory
              onFocus={onFocus}
              selectedId={selectedId}
              observatory={props.observatory}
            />
          )}
          <SceneRenderReady key={world} world={world} onReady={props.onSceneReady} />
        </Suspense>
      </Canvas>
      <output
        className="atlas-v3__sr"
        data-testid="atlas-renderer-info"
        ref={metrics}
        aria-hidden="true"
      />
    </div>
  )
}

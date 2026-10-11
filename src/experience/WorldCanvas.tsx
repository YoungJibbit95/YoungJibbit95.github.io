import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { CameraRig } from './CameraRig'
import { bindSpatialInput } from './InteractionRouter'
import { getWorld } from './SceneRegistry'
import type { AvailableWorldId, CameraBridge, CameraPose } from './worldTypes'

const Origin = lazy(() => getWorld('origin').loadScene())
const Observatory = lazy(() => getWorld('observatory').loadScene())

interface CanvasProps {
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
        camera={{ position: [...props.initialPose.position], fov: 51, near: 0.1, far: 230 }}
        dpr={[1, 1.5]}
        frameloop={visible ? 'demand' : 'never'}
        gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
      >
        <ContextGuard onFailure={props.onFailure} />
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
            <Observatory onFocus={onFocus} selectedId={selectedId} />
          )}
          <SceneRenderReady key={world} world={world} onReady={props.onSceneReady} />
        </Suspense>
      </Canvas>
    </div>
  )
}

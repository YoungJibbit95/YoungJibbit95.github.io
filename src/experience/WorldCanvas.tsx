import { Canvas, useThree } from '@react-three/fiber'
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
  onCamera: (camera: CameraBridge | null) => void
  onRest: (pose: CameraPose) => void
  onInterrupt: () => void
  onFocus: (id: string) => void
  onFailure: () => void
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

function CameraHost({
  camera,
  initialPose,
  world,
  onCamera,
  onRest,
  onInterrupt,
}: {
  camera: RefObject<CameraBridge | null>
  initialPose: CameraPose
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
        </Suspense>
      </Canvas>
    </div>
  )
}

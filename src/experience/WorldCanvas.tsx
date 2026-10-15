import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { CameraRig } from './CameraRig'
import { bindSpatialInput } from './InteractionRouter'
import { getWorld } from './SceneRegistry'
import type { AvailableWorldId, CameraBridge, CameraPose } from './worldTypes'
import type { ObservatorySceneInput } from './observatory/contracts'
import { LineSegments, Sprite, Vector3 } from 'three'
import { nexusSemantics } from './worlds/cosmos/nexusSemantic'

const Origin = lazy(() => getWorld('origin').loadScene())
const Observatory = lazy(() => getWorld('observatory').loadScene())
const CosmicObservatory = lazy(() => import('./worlds/CosmicObservatoryWorld'))

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
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const sample = useCallback(
    (inspect = false) => {
      if (!target.current) return
      const nexusLabels: {
        id: string
        x: number
        y: number
        width: number
        height: number
        nameFontSize: number
        roleFontSize: number
      }[] = []
      const nexusRelations: number[][] = []
      if (inspect) {
        const relations = scene.getObjectByName('nexus-core-relations')
        if (relations instanceof LineSegments) {
          const positions = relations.geometry.getAttribute('position')
          for (let index = 0; index < positions.count; index++)
            nexusRelations.push([
              positions.getX(index),
              positions.getY(index),
              positions.getZ(index),
            ])
        }
        scene.traverse((object) => {
          if (!(object instanceof Sprite) || !object.name.startsWith('nexus-label-')) return
          for (let ancestor = object.parent; ancestor; ancestor = ancestor.parent)
            if (!ancestor.visible) return
          if (!object.visible) return
          const center = object.getWorldPosition(new Vector3())
          const scale = object.getWorldScale(new Vector3())
          const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
          const up = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
          // Measure the actual text footprint, including a relocated sprite anchor.
          const corners = [-1, 1].flatMap((x) =>
            [-1, 1].map((y) =>
              center
                .clone()
                .addScaledVector(
                  right,
                  (0.5 - object.center.x + (x * object.userData.glyphWidth) / 2) * scale.x,
                )
                .addScaledVector(
                  up,
                  (0.5 - object.center.y + (y * object.userData.glyphHeight) / 2) * scale.y,
                )
                .project(camera),
            ),
          )
          const xs = corners.map((point) => ((point.x + 1) * size.width) / 2)
          const ys = corners.map((point) => ((1 - point.y) * size.height) / 2)
          const projectedHeight = (Math.max(...ys) - Math.min(...ys)) / object.userData.glyphHeight
          nexusLabels.push({
            id: object.name.replace('nexus-label-', ''),
            x: Math.min(...xs),
            y: Math.min(...ys),
            width: Math.max(...xs) - Math.min(...xs),
            height: Math.max(...ys) - Math.min(...ys),
            nameFontSize: projectedHeight * object.userData.nameFontRatio,
            roleFontSize: projectedHeight * object.userData.roleFontRatio,
          })
        })
      }
      target.current.value = JSON.stringify({
        world,
        frame: gl.info.render.frame,
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        programs: gl.info.programs?.length ?? 0,
        ...(inspect
          ? {
              cameraFar: camera.far,
              cameraPosition: camera.position.toArray(),
              // Project the real sprite corners only when a test requests them.
              labels: (scene.getObjectByName('cosmic-project-labels')?.children ?? [])
                .filter((object) => object.visible && object instanceof Sprite)
                .map((object) => {
                  const center = object.getWorldPosition(new Vector3())
                  const scale = object.getWorldScale(new Vector3())
                  const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
                  const up = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
                  const corners = [-1, 1].flatMap((x) =>
                    [-1, 1].map((y) =>
                      center
                        .clone()
                        .addScaledVector(right, (x * scale.x) / 2)
                        .addScaledVector(up, (y * scale.y) / 2)
                        .project(camera),
                    ),
                  )
                  const xs = corners.map((point) => ((point.x + 1) * size.width) / 2)
                  const ys = corners.map((point) => ((1 - point.y) * size.height) / 2)
                  return {
                    id: object.name.replace('cosmic-label-', ''),
                    x: Math.min(...xs),
                    y: Math.min(...ys),
                    width: Math.max(...xs) - Math.min(...xs),
                    height: Math.max(...ys) - Math.min(...ys),
                  }
                }),
              // Read actual transforms only on explicit diagnostic requests.
              discovery: scene.getObjectByName('nexus-stellar-system')
                ? {
                    clients: nexusSemantics.clients.map(({ id }) => ({
                      id,
                      position: scene.getObjectByName('nexus-client-' + id)?.position.toArray(),
                      shells: ['upper', 'lower'].map((half) =>
                        scene.getObjectByName('nexus-shell-' + half + '-' + id)?.position.toArray(),
                      ),
                    })),
                    relations: nexusRelations,
                    labels: nexusLabels,
                    detailVisible: scene.getObjectByName('nexus-runtime-detail')?.visible,
                  }
                : null,
            }
          : {}),
      })
    },
    [gl, target, world, scene, camera, size.width, size.height],
  )
  useFrame(() => sample())
  useEffect(() => {
    // R3F frees old scene resources on idle, after the last demand frame.
    // Explicit diagnostics must read those current counters without rendering.
    const output = target.current
    const inspect = () => sample(true)
    output?.addEventListener('atlas:sample-renderer', inspect)
    return () => output?.removeEventListener('atlas:sample-renderer', inspect)
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
          ) : props.observatory?.cosmicPreview ? (
            <CosmicObservatory
              onFocus={onFocus}
              selectedId={selectedId}
              observatory={props.observatory}
            />
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

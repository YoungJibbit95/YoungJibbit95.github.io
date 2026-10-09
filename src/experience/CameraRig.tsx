import { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import CameraControlsImpl from 'camera-controls'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Box3, PerspectiveCamera, Vector3 } from 'three'
import type { CameraBounds, CameraBridge, CameraPose } from './worldTypes'

interface RigProps {
  bounds: CameraBounds
  initialPose: CameraPose
  onReady: () => void
  onRest: (pose: CameraPose) => void
  onManualStart: () => void
}

const tuple = (value: Vector3): [number, number, number] => [value.x, value.y, value.z]

/** Ported from the proven G0 CameraRig. Physical CameraControls pose is authoritative. */
export const CameraRig = forwardRef<CameraBridge, RigProps>(function CameraRig(
  { bounds, initialPose, onReady, onRest, onManualStart },
  forwarded,
) {
  const controlsRef = useRef<CameraControlsImpl>(null)
  const generation = useRef(0)
  const { camera, invalidate } = useThree()
  const callbacks = useRef({ onReady, onRest, onManualStart })
  callbacks.current = { onReady, onRest, onManualStart }

  function capture(): CameraPose | null {
    const controls = controlsRef.current
    if (!controls) return null
    const perspective = camera as PerspectiveCamera
    return {
      position: tuple(controls.getPosition(new Vector3(), false)),
      target: tuple(controls.getTarget(new Vector3(), false)),
      fov: perspective.fov,
      zoom: perspective.zoom,
    }
  }

  function cancel(): void {
    generation.current++
    controlsRef.current?.stop()
    invalidate()
  }

  async function moveTo(pose: CameraPose, animate: boolean): Promise<boolean> {
    const controls = controlsRef.current
    if (!controls) return false
    const token = ++generation.current
    controls.stop()
    const perspective = camera as PerspectiveCamera
    perspective.fov = pose.fov
    perspective.zoom = pose.zoom
    perspective.updateProjectionMatrix()
    controls.normalizeRotations()
    invalidate()
    await controls.setLookAt(...pose.position, ...pose.target, animate)
    const complete = generation.current === token
    if (complete) invalidate()
    return complete
  }

  useImperativeHandle(forwarded, () => ({
    capture,
    cancel,
    moveTo,
    pan: async (horizontal, vertical) => {
      cancel()
      await controlsRef.current?.truck(horizontal, vertical, true)
      const current = capture()
      if (current) callbacks.current.onRest(current)
    },
    dolly: async (distance) => {
      cancel()
      await controlsRef.current?.dolly(distance, true)
      const current = capture()
      if (current) callbacks.current.onRest(current)
    },
  }))

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const { x, y, z } = bounds.box
    controls.setBoundary(new Box3(new Vector3(x[0], y[0], z[0]), new Vector3(x[1], y[1], z[1])))
  }, [bounds])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    let active = true
    const start = () => {
      generation.current++
      callbacks.current.onManualStart()
    }
    const rest = () => {
      const pose = capture()
      if (pose) callbacks.current.onRest(pose)
    }
    controls.addEventListener('controlstart', start)
    controls.addEventListener('rest', rest)
    controls.addEventListener('sleep', rest)
    void controls.setLookAt(...initialPose.position, ...initialPose.target, false).then(() => {
      if (active) callbacks.current.onReady()
    })
    return () => {
      active = false
      generation.current++
      controls.removeEventListener('controlstart', start)
      controls.removeEventListener('rest', rest)
      controls.removeEventListener('sleep', rest)
    }
    // The stable physical camera mounts once; world changes only update boundaries and poses.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={bounds.minDistance}
      maxDistance={bounds.maxDistance}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI - 0.3}
      smoothTime={0.65}
      draggingSmoothTime={0.14}
      mouseButtons={{
        left: CameraControlsImpl.ACTION.TRUCK,
        right: CameraControlsImpl.ACTION.ROTATE,
        middle: CameraControlsImpl.ACTION.DOLLY,
        wheel: CameraControlsImpl.ACTION.DOLLY,
      }}
      touches={{
        one: CameraControlsImpl.ACTION.TOUCH_TRUCK,
        two: CameraControlsImpl.ACTION.TOUCH_DOLLY_TRUCK,
        three: CameraControlsImpl.ACTION.TOUCH_ROTATE,
      }}
    />
  )
})

import { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import CameraControlsImpl from 'camera-controls'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Box3, PerspectiveCamera, Vector3 } from 'three'
import {
  CAMERA_LIMITS,
  CameraHistory,
  DEFAULT_POSE,
  FlightToken,
  clonePose,
  poseForPoint,
  type CameraPose,
  type PointId,
} from './cameraModel'
import type { CameraRigHandle, SceneProps } from './cameraTypes'

function vec3(v: Vector3): [number, number, number] {
  return [v.x, v.y, v.z]
}

/**
 * Three's camera is the source of truth, not React state.
 * Publish snapshots only at user/navigation boundaries, never on each RAF.
 */
export const CameraRig = forwardRef<CameraRigHandle, SceneProps>(function CameraRig(
  { reducedMotion, onPose, onSelection },
  handle,
) {
  const controlsRef = useRef<CameraControlsImpl | null>(null)
  const tokenRef = useRef(new FlightToken())
  const historyRef = useRef(new CameraHistory())
  const selectionRef = useRef<PointId | null>(null)
  const { camera } = useThree()
  const motionRef = useRef(reducedMotion)
  const poseCallbackRef = useRef(onPose)
  const selectionCallbackRef = useRef(onSelection)

  useEffect(() => {
    motionRef.current = reducedMotion
  }, [reducedMotion])

  useEffect(() => {
    poseCallbackRef.current = onPose
    selectionCallbackRef.current = onSelection
  }, [onPose, onSelection])

  function capture(): CameraPose | null {
    const controls = controlsRef.current
    if (!controls) return null
    const perspective = camera as PerspectiveCamera
    return {
      position: vec3(controls.getPosition(new Vector3(), false)),
      target: vec3(controls.getTarget(new Vector3(), false)),
      fov: perspective.fov,
      zoom: perspective.zoom,
    }
  }

  function emit(): void {
    const pose = capture()
    if (pose) poseCallbackRef.current(pose)
  }

  function interrupt(): void {
    tokenRef.current.cancel()
    controlsRef.current?.stop()
    emit()
  }

  async function moveTo(pose: CameraPose): Promise<void> {
    const controls = controlsRef.current
    if (!controls) return
    const token = tokenRef.current.begin()
    controls.stop()
    const perspective = camera as PerspectiveCamera
    perspective.fov = pose.fov
    perspective.zoom = pose.zoom
    perspective.updateProjectionMatrix()
    controls.normalizeRotations()
    await controls.setLookAt(
      pose.position[0],
      pose.position[1],
      pose.position[2],
      pose.target[0],
      pose.target[1],
      pose.target[2],
      !motionRef.current,
    )
    if (tokenRef.current.isCurrent(token)) emit()
  }

  useImperativeHandle(handle, () => ({
    pose: capture,
    cancel: interrupt,
    focus: async (id) => {
      const destination = poseForPoint(id)
      const origin = capture()
      if (!destination || !origin) return
      historyRef.current.push({ pose: origin, selection: selectionRef.current })
      selectionRef.current = id
      selectionCallbackRef.current(id)
      await moveTo(destination)
    },
    back: async () => {
      const snapshot = historyRef.current.pop()
      if (!snapshot) return false
      selectionRef.current = snapshot.selection
      selectionCallbackRef.current(snapshot.selection)
      await moveTo(snapshot.pose)
      return true
    },
    reset: async () => {
      historyRef.current.clear()
      selectionRef.current = null
      selectionCallbackRef.current(null)
      await moveTo(clonePose(DEFAULT_POSE))
    },
    pan: async (horizontal, vertical) => {
      const controls = controlsRef.current
      if (!controls) return
      interrupt()
      await controls.truck(horizontal, vertical, !motionRef.current)
      emit()
    },
    dolly: async (distance) => {
      const controls = controlsRef.current
      if (!controls) return
      interrupt()
      await controls.dolly(distance, !motionRef.current)
      emit()
    },
  }))

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const { x, y, z } = CAMERA_LIMITS.bounds
    controls.setBoundary(
      new Box3(new Vector3(x[0], y[0], z[0]), new Vector3(x[1], y[1], z[1])),
    )
    void controls.setLookAt(...DEFAULT_POSE.position, ...DEFAULT_POSE.target, false).then(emit)

    // The input event itself owns the camera now: do NOT stop() in controlstart.
    const onStart = () => tokenRef.current.cancel()
    const onEnd = () => emit()
    controls.addEventListener('controlstart', onStart)
    controls.addEventListener('controlend', onEnd)
    controls.addEventListener('rest', onEnd)
    return () => {
      tokenRef.current.cancel()
      controls.removeEventListener('controlstart', onStart)
      controls.removeEventListener('controlend', onEnd)
      controls.removeEventListener('rest', onEnd)
    }
  }, [camera])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={CAMERA_LIMITS.minDistance}
      maxDistance={CAMERA_LIMITS.maxDistance}
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

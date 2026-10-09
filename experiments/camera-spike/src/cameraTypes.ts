import type { CameraPose, PointId } from './cameraModel'

export interface CameraRigHandle {
  focus(point: PointId): Promise<void>
  back(): Promise<boolean>
  reset(): Promise<void>
  pan(horizontal: number, vertical: number): Promise<void>
  dolly(distance: number): Promise<void>
  cancel(): void
  pose(): CameraPose | null
}

export type SceneProps = {
  reducedMotion: boolean
  onPose: (pose: CameraPose) => void
  onSelection: (point: PointId | null) => void
  onSavedPose: (pose: CameraPose | null) => void
  onReady: () => void
}

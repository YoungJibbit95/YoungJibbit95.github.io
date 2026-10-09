/** Deterministic, renderer-independent camera contracts for the isolated G0 spike. */
export type Vec3 = readonly [number, number, number]
export type PointId = 'signal' | 'atlas' | 'core'

export type CameraPose = Readonly<{
  position: Vec3
  target: Vec3
  fov: number
  zoom: number
}>

export type CameraSnapshot = Readonly<{
  pose: CameraPose
  selection: PointId | null
}>

export type PointDefinition = Readonly<{
  id: PointId
  label: string
  kind: string
  position: Vec3
  focusPose: CameraPose
  explanation: string
}>

export const DEFAULT_POSE: CameraPose = {
  position: [0, 6, 24],
  target: [0, 0, -2],
  fov: 52,
  zoom: 1,
}

export const FOCUS_POINTS: readonly PointDefinition[] = [
  {
    id: 'signal',
    label: 'Signal',
    kind: 'Raumpunkt A',
    position: [-8, 1, -6],
    focusPose: { position: [-5.8, 4.2, 2.5], target: [-8, 1, -6], fov: 52, zoom: 1 },
    explanation: 'Der Blick folgt einem Punkt in echter Tiefe – nicht einem vergrößerten HTML-Element.',
  },
  {
    id: 'atlas',
    label: 'Verbindung',
    kind: 'Raumpunkt B',
    position: [0, -2, 4],
    focusPose: { position: [0.5, 0.5, 12], target: [0, -2, 4], fov: 52, zoom: 1 },
    explanation: 'Ein anderer Blickwinkel macht den Abstand zwischen Raumobjekten sichtbar.',
  },
  {
    id: 'core',
    label: 'Kern',
    kind: 'Raumpunkt C',
    position: [8, 2.5, -11],
    focusPose: { position: [10, 5.5, -2], target: [8, 2.5, -11], fov: 52, zoom: 1 },
    explanation: 'Eine Fokusfahrt speichert die vorherige Kamerapose für eine präzise Rückkehr.',
  },
]

export const CAMERA_LIMITS = {
  minDistance: 3,
  maxDistance: 50,
  bounds: { x: [-14, 14], y: [-9, 9], z: [-16, 12] },
} as const

export function clonePose(pose: CameraPose): CameraPose {
  return {
    position: [...pose.position] as [number, number, number],
    target: [...pose.target] as [number, number, number],
    fov: pose.fov,
    zoom: pose.zoom,
  }
}

export function validatePose(pose: CameraPose): boolean {
  const values = [...pose.position, ...pose.target, pose.fov, pose.zoom]
  const squaredDistance = pose.position.reduce(
    (total, number, axis) => total + (number - pose.target[axis]) ** 2,
    0,
  )
  return (
    values.every(Number.isFinite) &&
    pose.fov >= 20 &&
    pose.fov <= 90 &&
    pose.zoom >= 0.25 &&
    pose.zoom <= 4 &&
    squaredDistance >= CAMERA_LIMITS.minDistance ** 2 &&
    squaredDistance <= CAMERA_LIMITS.maxDistance ** 2
  )
}

export function createSnapshot(pose: CameraPose, selection: PointId | null): CameraSnapshot {
  if (!validatePose(pose)) throw new Error('Invalid camera pose')
  return { pose: clonePose(pose), selection }
}

/** No React state writes per camera frame; only explicit navigation boundaries. */
export class CameraHistory {
  private history: CameraSnapshot[] = []

  push(snapshot: CameraSnapshot): void {
    this.history.push(createSnapshot(snapshot.pose, snapshot.selection))
  }

  pop(): CameraSnapshot | null {
    return this.history.pop() ?? null
  }

  clear(): void {
    this.history.length = 0
  }

  get length(): number {
    return this.history.length
  }
}

/** Monotonic cancellation token also protects async camera transitions against stale completions. */
export class FlightToken {
  private current = 0

  begin(): number {
    return ++this.current
  }

  cancel(): void {
    this.current++
  }

  isCurrent(token: number): boolean {
    return token === this.current
  }
}

export function poseForPoint(id: string): CameraPose | null {
  const match = FOCUS_POINTS.find((point) => point.id === id)
  return match ? clonePose(match.focusPose) : null
}

export function compactPose(pose: CameraPose): string {
  const round = (value: number) => Number(value.toFixed(4))
  return JSON.stringify({
    position: pose.position.map(round),
    target: pose.target.map(round),
    fov: round(pose.fov),
    zoom: round(pose.zoom),
  })
}

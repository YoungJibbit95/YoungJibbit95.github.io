/** Small, renderer-independent contract for explanatory spatial openings. */
export type Vec3 = readonly [number, number, number]

export type ExplosionMotion =
  | 'orbit-spread'
  | 'ring-open'
  | 'core-reveal'
  | 'layer-separate'
  | 'segment-unfold'
  | 'satellite-release'
  | 'signal-connect'
  | 'shell-open'

export interface ExplodedPart {
  id: string
  closed: Vec3
  opened: Vec3
}

export interface ExplodedRelation {
  from: string
  to: string
  meaning: string
}

/** Hysteresis is based on the physical camera, never a URL/LOD flag alone. */
export function getDiscoveryOpen(selected: boolean, distance: number, wasOpen: boolean) {
  return selected && distance <= (wasOpen ? 176 : 172)
}

/** Finite, interruptible interpolation; the exact endpoint lets demand rendering sleep. */
export function advanceExplosion(
  amount: number,
  open: boolean,
  delta: number,
  reducedMotion: boolean,
) {
  const destination = open ? 1 : 0
  if (reducedMotion) return destination
  const next =
    amount + (destination - amount) * (1 - Math.exp(-Math.max(0, Math.min(delta, 0.05)) * 7))
  return Math.abs(destination - next) < 0.001 ? destination : next
}

/** Optional reusable output avoids allocations in an existing useFrame callback. */
export function getExplodedPosition(
  part: ExplodedPart,
  amount: number,
  result: [number, number, number] = [0, 0, 0],
) {
  const progress = Math.max(0, Math.min(1, amount))
  for (let axis = 0; axis < 3; axis++)
    result[axis] = part.closed[axis] + (part.opened[axis] - part.closed[axis]) * progress
  return result
}

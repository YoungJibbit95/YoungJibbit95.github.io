import {
  clonePose,
  defaultSnapshot,
  findHotspot,
  isAvailableWorld,
} from '../experience/SceneRegistry'
import type { CameraPose, NavigationSnapshot } from '../experience/worldTypes'

export function copySnapshot(snapshot: NavigationSnapshot): NavigationSnapshot {
  return {
    world: snapshot.world,
    focusId: snapshot.focusId,
    selectionId: snapshot.selectionId,
    pose: clonePose(snapshot.pose),
    filters: [...snapshot.filters],
  }
}

function validPose(value: unknown): value is CameraPose {
  if (!value || typeof value !== 'object') return false
  const pose = value as Partial<CameraPose>
  return (
    Array.isArray(pose.position) &&
    Array.isArray(pose.target) &&
    pose.position.length === 3 &&
    pose.target.length === 3 &&
    [...pose.position, ...pose.target, pose.fov, pose.zoom].every(
      (number) => typeof number === 'number' && Number.isFinite(number),
    ) &&
    (pose.fov ?? 0) >= 20 &&
    (pose.fov ?? 0) <= 90 &&
    (pose.zoom ?? 0) >= 0.25 &&
    (pose.zoom ?? 0) <= 4
  )
}

/** Untrusted browser history never becomes unvalidated navigation state. */
export function normalizeSnapshot(value: unknown): NavigationSnapshot | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<NavigationSnapshot>
  if (!isAvailableWorld(candidate.world) || !validPose(candidate.pose)) return null
  const focus = findHotspot(candidate.world, candidate.focusId ?? null)
  const fallback = defaultSnapshot(candidate.world, focus?.id ?? null)
  return {
    ...fallback,
    pose: clonePose(candidate.pose),
    filters: Array.isArray(candidate.filters)
      ? candidate.filters.filter((item): item is string => typeof item === 'string')
      : [],
    selectionId: focus ? focus.id : null,
  }
}

export interface BrowserEntry {
  snapshot: NavigationSnapshot
  history: NavigationSnapshot[]
}

export function readBrowserEntry(raw: unknown): BrowserEntry | null {
  if (!raw || typeof raw !== 'object' || !('livingAtlas' in raw)) return null
  const candidate = (raw as { livingAtlas: unknown }).livingAtlas
  if (!candidate || typeof candidate !== 'object') return null
  const entry = candidate as Partial<BrowserEntry>
  const snapshot = normalizeSnapshot(entry.snapshot)
  if (!snapshot) return null
  const history = Array.isArray(entry.history)
    ? entry.history.map(normalizeSnapshot).filter((item): item is NavigationSnapshot => !!item)
    : []
  return { snapshot, history: history.slice(-32) }
}

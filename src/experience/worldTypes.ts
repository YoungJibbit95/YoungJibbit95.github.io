import type { ComponentType } from 'react'

export type WorldId =
  | 'origin'
  | 'heliosphere'
  | 'observatory'
  | 'nexus'
  | 'cerebri'
  | 'forge'
  | 'jarvis'
  | 'thinking'
  | 'garden'

/** G1 has two spatial prototypes, not nine pretend-complete destinations. */
export type AvailableWorldId = Extract<WorldId, 'origin' | 'observatory'>
export type Vec3 = readonly [number, number, number]
export type MotionMode = 'full' | 'reduced' | 'off'
export type TransitionPhase =
  | 'idle'
  | 'transitioning'
  | 'focused'
  | 'returning'
  | 'interrupted'
  | 'error'

export interface CameraPose {
  position: Vec3
  target: Vec3
  fov: number
  zoom: number
}

export interface CameraBounds {
  minDistance: number
  maxDistance: number
  box: { x: readonly [number, number]; y: readonly [number, number]; z: readonly [number, number] }
}

export interface WorldHotspot {
  id: string
  title: string
  kind: string
  description: string
  position: Vec3
  focusPose: CameraPose
  evidenceStatus: 'illustrative' | 'verified'
  destination?: AvailableWorldId
}

export interface WorldSceneProps {
  onFocus: (id: string) => void
  selectedId: string | null
}

export interface WorldDefinition {
  id: AvailableWorldId
  title: string
  subtitle: string
  introduction: string
  renderer: 'r3f'
  defaultPose: CameraPose
  bounds: CameraBounds
  hotspots: readonly WorldHotspot[]
  destinations: readonly AvailableWorldId[]
  contentSectionId: string
  fallbackText: string
  assets: readonly string[]
  motion: 'optional'
  loadScene: () => Promise<{ default: ComponentType<WorldSceneProps> }>
  onEnter?: () => void
  onExit?: () => void
}

export interface NavigationSnapshot {
  world: AvailableWorldId
  focusId: string | null
  selectionId: string | null
  pose: CameraPose
  filters: readonly string[]
}

export interface CameraBridge {
  capture: () => CameraPose | null
  cancel: () => void
  moveTo: (pose: CameraPose, animate: boolean) => Promise<boolean>
  pan: (horizontal: number, vertical: number) => Promise<void>
  dolly: (value: number) => Promise<void>
}

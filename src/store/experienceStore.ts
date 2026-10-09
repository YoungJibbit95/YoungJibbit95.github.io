import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { defaultSnapshot } from '../experience/SceneRegistry'
import type {
  AvailableWorldId,
  CameraPose,
  MotionMode,
  NavigationSnapshot,
  TransitionPhase,
} from '../experience/worldTypes'
import { copySnapshot } from './worldHistory'

export interface ExperienceState {
  activeWorld: AvailableWorldId
  focusId: string | null
  selectionId: string | null
  pose: CameraPose
  history: NavigationSnapshot[]
  filters: readonly string[]
  transition: TransitionPhase
  motion: MotionMode
  quality: 'auto' | 'low' | 'high'
  webgl: 'checking' | 'ready' | 'fallback'
  navigateState: (snapshot: NavigationSnapshot, history: NavigationSnapshot[]) => void
  setTransition: (phase: TransitionPhase) => void
  capturePose: (pose: CameraPose) => void
  setMotion: (mode: MotionMode) => void
  setWebGL: (status: ExperienceState['webgl']) => void
}

const initial = defaultSnapshot('origin', null)

export const useExperienceStore = create<ExperienceState>()(
  subscribeWithSelector((set) => ({
    activeWorld: initial.world,
    focusId: initial.focusId,
    selectionId: initial.selectionId,
    pose: initial.pose,
    history: [],
    filters: [],
    transition: 'idle',
    motion: 'full',
    quality: 'auto',
    webgl: 'checking',
    navigateState: (snapshot, history) =>
      set({
        activeWorld: snapshot.world,
        focusId: snapshot.focusId,
        selectionId: snapshot.selectionId,
        pose: copySnapshot(snapshot).pose,
        filters: [...snapshot.filters],
        history: history.map(copySnapshot),
      }),
    setTransition: (transition) => set({ transition }),
    capturePose: (pose) => set({ pose: copySnapshot({ ...initial, pose }).pose }),
    setMotion: (motion) => set({ motion }),
    setWebGL: (webgl) => set({ webgl }),
  })),
)

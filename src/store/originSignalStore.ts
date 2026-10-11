import { create } from 'zustand'
import { nextSignalStep, type SignalStep } from '../experience/worlds/originModel'

/** Only deliberate actions update React. Transient animation stays in the scene. */
export const useOriginSignal = create<{
  step: SignalStep
  revision: number
  playback: 'manual' | 'playing' | 'paused' | 'complete'
  send: () => void
  reset: () => void
  play: () => void
  pause: () => void
  replay: () => void
  advance: () => void
}>((set) => ({
  step: 0,
  revision: 0,
  playback: 'manual',
  send: () =>
    set((state) => ({
      step: nextSignalStep(state.step, 'send'),
      revision: state.revision + 1,
      playback: 'manual',
    })),
  reset: () => set((state) => ({ step: 0, revision: state.revision + 1, playback: 'manual' })),
  play: () =>
    set((state) =>
      state.playback === 'playing'
        ? state
        : state.playback === 'paused'
          ? { playback: 'playing' }
          : {
              step: state.step === 0 || state.step === 2 ? 1 : state.step,
              revision: state.revision + (state.step === 1 ? 0 : 1),
              playback: 'playing',
            },
    ),
  pause: () => set((state) => (state.playback === 'playing' ? { playback: 'paused' } : state)),
  replay: () => set((state) => ({ step: 1, revision: state.revision + 1, playback: 'playing' })),
  advance: () =>
    set((state) =>
      state.playback === 'playing'
        ? state.step === 2
          ? { playback: 'complete' }
          : { step: 2, revision: state.revision + 1 }
        : state,
    ),
}))

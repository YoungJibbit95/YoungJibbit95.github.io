import { create } from 'zustand'
import { nextSignalStep, type SignalStep } from '../experience/worlds/originModel'

/** Only deliberate actions update React. Transient animation stays in the scene. */
export const useOriginSignal = create<{
  step: SignalStep
  revision: number
  send: () => void
  reset: () => void
}>((set) => ({
  step: 0,
  revision: 0,
  send: () =>
    set((state) => ({ step: nextSignalStep(state.step, 'send'), revision: state.revision + 1 })),
  reset: () => set((state) => ({ step: 0, revision: state.revision + 1 })),
}))

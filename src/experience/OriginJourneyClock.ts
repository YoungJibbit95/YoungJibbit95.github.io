import { useOriginSignal } from '../store/originSignalStore'

export const ORIGIN_DWELL_MS = 4200

export interface JourneyTimer {
  now: () => number
  schedule: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>
  cancel: (id: ReturnType<typeof setTimeout>) => void
}

/** One finite timeout, no RAF. Pausing preserves the remaining dwell time. */
export function bindOriginJourneyClock(
  timer: JourneyTimer = {
    now: () => performance.now(),
    schedule: (callback, delay) => setTimeout(callback, delay),
    cancel: (id) => clearTimeout(id),
  },
) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let deadline = 0
  let remaining = ORIGIN_DWELL_MS
  let revision = useOriginSignal.getState().revision
  const stop = () => {
    if (timeout !== undefined) {
      remaining = Math.max(0, deadline - timer.now())
      timer.cancel(timeout)
      timeout = undefined
    }
  }
  const sync = () => {
    const state = useOriginSignal.getState()
    stop()
    if (state.revision !== revision) {
      remaining = ORIGIN_DWELL_MS
      revision = state.revision
    }
    if (state.playback !== 'playing') return
    deadline = timer.now() + remaining
    timeout = timer.schedule(() => {
      timeout = undefined
      useOriginSignal.getState().advance()
    }, remaining)
  }
  const unsubscribe = useOriginSignal.subscribe(sync)
  sync()
  return () => {
    unsubscribe()
    stop()
  }
}

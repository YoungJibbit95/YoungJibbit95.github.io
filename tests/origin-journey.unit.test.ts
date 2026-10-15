import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bindOriginJourneyClock, ORIGIN_DWELL_MS } from '../src/experience/OriginJourneyClock'
import { useOriginSignal } from '../src/store/originSignalStore'

test('pause preserves remaining time; replay replaces pending work; reset cannot resurrect a signal', () => {
  useOriginSignal.getState().reset()
  let time = 0
  let id = 0
  const tasks = new Map<number, { at: number; callback: () => void }>()
  const tick = (amount: number) => {
    time += amount
    for (const [key, task] of tasks) {
      if (task.at <= time) {
        tasks.delete(key)
        task.callback()
      }
    }
  }
  const unbind = bindOriginJourneyClock({
    now: () => time,
    schedule: (callback, delay) => {
      tasks.set(++id, { at: time + delay, callback })
      return id as unknown as ReturnType<typeof setTimeout>
    },
    cancel: (key) => {
      tasks.delete(key as unknown as number)
    },
  })
  const state = () => useOriginSignal.getState()
  state().play()
  assert.equal(state().step, 1)
  tick(1200)
  state().pause()
  assert.equal(tasks.size, 0)
  tick(10_000)
  assert.equal(state().step, 1)
  state().play()
  tick(ORIGIN_DWELL_MS - 1201)
  assert.equal(state().step, 1)
  tick(1)
  assert.equal(state().step, 2)
  assert.equal(state().playback, 'playing')
  state().pause()
  state().play()
  assert.equal(state().step, 2, 'resume at horizon must not restart the graph')
  tick(ORIGIN_DWELL_MS)
  assert.equal(state().playback, 'complete')
  state().replay()
  assert.equal(state().step, 1)
  assert.equal(tasks.size, 1)
  state().replay()
  assert.equal(tasks.size, 1)
  state().reset()
  tick(20_000)
  assert.equal(state().step, 0)
  assert.equal(tasks.size, 0)
  state().play()
  state().send()
  assert.equal(state().step, 2)
  assert.equal(state().playback, 'manual')
  assert.equal(tasks.size, 0)
  unbind()
  state().reset()
})

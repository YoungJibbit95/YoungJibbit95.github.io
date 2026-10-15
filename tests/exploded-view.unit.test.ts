import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  advanceExplosion,
  getDiscoveryOpen,
  getExplodedPosition,
} from '../src/experience/worlds/cosmos/explodedView'

test('discovery requires selection and physical approach, with a stable return band', () => {
  assert.equal(getDiscoveryOpen(false, 100, true), false)
  assert.equal(getDiscoveryOpen(true, 173, false), false)
  assert.equal(getDiscoveryOpen(true, 172, false), true)
  assert.equal(getDiscoveryOpen(true, 175, true), true)
  assert.equal(getDiscoveryOpen(true, 177, true), false)
})

test('opening can reverse mid-flight and both directions reach exact sleeping endpoints', () => {
  let amount = advanceExplosion(0, true, 1 / 60, false)
  assert.ok(amount > 0 && amount < 1)
  assert.ok(advanceExplosion(amount, false, 1 / 60, false) < amount)
  for (let frame = 0; frame < 200; frame++) amount = advanceExplosion(amount, true, 1 / 60, false)
  assert.equal(amount, 1)
  for (let frame = 0; frame < 200; frame++) amount = advanceExplosion(amount, false, 1 / 60, false)
  assert.equal(amount, 0)
  assert.equal(advanceExplosion(0, true, 10, false), advanceExplosion(0, true, 0.05, false))
  assert.equal(advanceExplosion(0.5, true, 0, false), 0.5)
})

test('reduced motion reaches the same geometry immediately, including an interrupted return', () => {
  assert.equal(advanceExplosion(0.3, true, 0, true), 1)
  assert.equal(advanceExplosion(0.3, false, 0, true), 0)
  const part = { id: 'application', closed: [8, 2, -4] as const, opened: [20, -6, 10] as const }
  const scratch: [number, number, number] = [0, 0, 0]
  assert.equal(getExplodedPosition(part, 0.5, scratch), scratch)
  assert.deepEqual(scratch, [14, -2, 3])
  assert.deepEqual(getExplodedPosition(part, -1), part.closed)
  assert.deepEqual(getExplodedPosition(part, 2), part.opened)
})

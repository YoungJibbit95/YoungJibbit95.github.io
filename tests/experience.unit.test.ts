import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  availableWorlds,
  defaultSnapshot,
  findHotspot,
  parseWorldRoute,
  validateRegistry,
  worldHref,
} from '../src/experience/SceneRegistry'
import { copySnapshot, normalizeSnapshot, readBrowserEntry } from '../src/store/worldHistory'

test('G1 registers exactly two navigable spatial prototypes', () => {
  assert.deepEqual(availableWorlds, ['origin', 'observatory'])
  assert.deepEqual(validateRegistry(), [])
})

test('queries validate world and focus without breaking legacy hash links', () => {
  assert.equal(parseWorldRoute('?atlas=preview&world=observatory&focus=nexus').focusId, 'nexus')
  assert.equal(parseWorldRoute('?atlas=preview&world=nexus&focus=core').world, 'origin')
  assert.equal(parseWorldRoute('?atlas=preview&world=observatory&focus=missing').focusId, null)
  assert.equal(worldHref(defaultSnapshot('observatory', 'cerebri')), '/?atlas=preview&world=observatory&focus=cerebri')
})

test('snapshots preserve camera and selection with defensive copying', () => {
  const snapshot = defaultSnapshot('observatory', 'nexus')
  assert.equal(snapshot.selectionId, 'nexus')
  const cloned = copySnapshot(snapshot)
  assert.deepEqual(cloned, snapshot)
  assert.notEqual(cloned.pose.position, snapshot.pose.position)
  assert.equal(findHotspot('observatory', 'nexus')?.id, 'nexus')
})

test('invalid history cannot inject unregistered worlds or invalid camera values', () => {
  const valid = defaultSnapshot('origin', 'signal')
  assert.deepEqual(normalizeSnapshot(valid), valid)
  assert.equal(normalizeSnapshot({ ...valid, world: 'jarvis' }), null)
  assert.equal(normalizeSnapshot({ ...valid, pose: { ...valid.pose, zoom: Infinity } }), null)
  const entry = readBrowserEntry({
    livingAtlas: {
      snapshot: valid,
      history: [valid, { ...valid, world: 'not-a-world' }],
    },
  })
  assert.equal(entry?.history.length, 1)
})

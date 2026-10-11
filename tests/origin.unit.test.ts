import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defaultSnapshot, getWorld } from '../src/experience/SceneRegistry'
import {
  landmarkPosition,
  nextSignalStep,
  originEdges,
  originLandmarks,
  signalResponse,
} from '../src/experience/worlds/originModel'

test('Origin signal follows only its authored edges and resets every consequence', () => {
  assert.deepEqual(signalResponse(0).reached, [])
  const first = nextSignalStep(0, 'send')
  assert.deepEqual(signalResponse(first).reached, ['signal', 'relation'])
  assert.deepEqual(signalResponse(first).edges, ['question-to-connection'])
  assert.equal(signalResponse(first).aperture, 1)
  assert.equal(signalResponse(first).portal, false)
  const second = nextSignalStep(first, 'send')
  assert.deepEqual(signalResponse(second).reached, ['signal', 'relation', 'horizon'])
  assert.equal(signalResponse(second).portal, true)
  assert.equal(nextSignalStep(second, 'send'), first)
  assert.deepEqual(signalResponse(nextSignalStep(second, 'reset')), signalResponse(0))
})

test('Origin graph, geometry and focus anchors share valid positions within the new bounds', () => {
  for (const edge of originEdges) {
    assert.ok(originLandmarks.some((node) => node.id === edge.from))
    assert.ok(originLandmarks.some((node) => node.id === edge.to))
    assert.notDeepEqual(landmarkPosition(edge.from), landmarkPosition(edge.to))
  }
  const { x, y, z } = getWorld('origin').bounds.box
  for (const node of originLandmarks) {
    assert.deepEqual(node.focusPose.target, node.position)
    node.position.forEach((value, axis) =>
      assert.ok(value >= [x, y, z][axis][0] && value <= [x, y, z][axis][1]),
    )
    assert.equal(node.evidenceStatus, 'illustrative')
  }
  assert.throws(() => landmarkPosition('invented'))
  assert.notDeepEqual(
    defaultSnapshot('origin', null, true).pose,
    defaultSnapshot('origin', null).pose,
  )
  // A compact entry never changes the destination's semantic identity.
  assert.deepEqual(defaultSnapshot('origin', 'signal', true), defaultSnapshot('origin', 'signal'))
})

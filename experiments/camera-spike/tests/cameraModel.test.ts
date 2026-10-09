import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CameraHistory,
  DEFAULT_POSE,
  FOCUS_POINTS,
  FlightToken,
  clonePose,
  compactPose,
  createSnapshot,
  poseForPoint,
  validatePose,
} from '../src/cameraModel.ts'

test('all anchors have unique IDs, distinct positions and valid focus camera poses', () => {
  assert.equal(FOCUS_POINTS.length, 3)
  assert.equal(new Set(FOCUS_POINTS.map((p) => p.id)).size, 3)
  assert.equal(new Set(FOCUS_POINTS.map((p) => JSON.stringify(p.position))).size, 3)
  FOCUS_POINTS.forEach((point) => assert.equal(validatePose(point.focusPose), true, point.id))
  assert.equal(poseForPoint('invalid'), null)
})

test('camera poses retain full position, target, FOV and zoom without shared mutable vectors', () => {
  const copy = clonePose(DEFAULT_POSE)
  assert.deepEqual(copy, DEFAULT_POSE)
  assert.notEqual(copy.position, DEFAULT_POSE.position)
  assert.notEqual(copy.target, DEFAULT_POSE.target)
  assert.equal(validatePose(copy), true)
})

test('rejects invalid poses before they enter history', () => {
  assert.equal(validatePose({ ...DEFAULT_POSE, position: [NaN, 2, 4] }), false)
  assert.equal(validatePose({ ...DEFAULT_POSE, zoom: 0 }), false)
  assert.equal(validatePose({ ...DEFAULT_POSE, position: [0, 0, -2] }), false)
  assert.throws(() => createSnapshot({ ...DEFAULT_POSE, fov: 150 }, null))
})

test('back restores exact previous snapshot and selection in LIFO order', () => {
  const history = new CameraHistory()
  const first = createSnapshot(DEFAULT_POSE, null)
  const second = createSnapshot(poseForPoint('signal')!, 'signal')
  history.push(first)
  history.push(second)
  assert.equal(history.length, 2)
  assert.deepEqual(history.pop(), second)
  assert.deepEqual(history.pop(), first)
  assert.equal(history.pop(), null)
})

test('reset clears history and a superseded flight can never commit its result', () => {
  const history = new CameraHistory()
  history.push(createSnapshot(DEFAULT_POSE, null))
  history.clear()
  assert.equal(history.length, 0)
  const flight = new FlightToken()
  const first = flight.begin()
  flight.cancel()
  const second = flight.begin()
  assert.equal(flight.isCurrent(first), false)
  assert.equal(flight.isCurrent(second), true)
})

test('pose readout has deterministic decimal precision', () => {
  const raw = compactPose(DEFAULT_POSE)
  assert.deepEqual(JSON.parse(raw), { position: [0, 6, 24], target: [0, 0, -2], fov: 52, zoom: 1 })
})

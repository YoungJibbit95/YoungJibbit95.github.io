import assert from 'node:assert/strict'
import { test } from 'node:test'
import { observatoryProjects } from '../src/experience/observatory/data'
import {
  cameraDistance,
  fitProjects,
  observatoryBounds,
  projectPose,
} from '../src/experience/observatory/camera'
import { defaultSnapshot, parseWorldRoute, worldHref } from '../src/experience/SceneRegistry'
import { readBrowserEntry } from '../src/store/worldHistory'
import {
  decodeFilters,
  encodeFilters,
  emptyFilters,
  filterProjects,
} from '../src/experience/observatory/state/filters'

test('seven independent project targets and compact detail are physically reachable', () => {
  const targets = new Set<string>()
  for (const project of observatoryProjects) {
    const desktop = projectPose(project)
    const mobile = projectPose(project, true)
    const detail = projectPose(project, true, true)
    targets.add(JSON.stringify(desktop.target))
    assert.deepEqual(desktop.target, project.position)
    assert.ok(cameraDistance(detail) < cameraDistance(mobile))
    for (const pose of [desktop, mobile, detail]) {
      assert.ok(cameraDistance(pose) >= observatoryBounds.minDistance)
      assert.ok(cameraDistance(pose) <= observatoryBounds.maxDistance)
    }
  }
  assert.equal(targets.size, 7)
})

test('Fit All encloses each project envelope even in a portrait viewport', () => {
  for (const aspect of [390 / 776, 768 / 952, 1440 / 828, 1920 / 1008]) {
    const pose = fitProjects(observatoryProjects, aspect)
    const halfFov = Math.atan(Math.tan((pose.fov * Math.PI) / 360) * Math.min(aspect, 1))
    const coveredRadius = cameraDistance(pose) * Math.sin(halfFov)
    assert.ok(cameraDistance(pose) < observatoryBounds.maxDistance)
    for (const project of observatoryProjects) {
      const envelope =
        Math.hypot(...project.position.map((value, axis) => value - pose.target[axis])) +
        project.radius
      assert.ok(envelope <= coveredRadius, `${project.id} outside viewport at aspect ${aspect}`)
    }
  }
})

test('native deep links and history preserve filters, selection and the exact explored pose', () => {
  const snapshot = defaultSnapshot('observatory', 'novacore')
  snapshot.filters = encodeFilters({ ...emptyFilters, query: 'engine', technology: 'C++23' })
  snapshot.pose = { ...snapshot.pose, position: [118.25, 80, 25.75], zoom: 1.25 }
  const href = worldHref(snapshot)
  assert.match(href, /technology=C%2B%2B23/)
  const fromUrl = parseWorldRoute(new URL(href, 'https://example.test').search)
  assert.deepEqual(fromUrl.filters, snapshot.filters)
  assert.equal(fromUrl.focusId, 'novacore')
  assert.ok(
    filterProjects(observatoryProjects, decodeFilters(fromUrl.filters)).some(
      (project) => project.id === 'novacore',
    ),
  )
  const history = readBrowserEntry({ livingAtlas: { snapshot, history: [snapshot] } })
  assert.deepEqual(history?.snapshot, snapshot)
  assert.deepEqual(history?.history[0], snapshot)
  assert.notEqual(history?.snapshot.pose.position, snapshot.pose.position)
})

test('route validation discards unknown filters and edges whose endpoints are hidden', () => {
  const route = parseWorldRoute(
    '?atlas=preview&world=observatory&q=Rust&edge=novacore-nemisis&status=Production&cluster=missing',
  )
  assert.deepEqual(route.filters, ['q=Rust'])
  assert.deepEqual(
    filterProjects(observatoryProjects, decodeFilters(route.filters)).map((project) => project.id),
    ['cerebri'],
  )
})

test('maximum-length Unicode queries survive URL and browser history normalization', () => {
  for (const query of ['ü'.repeat(160), '星'.repeat(160), '🚀'.repeat(80)]) {
    const snapshot = defaultSnapshot('observatory', null)
    snapshot.filters = encodeFilters({ ...emptyFilters, query })
    const route = parseWorldRoute(new URL(worldHref(snapshot), 'https://example.test').search)
    assert.equal(decodeFilters(route.filters).query, query)
    const entry = readBrowserEntry({ livingAtlas: { snapshot, history: [snapshot] } })
    assert.equal(decodeFilters(entry!.snapshot.filters).query, query)
    assert.equal(decodeFilters(entry!.history[0].filters).query, query)
  }
})

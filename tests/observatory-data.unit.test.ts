import assert from 'node:assert/strict'
import { test } from 'node:test'
import { projectIds } from '../src/experience/observatory/contracts'
import {
  observatoryClusters,
  observatoryEdges,
  observatoryProjects,
  sourceRevisions,
} from '../src/experience/observatory/data'
import { validateObservatoryData } from '../src/experience/observatory/data/validate'

function dataset() {
  return structuredClone({
    projects: [...observatoryProjects],
    edges: [...observatoryEdges],
    clusters: [...observatoryClusters],
  })
}

test('seven source-backed dossiers have complete, consistent spatial and cluster data', () => {
  assert.deepEqual(
    observatoryProjects.map((project) => project.id),
    projectIds,
  )
  assert.deepEqual(validateObservatoryData(), [])
  for (const project of observatoryProjects) {
    assert.equal(project.evidence[0].revision, sourceRevisions[project.id].revision)
    assert.match(project.evidence[0].url, /\/blob\/[a-f\d]{40}\/README.md$/)
  }
  const positions = observatoryProjects.map((project) => project.position)
  assert.ok(Math.max(...positions.map(([x]) => x)) - Math.min(...positions.map(([x]) => x)) > 600)
  assert.ok(
    Math.max(...positions.map(([, , z]) => z)) - Math.min(...positions.map(([, , z]) => z)) > 500,
  )
})

test('only the inspected NovaCore build dependency is represented as a technical edge', () => {
  const technical = observatoryEdges.filter((edge) => edge.kind === 'technical')
  assert.deepEqual(
    technical.map(({ from, to }) => [from, to]),
    [['novacore', 'nemisis']],
  )
  assert.ok(technical[0].evidence.some((item) => item.url.endsWith('/CMakeLists.txt')))
  assert.equal(observatoryEdges.find((edge) => edge.id === 'nexus-cerebri')?.kind, 'thematic')
  assert.equal(observatoryEdges.find((edge) => edge.id === 'adventura-yjse')?.kind, 'thematic')
})

test('validator rejects missing projects, non-finite positions and conflicting cluster ownership', () => {
  const malformed = dataset()
  malformed.projects.pop()
  malformed.projects[0].position = [Infinity, ...malformed.projects[0].position.slice(1)] as [
    number,
    number,
    number,
  ]
  malformed.clusters[1].projectIds = [...malformed.clusters[1].projectIds, 'nexus']
  const errors = validateObservatoryData(malformed)
  assert.ok(errors.includes('Missing project: jarvis'))
  assert.ok(errors.includes('Invalid spatial coordinates: nexus'))
  assert.ok(errors.includes('Ambiguous cluster membership: nexus'))
})

test('validator rejects floating citations and a thematic relation promoted without code evidence', () => {
  const malformed = dataset()
  malformed.projects[0].evidence = [
    {
      ...malformed.projects[0].evidence[0],
      url: 'https://github.com/YoungJibbit95/Nexus-Ecosystem/blob/main/README.md',
    },
  ]
  malformed.edges[1].kind = 'technical'
  malformed.edges[0].to = 'novacore'
  const errors = validateObservatoryData(malformed)
  assert.ok(errors.includes('Invalid project evidence: nexus'))
  assert.ok(errors.includes('Technical edge requires inspected code: nexus-cerebri'))
  assert.ok(errors.includes('Invalid edge endpoints: novacore-nemisis'))
})

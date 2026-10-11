import {
  projectIds,
  type ObservatoryCluster,
  type ObservatoryEdge,
  type ObservatoryProject,
  type ProjectEvidence,
} from '../contracts'
import { observatoryClusters, observatoryEdges, observatoryProjects } from './index'

interface ObservatoryDataset {
  projects: readonly ObservatoryProject[]
  edges: readonly ObservatoryEdge[]
  clusters: readonly ObservatoryCluster[]
}

function validEvidence(source: ProjectEvidence) {
  try {
    const url = new URL(source.url)
    return (
      url.protocol === 'https:' &&
      Boolean(source.id.trim() && source.claim.trim() && source.limits.trim()) &&
      /^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt) &&
      Number.isFinite(Date.parse(source.checkedAt)) &&
      (source.kind === 'curation' ||
        (Boolean(source.revision && /^[a-f\d]{40}$/.test(source.revision)) &&
          url.pathname.includes(`/blob/${source.revision}/`)))
    )
  } catch {
    return false
  }
}

/** Pure contract checks: invalid sources or orphaned relations cannot silently become facts. */
export function validateObservatoryData(
  dataset: ObservatoryDataset = {
    projects: observatoryProjects,
    edges: observatoryEdges,
    clusters: observatoryClusters,
  },
): string[] {
  const errors: string[] = []
  const ids = new Set(dataset.projects.map((project) => project.id))
  const clusters = new Map(dataset.clusters.map((cluster) => [cluster.id, cluster]))
  const edgeIds = new Set<string>()
  const locations = new Set<string>()
  if (dataset.projects.length !== projectIds.length || ids.size !== projectIds.length) {
    errors.push('Expected exactly seven unique projects')
  }
  for (const id of projectIds) {
    if (!ids.has(id)) errors.push(`Missing project: ${id}`)
  }
  if (clusters.size !== dataset.clusters.length) errors.push('Duplicate cluster IDs')

  for (const project of dataset.projects) {
    if (!projectIds.includes(project.id)) errors.push(`Unknown project: ${project.id}`)
    if (
      project.position.length !== 3 ||
      !project.position.every(Number.isFinite) ||
      !Number.isFinite(project.radius) ||
      project.radius <= 0
    ) {
      errors.push(`Invalid spatial coordinates: ${project.id}`)
    }
    const location = project.position.join(',')
    if (locations.has(location)) errors.push(`Overlapping anchor: ${project.id}`)
    locations.add(location)
    if (
      !/^#[a-f\d]{6}$/i.test(project.visual.color) ||
      !project.visual.silhouette.trim() ||
      !project.visual.interpretation.trim()
    ) {
      errors.push(`Missing visual interpretation: ${project.id}`)
    }
    const cluster = clusters.get(project.clusterId)
    if (!cluster?.projectIds.includes(project.id)) {
      errors.push(`Cluster membership mismatch: ${project.id}`)
    }
    if (!project.evidence.length || !project.evidence.every(validEvidence)) {
      errors.push(`Invalid project evidence: ${project.id}`)
    }
    if (
      !project.name.trim() ||
      !project.description.trim() ||
      !project.question.trim() ||
      !project.status.trim() ||
      !project.stack.length ||
      !project.stack.every((technology) => technology.trim()) ||
      !project.repo.startsWith('https://github.com/YoungJibbit95/')
    ) {
      errors.push(`Incomplete dossier: ${project.id}`)
    }
  }

  const memberships = new Map<string, number>()
  for (const cluster of dataset.clusters) {
    if (!cluster.projectIds.length) errors.push(`Empty cluster: ${cluster.id}`)
    for (const id of cluster.projectIds) {
      memberships.set(id, (memberships.get(id) ?? 0) + 1)
      if (!ids.has(id)) errors.push(`Unknown cluster member: ${id}`)
    }
  }
  for (const id of ids) {
    if (memberships.get(id) !== 1) errors.push(`Ambiguous cluster membership: ${id}`)
  }
  for (const edge of dataset.edges) {
    if (edgeIds.has(edge.id)) errors.push(`Duplicate edge: ${edge.id}`)
    edgeIds.add(edge.id)
    if (!ids.has(edge.from) || !ids.has(edge.to) || edge.from === edge.to) {
      errors.push(`Invalid edge endpoints: ${edge.id}`)
    }
    if (!edge.evidence.length || !edge.evidence.every(validEvidence)) {
      errors.push(`Invalid edge evidence: ${edge.id}`)
    }
    if (edge.kind === 'technical' && !edge.evidence.some((item) => item.kind === 'code')) {
      errors.push(`Technical edge requires inspected code: ${edge.id}`)
    }
    if (!edge.label.trim() || !edge.description.trim()) {
      errors.push(`Missing relationship explanation: ${edge.id}`)
    }
  }
  return errors
}

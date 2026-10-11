import type {
  ObservatoryEdge,
  ObservatoryFilters,
  ObservatoryProject,
  ProjectId,
} from '../contracts'
import { observatoryClusters, observatoryProjects } from '../data'

export const emptyFilters: ObservatoryFilters = Object.freeze({
  query: '',
  category: '',
  technology: '',
  status: '',
  cluster: '',
})

export const MAX_QUERY_LENGTH = 160
const normalize = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('de')
    .trim()

export function getFilterOptions(projects: readonly ObservatoryProject[] = observatoryProjects) {
  const unique = (values: readonly string[]) =>
    [...new Set(values)].sort((left, right) => left.localeCompare(right, 'de'))
  return {
    categories: unique(projects.map((project) => project.category)),
    technologies: unique(projects.flatMap((project) => project.stack)),
    statuses: unique(projects.map((project) => project.status)),
    clusters: observatoryClusters,
  }
}

const options = getFilterOptions()
const canonical = (value: string, allowed: readonly string[]) =>
  allowed.find((option) => normalize(option) === normalize(value)) ?? ''

/** All dimensions intersect. Search terms may match different fields on the same project. */
export function filterProjects(
  projects: readonly ObservatoryProject[],
  filters: ObservatoryFilters,
): ObservatoryProject[] {
  const terms = normalize(filters.query.slice(0, MAX_QUERY_LENGTH)).split(/\s+/).filter(Boolean)
  return projects.filter((project) => {
    if (filters.category && project.category !== filters.category) return false
    if (filters.technology && !project.stack.includes(filters.technology)) return false
    if (filters.status && project.status !== filters.status) return false
    if (filters.cluster && project.clusterId !== filters.cluster) return false
    const searchable = normalize(
      [
        project.id,
        project.name,
        project.category,
        project.status,
        project.tagline,
        project.description,
        project.question,
        ...project.stack,
      ].join(' '),
    )
    return terms.every((term) => searchable.includes(term))
  })
}

/** A filtered endpoint removes its relation from both the Canvas and the DOM. */
export function filterEdges(
  edges: readonly ObservatoryEdge[],
  projects: readonly ObservatoryProject[],
): ObservatoryEdge[] {
  const visible = new Set(projects.map((project) => project.id))
  return edges.filter((edge) => visible.has(edge.from) && visible.has(edge.to))
}

export function selectedVisibleProject(
  projects: readonly ObservatoryProject[],
  id: ProjectId | string | null,
): ObservatoryProject | null {
  return projects.find((project) => project.id === id) ?? null
}

/** Tokens share the existing NavigationSnapshot.filters; unknown/edge tokens remain Lead-owned. */
export function decodeFilters(tokens: readonly string[]): ObservatoryFilters {
  const values = new Map<string, string>()
  for (const token of tokens) {
    if (token.length > 2048) continue
    const entries = [...new URLSearchParams(token)]
    if (entries.length !== 1) continue
    const [key, value] = entries[0]
    if (!values.has(key)) values.set(key, value)
  }
  const query = (values.get('q') ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .slice(0, MAX_QUERY_LENGTH)
  return {
    query: query.trim() ? query : '',
    category: canonical(values.get('category') ?? '', options.categories),
    technology: canonical(values.get('technology') ?? '', options.technologies),
    status: canonical(values.get('status') ?? '', options.statuses),
    cluster: observatoryClusters.find((cluster) => cluster.id === values.get('cluster'))?.id ?? '',
  }
}

export function encodeFilters(filters: ObservatoryFilters): string[] {
  const entries = [
    ['q', filters.query],
    ['category', filters.category],
    ['technology', filters.technology],
    ['status', filters.status],
    ['cluster', filters.cluster],
  ]
  // Normalize public inputs once and serialize in a fixed order for stable history and links.
  const clean = decodeFilters(
    entries.map(([key, value]) => new URLSearchParams({ [key]: value }).toString()),
  )
  return [
    ['q', clean.query],
    ['category', clean.category],
    ['technology', clean.technology],
    ['status', clean.status],
    ['cluster', clean.cluster],
  ]
    .filter(([, value]) => value !== '')
    .map(([key, value]) => new URLSearchParams({ [key]: value }).toString())
}

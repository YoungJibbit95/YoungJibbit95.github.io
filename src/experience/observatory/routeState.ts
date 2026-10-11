import { observatoryEdges, observatoryProjects } from './data'
import { decodeFilters, encodeFilters, filterProjects } from './state/filters'

export function normalizeObservatoryTokens(tokens: readonly string[]): string[] {
  // A valid 160-character Unicode query can expand to 1,920 URL-encoded bytes.
  const bounded = tokens
    .filter((token) => typeof token === 'string' && token.length <= 2048)
    .slice(0, 12)
  const filters = decodeFilters(bounded)
  const normalized = encodeFilters(filters)
  const ids = new Set(filterProjects(observatoryProjects, filters).map((project) => project.id))
  const edge = observatoryEdges.find((candidate) => bounded.includes('edge=' + candidate.id))
  if (edge && ids.has(edge.from) && ids.has(edge.to)) normalized.push('edge=' + edge.id)
  return normalized
}

export function tokensFromQuery(params: URLSearchParams): string[] {
  const tokens: string[] = []
  for (const key of ['q', 'category', 'technology', 'status', 'cluster', 'edge']) {
    const value = params.get(key)
    if (value) tokens.push(new URLSearchParams({ [key]: value }).toString())
  }
  return normalizeObservatoryTokens(tokens)
}

export function appendTokensToQuery(query: URLSearchParams, tokens: readonly string[]): void {
  for (const token of normalizeObservatoryTokens(tokens)) {
    for (const [key, value] of new URLSearchParams(token)) query.set(key, value)
  }
}

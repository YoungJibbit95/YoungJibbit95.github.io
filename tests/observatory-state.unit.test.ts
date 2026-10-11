import assert from 'node:assert/strict'
import { test } from 'node:test'
import { observatoryEdges, observatoryProjects } from '../src/experience/observatory/data'
import {
  decodeFilters,
  emptyFilters,
  encodeFilters,
  filterEdges,
  filterProjects,
  getFilterOptions,
  MAX_QUERY_LENGTH,
  selectedVisibleProject,
} from '../src/experience/observatory/state/filters'
import { projectHref } from '../src/experience/observatory/ui/navigation'

const ids = (filters = emptyFilters) =>
  filterProjects(observatoryProjects, filters).map((project) => project.id)

test('search matches all words across verified project fields and ignores case/diacritics', () => {
  assert.equal(ids().length, 7)
  assert.deepEqual(ids({ ...emptyFilters, query: '  NEXUS   rust ' }), ['cerebri'])
  assert.deepEqual(ids({ ...emptyFilters, query: 'fruhe sandbox' }), ['nemisis'])
  assert.deepEqual(ids({ ...emptyFilters, query: 'C++23' }), ['novacore', 'nemisis'])
  assert.deepEqual(ids({ ...emptyFilters, query: 'ohne-treffer' }), [])
})

test('category, technology, status and cluster intersect without mutating sources', () => {
  const snapshot = JSON.stringify(observatoryProjects)
  assert.deepEqual(ids({ ...emptyFilters, technology: 'React' }), ['nexus', 'jarvis'])
  assert.deepEqual(
    ids({ ...emptyFilters, category: 'ENGINES & SPIELE', cluster: 'world-building' }),
    ['novacore', 'nemisis', 'adventura', 'yjse'],
  )
  assert.deepEqual(
    ids({
      ...emptyFilters,
      technology: 'React',
      cluster: 'connected-work',
      status: 'In Entwicklung',
    }),
    ['nexus'],
  )
  assert.deepEqual(ids({ ...emptyFilters, technology: 'Java', cluster: 'connected-work' }), [])
  assert.equal(JSON.stringify(observatoryProjects), snapshot)
  assert.equal(Object.isFrozen(emptyFilters), true)
})

test('URL tokens round-trip punctuation, Unicode and all dimensions in a canonical order', () => {
  const filters = {
    query: 'C++ & Welt ',
    category: 'ENGINES & SPIELE',
    technology: 'C++23',
    status: 'Experimentelle Engine',
    cluster: 'world-building' as const,
  }
  const encoded = encodeFilters(filters)
  assert.deepEqual(decodeFilters(encoded), filters)
  assert.deepEqual(
    encoded.map((token) => [...new URLSearchParams(token).keys()][0]),
    ['q', 'category', 'technology', 'status', 'cluster'],
  )
  assert.equal(encoded[0], 'q=C%2B%2B+%26+Welt+')
  assert.deepEqual(encodeFilters(emptyFilters), [])
  assert.equal(decodeFilters(['technology=react']).technology, 'React')
})

test('untrusted, unknown and ambiguous tokens cannot invent categories or consume edge state', () => {
  assert.deepEqual(
    decodeFilters([
      'edge=novacore-nemisis',
      'category=unknown',
      'status=shipped',
      'cluster=elsewhere',
      'technology=magic',
      'q=a&status=anything',
      'q=' + 'x'.repeat(3000),
    ]),
    emptyFilters,
  )
  assert.equal(decodeFilters(['q=first', 'q=second']).query, 'first')
  assert.equal(decodeFilters(['q=%00Rust%0A']).query, 'Rust')
  assert.equal(decodeFilters(['q=' + 'a'.repeat(300)]).query.length, MAX_QUERY_LENGTH)
})

test('filtering removes hidden relationship endpoints and stale selected projects', () => {
  const visible = filterProjects(observatoryProjects, { ...emptyFilters, technology: 'C++23' })
  assert.deepEqual(
    filterEdges(observatoryEdges, visible).map((edge) => edge.id),
    ['novacore-nemisis'],
  )
  assert.equal(selectedVisibleProject(visible, 'nexus'), null)
  assert.equal(selectedVisibleProject(visible, 'novacore')?.id, 'novacore')
  assert.deepEqual(filterEdges(observatoryEdges, []), [])
  assert.equal(selectedVisibleProject(visible, 'constructor'), null)
})

test('native project links use the shared direct URL keys and retain current filters', () => {
  const url = new URL(
    projectHref('nemisis', { ...emptyFilters, query: 'C++', technology: 'C++23' }),
    'https://example.test',
  )
  assert.equal(url.searchParams.get('world'), 'observatory')
  assert.equal(url.searchParams.get('focus'), 'nemisis')
  assert.equal(url.searchParams.get('q'), 'C++')
  assert.equal(url.searchParams.get('technology'), 'C++23')
  assert.equal(url.searchParams.has('filter'), false)
  const options = getFilterOptions()
  assert.equal(new Set(options.technologies).size, options.technologies.length)
})

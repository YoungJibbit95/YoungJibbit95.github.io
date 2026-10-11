import assert from 'node:assert/strict'
import test from 'node:test'
import { worldHref, defaultSnapshot } from '../src/experience/SceneRegistry'
import { projectHref } from '../src/experience/observatory/ui/navigation'
import { emptyFilters } from '../src/experience/observatory/state/filters'

test('native project and world links retain the same entry path and query state', () => {
  const snapshot = defaultSnapshot('observatory', 'novacore')
  snapshot.filters = ['q=Rust']
  for (const [pathname, expected] of [
    ['/', '/'],
    ['/atlas/', '/atlas/'],
    ['/atlas/index.html', '/atlas/'],
  ]) {
    for (const href of [
      worldHref(snapshot, pathname),
      projectHref('novacore', { ...emptyFilters, query: 'Rust' }, pathname),
    ]) {
      const url = new URL(href, 'https://youngjibbit95.github.io')
      assert.equal(url.pathname, expected)
      assert.equal(url.searchParams.get('atlas'), 'preview')
      assert.equal(url.searchParams.get('focus'), 'novacore')
      assert.equal(url.searchParams.get('q'), 'Rust')
    }
  }
})

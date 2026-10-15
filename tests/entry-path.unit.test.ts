import assert from 'node:assert/strict'
import test from 'node:test'
import { worldHref, defaultSnapshot, parseWorldRoute } from '../src/experience/SceneRegistry'
import { experienceEntryWorld } from '../src/experience/entryPath'
import { projectHref } from '../src/experience/observatory/ui/navigation'
import { emptyFilters } from '../src/experience/observatory/state/filters'

test('native project and world links retain the same entry path and query state', () => {
  const snapshot = defaultSnapshot('observatory', 'novacore')
  snapshot.filters = ['q=Rust']
  for (const [pathname, expected] of [
    ['/', '/'],
    ['/atlas/', '/atlas/observatory/'],
    ['/atlas/index.html', '/atlas/observatory/'],
    ['/atlas/observatory/', '/atlas/observatory/'],
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

test('bare static world entries restore the correct default without altering root queries', () => {
  assert.equal(
    parseWorldRoute('', false, experienceEntryWorld('/atlas/observatory/')).world,
    'observatory',
  )
  assert.equal(parseWorldRoute('', false, experienceEntryWorld('/atlas/')).world, 'origin')
  assert.equal(
    parseWorldRoute('?world=observatory', false, experienceEntryWorld('/')).world,
    'observatory',
  )
  assert.equal(
    new URL(
      worldHref(defaultSnapshot('origin', null), '/atlas/observatory/'),
      'https://example.test',
    ).pathname,
    '/atlas/',
  )
})

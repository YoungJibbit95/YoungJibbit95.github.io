import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
})
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4184/atlas/observatory/')
  await page
    .getByTestId('atlas-scene-ready')
    .filter({ hasText: 'observatory' })
    .waitFor({ state: 'attached', timeout: 30000 })
  await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
  await page.getByRole('searchbox').fill('Rust')
  await page.getByRole('button', { name: 'Suchen', exact: true }).click()
  const link = page
    .getByRole('navigation', { name: 'Gefundene Projekte' })
    .getByRole('link')
    .filter({ hasText: 'Cerebri' })
  const nativeHref = await link.getAttribute('href')
  const popupPromise = context.waitForEvent('page')
  await link.click({ modifiers: ['Control'] })
  const popup = await popupPromise
  await popup
    .getByTestId('atlas-scene-ready')
    .filter({ hasText: 'observatory' })
    .waitFor({ state: 'attached', timeout: 30000 })
  const url = new URL(popup.url())
  assert.equal(url.pathname, '/atlas/observatory/')
  assert.equal(url.searchParams.get('focus'), 'cerebri')
  assert.equal(url.searchParams.get('q'), 'Rust')
  const state = JSON.parse(await popup.getByTestId('atlas-observatory-state').textContent())
  assert.equal(state.filters.query, 'Rust')
  assert.ok(state.visibleIds.includes('cerebri'))
  const result = {
    nativeHref,
    popupUrl: popup.url(),
    filters: state.filters,
    visibleIds: state.visibleIds,
    result: 'PASS: real Explorer Ctrl-click retains static entry, focus, query and rendered world',
  }
  await writeFile('.verification/g2d/native-link.json', JSON.stringify(result, null, 2) + '\n')
  console.log(JSON.stringify(result))
} finally {
  await browser.close()
}

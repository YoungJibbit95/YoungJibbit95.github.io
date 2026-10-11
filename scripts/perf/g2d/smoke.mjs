import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const base = process.argv[2] ?? 'http://127.0.0.1:4184'
const out = '.verification/g2d'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
})
const results = []
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 900 },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto(base + '/atlas/')
    await page
      .getByTestId('atlas-scene-ready')
      .filter({ hasText: 'origin' })
      .waitFor({ state: 'attached', timeout: 30000 })
    const canvas = page.getByTestId('atlas-canvas').locator('canvas')
    await canvas.evaluate((el) => {
      el.dataset.sameCanvas = 'retained'
    })
    const before = await page.getByTestId('atlas-pose').textContent()
    await page.getByTestId('atlas-stage').focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForFunction(
      (old) => document.querySelector('[data-testid="atlas-pose"]').textContent !== old,
      before,
    )
    const moved = await page.getByTestId('atlas-pose').textContent()
    await page.getByRole('link', { name: 'Sternwarte', exact: true }).click()
    await page
      .getByTestId('atlas-scene-ready')
      .filter({ hasText: 'observatory' })
      .waitFor({ state: 'attached', timeout: 30000 })
    assert.equal(new URL(page.url()).pathname, '/atlas/observatory/')
    assert.equal(await canvas.getAttribute('data-same-canvas'), 'retained')
    await page.goBack()
    await page
      .getByTestId('atlas-scene-ready')
      .filter({ hasText: 'origin' })
      .waitFor({ state: 'attached', timeout: 30000 })
    await page.waitForFunction(
      (old) => document.querySelector('[data-testid="atlas-pose"]').textContent === old,
      moved,
    )
    await page.screenshot({ path: `${out}/standalone-${width}.png` })
    assert.deepEqual(errors, [])
    results.push({
      width,
      hydrationErrors: errors,
      camera: 'physical movement + exact Back pose',
      canvas: 'persistent',
    })
    await context.close()
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false })
  const page = await nojs.newPage()
  for (const path of ['/atlas/', '/atlas/observatory/']) {
    await page.goto(base + path)
    assert.equal(await page.locator('#atlas-projects article').count(), 7)
    assert.equal(await page.getByRole('link', { name: 'Projekt auf GitHub' }).count(), 7)
    assert.match(await page.locator('body').innerText(), /benötigt JavaScript/)
    assert.equal(await page.locator('canvas').count(), 0)
    assert.equal(
      await page.locator('main').getAttribute('data-active-world'),
      path.includes('observatory') ? 'observatory' : 'origin',
    )
  }
  results.push({ noJS: 'seven source links and honest fallback; no canvas' })
  await nojs.close()
  const fallback = await browser.newContext()
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      return String(kind).startsWith('webgl') ? null : original.call(this, kind, ...args)
    }
  })
  const fallbackPage = await fallback.newPage()
  await fallbackPage.goto(base + '/atlas/observatory/')
  await fallbackPage
    .getByText('Direkte Links zu den Repositories bleiben jederzeit zugänglich.')
    .waitFor()
  assert.equal(await fallbackPage.locator('#atlas-projects article').count(), 7)
  assert.equal(await fallbackPage.locator('canvas').count(), 0)
  results.push({ noWebGL: 'seven projects and usable fallback' })
  await fallback.close()
  const direct = await browser.newContext({ reducedMotion: 'reduce' })
  const directPage = await direct.newPage()
  const directErrors = []
  directPage.on('pageerror', (error) => directErrors.push(error.message))
  directPage.on('console', (message) => {
    if (message.type() === 'error') directErrors.push(message.text())
  })
  await directPage.goto(base + '/atlas/observatory/')
  await directPage
    .getByTestId('atlas-scene-ready')
    .filter({ hasText: 'observatory' })
    .waitFor({ state: 'attached', timeout: 30000 })
  const nativeProject = directPage.getByRole('link', { name: /Nexus Workspaces/ })
  assert.match(await nativeProject.getAttribute('href'), /^\/atlas\/observatory\/\?atlas=preview/)
  const popupPromise = direct.waitForEvent('page')
  await nativeProject.click({ modifiers: ['Control'] })
  const popup = await popupPromise
  await popup
    .getByTestId('atlas-scene-ready')
    .filter({ hasText: 'observatory' })
    .waitFor({ state: 'attached', timeout: 30000 })
  assert.equal(new URL(popup.url()).pathname, '/atlas/observatory/')
  assert.equal(new URL(popup.url()).searchParams.get('focus'), 'nexus')
  assert.deepEqual(directErrors, [])
  results.push({
    standaloneObservatory:
      'bare path, hydration, actual scene and Ctrl-click native focus link pass',
  })
  await direct.close()
  await writeFile(`${out}/smoke.json`, JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}

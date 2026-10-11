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
    assert.equal(new URL(page.url()).pathname, '/atlas/')
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
  await page.goto(base + '/atlas/')
  assert.equal(await page.locator('#atlas-projects article').count(), 7)
  assert.equal(await page.getByRole('link', { name: 'Projekt auf GitHub' }).count(), 7)
  assert.match(await page.locator('body').innerText(), /benötigt JavaScript/)
  assert.equal(await page.locator('canvas').count(), 0)
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
  await fallbackPage.goto(base + '/atlas/?world=observatory')
  await fallbackPage
    .getByText('Direkte Links zu den Repositories bleiben jederzeit zugänglich.')
    .waitFor()
  assert.equal(await fallbackPage.locator('#atlas-projects article').count(), 7)
  assert.equal(await fallbackPage.locator('canvas').count(), 0)
  results.push({ noWebGL: 'seven projects and usable fallback' })
  await fallback.close()
  await writeFile(`${out}/smoke.json`, JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}

import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const root = 'docs/experience/evidence/g2d/b'
const base =
  process.env.DIRECTION_B_URL || 'http://127.0.0.1:3012/experiments/g2d-design/direction-b/'
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const evidence = []
async function settled(page) {
  await page.waitForFunction(() => window.bReady && window.bCapture)
  await page.waitForTimeout(1800)
}
async function capture(page, name) {
  const metrics = await page.evaluate(() => window.bCapture())
  assert.ok(metrics.calls > 0 && metrics.triangles > 1000)
  assert.ok(metrics.sampledColorBuckets > 15 && metrics.sampledColoredPixels > 1500)
  await page.screenshot({ path: `${root}/${name}.png` })
  evidence.push({ name, metrics })
  return metrics
}
try {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      hasTouch: width === 390,
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.stack || error.message))
    await page.goto(base)
    await settled(page)
    assert.equal(await page.locator('canvas').count(), 1)
    await page.evaluate(() => {
      window.canvasIdentity = document.querySelector('canvas')
    })
    const before = await capture(page, `observatory-overview-${width}`)
    await page.getByRole('button', { name: 'Nexus erkunden' }).click()
    await settled(page)
    const approach = await capture(page, `observatory-approach-${width}`)
    assert.notDeepEqual(before.position, approach.position)
    await page.getByRole('button', { name: 'Den Kern freilegen' }).click()
    await settled(page)
    await page.getByText('Vier Clients. Ein gemeinsamer Kern.').waitFor()
    const detail = await capture(page, `observatory-discovery-${width}`)
    assert.notDeepEqual(approach.position, detail.position)
    assert.equal(await page.locator('.client-list span').count(), 4)
    assert.match(
      await page.locator('.dossier a').getAttribute('href'),
      /835cd116174981efe2f330b1083552091f52f808/,
    )
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    evidence.push({ name: `axe-discovery-${width}`, violations: axe.violations })
    assert.deepEqual(axe.violations, [])
    await page.getByRole('button', { name: 'Projekte +', exact: true }).click()
    assert.equal(await page.locator('#project-register button').count(), 7)
    assert.equal(await page.locator('.dossier').getAttribute('inert'), '')
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Projekte +', exact: true }).waitFor()
    assert.equal(
      await page.evaluate(() => document.activeElement?.getAttribute('aria-controls')),
      'project-register',
    )
    await page.getByRole('button', { name: 'Zur Übersicht', exact: true }).click()
    await settled(page)
    const positionBeforeDrag = await page.evaluate(() => window.bCapture().position)
    await page.mouse.move(width * 0.65, height * 0.59)
    await page.mouse.down()
    await page.mouse.move(width * 0.72, height * 0.55, { steps: 7 })
    await page.mouse.up()
    await settled(page)
    const positionAfterDrag = await page.evaluate(() => window.bCapture().position)
    assert.notDeepEqual(positionBeforeDrag, positionAfterDrag)
    const frameBefore = await page.evaluate(() => window.bFrames)
    await page.waitForTimeout(600)
    const frameAfter = await page.evaluate(() => window.bFrames)
    assert.equal(frameBefore, frameAfter, 'Demand renderer must become idle')
    evidence.push({
      name: `drag-and-idle-${width}`,
      positionBeforeDrag,
      positionAfterDrag,
      frameBefore,
      frameAfter,
    })
    await page.getByRole('button', { name: 'Ursprung', exact: true }).click()
    await settled(page)
    assert.equal(
      await page.evaluate(() => window.canvasIdentity === document.querySelector('canvas')),
      true,
    )
    const origin = await capture(page, `origin-overview-${width}`)
    await page.getByRole('button', { name: 'Den Weg öffnen' }).click()
    await settled(page)
    const opened = await capture(page, `origin-open-${width}`)
    assert.notDeepEqual(origin.position, opened.position)
    await page.getByRole('button', { name: 'Zur Sternwarte' }).click()
    await settled(page)
    assert.equal(
      await page
        .getByRole('button', { name: 'Sternwarte', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    )
    assert.equal(
      await page.evaluate(() => window.canvasIdentity === document.querySelector('canvas')),
      true,
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    )
    assert.deepEqual(errors, [])
    evidence.push({ name: `world-return-${width}`, persistentCanvas: true, errors })
    await context.close()
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto(base)
  await settled(page)
  await page.getByRole('button', { name: 'Nexus erkunden' }).click()
  await page.getByRole('button', { name: 'Den Kern freilegen' }).click()
  await settled(page)
  const reduced = await page.evaluate(() => window.bCapture())
  const ordinary = evidence.find((item) => item.name === 'observatory-discovery-390').metrics
  assert.ok(Math.hypot(...reduced.position.map((v, i) => v - ordinary.position[i])) < 0.01)
  evidence.push({ name: 'reduced-motion-390', sameDestination: true, metrics: reduced })
  await context.close()
  await writeFile(
    `${root}/render-and-interaction-evidence.json`,
    JSON.stringify(
      {
        date: new Date().toISOString(),
        method:
          'Actual Chromium SwiftShader Canvas captures at DPR1. Pixel counts come directly from WebGL readPixels, not DOM screenshots. Isolated visual prototype, not integrated production or a lab performance benchmark.',
        evidence,
      },
      null,
      2,
    ),
  )
  console.log(
    `PASS: ${evidence.length} evidence entries, 10 screenshots, zero browser errors, real camera motion, one persistent Canvas, demand idle, keyboard register, 0 Axe violations, same reduced-motion pose.`,
  )
} finally {
  await browser.close()
}

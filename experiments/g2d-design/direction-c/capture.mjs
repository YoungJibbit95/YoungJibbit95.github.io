import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const directory = 'docs/experience/evidence/g2d/c'
await mkdir(directory, { recursive: true })
const browser = await chromium.launch({
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
})
const evidence = []
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 390 ? 844 : 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('http://127.0.0.1:3013/experiments/g2d-design/direction-c/index.html')
    await page.locator('main[data-ready=true]').waitFor()
    await page.waitForTimeout(700)
    const overview = await page.evaluate(() => window.g2dC.diagnostics())
    assert(overview.calls > 0 && overview.triangles > 1000)
    await page.screenshot({ path: `${directory}/c-overview-${width}.png` })
    await page.getByRole('button', { name: 'Bei Nexus beginnen ↗', exact: true }).click()
    await page.getByRole('button', { name: 'Aufbau entdecken', exact: true }).click()
    await page.locator('main[data-opened=true]').waitFor()
    await page.waitForTimeout(300)
    const detail = await page.evaluate(() => window.g2dC.diagnostics())
    assert.notDeepEqual(detail.position, overview.position)
    assert.match(await page.locator('.discovery').innerText(), /Vier öffentliche/)
    await page.screenshot({ path: `${directory}/c-discovery-${width}.png` })
    const frame = detail.frame
    await page.waitForTimeout(1000)
    assert.equal((await page.evaluate(() => window.g2dC.diagnostics())).frame, frame)
    await page.getByRole('button', { name: 'Ursprung', exact: true }).click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${directory}/c-origin-${width}.png` })
    await page.getByRole('button', { name: 'Gedanken öffnen', exact: true }).click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${directory}/c-origin-open-${width}.png` })
    assert.equal(await page.locator('canvas').count(), 1)
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    )
    assert.deepEqual(errors, [])
    evidence.push({ width, overview, detail, errors, idleFrameStable: true, singleCanvas: true })
    await page.close()
  }
} finally {
  await browser.close()
}
await writeFile(`${directory}/render-evidence.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))

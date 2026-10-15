import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const evidence = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://127.0.0.1:3012/experiments/g2d-design/direction-b/')
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height })
    await page.waitForFunction(() => window.bReady && window.bCapture)
    await page.waitForTimeout(2500)
    const labels = await page.locator('.site-label').evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          name: element.textContent,
          visibility: getComputedStyle(element).visibility,
          left: rect.left,
          right: rect.right,
          height: rect.height,
        }
      }),
    )
    const visible = labels.filter((label) => label.visibility === 'visible')
    assert.ok(visible.length >= 2)
    for (const label of visible) {
      assert.ok(label.left >= 15.9 && label.right <= width - 15.9, JSON.stringify(label))
      assert.ok(label.height >= 44)
    }
    await page.screenshot({
      path: `docs/experience/evidence/g2d/b/observatory-overview-${width}.png`,
    })
    evidence.push({ width, height, labels, metrics: await page.evaluate(() => window.bCapture()) })
  }
  await writeFile(
    'docs/experience/evidence/g2d/b/label-edge-evidence.json',
    JSON.stringify({ date: new Date().toISOString(), evidence }, null, 2),
  )
  console.log(
    'PASS: visible labels have 16px edge clearance and 44px target height at 1440 and 390; refreshed overview screenshots.',
  )
} finally {
  await browser.close()
}

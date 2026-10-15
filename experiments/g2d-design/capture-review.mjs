import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

// A browser layout of actual prototype screenshots, never an invented render.
const output = 'docs/experience/evidence/g2d'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const evidence = []
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const width of ['1440', '390']) {
    await page.goto(`http://127.0.0.1:3013/docs/experience/g2d/REVIEW.html?size=${width}`)
    for (const scene of ['overview', 'discovery', 'origin']) {
      await page.locator('#scene').selectOption(scene)
      await page.locator('img').evaluateAll(async (images) => {
        await Promise.all(images.map((image) => image.decode()))
      })
      const images = await page.locator('img').evaluateAll((elements) =>
        elements.map((image) => ({
          src: image.getAttribute('src'),
          width: image.naturalWidth,
          height: image.naturalHeight,
        })),
      )
      assert.equal(images.length, 3)
      assert(images.every((image) => image.width === Number(width)))
      evidence.push({ width, scene, images })
      if (scene === 'overview') {
        await page.locator('.comparison').screenshot({
          path: `${output}/comparison-${width === '1440' ? 'desktop' : 'mobile'}.png`,
        })
      }
    }
  }
  assert.deepEqual(errors, [])
} finally {
  await browser.close()
}
await writeFile(`${output}/comparison-evidence.json`, JSON.stringify(evidence, null, 2) + '\n')
console.log(
  '18 real source images decoded at exact viewport dimensions; both comparison captures saved.',
)

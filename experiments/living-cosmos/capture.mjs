import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const base = process.env.COSMOS_URL || 'http://127.0.0.1:3000/experiments/living-cosmos/'
const directory = new URL('./evidence/', import.meta.url)
mkdirSync(directory, { recursive: true })
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-webgl'] })
const report = []
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 1440 ? 1000 : 844 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(base)
    await page.locator('html[data-rendered=true]').waitFor({ timeout: 30000 })
    await page.waitForTimeout(1000)
    await page.screenshot({ path: fileURLToPath(new URL(`nebula-${width}.png`, directory)) })
    await page.getByRole('button', { name: 'Nexus erkunden' }).click()
    await page.waitForTimeout(1300)
    await page.screenshot({ path: fileURLToPath(new URL(`nexus-${width}.png`, directory)) })
    await page.getByRole('button', { name: 'Zurück zur Karte' }).click()
    await page.getByRole('button', { name: 'Stille Weite' }).click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: fileURLToPath(new URL(`meridian-${width}.png`, directory)) })
    report.push({
      width,
      errors,
      drawCalls: await page.locator('html').getAttribute('data-draw-calls'),
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    })
    await page.close()
  }
} finally {
  await browser.close()
}
writeFileSync(new URL('render-report.json', directory), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report))

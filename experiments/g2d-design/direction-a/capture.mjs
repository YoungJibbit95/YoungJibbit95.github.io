import { chromium, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const out = path.resolve('docs/experience/evidence/g2d/a')
await mkdir(out, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const results = []
for (const width of [1440, 390]) {
  const height = width === 1440 ? 900 : 844
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    hasTouch: width === 390,
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('http://127.0.0.1:3011/experiments/g2d-design/direction-a/', {
    waitUntil: 'networkidle',
  })
  const sample = () =>
    page.evaluate(() => {
      document.dispatchEvent(new Event('aperture:sample'))
      return JSON.parse(document.querySelector('#renderer-evidence').value || '{}')
    })
  await expect.poll(async () => (await sample()).calls, { timeout: 30000 }).toBeGreaterThan(5)
  const capture = async (name) => {
    await page.waitForTimeout(500)
    const metrics = await sample()
    expect(metrics.calls).toBeGreaterThan(5)
    expect(metrics.triangles).toBeGreaterThan(1000)
    expect(metrics.canvasCount).toBe(1)
    await page.screenshot({ path: path.join(out, `${name}-${width}.png`) })
    const mask = await page.addStyleTag({
      content: '.archive > :not(.stage) { visibility: hidden !important; }',
    })
    const raw = await page.screenshot()
    await mask.evaluate((e) => e.remove())
    const pixels = await page.evaluate(async (base64) => {
      const image = new Image()
      image.src = 'data:image/png;base64,' + base64
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = 240
      canvas.height = 150
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(image, 0, 0, 240, 150)
      const data = ctx.getImageData(0, 0, 240, 150).data
      let copper = 0
      let dark = 0
      const colors = new Set()
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = data.slice(i, i + 3)
        if (r > g * 1.25 && r > b * 1.25 && r > 45) copper++
        if (Math.max(r, g, b) < 120) dark++
        colors.add([r >> 4, g >> 4, b >> 4].join('/'))
      }
      return { copper, dark, shades: colors.size, sampledPixels: 36000, domMasked: true }
    }, raw.toString('base64'))
    expect(pixels.copper).toBeGreaterThan(35)
    expect(pixels.dark).toBeGreaterThan(35)
    expect(pixels.shades).toBeGreaterThan(6)
    results.push({ width, height, name, metrics, pixels })
    console.log(JSON.stringify({ width, name, metrics }))
  }
  await capture('origin-overview')
  await page.locator('.primary-action').getByRole('button', { name: 'Portal öffnen' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jede Idee öffnet einen Raum.')
  await capture('origin-open')
  await page.getByRole('button', { name: 'Projekte betreten' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ein Archiv im Werden.')
  await capture('observatory-overview')
  await page.getByRole('button', { name: 'Nexus entdecken' }).click()
  await capture('nexus-approach')
  const approach = await sample()
  await page.getByRole('button', { name: 'Kammer öffnen' }).focus()
  await page.keyboard.press('Enter')
  await capture('nexus-discovery')
  const detail = await sample()
  expect(detail.eye).not.toEqual(approach.eye)
  await page.getByRole('button', { name: 'Projekt lesen' }).click()
  await expect(page.locator('#project-reading')).toBeVisible()
  await expect(page.locator('#project-reading')).toContainText(
    'Vier öffentliche Workspace-/Code-Clients',
  )
  await expect(page.locator('#project-reading a')).toHaveAttribute(
    'href',
    /835cd116174981efe2f330b1083552091f52f808/,
  )
  await capture('nexus-reading')
  await expect(page.getByRole('dialog', { name: 'Projektinformationen' })).toBeVisible()
  await expect(page.locator('.stage')).toHaveAttribute('inert', '')
  await page.getByRole('button', { name: 'Schließen', exact: true }).focus()
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('#project-reading a')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Schließen', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Projekt lesen' })).toBeFocused()
  await page.getByRole('button', { name: 'Zur vorherigen Kamera zurück' }).click()
  const restored = await sample()
  for (let i = 0; i < 3; i++) expect(restored.eye[i]).toBeCloseTo(approach.eye[i], 3)
  await page.getByRole('button', { name: 'Übersicht', exact: true }).click()
  const before = await sample()
  await page.mouse.move(width * 0.58, height * 0.56)
  await page.mouse.down()
  await page.mouse.move(width * 0.7, height * 0.59, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(1500)
  const after = await sample()
  expect(after.eye).not.toEqual(before.eye)
  await page.locator('.stage').focus()
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(1500)
  const keyboard = await sample()
  expect(keyboard.target).not.toEqual(after.target)
  await expect.poll(async () => (await sample()).sleeping, { timeout: 10000 }).toBe(true)
  await expect
    .poll(
      async () => {
        const a = await sample()
        await page.waitForTimeout(300)
        const b = await sample()
        return b.frame - a.frame
      },
      { timeout: 10000 },
    )
    .toBe(0)
  const idle1 = await sample()
  await page.waitForTimeout(1500)
  const idle2 = await sample()
  expect(idle2.frame - idle1.frame).toBeLessThan(3)
  expect(errors).toEqual([])
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  expect(overflow).toBe(false)
  results.push({
    width,
    interactions: {
      realPointerDrag: true,
      keyboardCamera: true,
      keyboardActivation: true,
      exactBackPose: true,
      truthfulSource: true,
      modalFocusTrapAndEscape: true,
      demandIdleFrameDelta: idle2.frame - idle1.frame,
      horizontalOverflow: overflow,
    },
    errors,
  })
  await context.close()
}
await writeFile(
  path.join(out, 'renderer-and-interaction-evidence.json'),
  JSON.stringify(results, null, 2),
)
await browser.close()

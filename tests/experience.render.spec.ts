import { expect, test, type Locator, type Page } from '@playwright/test'

type World = 'origin' | 'observatory'

/**
 * A visible canvas element is insufficient: earlier Chromium runs captured a
 * completely black desktop frame while the DOM world navigation looked healthy.
 * Inspect actual composited WebGL pixels without adding an image dependency.
 */
async function readyCanvas(page: Page, world: World = 'origin') {
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText(world, {
    timeout: 20_000,
  })
  const canvas = page.getByTestId('atlas-canvas').locator('canvas')
  await expect(canvas).toBeVisible()
  return canvas
}

async function spatialPixelEvidence(page: Page, canvas: Locator) {
  const png = await canvas.screenshot()
  return page.evaluate(async (base64) => {
    const image = new Image()
    image.src = 'data:image/png;base64,' + base64
    await image.decode()
    const sample = document.createElement('canvas')
    sample.width = 240
    sample.height = 150
    const ctx = sample.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('Cannot inspect screenshot pixels')
    ctx.drawImage(image, 0, 0, sample.width, sample.height)
    const pixels = ctx.getImageData(0, 0, sample.width, sample.height).data
    let lit = 0
    const colors = new Set<string>()
    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index]
      const green = pixels[index + 1]
      const blue = pixels[index + 2]
      const high = Math.max(red, green, blue)
      if (high > 85 && high - Math.min(red, green, blue) > 12) {
        lit++
        colors.add([red >> 4, green >> 4, blue >> 4].join('/'))
      }
    }
    return { lit, shades: colors.size }
  }, png.toString('base64'))
}

for (const width of [390, 1440]) {
  for (const world of ['origin', 'observatory'] as const satisfies readonly World[]) {
    test(`visible 3D landmarks render in ${world} at ${width}px`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto(`/?atlas=preview&world=${world}`)
      const canvas = page.getByTestId('atlas-canvas').locator('canvas')
      await expect(canvas).toBeVisible({ timeout: 20_000 })
      await expect(page.getByTestId('atlas-scene-ready')).toHaveText(world, {
        timeout: 20_000,
      })
      await expect
        .poll(async () => (await spatialPixelEvidence(page, canvas)).lit, {
          timeout: 20_000,
          intervals: [250, 500, 1000],
        })
        .toBeGreaterThan(35)
      const evidence = await spatialPixelEvidence(page, canvas)
      expect(evidence.shades).toBeGreaterThan(6)
      await page.evaluate(() => document.fonts.ready)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ),
      ).toBe(false)
      await page.screenshot({
        path: info.outputPath(`g1-${world}-${width}-verified.png`),
        fullPage: true,
      })
    })
  }
}

test('two consecutive world changes render real frames in one persistent canvas', async ({
  page,
}) => {
  await page.goto('/?atlas=preview')
  const stage = page.getByTestId('atlas-canvas')
  const canvas = await readyCanvas(page)
  for (const [button, world] of [
    ['Sternwarte', 'observatory'],
    ['Ursprung', 'origin'],
    ['Sternwarte', 'observatory'],
  ] as const) {
    await page.getByRole('button', { name: button, exact: true }).click()
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText(world)
    await expect
      .poll(async () => (await spatialPixelEvidence(page, canvas)).lit)
      .toBeGreaterThan(35)
    await expect(stage.locator('canvas')).toHaveCount(1)
  }
})

test('lost WebGL context activates accessible HTML fallback', async ({ page }) => {
  await page.goto('/?atlas=preview')
  const canvas = await readyCanvas(page)
  await canvas.evaluate((element) => {
    element.dispatchEvent(new Event('webglcontextlost', { cancelable: true }))
  })
  await expect(page.getByTestId('atlas-canvas')).toHaveCount(0)
  await expect(
    page.getByRole('region', { name: 'Räumlicher Atlas, mit Pfeiltasten verschiebbar' }),
  ).toContainText('Die Projekte sind auch ohne dreidimensionale Ansicht direkt erreichbar.')
  await expect(page.locator('#atlas-projects article')).toHaveCount(7)
})

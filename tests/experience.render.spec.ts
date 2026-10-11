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

/**
 * Scene canvases start below the editorial hero. Bring them into the viewport
 * before sampling; screenshot actions must not own scrolling during a poll.
 */
async function positionCanvasForEvidence(canvas: Locator) {
  await canvas.evaluate((element) => {
    element.scrollIntoView({ behavior: 'instant', block: 'center' })
  })
  await expect
    .poll(async () =>
      canvas.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        return (
          bounds.width > 100 &&
          bounds.height > 100 &&
          bounds.top >= 0 &&
          bounds.bottom <= window.innerHeight + 1
        )
      }),
    )
    .toBe(true)
}

async function spatialPixelEvidence(page: Page, canvas: Locator) {
  // A page screenshot has no locator-driven auto-scroll or stability wait.
  // Crop its viewport pixels to the *actual* canvas, excluding the stage caption.
  const bounds = await canvas.boundingBox()
  if (!bounds) throw new Error('No canvas bounding rectangle for pixel evidence')
  const png = await page.screenshot()
  return page.evaluate(
    async ({ base64, bounds }) => {
      const image = new Image()
      image.src = 'data:image/png;base64,' + base64
      await image.decode()
      const sample = document.createElement('canvas')
      sample.width = 240
      sample.height = 150
      const ctx = sample.getContext('2d', { willReadFrequently: true })
      if (!ctx) throw new Error('Cannot inspect screenshot pixels')
      const scaleX = image.naturalWidth / window.innerWidth
      const scaleY = image.naturalHeight / window.innerHeight
      ctx.drawImage(
        image,
        (bounds.x + 8) * scaleX,
        (bounds.y + 8) * scaleY,
        (bounds.width - 16) * scaleX,
        (bounds.height - 80) * scaleY,
        0,
        0,
        sample.width,
        sample.height,
      )
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
    },
    { base64: png.toString('base64'), bounds },
  )
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
      await positionCanvasForEvidence(canvas)
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
    await positionCanvasForEvidence(canvas)
    await expect
      .poll(async () => (await spatialPixelEvidence(page, canvas)).lit)
      .toBeGreaterThan(35)
    await expect(stage.locator('canvas')).toHaveCount(1)
  }
})

test('history, reduced motion and viewport resize preserve rendered worlds', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?atlas=preview')
  const stage = page.getByTestId('atlas-canvas')
  const canvas = await readyCanvas(page)

  async function checkVisible(world: World) {
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText(world)
    await positionCanvasForEvidence(canvas)
    await expect
      .poll(async () => (await spatialPixelEvidence(page, canvas)).lit)
      .toBeGreaterThan(35)
    expect((await spatialPixelEvidence(page, canvas)).shades).toBeGreaterThan(6)
    await expect(stage.locator('canvas')).toHaveCount(1)
  }

  await checkVisible('origin')
  await page.getByRole('button', { name: 'Sternwarte', exact: true }).click()
  await checkVisible('observatory')
  await page.goBack()
  await checkVisible('origin')
  await page.goForward()
  await checkVisible('observatory')
  await page.setViewportSize({ width: 390, height: 844 })
  await checkVisible('observatory')
})

test('interrupted camera flight leaves the destination world visibly rendered', async ({
  page,
}) => {
  await page.goto('/?atlas=preview')
  const canvas = await readyCanvas(page)
  await page.getByRole('button', { name: /Das Signal Neugier/ }).click()
  await page.getByRole('button', { name: 'Sternwarte', exact: true }).click()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
  await positionCanvasForEvidence(canvas)
  await expect.poll(async () => (await spatialPixelEvidence(page, canvas)).lit).toBeGreaterThan(35)
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Sternwarte')
  await expect(page.getByTestId('atlas-canvas').locator('canvas')).toHaveCount(1)
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

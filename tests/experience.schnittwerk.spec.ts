import { expect, test, type Page } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

type Pose = { position: number[]; target: number[]; fov: number; zoom: number }
type MatrixUpload = { translation: number[][] }
type ProbeWindow = Window & { __schnittwerkUploads?: MatrixUpload[] }
type State = { visibleIds: string[]; filters: { query: string } }

const pose = async (page: Page): Promise<Pose> =>
  JSON.parse((await page.getByTestId('atlas-pose').textContent())!)
// Same full-pose precision contract as observatory.spec.ts; permit IEEE-754 roundoff.
const poseDelta = (a: Pose, b: Pose) =>
  Math.max(
    ...a.position.map((value, axis) => Math.abs(value - b.position[axis])),
    ...a.target.map((value, axis) => Math.abs(value - b.target[axis])),
    Math.abs(a.fov - b.fov),
    Math.abs(a.zoom - b.zoom),
  )
const state = async (page: Page): Promise<State> =>
  JSON.parse((await page.getByTestId('atlas-observatory-state').textContent())!)
const uploads = (page: Page) =>
  page.evaluate(() => (window as ProbeWindow).__schnittwerkUploads ?? [])
const resetUploads = (page: Page) =>
  page.evaluate(() => {
    ;(window as ProbeWindow).__schnittwerkUploads = []
  })
const hasHeight = (values: MatrixUpload[], height: number) =>
  values.some((value) => value.translation.every((xyz) => Math.abs(xyz[1] - height) < 0.001))

async function settledPose(page: Page): Promise<Pose> {
  const frame = () =>
    page.getByTestId('atlas-renderer-info').evaluate((element) => {
      element.dispatchEvent(new Event('atlas:sample-renderer'))
      return JSON.parse((element as HTMLOutputElement).value).frame as number
    })
  // Opening can finish before CameraControls sleeps. Observe real demand-frame rest.
  await expect
    .poll(
      async () => {
        const before = await frame()
        await page.waitForTimeout(300)
        return (await frame()) === before
      },
      { timeout: 20_000 },
    )
    .toBe(true)
  return pose(page)
}

/** Read actual instance matrices sent to WebGL. Forward every native call unchanged. */
async function observeGeometry(page: Page) {
  await page.addInitScript(() => {
    const target = window as ProbeWindow
    target.__schnittwerkUploads = []
    for (const prototype of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      for (const name of ['bufferData', 'bufferSubData'] as const) {
        const original = prototype[name]
        Object.defineProperty(prototype, name, {
          configurable: true,
          writable: true,
          value: function (this: WebGLRenderingContext, ...args: unknown[]) {
            const data = args[name === 'bufferData' ? 1 : 2]
            if (data instanceof Float32Array && data.length === 64) {
              const affine = [0, 16, 32, 48].every(
                (offset) =>
                  data[offset + 3] === 0 &&
                  data[offset + 7] === 0 &&
                  data[offset + 11] === 0 &&
                  data[offset + 15] === 1,
              )
              if (affine) {
                target.__schnittwerkUploads!.push({
                  translation: [0, 16, 32, 48].map((offset) =>
                    Array.from(data.slice(offset + 12, offset + 15)),
                  ),
                })
                if (target.__schnittwerkUploads!.length > 1000) target.__schnittwerkUploads!.shift()
              }
            }
            return Reflect.apply(original, this, args)
          },
        })
      }
    }
  })
}

async function open(page: Page, width: number, reduced = true) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' })
  await observeGeometry(page)
  await page.goto('/atlas/observatory/?focus=nexus')
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  await expect(page.getByTestId('atlas-transition')).toHaveText('focused')
  await page.evaluate(() => document.fonts.ready)
  await page
    .getByTestId('atlas-canvas')
    .locator('canvas')
    .evaluate((canvas) => canvas.setAttribute('data-independent-qa-identity', 'persistent'))
}

/** Same existing Canvas-only color thresholds; no DOM text or panels qualify. */
async function pixels(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  const bounds = await page.getByTestId('atlas-canvas').locator('canvas').boundingBox()
  if (!bounds) throw new Error('Missing real Canvas bounds')
  const style = await page.addStyleTag({
    content: '.atlas-v3__overlay, .observatory-explorer { visibility: hidden !important }',
  })
  let png: Buffer
  try {
    png = await page.screenshot()
  } finally {
    await style.evaluate((node) => node.parentNode?.removeChild(node))
  }
  return page.evaluate(
    async ({ base64, bounds }) => {
      const image = new Image()
      image.src = 'data:image/png;base64,' + base64
      await image.decode()
      const sample = document.createElement('canvas')
      sample.width = 240
      sample.height = 150
      const context = sample.getContext('2d', { willReadFrequently: true })!
      const sx = image.naturalWidth / innerWidth
      const sy = image.naturalHeight / innerHeight
      context.drawImage(
        image,
        (bounds.x + 8) * sx,
        (bounds.y + 8) * sy,
        (bounds.width - 16) * sx,
        (bounds.height - 80) * sy,
        0,
        0,
        240,
        150,
      )
      const data = context.getImageData(0, 0, 240, 150).data
      let lit = 0
      let checksum = 2166136261
      const shades = new Set<string>()
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
        if (Math.max(r, g, b) > 85 && Math.max(r, g, b) - Math.min(r, g, b) > 12) {
          lit++
          shades.add([r >> 4, g >> 4, b >> 4].join('/'))
        }
        checksum = Math.imul(checksum ^ r ^ (g << 8) ^ (b << 16), 16777619)
      }
      return { lit, shades: shades.size, checksum }
    },
    { base64: png.toString('base64'), bounds },
  )
}

test.describe.configure({ timeout: 120_000 })

for (const width of [390, 768, 1440, 1920]) {
  test(`Schnittwerk Nexus opens real geometry and restores it through history at ${width}px`, async ({
    page,
  }, info) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await open(page, width)
    await expect.poll(async () => hasHeight(await uploads(page), 0)).toBe(true)
    const approachPose = await pose(page)
    const approachPixels = await pixels(page)
    expect(approachPixels.lit).toBeGreaterThan(35)
    expect(approachPixels.shades).toBeGreaterThan(6)
    await page.screenshot({ path: info.outputPath(`nexus-approach-${width}.png`) })
    await resetUploads(page)
    await page.getByRole('button', { name: 'Innenraum entdecken', exact: true }).click()
    await expect.poll(async () => hasHeight(await uploads(page), -46)).toBe(true)
    await expect.poll(async () => hasHeight(await uploads(page), -34)).toBe(true)
    const detailPose = await pose(page)
    expect(detailPose).not.toEqual(approachPose)
    const detailPixels = await pixels(page)
    expect(detailPixels.lit).toBeGreaterThan(35)
    expect(detailPixels.shades).toBeGreaterThan(6)
    expect(detailPixels.checksum).not.toBe(approachPixels.checksum)
    const openingUploads = await uploads(page)
    await page.screenshot({ path: info.outputPath(`nexus-discovery-${width}.png`) })

    await resetUploads(page)
    await page.goBack()
    await expect.poll(async () => poseDelta(await pose(page), approachPose)).toBeLessThan(0.0000001)
    await expect.poll(async () => hasHeight(await uploads(page), 0)).toBe(true)
    const closedUploads = await uploads(page)
    expect(
      closedUploads.filter((value) => value.translation.every((xyz) => xyz[1] === 0)).length,
    ).toBeGreaterThanOrEqual(2)
    const restoredPixels = await pixels(page)
    expect(restoredPixels.checksum).toBe(approachPixels.checksum)
    await page.screenshot({ path: info.outputPath(`nexus-back-${width}.png`) })
    await resetUploads(page)
    await page.goForward()
    await expect.poll(async () => poseDelta(await pose(page), detailPose)).toBeLessThan(0.0000001)
    await expect.poll(async () => hasHeight(await uploads(page), -46)).toBe(true)
    await expect.poll(async () => hasHeight(await uploads(page), -34)).toBe(true)
    await expect(page.getByTestId('atlas-canvas').locator('canvas')).toHaveCount(1)
    await expect(page.getByTestId('atlas-canvas').locator('canvas')).toHaveAttribute(
      'data-independent-qa-identity',
      'persistent',
    )
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false)
    expect(errors).toEqual([])
    await writeFile(
      info.outputPath(`nexus-geometry-${width}.json`),
      JSON.stringify(
        {
          width,
          approachPose,
          detailPose,
          approachPixels,
          detailPixels,
          restoredPixels,
          openingUploads,
          closedUploads,
          errors,
        },
        null,
        2,
      ),
    )
  })
}

test('Schnittwerk discovery respects Rust filtering and disables the empty result action', async ({
  page,
}) => {
  await open(page, 390)
  const panel = page.getByRole('region', { name: 'Projektsternwarte', exact: true })
  await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
  await panel.getByLabel('Projekte suchen', { exact: true }).fill('Rust')
  await panel.getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect.poll(async () => (await state(page)).visibleIds).toEqual(['cerebri'])
  await page.getByRole('button', { name: 'Projekterkundung schließen' }).click()
  await expect(page.locator('.schnittwerk-discover')).toHaveText(/Cerebri.*erkunden/)
  await page.locator('.schnittwerk-discover').click()
  await expect(page).toHaveURL(/focus=cerebri/)
  await expect(page).toHaveURL(/q=Rust/)
  expect((await state(page)).visibleIds).toEqual(['cerebri'])
  expect((await state(page)).filters.query).toBe('Rust')
  await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
  await panel.getByLabel('Projekte suchen', { exact: true }).fill('No such project 987654')
  await panel.getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect.poll(async () => (await state(page)).visibleIds).toEqual([])
  await page.getByRole('button', { name: 'Projekterkundung schließen' }).click()
  await expect(page.locator('.schnittwerk-discover')).toBeDisabled()
  await expect(page.locator('.schnittwerk-discover')).toHaveText(/Keine Projekte im Ausschnitt/)
})

test('Schnittwerk roof uses global reduced motion with identical final geometry and pose', async ({
  page,
}, info) => {
  await open(page, 1440, false)
  await expect(page.getByTestId('atlas-motion')).toHaveText('full')
  await resetUploads(page)
  await page.getByRole('button', { name: 'Innenraum entdecken', exact: true }).click()
  await expect.poll(async () => hasHeight(await uploads(page), -46), { timeout: 20_000 }).toBe(true)
  await expect.poll(async () => hasHeight(await uploads(page), -34)).toBe(true)
  const fullPose = await settledPose(page)
  const fullUploads = await uploads(page)
  expect(
    fullUploads.some((value) =>
      value.translation.every((xyz) => xyz[1] < -0.01 && xyz[1] > -33.99),
    ),
  ).toBe(true)
  await resetUploads(page)
  await page.goBack()
  await expect.poll(async () => hasHeight(await uploads(page), 0), { timeout: 20_000 }).toBe(true)
  await page.getByRole('checkbox', { name: 'Kamerafahrten reduzieren' }).check()
  await expect(page.getByTestId('atlas-motion')).toHaveText('reduced')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await resetUploads(page)
  await page.getByRole('button', { name: 'Innenraum entdecken', exact: true }).click()
  await expect.poll(async () => hasHeight(await uploads(page), -46)).toBe(true)
  await expect.poll(async () => hasHeight(await uploads(page), -34)).toBe(true)
  await expect.poll(async () => poseDelta(await pose(page), fullPose)).toBeLessThan(0.0000001)
  const reducedUploads = await uploads(page)
  expect(
    reducedUploads.every((value) =>
      [0, -34, -46].some((height) =>
        value.translation.every((xyz) => Math.abs(xyz[1] - height) < 0.001),
      ),
    ),
  ).toBe(true)
  await writeFile(
    info.outputPath('nexus-motion-geometry.json'),
    JSON.stringify({ fullPose, fullUploads, reducedUploads }, null, 2),
  )
})

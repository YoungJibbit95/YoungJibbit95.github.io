import { devices, expect, test, type Page, type TestInfo } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type { CameraPose } from '../src/experience/worldTypes'

test.describe.configure({ timeout: 120_000 })

const pose = async (page: Page): Promise<CameraPose> =>
  JSON.parse((await page.getByTestId('atlas-pose').textContent())!)
const state = async (page: Page) =>
  JSON.parse((await page.getByTestId('atlas-observatory-state').textContent())!) as {
    visibleIds: string[]
    filters: { query: string }
    lod: { levels: Record<string, string> }
  }
const values = (value: CameraPose) => [...value.position, ...value.target, value.fov, value.zoom]
const difference = (a: CameraPose, b: CameraPose) =>
  Math.max(...values(a).map((value, axis) => Math.abs(value - values(b)[axis])))
const distance = (value: CameraPose) =>
  Math.hypot(...value.position.map((coordinate, axis) => coordinate - value.target[axis]))
const panel = (page: Page) => page.getByRole('region', { name: 'Projektsternwarte', exact: true })

type RendererSample = {
  cameraFar: number
  discovery: { sails: [number, number, number][]; detailVisible: boolean } | null
}

/** Dispatch and read in one browser task so a demand frame cannot replace the inspection. */
const renderer = async (page: Page): Promise<RendererSample> =>
  page.getByTestId('atlas-renderer-info').evaluate((element) => {
    element.dispatchEvent(new Event('atlas:sample-renderer'))
    return JSON.parse(element.textContent!)
  })

async function expectDiscovery(page: Page, opened: boolean) {
  const initial = (await renderer(page)).discovery
  expect(initial?.sails).toHaveLength(4)
  for (const sail of initial!.sails) expect(sail).toHaveLength(3)
  const horizontal = async () =>
    (await renderer(page)).discovery!.sails.map(([x, , z]) => Math.hypot(x, z))
  if (opened) {
    await expect.poll(async () => Math.min(...(await horizontal()))).toBeGreaterThan(8.99)
  } else {
    await expect.poll(async () => Math.max(...(await horizontal()))).toBeLessThan(1e-7)
  }
  await expect.poll(async () => (await renderer(page)).discovery?.detailVisible).toBe(opened)
  return (await renderer(page)).discovery!
}

async function open(page: Page, width = 1440, reducedMotion = false) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.emulateMedia({ reducedMotion: reducedMotion ? 'reduce' : 'no-preference' })
  await page.goto('/atlas/observatory/?cosmos=preview')
  await expect(page.getByTestId('atlas-experience')).toHaveAttribute('data-cosmos', 'preview')
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  await expect(page.getByTestId('atlas-transition')).toHaveText('idle')
  await page.evaluate(() => document.fonts.ready)
}

async function settle(page: Page, focused = false) {
  await expect(page.getByTestId('atlas-transition')).toHaveText(focused ? 'focused' : 'idle')
}

/** Use the same real-Canvas crop and strict pixel thresholds as the existing G1/G2 gate. */
async function pixels(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  const bounds = await page.getByTestId('atlas-canvas').locator('canvas').boundingBox()
  if (!bounds) throw new Error('Missing physical Canvas rectangle')
  const png = await page.screenshot({
    style: '.atlas-v3__overlay, .observatory-explorer { visibility: hidden !important; }',
  })
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

async function capture(page: Page, info: TestInfo, name: string) {
  const evidence = await pixels(page)
  expect(evidence.lit).toBeGreaterThan(35)
  expect(evidence.shades).toBeGreaterThan(6)
  await page.screenshot({ path: info.outputPath(name + '.png') })
  return evidence
}

for (const width of [1440, 390]) {
  test(`cosmic overview and Nexus discovery render real pixels at ${width}px`, async ({
    page,
  }, info) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await open(page, width, width === 390)
    const canvas = page.getByTestId('atlas-canvas').locator('canvas')
    await canvas.evaluate((element) => {
      element.dataset.cosmosIdentity = 'persistent'
    })
    expect((await state(page)).visibleIds).toEqual([
      'nexus',
      'cerebri',
      'novacore',
      'nemisis',
      'adventura',
      'yjse',
      'jarvis',
    ])
    const macro = await pose(page)
    const macroPixels = await capture(page, info, `cosmos-macro-${width}`)
    await page.getByRole('button', { name: 'Nexus erkunden', exact: false }).click()
    await settle(page, true)
    const approach = await pose(page)
    expect(difference(approach, macro)).toBeGreaterThan(100)
    expect(distance(approach)).toBeLessThan(distance(macro))
    const approachDiscovery = await expectDiscovery(page, false)
    await capture(page, info, `cosmos-nexus-approach-${width}`)
    await page.getByRole('button', { name: 'Kern entdecken', exact: false }).click()
    await settle(page, true)
    // CameraControls emits rest before its final sleep. History stores the
    // physical departure pose at navigation, not that earlier rest sample.
    const departedApproach: CameraPose = await page.evaluate(
      () => window.history.state.livingAtlas.history.at(-1).pose,
    )
    expect(difference(departedApproach, approach)).toBeLessThan(0.05)
    const detail = await pose(page)
    expect(distance(detail)).toBeLessThan(distance(approach))
    await expect.poll(async () => (await state(page)).lod.levels.nexus).toBe('micro')
    const detailDiscovery = await expectDiscovery(page, true)
    const detailPixels = await capture(page, info, `cosmos-nexus-detail-${width}`)
    expect(detailPixels.checksum).not.toBe(macroPixels.checksum)
    await page.goBack()
    await expect.poll(async () => difference(await pose(page), departedApproach)).toBeLessThan(1e-7)
    const returnedDiscovery = await expectDiscovery(page, false)
    await expect(canvas).toHaveAttribute('data-cosmos-identity', 'persistent')
    await expect(page.locator('canvas[data-engine]')).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    await info.attach('camera-and-pixels.json', {
      body: JSON.stringify(
        {
          width,
          macro,
          approach,
          departedApproach,
          detail,
          macroPixels,
          detailPixels,
          approachDiscovery,
          detailDiscovery,
          returnedDiscovery,
        },
        null,
        2,
      ),
      contentType: 'application/json',
    })
    expect(errors).toEqual([])
  })
}

test('cosmic filters and physical pose survive Back and Forward with one Canvas', async ({
  page,
}) => {
  await open(page, 1440, true)
  const canvas = page.getByTestId('atlas-canvas').locator('canvas')
  await canvas.evaluate((element) => {
    element.dataset.cosmosHistoryIdentity = 'persistent'
  })
  await expect.poll(async () => (await renderer(page)).cameraFar).toBe(14000)
  const macro = await pose(page)
  await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
  await panel(page).getByLabel('Projekte suchen', { exact: true }).fill('Nexus')
  await panel(page).getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect.poll(async () => (await state(page)).filters.query).toBe('Nexus')
  const filtered = await pose(page)
  const filteredIds = (await state(page)).visibleIds
  await panel(page).locator('[data-project-id="nexus"]').click()
  await settle(page, true)
  await page.getByRole('button', { name: 'Projekterkundung schließen' }).click()
  const selected = await pose(page)
  await page.getByTestId('atlas-stage').focus()
  await page.keyboard.press('ArrowRight')
  await expect.poll(async () => difference(await pose(page), selected)).toBeGreaterThan(1)
  const moved = await pose(page)
  await page.goBack()
  await expect.poll(async () => difference(await pose(page), filtered)).toBeLessThan(1e-7)
  expect((await state(page)).visibleIds).toEqual(filteredIds)
  expect((await state(page)).filters.query).toBe('Nexus')
  await page.goForward()
  await expect.poll(async () => difference(await pose(page), moved)).toBeLessThan(1e-7)
  await expect(page).toHaveURL(/focus=nexus/)
  expect(new URL(page.url()).searchParams.get('cosmos')).toBe('preview')
  await page.goBack()
  await page.goBack()
  await expect.poll(async () => difference(await pose(page), macro)).toBeLessThan(1e-7)
  expect((await state(page)).visibleIds).toHaveLength(7)
  expect((await pixels(page)).lit).toBeGreaterThan(35)
  await page.getByRole('link', { name: 'Ursprung', exact: true }).click()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin')
  await expect.poll(async () => (await renderer(page)).cameraFar).toBe(6000)
  await expect(canvas).toHaveAttribute('data-cosmos-history-identity', 'persistent')
  await page.goBack()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
  await expect.poll(async () => (await renderer(page)).cameraFar).toBe(14000)
  await expect.poll(async () => difference(await pose(page), macro)).toBeLessThan(1e-7)
  await expect(canvas).toHaveAttribute('data-cosmos-history-identity', 'persistent')
  await expect(page.getByTestId('atlas-canvas').locator('canvas')).toHaveCount(1)
  expect(new URL(page.url()).searchParams.get('cosmos')).toBe('preview')
})

test('cosmic map supports continuous wheel, pan, orbit and keyboard movement', async ({ page }) => {
  await open(page)
  const before = await pose(page)
  const scroll = await page.evaluate(() => scrollY)
  await page.mouse.move(740, 620)
  await page.mouse.wheel(0, -450)
  await expect.poll(async () => distance(await pose(page))).toBeLessThan(distance(before) - 10)
  const zoomed = await pose(page)
  await page.mouse.move(740, 620)
  await page.mouse.down()
  await page.mouse.move(980, 690, { steps: 16 })
  await page.mouse.up()
  await expect
    .poll(async () => Math.abs((await pose(page)).target[0] - zoomed.target[0]))
    .toBeGreaterThan(50)
  const panned = await pose(page)
  await page.mouse.move(740, 620)
  await page.mouse.down({ button: 'right' })
  await page.mouse.move(870, 570, { steps: 16 })
  await page.mouse.up({ button: 'right' })
  await expect.poll(async () => difference(await pose(page), panned)).toBeGreaterThan(1)
  await settle(page)
  const orbited = await pose(page)
  expect(Math.max(...orbited.target.map((v, i) => Math.abs(v - panned.target[i])))).toBeLessThan(
    0.05,
  )
  await page.getByTestId('atlas-stage').focus()
  await page.keyboard.press('ArrowRight')
  await expect
    .poll(async () => Math.abs((await pose(page)).target[0] - orbited.target[0]))
    .toBeGreaterThan(1)
  expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThan(3)
  expect((await pixels(page)).lit).toBeGreaterThan(35)
})

test('cosmic mobile pinch and two-finger pan move the map without page scrolling', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ ...devices['Pixel 5'], baseURL })
  try {
    const page = await context.newPage()
    await open(page, 390)
    const bounds = (await page.getByTestId('atlas-canvas').locator('canvas').boundingBox())!
    const x = bounds.x + bounds.width * 0.5
    const y = bounds.y + bounds.height * 0.48
    const scroll = await page.evaluate(() => scrollY)
    const before = await pose(page)
    const client = await context.newCDPSession(page)
    const fingers = (spread: number, offset = 0) => [
      { x: x - spread + offset, y, id: 1 },
      { x: x + spread + offset, y, id: 2 },
    ]
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: fingers(28) })
    for (const spread of [42, 56, 75, 93]) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: fingers(spread),
      })
      await page.waitForTimeout(45)
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect
      .poll(async () => Math.abs(distance(await pose(page)) - distance(before)))
      .toBeGreaterThan(1)
    const zoomed = await pose(page)
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: fingers(36) })
    for (const offset of [10, 20, 30, 40]) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: fingers(36, offset),
      })
      await page.waitForTimeout(45)
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect
      .poll(async () => Math.abs((await pose(page)).target[0] - zoomed.target[0]))
      .toBeGreaterThan(1)
    await settle(page)
    expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThan(3)
    expect((await pixels(page)).lit).toBeGreaterThan(35)
    await client.detach()
  } finally {
    await context.close()
  }
})

test('cosmic keyboard, reduced motion, accessibility and WebGL fallback preserve discovery', async ({
  page,
}) => {
  await open(page, 390, true)
  await expect(page.getByTestId('atlas-motion')).toHaveText('reduced')
  const trigger = page.getByRole('button', { name: 'Projekte erkunden', exact: true })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(
    panel(page).getByRole('heading', { name: 'Projektsternwarte', exact: true }),
  ).toBeFocused()
  await panel(page).locator('[data-project-id="nexus"]').click()
  await settle(page, true)
  const findings = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(
    findings.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical'),
  ).toEqual([])
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
        if (kind.startsWith('webgl')) return null
        return (original as (...args: unknown[]) => unknown).call(this, kind, ...args)
      },
    })
  })
  await page.reload()
  await expect(page.getByTestId('atlas-experience')).toHaveAttribute('data-cosmos', 'preview')
  await expect(page.locator('#atlas-projects article')).toHaveCount(7)
  await expect(page.getByTestId('atlas-canvas')).toHaveCount(0)
  await trigger.click()
  await expect(panel(page).locator('[data-project-id]')).toHaveCount(7)
  await expect(
    page.getByTestId('observatory-dossier').getByRole('link', { name: /Repository/ }),
  ).toHaveAttribute('href', /github.com/)
})

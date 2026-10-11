import { expect, test, devices, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { writeFile } from 'node:fs/promises'
import { observatoryProjects } from '../src/experience/observatory/data'

type Pose = { position: number[]; target: number[]; fov: number; zoom: number }
type State = {
  visibleIds: string[]
  filters: { query: string; category: string; technology: string; status: string; cluster: string }
  selectedEdgeId: string | null
  lod: { level: string; levels: Record<string, string> }
}
const pose = async (page: Page): Promise<Pose> =>
  JSON.parse((await page.getByTestId('atlas-pose').textContent())!)
const state = async (page: Page): Promise<State> =>
  JSON.parse((await page.getByTestId('atlas-observatory-state').textContent())!)
const distance = (value: Pose) =>
  Math.hypot(...value.position.map((item, axis) => item - value.target[axis]))
const delta = (a: Pose, b: Pose) =>
  Math.max(
    ...a.position.map((v, i) => Math.abs(v - b.position[i])),
    ...a.target.map((v, i) => Math.abs(v - b.target[i])),
    Math.abs(a.fov - b.fov),
    Math.abs(a.zoom - b.zoom),
  )
const panel = (page: Page) => page.getByRole('region', { name: 'Projektsternwarte', exact: true })

async function open(page: Page, width = 1440, query = '') {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.goto('/?atlas=preview&world=observatory' + query)
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  await page.evaluate(() => document.fonts.ready)
}
async function explore(page: Page) {
  if (!(await panel(page).count()))
    await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
  await expect(panel(page)).toBeVisible()
}
async function close(page: Page) {
  if (await panel(page).count())
    await page.getByRole('button', { name: 'Projekterkundung schließen' }).click()
}
async function focus(page: Page, id: string) {
  await explore(page)
  await panel(page).locator(`[data-project-id="${id}"]`).click()
  await expect(page.getByTestId('atlas-transition')).toHaveText('focused')
  await expect(page).toHaveURL(new RegExp('focus=' + id))
}

/** Only real composited Canvas pixels qualify; DOM labels/panels are excluded. */
async function pixels(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  const canvas = page.getByTestId('atlas-canvas').locator('canvas')
  const bounds = await canvas.boundingBox()
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
  const stats = await page.evaluate(
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
      const shades = new Set<string>()
      let checksum = 2166136261
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
  return stats
}

test.describe.configure({ timeout: 120_000 })

for (const width of [390, 768, 1440, 1920]) {
  test(`observatory overview, cluster and project have real pixels at ${width}px`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page, width)
    await expect.poll(async () => (await pixels(page)).lit).toBeGreaterThan(35)
    expect((await pixels(page)).shades).toBeGreaterThan(6)
    expect((await state(page)).visibleIds).toHaveLength(7)
    await page.screenshot({ path: info.outputPath(`g2c-overview-${width}.png`) })
    const overview = await pose(page)
    await explore(page)
    await panel(page).getByText('Cluster erkunden', { exact: true }).click()
    await panel(page)
      .getByRole('button', { name: 'Arbeit & Planung einrahmen', exact: true })
      .click()
    await expect.poll(async () => delta(await pose(page), overview)).toBeGreaterThan(50)
    await close(page)
    await expect.poll(async () => (await pixels(page)).lit).toBeGreaterThan(35)
    await page.screenshot({ path: info.outputPath(`g2c-cluster-${width}.png`) })
    await focus(page, 'novacore')
    await expect
      .poll(async () => (await state(page)).lod.levels.novacore)
      .toBe(width === 390 ? 'meso' : 'micro')
    await close(page)
    await expect.poll(async () => (await pixels(page)).lit).toBeGreaterThan(35)
    await page.screenshot({ path: info.outputPath(`g2c-project-${width}.png`) })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false)
    await expect(page.getByTestId('atlas-canvas').locator('canvas')).toHaveCount(1)
  })
}

test('all seven projects have unique rendered portraits, exact targets and source dossiers', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const checksums = new Set<number>()
  for (const project of observatoryProjects) {
    await focus(page, project.id)
    await expect.poll(async () => (await pose(page)).target).toEqual([...project.position])
    await expect(
      page
        .getByTestId('observatory-dossier')
        .getByRole('heading', { name: project.name, exact: true }),
    ).toBeVisible()
    await page
      .getByTestId('observatory-dossier')
      .getByText('Quellen & Grenzen', { exact: true })
      .click()
    await expect(page.getByTestId('observatory-dossier')).toContainText(
      project.visual.interpretation,
    )
    await expect(
      page.getByTestId('observatory-dossier').locator('a[href*="/blob/"]').first(),
    ).toHaveAttribute('href', /\/blob\/[a-f0-9]{40}\//)
    await close(page)
    const result = await pixels(page)
    expect(result.lit).toBeGreaterThan(35)
    checksums.add(result.checksum)
    await page.screenshot({ path: info.outputPath(`g2c-portrait-${project.id}.png`) })
  }
  expect(checksums.size).toBe(7)
})

test('search, four filters, empty state and relation selection change real scene state', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const allPixels = await pixels(page)
  await explore(page)
  await panel(page).getByText('Verbindungen lesen', { exact: true }).click()
  await panel(page)
    .getByRole('button', { name: /NovaCore.*Nemisis.*Technische Abhängigkeit/ })
    .click()
  await expect.poll(async () => (await state(page)).selectedEdgeId).toBe('novacore-nemisis')
  await expect(page).toHaveURL(/edge=novacore-nemisis/)
  await expect(
    panel(page).getByRole('article', { name: 'Verbindung: Engine → Spiel' }),
  ).toContainText('CMake-Build-Abhängigkeit')
  await panel(page).getByLabel('Projekte suchen', { exact: true }).fill('Cerebri')
  await panel(page).getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect.poll(async () => (await state(page)).visibleIds).toEqual(['cerebri'])
  await expect.poll(async () => (await state(page)).selectedEdgeId).toBeNull()
  await expect(page).toHaveURL(/q=Cerebri/)
  expect((await pixels(page)).checksum).not.toBe(allPixels.checksum)
  await panel(page).getByLabel('Projekte suchen', { exact: true }).fill('No such project 987654')
  await panel(page).getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect(panel(page).getByRole('heading', { name: 'Kein Projekt passt dazu.' })).toBeVisible()
  await expect.poll(async () => (await state(page)).visibleIds).toEqual([])
  await page.screenshot({ path: info.outputPath('g2c-empty-1440.png') })
  await panel(page).getByRole('button', { name: 'Alle Projekte anzeigen', exact: true }).click()
  await expect.poll(async () => (await state(page)).visibleIds.length).toBe(7)
  await panel(page)
    .locator('summary')
    .filter({ hasText: /^Filter/ })
    .click()
  for (const [label, field, value] of [
    ['Kategorie', 'category', observatoryProjects[0].category],
    ['Technologie', 'technology', 'Rust'],
    ['Status', 'status', '0.2.0 · unveröffentlicht'],
    ['Cluster', 'cluster', 'world-building'],
  ]) {
    await panel(page).getByLabel(label, { exact: true }).selectOption(value)
    await expect
      .poll(async () => (await state(page)).filters[field as keyof State['filters']])
      .toBe(value)
    expect((await state(page)).visibleIds.length).toBeGreaterThan(0)
    expect((await state(page)).visibleIds.length).toBeLessThan(7)
    await panel(page).getByRole('button', { name: 'Suche & Filter zurücksetzen' }).click()
  }
})

test('free pan and zoom change real pose and LOD; Fit All restores macro', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, 390)
  await focus(page, 'novacore')
  await close(page)
  await expect.poll(async () => (await state(page)).lod.levels.novacore).toBe('meso')
  const before = await pose(page)
  await page.getByRole('button', { name: 'Hineinzoomen', exact: true }).click()
  await expect.poll(async () => distance(await pose(page))).toBeLessThan(distance(before))
  await expect.poll(async () => (await state(page)).lod.levels.novacore).toBe('micro')
  await page.screenshot({ path: info.outputPath('g2c-micro-390.png') })
  const afterZoom = await pose(page)
  await page.getByTestId('atlas-stage').focus()
  await page.keyboard.press('ArrowRight')
  await expect
    .poll(async () => Math.abs((await pose(page)).target[0] - afterZoom.target[0]))
    .toBeGreaterThan(1)
  await page.getByRole('button', { name: 'Alle einrahmen', exact: true }).click()
  await expect.poll(async () => (await state(page)).lod.level).toBe('macro')
  expect(distance(await pose(page))).toBeGreaterThan(1000)
  await expect.poll(async () => (await pixels(page)).lit).toBeGreaterThan(35)
})

test('Origin to Observatory, filters and exact camera survive Back and Forward', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?atlas=preview')
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin', { timeout: 30_000 })
  await page.getByTestId('atlas-stage').focus()
  await page.keyboard.press('ArrowRight')
  const origin = await pose(page)
  await page.getByRole('link', { name: 'Sternwarte', exact: true }).click()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
  const overview = await pose(page)
  await explore(page)
  await panel(page).getByLabel('Projekte suchen', { exact: true }).fill('Rust')
  await panel(page).getByRole('button', { name: 'Suchen', exact: true }).click()
  const filtered = await state(page)
  const filteredPose = await pose(page)
  await focus(page, 'cerebri')
  await close(page)
  await page.getByTestId('atlas-stage').focus()
  await page.keyboard.press('ArrowRight')
  const focused = await pose(page)
  await page.goBack()
  await expect.poll(async () => delta(await pose(page), filteredPose)).toBeLessThan(0.0000001)
  await expect.poll(async () => (await state(page)).filters).toEqual(filtered.filters)
  await page.goForward()
  await expect.poll(async () => delta(await pose(page), focused)).toBeLessThan(0.0000001)
  await expect(page).toHaveURL(/focus=cerebri/)
  await page.goBack()
  await page.goBack()
  await expect.poll(async () => delta(await pose(page), overview)).toBeLessThan(0.0000001)
  await expect.poll(async () => (await state(page)).visibleIds.length).toBe(7)
  await page.goBack()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin')
  await expect.poll(async () => delta(await pose(page), origin)).toBeLessThan(0.0000001)
  await expect.poll(async () => (await pixels(page)).lit).toBeGreaterThan(35)
})

test('rapid focus and user input interrupt camera flight without a stale destination', async ({
  page,
}) => {
  await open(page)
  await explore(page)
  await panel(page).locator('[data-project-id="nexus"]').click()
  await panel(page).locator('[data-project-id="jarvis"]').click()
  await expect(page).toHaveURL(/focus=jarvis/)
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(-400, 1)
  await panel(page).locator('[data-project-id="novacore"]').click()
  await page.getByTestId('atlas-stage').focus()
  await page.keyboard.press('ArrowRight')
  // Manual motion retains the selected project; the Director must settle that
  // retained selection instead of staying in a canceled 'transitioning' state.
  await expect(page.getByTestId('atlas-transition')).toHaveText('focused')
  const stopped = await pose(page)
  await page.waitForTimeout(1000)
  expect(delta(await pose(page), stopped)).toBeLessThan(0.05)
  await expect.poll(async () => (await pixels(page)).lit).toBeGreaterThan(35)
})

test('mobile pinch and two-finger pan move Observatory without scrolling the page', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ ...devices['Pixel 5'], baseURL })
  const page = await context.newPage()
  try {
    await open(page, 390)
    const canvas = page.getByTestId('atlas-canvas').locator('canvas')
    const bounds = (await canvas.boundingBox())!
    const x = bounds.x + bounds.width * 0.5
    const y = bounds.y + bounds.height * 0.46
    const startScroll = await page.evaluate(() => scrollY)
    const before = await pose(page)
    const client = await context.newCDPSession(page)
    const fingers = (spread: number, offset: number) => [
      { x: x - spread + offset, y, id: 1 },
      { x: x + spread + offset, y, id: 2 },
    ]
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: fingers(28, 0),
    })
    for (const spread of [42, 56, 75, 93]) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: fingers(spread, 0),
      })
      await page.waitForTimeout(45)
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect
      .poll(async () => Math.abs(distance(await pose(page)) - distance(before)))
      .toBeGreaterThan(1)
    const zoomed = await pose(page)
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: fingers(36, 0),
    })
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
    expect(Math.abs((await page.evaluate(() => scrollY)) - startScroll)).toBeLessThan(3)
    await client.detach()
    await expect.poll(async () => (await pixels(page)).lit).toBeGreaterThan(35)
  } finally {
    await context.close()
  }
})

test('explorer supports keyboard focus, 44px controls and WCAG A/AA severe checks', async ({
  page,
}, info) => {
  await open(page, 390)
  const trigger = page.getByRole('button', { name: 'Projekte erkunden', exact: true })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(
    panel(page).getByRole('heading', { name: 'Projektsternwarte', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await focus(page, 'nexus')
  const findings = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  await writeFile(
    info.outputPath('observatory-axe.json'),
    JSON.stringify(findings.violations, null, 2),
  )
  await info.attach('observatory-axe.json', {
    body: JSON.stringify(findings.violations, null, 2),
    contentType: 'application/json',
  })
  expect(
    findings.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical'),
  ).toEqual([])
  for (const button of await page.getByTestId('observatory-explorer').getByRole('button').all()) {
    if (await button.isVisible())
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }
  await page.screenshot({ path: info.outputPath('g2c-dossier-390.png') })
})

test('filtered project geometry cannot capture clicks and silently reset the filter', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  await focus(page, 'novacore')
  await close(page)
  // The archived NovaCore portrait contains its solid left lamella at (600,450).
  // Keep the physical camera in place while filtering that entire system away.
  const before = await pose(page)
  await explore(page)
  await panel(page).getByLabel('Projekte suchen', { exact: true }).fill('Rust')
  await panel(page).getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect.poll(async () => (await state(page)).visibleIds).toEqual(['cerebri'])
  await close(page)
  expect(delta(await pose(page), before)).toBeLessThan(0.0000001)
  await page.mouse.click(600, 450)
  await page.waitForTimeout(400)
  expect((await state(page)).visibleIds).toEqual(['cerebri'])
  expect((await state(page)).filters.query).toBe('Rust')
  await expect(page).toHaveURL(/q=Rust/)
})

test('a 160-character Unicode search survives URL reload and browser history', async ({ page }) => {
  await open(page)
  await explore(page)
  const query = '界'.repeat(160)
  await panel(page).getByLabel('Projekte suchen', { exact: true }).fill(query)
  await panel(page).getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect.poll(async () => (await state(page)).filters.query).toBe(query)
  expect(new URL(page.url()).searchParams.get('q')).toBe(query)
  await page.reload()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  await expect.poll(async () => (await state(page)).filters.query).toBe(query)
  await explore(page)
  await expect(panel(page).getByLabel('Projekte suchen', { exact: true })).toHaveValue(query)
  await panel(page).getByRole('button', { name: 'Alle Projekte anzeigen', exact: true }).click()
  await expect.poll(async () => (await state(page)).visibleIds.length).toBe(7)
  await page.goBack()
  await expect.poll(async () => (await state(page)).filters.query).toBe(query)
})

test('mouse drag and wheel explore physical space beyond the initial viewport', async ({
  page,
}) => {
  await open(page)
  const before = await pose(page)
  const scroll = await page.evaluate(() => scrollY)
  const imageBefore = await pixels(page)
  await page.mouse.move(740, 640)
  await page.mouse.down()
  await page.mouse.move(1000, 710, { steps: 16 })
  await page.mouse.up()
  await expect
    .poll(async () => Math.abs((await pose(page)).target[0] - before.target[0]))
    .toBeGreaterThan(50)
  const dragged = await pose(page)
  await page.mouse.move(740, 640)
  await page.mouse.wheel(0, -450)
  await expect.poll(async () => distance(await pose(page))).toBeLessThan(distance(dragged) - 10)
  expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThan(3)
  expect((await pixels(page)).checksum).not.toBe(imageBefore.checksum)
})

test('WebGL failure preserves seven semantic projects, filters and source links', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
        if (kind === 'webgl2') return null
        return (original as (...params: unknown[]) => unknown).call(this, kind, ...args)
      },
    })
  })
  await page.goto('/?atlas=preview&world=observatory')
  await expect(page.getByTestId('atlas-experience')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByTestId('atlas-canvas')).toHaveCount(0)
  await explore(page)
  await expect(panel(page).locator('[data-project-id]')).toHaveCount(7)
  await panel(page).getByLabel('Projekte suchen', { exact: true }).fill('YJarvis')
  await panel(page).getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect(panel(page).locator('[data-project-id]')).toHaveCount(1)
  await panel(page).locator('[data-project-id="jarvis"]').click()
  await expect(page.getByTestId('observatory-dossier')).toContainText('Local v1')
  await expect(
    page.getByTestId('observatory-dossier').getByRole('link', { name: /Repository/ }),
  ).toHaveAttribute('href', /YJarvis/)
  await expect(page.locator('#atlas-projects article')).toHaveCount(7)
})

test('native Tab never focuses camera controls hidden behind the open explorer', async ({
  page,
}, info) => {
  const obscured: unknown[] = []
  for (const width of [390, 768]) {
    await open(page, width)
    await explore(page)
    let cameraControlsVisited = 0
    for (let step = 0; step < 24; step++) {
      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() => {
        const target = document.activeElement as HTMLElement | null
        if (!target?.closest('.atlas-v3__controls')) return null
        const rect = target.getBoundingClientRect()
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
        return {
          label: target.getAttribute('aria-label') ?? target.textContent,
          hit: hit?.closest('button')?.getAttribute('aria-label') ?? hit?.tagName,
          clear: hit === target || target.contains(hit),
        }
      })
      if (focused) {
        cameraControlsVisited++
        if (!focused.clear) obscured.push({ width, ...focused })
        if (cameraControlsVisited === 3) break
      }
    }
    if (width === 768) expect(cameraControlsVisited).toBeGreaterThan(0)
    await page.screenshot({ path: info.outputPath(`g2c-keyboard-panel-${width}.png`) })
    await page.getByRole('button', { name: 'Projekterkundung schließen' }).click()
    await expect(page.getByRole('button', { name: 'Hineinzoomen', exact: true })).toBeVisible()
  }
  expect(obscured, JSON.stringify(obscured, null, 2)).toEqual([])
})

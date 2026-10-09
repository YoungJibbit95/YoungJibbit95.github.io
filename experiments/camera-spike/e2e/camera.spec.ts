import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

type Pose = {
  position: number[]
  target: number[]
  fov: number
  zoom: number
}

async function pose(page: Page): Promise<Pose> {
  return JSON.parse(await page.getByTestId('camera-pose').innerText()) as Pose
}

async function stage(page: Page) {
  const canvas = page.getByTestId('camera-stage').locator('canvas')
  await expect(canvas).toBeVisible()
  return canvas
}

test('true pan, continuous dolly, focus and full-pose return', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop mouse-gesture test')
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  const canvas = await stage(page)
  const box = await canvas.boundingBox()
  expect(box).not.toBeNull()
  const before = await pose(page)

  await page.mouse.move(box!.x + box!.width * 0.52, box!.y + box!.height * 0.45)
  await page.mouse.down()
  await page.mouse.move(box!.x + box!.width * 0.7, box!.y + box!.height * 0.55, {
    steps: 14,
  })
  await page.mouse.up()

  await expect
    .poll(async () => JSON.stringify((await pose(page)).target))
    .not.toEqual(JSON.stringify(before.target))
  await canvas.hover()
  const afterPan = await pose(page)
  await page.mouse.wheel(0, -420)
  await expect
    .poll(async () => JSON.stringify((await pose(page)).position))
    .not.toEqual(JSON.stringify(afterPan.position))

  await page.getByRole('button', { name: /Kern Raumpunkt C/ }).click()
  // Compare Back with the actual CameraControls snapshot taken AT focus time,
  // never a stale UI coordinate emitted during an in-flight dolly.
  const explorerSnapshot = JSON.parse(
    (await page.getByTestId('saved-pose').textContent()) ?? 'null',
  ) as Pose
  expect(explorerSnapshot).not.toBeNull()
  expect(explorerSnapshot.position).not.toEqual(before.position)
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(8, 1)
  await page.screenshot({ path: testInfo.outputPath('g0-desktop-focused.png'), fullPage: true })

  await page.getByRole('button', { name: /Zurück/ }).click()
  // A target can arrive ahead of the damped position. Validate the complete
  // six-coordinate pose after the flight actually finishes, not mid-flight.
  await expect
    .poll(async () => {
      const restored = await pose(page)
      return Math.max(
        ...restored.position.map((value, axis) =>
          Math.abs(value - explorerSnapshot.position[axis]),
        ),
        ...restored.target.map((value, axis) => Math.abs(value - explorerSnapshot.target[axis])),
      )
    })
    .toBeLessThan(0.05)
  const restored = await pose(page)
  expect(restored.fov).toBe(explorerSnapshot.fov)
  expect(restored.zoom).toBe(explorerSnapshot.zoom)
  await expect(
    page.getByRole('button', { name: /Kern Raumpunkt C/ }),
  ).toHaveAttribute('aria-pressed', 'false')
  expect(errors).toEqual([])
})

test('a manual gesture interrupts a running camera flight', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop interruption test')
  await page.goto('/')
  const canvas = await stage(page)
  const box = await canvas.boundingBox()
  expect(box).not.toBeNull()
  await page.getByRole('button', { name: /Signal Raumpunkt A/ }).click()
  await page.mouse.move(box!.x + box!.width * 0.65, box!.y + box!.height * 0.5)
  await page.mouse.down()
  await page.mouse.move(box!.x + box!.width * 0.79, box!.y + box!.height * 0.57, {
    steps: 9,
  })
  await page.mouse.up()
  const afterGesture = await pose(page)
  await page.waitForTimeout(950)
  const final = await pose(page)
  expect(final.target[0]).not.toBeCloseTo(-8, 1)
  expect(Math.abs(final.target[0] - afterGesture.target[0])).toBeLessThan(0.15)
})

test('OS reduced motion preserves instant spatial navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await stage(page)
  await expect(page.getByLabel('Kamerafahrten reduzieren')).toBeChecked()
  await page.getByRole('button', { name: /Signal Raumpunkt A/ }).click()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(-8, 1)
  await page.getByRole('button', { name: 'Übersicht' }).click()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(0, 1)
})

test('WebGL2 failure keeps readable, keyboard-operable HTML', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
        if (kind === 'webgl2') return null
        return (original as (...parameters: unknown[]) => unknown).call(this, kind, ...args)
      },
    })
  })
  await page.goto('/')
  await expect(
    page.getByText('Die räumliche Ansicht ist nicht verfügbar.', { exact: false }),
  ).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Räumliche Ziele' })).toBeVisible()
  await page.getByRole('button', { name: /Signal Raumpunkt A/ }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: /Signal Raumpunkt A/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByRole('link', { name: /Projekte entdecken/ })).toHaveAttribute(
    'href',
    /github.com/,
  )
})

test('no-JS fallback includes a title and direct project link', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4174/')
  await expect(page.getByRole('heading', { name: /YoungJibbit95/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Projekte auf GitHub' })).toHaveAttribute(
    'href',
    /github.com/,
  )
  await context.close()
})

test('WCAG 2.1 A/AA audit has no serious or critical violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Räumliche Ziele' })).toBeVisible()
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  const major = result.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )
  expect(major, JSON.stringify(major, null, 2)).toEqual([])
})

test('mobile stage, large DOM targets and screenshot', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only viewport test')
  await page.goto('/')
  await stage(page)
  await expect(page.getByRole('button', { name: /Verbindung Raumpunkt B/ })).toBeVisible()
  await page.getByRole('button', { name: /Verbindung Raumpunkt B/ }).tap()
  await expect.poll(async () => (await pose(page)).target[1]).toBeCloseTo(-2, 1)
  await page.screenshot({ path: testInfo.outputPath('g0-mobile-focused.png'), fullPage: true })
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('keyboard pan and Escape restore the saved real camera pose', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop keyboard test')
  await page.goto('/')
  await stage(page)
  await expect(page.getByRole('button', { name: 'Übersicht' })).toBeEnabled()
  const before = await pose(page)
  await page
    .getByRole('region', { name: 'Dreidimensionalen Raum mit Pfeiltasten verschieben' })
    .focus()
  await page.keyboard.press('ArrowLeft')
  await expect.poll(async () => (await pose(page)).target[0]).not.toBeCloseTo(before.target[0], 1)
  await page.getByRole('button', { name: /Kern Raumpunkt C/ }).click()
  const snapshot = JSON.parse(
    (await page.getByTestId('saved-pose').textContent()) ?? 'null',
  ) as Pose
  expect(snapshot).not.toBeNull()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(8, 1)
  await page.keyboard.press('Escape')
  await expect
    .poll(async () => {
      const actual = await pose(page)
      return Math.max(
        ...actual.position.map((value, axis) => Math.abs(value - snapshot.position[axis])),
        ...actual.target.map((value, axis) => Math.abs(value - snapshot.target[axis])),
      )
    })
    .toBeLessThan(0.05)
})

test('two-finger touch pinch changes actual 3D camera distance', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Emulated multi-touch mobile test')
  await page.goto('/')
  const canvas = await stage(page)
  await expect(page.getByRole('button', { name: 'Übersicht' })).toBeEnabled()
  await canvas.scrollIntoViewIfNeeded()
  const scrollBeforePinch = await page.evaluate(() => window.scrollY)
  const before = await pose(page)
  const bounds = await canvas.boundingBox()
  expect(bounds).not.toBeNull()
  const cx = bounds!.x + bounds!.width * 0.5
  const cy = bounds!.y + bounds!.height * 0.48
  const client = await page.context().newCDPSession(page)
  const pair = (distance: number) => [
    { x: cx - distance, y: cy, id: 1 },
    { x: cx + distance, y: cy, id: 2 },
  ]
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pair(35) })
  for (const spread of [45, 65, 85, 110]) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pair(spread) })
    await page.waitForTimeout(50)
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  const length = (p: Pose) => Math.hypot(...p.position.map((value, axis) => value - p.target[axis]))
  await expect
    .poll(async () => Math.abs(length(await pose(page)) - length(before)))
    .toBeGreaterThan(0.25)
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollBeforePinch)).toBeLessThan(3)
  const afterPinch = await pose(page)
  const scrollBeforeTruck = await page.evaluate(() => window.scrollY)
  const truck = (shift: number) => pair(40).map((finger) => ({ ...finger, x: finger.x + shift }))
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: truck(0),
  })
  for (const offset of [8, 16, 24, 32, 40]) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: truck(offset),
    })
    await page.waitForTimeout(45)
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect
    .poll(async () => {
      const after = await pose(page)
      return Math.max(
        ...after.target.map((value, axis) => Math.abs(value - afterPinch.target[axis])),
      )
    })
    .toBeGreaterThan(0.1)
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollBeforeTruck)).toBeLessThan(3)
  await client.detach()
})

test('right mouse orbit changes azimuth while retaining the target', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Right mouse button requires a desktop')
  await page.goto('/')
  const canvas = await stage(page)
  // The canvas starts partly below the fold at 720px; move it inside the viewport first.
  await canvas.scrollIntoViewIfNeeded()
  const bounds = await canvas.boundingBox()
  expect(bounds).not.toBeNull()
  const before = await pose(page)
  const x = bounds!.x + bounds!.width / 2
  const y = bounds!.y + bounds!.height / 2
  const azimuth = (value: Pose) =>
    Math.atan2(value.position[0] - value.target[0], value.position[2] - value.target[2])
  await page.mouse.move(x, y)
  await page.mouse.down({ button: 'right' })
  await page.mouse.move(x + 145, y + 55, { steps: 16 })
  await page.mouse.up({ button: 'right' })
  await expect
    .poll(async () => Math.abs(azimuth(await pose(page)) - azimuth(before)))
    .toBeGreaterThan(0.08)
  const after = await pose(page)
  expect(
    Math.max(...after.target.map((value, axis) => Math.abs(value - before.target[axis]))),
  ).toBeLessThan(0.2)
})

test('Back restores saved selection and complete pose', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop selection-history regression')
  await page.goto('/')
  await stage(page)
  await page.getByRole('button', { name: /Signal Raumpunkt A/ }).click()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(-8, 1)
  await page.getByRole('button', { name: /Kern Raumpunkt C/ }).click()
  const saved = JSON.parse((await page.getByTestId('saved-pose').textContent()) ?? 'null') as Pose
  expect(saved).not.toBeNull()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(8, 1)
  await page.getByRole('button', { name: /Zurück/ }).click()
  await expect
    .poll(async () => {
      const after = await pose(page)
      return Math.max(
        ...after.position.map((value, axis) => Math.abs(value - saved.position[axis])),
        ...after.target.map((value, axis) => Math.abs(value - saved.target[axis])),
      )
    })
    .toBeLessThan(0.05)
  const restored = await pose(page)
  expect(restored.fov).toBe(saved.fov)
  expect(restored.zoom).toBe(saved.zoom)
  await expect(
    page.getByRole('button', { name: /Signal Raumpunkt A/ }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('button', { name: /Kern Raumpunkt C/ }),
  ).toHaveAttribute('aria-pressed', 'false')
})

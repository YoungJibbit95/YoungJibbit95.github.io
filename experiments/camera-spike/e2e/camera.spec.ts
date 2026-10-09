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

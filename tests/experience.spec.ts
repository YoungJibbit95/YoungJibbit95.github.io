import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type Pose = {
  position: number[]
  target: number[]
  fov: number
  zoom: number
}

async function pose(page: Page): Promise<Pose> {
  return JSON.parse((await page.getByTestId('atlas-pose').textContent()) ?? '{}') as Pose
}

async function canvas(page: Page) {
  const actual = page.getByTestId('atlas-canvas').locator('canvas')
  await expect(actual).toBeVisible({ timeout: 20_000 })
  return actual
}

test.describe.configure({ timeout: 90_000 })

test('two worlds share exactly one R3F canvas across navigation', async ({ page }) => {
  await page.goto('/?atlas=preview')
  await canvas(page)
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Ursprung')
  await page.getByRole('button', { name: 'Sternwarte', exact: true }).click()
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Sternwarte')
  await expect(page.getByTestId('atlas-canvas').locator('canvas')).toHaveCount(1)
  await page.getByRole('button', { name: 'Ursprung', exact: true }).click()
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Ursprung')
  await expect(page.getByTestId('atlas-canvas').locator('canvas')).toHaveCount(1)
})

test('deep link, browser back and forward restore world and focus', async ({ page }) => {
  await page.goto('/?atlas=preview&world=observatory&focus=nexus')
  await canvas(page)
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Sternwarte')
  await expect(page.getByRole('button', { name: /Nexus Workspaces/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: /Cerebri Planung/ }).click()
  await expect(page).toHaveURL(/focus=cerebri/)
  await expect(page.getByRole('button', { name: /Cerebri Planung/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.goBack()
  await expect(page).toHaveURL(/focus=nexus/)
  await expect(page.getByRole('button', { name: /Nexus Workspaces/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.goForward()
  await expect(page).toHaveURL(/focus=cerebri/)
  await expect(page.getByRole('button', { name: /Cerebri Planung/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('cross-world Back returns to the actual previous camera pose', async ({ page }) => {
  await page.goto('/?atlas=preview')
  const stage = await canvas(page)
  await stage.scrollIntoViewIfNeeded()
  const bounds = await stage.boundingBox()
  expect(bounds).not.toBeNull()
  const x = bounds!.x + bounds!.width * 0.5
  const y = bounds!.y + bounds!.height * 0.5
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 110, y + 38, { steps: 12 })
  await page.mouse.up()
  await expect.poll(async () => (await pose(page)).target[0]).not.toBeCloseTo(0, 1)
  const earlier = await pose(page)
  await page.getByRole('button', { name: 'Sternwarte', exact: true }).click()
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Sternwarte')
  await page.getByRole('button', { name: /Nexus Workspaces/ }).click()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(-10, 1)
  await page.getByRole('button', { name: /Zurück/ }).click()
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Sternwarte')
  await page.getByRole('button', { name: /Zurück/ }).click()
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Ursprung')
  await expect
    .poll(async () => {
      const current = await pose(page)
      const position = current.position.map((value, i) => Math.abs(value - earlier.position[i]))
      const target = current.target.map((value, i) => Math.abs(value - earlier.target[i]))
      return Math.max(...position, ...target)
    })
    .toBeLessThan(0.05)
})

test('rapid focus changes are interruptible and settle on the latest destination', async ({
  page,
}) => {
  await page.goto('/?atlas=preview')
  await canvas(page)
  await page.getByRole('button', { name: /Das Signal Neugier/ }).click()
  await page.getByRole('button', { name: /Der Horizont Entdeckung/ }).click()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(10, 1)
  await expect(page.getByRole('button', { name: /Der Horizont Entdeckung/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByTestId('atlas-transition')).toHaveText('focused')
})

test('active canvas wheel zoom does not scroll the document', async ({ page }) => {
  await page.goto('/?atlas=preview')
  const stage = await canvas(page)
  await stage.scrollIntoViewIfNeeded()
  const start = await pose(page)
  const scroll = await page.evaluate(() => window.scrollY)
  await stage.hover()
  await page.mouse.wheel(0, -390)
  await expect
    .poll(async () => {
      const current = await pose(page)
      return Math.hypot(...current.position.map((v, i) => v - current.target[i]))
    })
    .not.toBeCloseTo(Math.hypot(...start.position.map((v, i) => v - start.target[i])), 1)
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - scroll)).toBeLessThan(3)
})

test('system reduced motion, keyboard and forced WebGL fallback keep content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?atlas=preview')
  await canvas(page)
  await expect(page.getByLabel('Kamerafahrten reduzieren')).toBeChecked()
  await page.getByRole('button', { name: /Die Verbindung Zusammenhang/ }).click()
  await expect(page.getByTestId('atlas-motion')).toHaveText('reduced')
  await expect(page.getByRole('button', { name: /Die Verbindung Zusammenhang/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByTestId('atlas-stage').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('link', { name: /Projekt auf GitHub/ }).first()).toBeVisible()
})

test('WebGL2 disabled still provides a usable world choice and seven project links', async ({
  page,
}) => {
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
  await page.goto('/?atlas=preview')
  await expect(page.getByTestId('atlas-experience')).toBeVisible({ timeout: 20_000 })
  await expect(
    page
      .getByRole('region', { name: 'Räumlicher Atlas, mit Pfeiltasten verschiebbar' })
      .getByRole('status'),
  ).toContainText('Die Projekte sind auch ohne', { timeout: 20_000 })
  await expect(page.getByTestId('atlas-canvas')).toHaveCount(0)
  await page.getByRole('button', { name: 'Sternwarte', exact: true }).click()
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Sternwarte')
  await expect(page.locator('#atlas-projects article')).toHaveCount(7)
})

test('preview is opt-in and original no-JavaScript HTML remains intact', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/?atlas=preview')
  await expect(
    page.getByRole('heading', { name: 'YoungJibbit95. Ich baue, um zu verstehen.' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Nexus Ecosystem', exact: true })).toBeVisible()
  await context.close()
})

test('mobile and desktop preview compositions are screenshot-reviewed', async ({ page }, info) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await page.goto('/?atlas=preview')
    await canvas(page)
    await page.getByRole('button', { name: 'Sternwarte', exact: true }).click()
    await expect(page.getByTestId('atlas-world-title')).toHaveText('Sternwarte')
    await page.evaluate(() => document.fonts.ready)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(overflow).toBe(false)
    await page.screenshot({
      path: info.outputPath('g1-' + width + '.png'),
      fullPage: true,
    })
  }
})

test('preview passes WCAG 2.1 A/AA severe accessibility checks', async ({ page }) => {
  await page.goto('/?atlas=preview')
  await expect(page.getByRole('navigation', { name: 'Orte im Raum' })).toBeVisible({
    timeout: 20_000,
  })
  const findings = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  const severe = findings.violations.filter(
    (item) => item.impact === 'serious' || item.impact === 'critical',
  )
  expect(severe, JSON.stringify(severe, null, 2)).toEqual([])
})

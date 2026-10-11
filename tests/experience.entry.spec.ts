import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe.configure({ timeout: 90_000 })

for (const width of [390, 1440]) {
  test(`standalone entry hydrates and preserves camera history at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/atlas/')
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin', { timeout: 30_000 })
    const canvas = page.getByTestId('atlas-canvas').locator('canvas')
    await canvas.evaluate((element) => {
      element.dataset.entryIdentity = 'same'
    })
    const before = await page.getByTestId('atlas-pose').textContent()
    await page.getByTestId('atlas-stage').focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByTestId('atlas-pose')).not.toHaveText(before!)
    const moved = await page.getByTestId('atlas-pose').textContent()
    await page.getByRole('link', { name: 'Sternwarte', exact: true }).click()
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
    expect(new URL(page.url()).pathname).toBe('/atlas/observatory/')
    await expect(canvas).toHaveAttribute('data-entry-identity', 'same')
    await page.goBack()
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin')
    await expect(page.getByTestId('atlas-pose')).toHaveText(moved!)
    expect(errors).toEqual([])
  })
}

test('standalone static HTML has seven real project links without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await page.goto('/atlas/observatory/?focus=nexus')
    await expect(page.getByText(/Die räumliche Ansicht benötigt JavaScript/)).toBeVisible()
    await expect(page.locator('#atlas-projects article')).toHaveCount(7)
    await expect(page.getByRole('link', { name: 'Projekt auf GitHub' })).toHaveCount(7)
    await expect(page.getByRole('heading', { name: 'Nexus Ecosystem', exact: true })).toBeVisible()
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Sternwarte', exact: true })).toHaveAttribute(
      'href',
      /^\/atlas\/observatory\/\?/,
    )
  } finally {
    await context.close()
  }
})

test('standalone native project URLs retain path and filtered deep link on reload', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/atlas/observatory/?focus=nexus&q=Nexus')
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
  const project = page
    .getByRole('navigation', { name: 'Gefundene Projekte' })
    .locator('[data-project-id="nexus"]')
  const href = await project.getAttribute('href')
  const target = new URL(href!, page.url())
  expect(target.pathname).toBe('/atlas/observatory/')
  expect(target.searchParams.get('focus')).toBe('nexus')
  expect(target.searchParams.get('q')).toBe('Nexus')
  // A fresh native navigation exercises the SSR/hydration path, unlike an onClick update.
  await page.goto(target.href)
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
  await expect(project).toHaveAttribute('aria-current', 'location')
  const findings = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(
    findings.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical'),
  ).toEqual([])
})

test('standalone unavailable WebGL retains navigation and source content', async ({ page }) => {
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
  await page.goto('/atlas/observatory/')
  await expect(
    page.getByText('Direkte Links zu den Repositories bleiben jederzeit zugänglich.'),
  ).toBeVisible()
  await expect(page.locator('#atlas-projects article')).toHaveCount(7)
  await expect(page.locator('canvas')).toHaveCount(0)
  await page.getByRole('link', { name: 'Ursprung', exact: true }).click()
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Ursprung')
  expect(new URL(page.url()).pathname).toBe('/atlas/')
})

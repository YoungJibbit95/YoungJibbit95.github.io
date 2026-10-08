import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('production HTML contains the portfolio without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Aus Neugier wird Software.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Nexus Ecosystem', exact: true })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Systeme im Kopf. Natur im Blick.' }),
  ).toBeVisible()
  await expect(page.getByText('Wenn es nach mir ginge', { exact: false })).toBeVisible()
  await context.close()
})

test('project selection updates both entry point and project details', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('button', { name: 'Cerebri Nachvollziehbare Planung', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Nexus Cerebri', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cerebri', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'YJarvis', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'YJarvis', exact: true })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'YJarvis Lokale Assistenz', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  expect(errors).toEqual([])
})

test('mobile menu supports keyboard dismissal and anchor navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Menü öffnen' })
  await trigger.click()
  await expect(page.getByRole('button', { name: 'Menü schließen' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await trigger.click()
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Über mich' }).click()
  await expect(page).toHaveURL(/#mensch$/)
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('system reduced motion and explicit opt-out remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'reduced')
  await page.getByRole('button', { name: 'Cerebri', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Nexus Cerebri', exact: true })).toBeVisible()
  await page.getByLabel('Bewegung').selectOption('off')
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'off')
  await page.reload()
  await expect(page.getByLabel('Bewegung')).toHaveValue('off')
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'off')
})

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`layout fits a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.getByLabel('Bewegung').selectOption('off')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    const overlappingNodes = await page.locator('.orbit-node').evaluateAll((nodes) => {
      const rectangles = nodes.map((node) => node.getBoundingClientRect())
      return rectangles.some((a, i) =>
        rectangles.some(
          (b, j) =>
            j > i && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top,
        ),
      )
    })
    expect(overlappingNodes).toBe(false)
    await expect(
      page.getByRole('button', { name: 'Nexus Verbundene Workspaces', exact: true }),
    ).toBeVisible()
    if (width === 1440 || width === 390) {
      await page.getByRole('link', { name: 'YoungJibbit95 – zum Anfang', exact: true }).click()
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({
        path: `.verification/release-0.1-${width === 1440 ? 'desktop' : 'mobile'}.png`,
      })
    }
  })
}

test('the rendered page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Bewegung').selectOption('off')
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(result.violations).toEqual([])
})

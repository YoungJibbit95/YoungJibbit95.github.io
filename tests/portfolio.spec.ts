import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function staticMode(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByLabel('Bewegung').selectOption('off')
}

test('the main stories and stack remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  for (const name of ['YoungJibbit95', 'Nexus.', 'Cerebri.', 'Mein Stack.', 'So arbeite ich.'])
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
  await expect(
    page.getByText('Webentwicklung, UI-Experimenten', { exact: false }).first(),
  ).toBeVisible()
  await context.close()
})

test('the personal journey can be explored with the keyboard', async ({ page }) => {
  await staticMode(page)
  const planet = page.getByRole('button', { name: 'Cerebri', exact: true })
  await planet.focus()
  await page.keyboard.press('Enter')
  await expect(planet).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.journey-summary')).toContainText('Planungsoberflächen')
  await expect(page.locator('.journey-summary a')).toHaveAttribute('href', '#cerebri')
  await page.getByRole('button', { name: 'Engines & Spiele', exact: true }).click()
  await expect(page.locator('.journey-summary')).toContainText('NovaCore')
})

test('Nexus switches between real captures and the shared-client explanation', async ({ page }) => {
  await staticMode(page)
  await page.getByRole('button', { name: 'Gemeinsamer Kern', exact: true }).click()
  await expect(page.locator('.system-core')).toContainText('@nexus/core')
  await expect(page.locator('.system-client')).toHaveCount(4)
  await page.getByRole('button', { name: 'Workspace', exact: true }).click()
  await page.locator('.nexus-main-shot').scrollIntoViewIfNeeded()
  await expect
    .poll(() =>
      page
        .locator('.nexus-main-shot img')
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0)
  await expect(page.locator('.nexus-plate figcaption')).toContainText('v6 Beta')
})

test('the planning illustration moves a conflicting candidate into free time', async ({ page }) => {
  await staticMode(page)
  await page.getByRole('button', { name: 'Konflikt', exact: true }).click()
  const busyEnd = await page
    .locator('.busy-slot')
    .evaluate((el) => Number(el.getAttribute('x')) + Number(el.getAttribute('width')))
  expect(
    await page.locator('.candidate-slot').evaluate((el) => Number(el.getAttribute('x'))),
  ).toBeLessThan(busyEnd)
  await expect(page.locator('.cerebri-plate figcaption')).toContainText('überschneiden')
  await page.getByRole('button', { name: 'Vorschlag', exact: true }).click()
  await expect
    .poll(() => page.locator('.candidate-slot').evaluate((el) => Number(el.getAttribute('x'))))
    .toBeGreaterThanOrEqual(busyEnd)
  const hourWidth = await page
    .locator('.time-labels text')
    .evaluateAll((nodes) => Number(nodes[1].getAttribute('x')) - Number(nodes[0].getAttribute('x')))
  expect(
    await page.locator('.candidate-slot').evaluate((el) => Number(el.getAttribute('width'))),
  ).toBe(hourWidth / 2)
  await expect(page.locator('.cerebri-plate figcaption')).toContainText('30-minütigen')
})

test('mobile navigation supports anchors and keyboard dismissal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Menü öffnen' })
  await toggle.click()
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await page
    .locator('#mobile-navigation')
    .getByRole('link', { name: 'Cerebri', exact: true })
    .click()
  await expect(page).toHaveURL(/#cerebri$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('reduced motion and persistent opt-out keep every layer visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'reduced')
  await page.getByRole('button', { name: 'Vorschlag', exact: true }).click()
  await page.getByLabel('Bewegung').selectOption('off')
  await page.reload()
  await expect(page.getByLabel('Bewegung')).toHaveValue('off')
  for (const panel of await page.locator('.layer-panel').all())
    await expect(panel).toHaveCSS('visibility', 'visible')
})

for (const width of [320, 390, 768, 1024, 1440])
  test(`atlas layouts fit ${width}px without overlapping the runtime explanation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await staticMode(page)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const titleRight = await page
      .locator('h1>span')
      .evaluate((el) => el.getBoundingClientRect().right)
    expect(titleRight).toBeLessThanOrEqual(width)
    await page.getByRole('button', { name: 'Gemeinsamer Kern', exact: true }).click()
    const overlaps = await page.locator('.system-client,.system-core').evaluateAll((nodes) => {
      const boxes = nodes.map((node) => node.getBoundingClientRect())
      return boxes.some((a, i) =>
        boxes.some(
          (b, j) =>
            j > i && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top,
        ),
      )
    })
    expect(overlaps).toBe(false)
    if (width === 390 || width === 1440) {
      await page.getByRole('link', { name: 'YoungJibbit95 – zum Anfang', exact: true }).click()
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({
        path: `.verification/release-0.3-${width === 1440 ? 'desktop' : 'mobile'}.png`,
      })
    }
  })

test('the atlas and interactive explanations pass accessibility checks', async ({ page }) => {
  await staticMode(page)
  await page.getByRole('button', { name: 'Gemeinsamer Kern', exact: true }).click()
  await page.getByRole('button', { name: 'Vorschlag', exact: true }).click()
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(result.violations).toEqual([])
})

test('disabling motion during a layer transition restores readable content', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'full')
  await page
    .getByRole('navigation', { name: 'Hauptnavigation' })
    .getByRole('link', { name: 'Cerebri', exact: true })
    .click()
  await page.getByLabel('Bewegung').selectOption('off')
  for (const panel of await page.locator('.layer-panel').all())
    await expect(panel).toHaveCSS('visibility', 'visible')
  expect(errors).toEqual([])
})

test('the atlas index follows navigation and GitHub links remain direct', async ({ page }) => {
  await staticMode(page)
  const navigation = page.getByRole('navigation', { name: 'Atlas-Ebenen' })
  await navigation.getByRole('link', { name: 'Stack', exact: true }).click()
  await expect(navigation.getByRole('link', { name: 'Stack', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(
    page.getByRole('link', { name: 'YoungJibbit95 auf GitHub', exact: false }),
  ).toHaveAttribute('href', 'https://github.com/YoungJibbit95')
})

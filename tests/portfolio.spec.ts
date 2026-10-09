import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('production HTML contains the portfolio without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'YoungJibbit95. Ich baue, um zu verstehen.' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Nexus Ecosystem', exact: true })).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Systeme im Kopf. Natur im Blick.' }),
  ).toBeVisible()
  await expect(
    page.locator('blockquote').filter({ hasText: 'Wenn es nach mir ginge' }).first(),
  ).toBeVisible()
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
        path: `.verification/release-0.2-${width === 1440 ? 'desktop' : 'mobile'}.png`,
      })
    }
    await page
      .getByRole('group', { name: 'Kapitel der Nexus-Geschichte' })
      .getByRole('button', { name: /Gemeinsamer Kern/ })
      .click()
    const overlappingRuntimeNodes = await page
      .locator('.story-system .client, .story-system .runtime-core')
      .evaluateAll((nodes) => {
        const rectangles = nodes.map((node) => node.getBoundingClientRect())
        return rectangles.some((a, i) =>
          rectangles.some(
            (b, j) =>
              j > i && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top,
          ),
        )
      })
    expect(overlappingRuntimeNodes).toBe(false)
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

test('chapter transitions settle and can be interrupted by disabling motion', async ({ page }) => {
  await page.goto('/#nexus-geschichte')
  await page.locator('.nexus-story .story-body').scrollIntoViewIfNeeded()
  await page
    .getByRole('group', { name: 'Kapitel der Nexus-Geschichte' })
    .getByRole('button', { name: /Zusammenhang/ })
    .click()
  await page.locator('.nexus-story .story-body').scrollIntoViewIfNeeded()
  await expect(page.locator('.story-media')).toHaveCSS('opacity', '1')
  await expect(page.locator('.context-node').first()).toHaveCSS('opacity', '1')
  await page
    .getByRole('group', { name: 'Kapitel der Nexus-Geschichte' })
    .getByRole('button', { name: /Gemeinsamer Kern/ })
    .click()
  await page.getByLabel('Bewegung').selectOption('off')
  await expect(page.locator('.story-media')).toHaveCSS('opacity', '1')
  await expect(page.locator('.story-system .client').first()).toHaveCSS('opacity', '1')
  await expect(
    page.getByRole('heading', { name: 'Die Oberfläche braucht eine gemeinsame Grundlage.' }),
  ).toBeVisible()
})

test('Nexus chapters show real captures and explain the shared core', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Bewegung').selectOption('off')
  await page.getByRole('link', { name: 'Die Geschichte dahinter' }).click()
  await expect(page.getByRole('heading', { name: 'Ein Gedanke braucht einen Ort.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Vorheriges Nexus-Kapitel' })).toBeDisabled()
  await expect(page.locator('.story-media img')).toHaveJSProperty('complete', true)
  expect(
    await page
      .locator('.story-media img')
      .evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0)
  await page
    .getByRole('group', { name: 'Kapitel der Nexus-Geschichte' })
    .getByRole('button', { name: /Zusammenhang/ })
    .click()
  await expect(page.locator('.story-media img')).toHaveAttribute(
    'src',
    '/media/nexus/dashboard.png',
  )
  await expect(
    page.getByRole('heading', { name: 'Aus einzelnen Teilen wird ein Arbeitsraum.' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Nächstes Nexus-Kapitel' }).click()
  await expect(
    page.getByRole('heading', { name: 'Die Oberfläche braucht eine gemeinsame Grundlage.' }),
  ).toBeVisible()
  await expect(page.locator('.story-system')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Nächstes Nexus-Kapitel' })).toBeDisabled()
  await page.getByRole('button', { name: 'Vorheriges Nexus-Kapitel' }).click()
  await expect(
    page
      .getByRole('group', { name: 'Kapitel der Nexus-Geschichte' })
      .getByRole('button', { name: /Zusammenhang/ }),
  ).toHaveAttribute('aria-pressed', 'true')
})

test('Nexus chapter selection works with the keyboard and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#nexus-geschichte')
  const chapter = page
    .getByRole('group', { name: 'Kapitel der Nexus-Geschichte' })
    .getByRole('button', { name: /Gemeinsamer Kern/ })
  await chapter.focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'Die Oberfläche braucht eine gemeinsame Grundlage.' }),
  ).toBeVisible()
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'reduced')
  expect(
    await page
      .locator('.story-media')
      .evaluate((element) => (element as HTMLElement).style.transform),
  ).toBe('')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(result.violations).toEqual([])
})

import AxeBuilder from '@axe-core/playwright'

test('cosmic static entry reserves overlays until the query variant hydrates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  let release!: () => void
  const scripts = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/*.js', async (route) => {
    await scripts
    await route.continue()
  })
  try {
    await page.goto('/atlas/observatory/?cosmos=preview', { waitUntil: 'commit' })
    await expect(page.locator('#atlas-projects article')).toHaveCount(7)
    await expect(page.locator('.atlas-v3__intro')).toBeHidden()
    await expect(page.getByRole('group', { name: 'Kamera und Verlauf' })).toBeHidden()
    await expect(page.getByTestId('observatory-explorer')).toBeHidden()
  } finally {
    release()
  }
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  await expect(page.getByRole('heading', { name: 'Sieben Systeme. Ein Universum.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Nexus erkunden', exact: true })).toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-cosmos-pending')
})
import { expect, test, type Locator } from '@playwright/test'

async function touchTarget(locator: Locator) {
  const rectangle = await locator.boundingBox()
  expect(rectangle, 'The touch target must be visible').not.toBeNull()
  expect(rectangle!.width).toBeGreaterThanOrEqual(44)
  expect(rectangle!.height).toBeGreaterThanOrEqual(44)
  return rectangle!
}

for (const viewport of [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
]) {
  test(`cosmic compact controls and readable dossier at ${viewport.width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/atlas/observatory/?cosmos=preview')
    await expect(page.getByTestId('atlas-experience')).toHaveAttribute('data-cosmos', 'preview')
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', {
      timeout: 30_000,
    })
    await expect(page.getByTestId('atlas-transition')).toHaveText('idle')
    await page.evaluate(() => document.fonts.ready)

    const explorer = page.getByTestId('observatory-explorer')
    const trigger = page.getByRole('button', { name: 'Projekte erkunden', exact: true })
    const controls = page.getByRole('group', { name: 'Kamera und Verlauf' })
    const panel = page.locator('#observatory-explorer-panel')
    await expect(panel).toHaveCount(0)
    await expect(explorer.getByRole('button')).toHaveCount(2)
    await expect(page.getByRole('button', { name: 'Alle einrahmen', exact: true })).toHaveCount(0)

    const targets = []
    for (const button of [
      ...(await explorer.getByRole('button').all()),
      ...(await controls.getByRole('button').all()),
    ]) {
      const target = await touchTarget(button)
      expect(target.x).toBeGreaterThanOrEqual(0)
      expect(target.x + target.width).toBeLessThanOrEqual(viewport.width)
      expect(target.y + target.height).toBeLessThanOrEqual(viewport.height)
      targets.push(target)
    }
    for (let a = 0; a < targets.length; a++) {
      for (let b = a + 1; b < targets.length; b++) {
        const first = targets[a]
        const second = targets[b]
        expect(
          first.x < second.x + second.width &&
            first.x + first.width > second.x &&
            first.y < second.y + second.height &&
            first.y + first.height > second.y,
          'Distinct controls must not cover each other',
        ).toBe(false)
      }
    }
    const dockHeight = viewport.height - Math.min(...targets.map((target) => target.y))
    expect(
      dockHeight,
      'Two compact rows should leave the central universe open',
    ).toBeLessThanOrEqual(116)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    await page.screenshot({ path: info.outputPath(`cosmos-ui-${viewport.width}.png`) })

    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(
      panel.getByRole('heading', { name: 'Projektsternwarte', exact: true }),
    ).toBeFocused()
    await expect(controls).toBeHidden()
    const panelBounds = (await panel.boundingBox())!
    expect(panelBounds.y).toBeGreaterThanOrEqual(68)
    expect(panelBounds.y + panelBounds.height).toBeLessThanOrEqual(viewport.height)
    await touchTarget(panel.getByRole('button', { name: 'Projekterkundung schließen' }))
    await touchTarget(panel.getByRole('button', { name: 'Alle einrahmen', exact: true }))
    await touchTarget(panel.getByRole('link', { name: 'Projektliste als Text' }))

    await panel.locator('[data-project-id="nexus"]').click()
    await expect(page.getByTestId('atlas-transition')).toHaveText('focused')
    const dossier = page.getByTestId('observatory-dossier')
    const dossierHeading = dossier.getByRole('heading', { name: 'Nexus Ecosystem', exact: true })
    await expect(dossierHeading).toBeFocused()
    await expect(dossierHeading).toBeInViewport({ ratio: 1 })
    await expect(dossier).toContainText(
      'Nexus Main, Nexus Mobile, Nexus Code und Nexus Code Mobile',
    )
    await expect(dossier.getByRole('link', { name: /Repository/ })).toHaveAttribute(
      'href',
      /github\.com/,
    )
    expect(
      await dossier.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    ).toBeGreaterThanOrEqual(14)
    await page.screenshot({ path: info.outputPath(`cosmos-dossier-${viewport.width}.png`) })

    // A nonmodal sheet keeps normal Tab order. Scrolled content must reveal
    // itself on focus, while the covered camera controls remain unreachable.
    for (let step = 0; step < 10; step++) {
      await page.keyboard.press('Tab')
      const active = await page.evaluate(() => {
        const element = document.activeElement as HTMLElement
        const bounds = element.getBoundingClientRect()
        const hit = document.elementFromPoint(
          bounds.x + bounds.width / 2,
          bounds.y + bounds.height / 2,
        )
        return {
          inCamera: Boolean(element.closest('.atlas-v3__controls')),
          visibility: getComputedStyle(element).visibility,
          withinViewport:
            bounds.x >= 0 &&
            bounds.y >= 0 &&
            bounds.right <= innerWidth &&
            bounds.bottom <= innerHeight,
          hit: hit === element || element.contains(hit),
        }
      })
      expect(active).toEqual({
        inCamera: false,
        visibility: 'visible',
        withinViewport: true,
        hit: true,
      })
    }
    if (viewport.width === 390) {
      const accessibility = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      expect(
        accessibility.violations.filter(
          (violation) => violation.impact === 'serious' || violation.impact === 'critical',
        ),
      ).toEqual([])
    }
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(panel).toHaveCount(0)
    await expect(controls).toBeVisible()

    await trigger.click()
    await panel.getByRole('link', { name: 'Projektliste als Text' }).click()
    await expect(page).toHaveURL(/cosmos=preview.*#atlas-projects/)
    await expect(page.locator('#atlas-projects')).toBeInViewport()
    await expect(page.locator('#atlas-projects article')).toHaveCount(7)
    await expect(panel).toHaveCount(0)
    await info.attach('mobile-ui-bounds.json', {
      body: JSON.stringify({ viewport, targets, dockHeight, panelBounds }, null, 2),
      contentType: 'application/json',
    })
  })
}

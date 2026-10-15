import { expect, test, type Page } from '@playwright/test'

test.describe.configure({ timeout: 60_000 })

const clients = [
  ['main', 'Nexus Main', 'Workspace · Desktop'],
  ['mobile', 'Nexus Mobile', 'Workspace · Mobil'],
  ['code', 'Nexus Code', 'Code-Editor · Desktop'],
  ['code-mobile', 'Nexus Code Mobile', 'Code-Editor · Mobil'],
] as const

type Rectangle = { x: number; y: number; width: number; height: number }
type Label = Rectangle & { id: string; nameFontSize: number; roleFontSize: number }
const sampleNexus = (page: Page): Promise<{ labels: Label[]; detailVisible: boolean }> =>
  page.getByTestId('atlas-renderer-info').evaluate((element) => {
    element.dispatchEvent(new Event('atlas:sample-renderer'))
    return JSON.parse(element.textContent!).discovery
  })
const overlaps = (a: Rectangle, b: Rectangle) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

async function checkNexusLabels(page: Page) {
  await expect.poll(async () => (await sampleNexus(page)).labels.length).toBe(5)
  const sample = await sampleNexus(page)
  expect(sample.detailVisible).toBe(true)
  expect(sample.labels.map((label) => label.id).sort()).toEqual([
    'code',
    'code-mobile',
    'core',
    'main',
    'mobile',
  ])
  const canvas = (await page.getByTestId('atlas-canvas').locator('canvas').boundingBox())!
  const obstacles = await page.locator('[data-cosmos-occluder]:visible').evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    }),
  )
  for (const label of sample.labels) {
    expect(label.height, `${label.id} actual glyph height`).toBeGreaterThanOrEqual(14)
    expect(label.nameFontSize, `${label.id} projected name font size`).toBeGreaterThanOrEqual(14)
    expect(label.roleFontSize, `${label.id} projected role font size`).toBeGreaterThanOrEqual(14)
    expect(label.x, label.id).toBeGreaterThanOrEqual(8)
    expect(label.y, label.id).toBeGreaterThanOrEqual(8)
    expect(label.x + label.width, label.id).toBeLessThanOrEqual(canvas.width - 8)
    expect(label.y + label.height, label.id).toBeLessThanOrEqual(canvas.height - 8)
    for (const other of sample.labels.filter((other) => other.id !== label.id))
      expect(overlaps(label, other), `${label.id} must not overlap ${other.id}`).toBe(false)
    for (const obstacle of obstacles)
      expect(
        overlaps(label, { ...obstacle, x: obstacle.x - canvas.x, y: obstacle.y - canvas.y }),
        `${label.id} must not sit behind a control or heading`,
      ).toBe(false)
  }
  return sample.labels
}

async function openNexusDossier(page: Page) {
  const trigger = page.getByRole('button', { name: 'Projekte erkunden', exact: true })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const panel = page.getByRole('region', { name: 'Projektsternwarte', exact: true })
  await expect(panel.getByRole('heading', { name: 'Projektsternwarte' })).toBeFocused()
  await panel.locator('[data-project-id="nexus"]').click()
  const dossier = page.getByTestId('observatory-dossier')
  await expect(dossier.getByRole('heading', { name: 'Nexus Ecosystem' })).toBeFocused()
  return { trigger, panel, dossier }
}

for (const width of [1440, 390]) {
  test(`Nexus explains four distinct apps and their shared core at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/atlas/observatory/?cosmos=preview')
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', {
      timeout: 30_000,
    })
    const { trigger, panel, dossier } = await openNexusDossier(page)
    const system = dossier.getByRole('region', { name: 'Ein Stern, vier Apps' })
    await expect(system.locator('h4')).toHaveText('Ein Stern, vier Apps')
    await expect(system.locator('.cosmos-nexus-system__core strong')).toHaveText('@nexus/core')
    await expect(system.locator('.cosmos-nexus-system__core')).toContainText(
      'Gemeinsame Runtime für Darstellung, Bewegung und Client-Verträge',
    )
    await expect(system.locator('[data-nexus-client]')).toHaveCount(4)
    for (const [id, name, role] of clients) {
      const row = system.locator(`[data-nexus-client="${id}"]`)
      await expect(row.locator('dt')).toHaveText(name)
      await expect(row.locator('dd')).toHaveText(role)
      await row.scrollIntoViewIfNeeded()
      await expect(row).toBeInViewport({ ratio: 1 })
      const metrics = await row.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        return {
          left: bounds.left,
          right: bounds.right,
          overflows: element.scrollWidth > element.clientWidth,
          nameSize: parseFloat(getComputedStyle(element.querySelector('dt')!).fontSize),
          roleSize: parseFloat(getComputedStyle(element.querySelector('dd')!).fontSize),
        }
      })
      expect(metrics.left).toBeGreaterThanOrEqual(0)
      expect(metrics.right).toBeLessThanOrEqual(width)
      expect(metrics.overflows).toBe(false)
      expect(metrics.nameSize).toBeGreaterThanOrEqual(14)
      expect(metrics.roleSize).toBeGreaterThanOrEqual(14)
    }
    // The explanatory diagram adds no inert Tab stops or pretend app launchers.
    await expect(system.locator('button, a, input, [tabindex]')).toHaveCount(0)
    await expect(system).toContainText('fächern sich die App-Welten um den zentralen Stern auf')
    await page.screenshot({ path: info.outputPath(`nexus-dossier-${width}.png`) })

    await dossier.getByText('Quellen & Grenzen', { exact: true }).click()
    const evidence = dossier.locator('.observatory-evidence')
    await expect(evidence).toContainText('keinen Live-Datenfluss')
    await expect(evidence).toContainText('Cloud, Sync und KI-Angebote sind geplant')
    await expect(evidence.getByRole('link', { name: /Dokumentation/ })).toHaveAttribute(
      'href',
      'https://github.com/YoungJibbit95/Nexus-Ecosystem/blob/835cd116174981efe2f330b1083552091f52f808/README.md',
    )
    await expect(evidence).not.toContainText('räumlich getrennte Flügel')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    await page.keyboard.press('Escape')
    await expect(panel).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await page.getByRole('button', { name: 'Kern entdecken', exact: false }).click()
    await expect(page.getByTestId('atlas-transition')).toHaveText('focused')
    const labels = await checkNexusLabels(page)
    await info.attach('nexus-label-bounds.json', {
      body: JSON.stringify({ width, labels }, null, 2),
      contentType: 'application/json',
    })
  })
}

test('Nexus semantic explanation remains available without WebGL', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
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
  await page.goto('/atlas/observatory/?cosmos=preview')
  await expect(page.getByTestId('atlas-experience')).toHaveAttribute('data-cosmos', 'preview')
  await expect(page.getByTestId('atlas-canvas')).toHaveCount(0)
  const { dossier } = await openNexusDossier(page)
  const system = dossier.getByRole('region', { name: 'Ein Stern, vier Apps' })
  await expect(system).toContainText('@nexus/core')
  await expect(system.locator('dt')).toHaveText(clients.map(([, name]) => name))
  await expect(system.locator('dd')).toHaveText(clients.map(([, , role]) => role))
  await expect(page.locator('#atlas-projects article')).toHaveCount(7)
})

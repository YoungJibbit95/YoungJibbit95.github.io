import { expect, test, type Page } from '@playwright/test'

type Label = { id: string; x: number; y: number; width: number; height: number }
type Sample = { labels: Label[]; frame: number; geometries: number; textures: number }
const sample = (page: Page): Promise<Sample> =>
  page.getByTestId('atlas-renderer-info').evaluate((element) => {
    element.dispatchEvent(new Event('atlas:sample-renderer'))
    return JSON.parse(element.textContent!)
  })
const overlap = (a: Label, b: Omit<Label, 'id'>) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

async function checkLabels(page: Page) {
  const labels = (await sample(page)).labels
  const canvas = (await page.getByTestId('atlas-canvas').locator('canvas').boundingBox())!
  const obstacles = await page.locator('[data-cosmos-occluder]:visible').evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    }),
  )
  for (const label of labels) {
    expect(label.x, label.id).toBeGreaterThanOrEqual(11)
    expect(label.y, label.id).toBeGreaterThanOrEqual(11)
    expect(label.x + label.width, label.id).toBeLessThanOrEqual(canvas.width - 11)
    expect(label.y + label.height, label.id).toBeLessThanOrEqual(canvas.height - 11)
    for (const other of labels.filter((other) => other.id !== label.id))
      expect(overlap(label, other), `${label.id} must not merge with ${other.id}`).toBe(false)
    for (const obstacle of obstacles)
      expect(
        overlap(label, { ...obstacle, x: obstacle.x - canvas.x, y: obstacle.y - canvas.y }),
        `${label.id} must not sit behind a control or heading`,
      ).toBe(false)
  }
  return labels
}

for (const [width, height] of [
  [320, 640],
  [390, 844],
  [768, 1024],
  [1440, 900],
]) {
  test(`cosmic labels retain real screen clearance at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/atlas/observatory/?cosmos=preview')
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', {
      timeout: 30_000,
    })
    await expect(page.getByTestId('atlas-transition')).toHaveText('idle')
    await page.evaluate(() => document.fonts.ready)
    const initial = await checkLabels(page)
    if (width === 1440)
      expect(initial.map((label) => label.id).sort()).toEqual([
        'adventura',
        'cerebri',
        'jarvis',
        'nemisis',
        'nexus',
        'novacore',
        'yjse',
      ])
    else expect(initial.map((label) => label.id)).toContain('nexus')
    await page.getByTestId('atlas-stage').focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByTestId('atlas-transition')).toHaveText('idle')
    const moved = await checkLabels(page)
    expect(moved.length).toBeGreaterThan(0)

    // Demand rendering must actually stop; a layout observer must not feed itself.
    await page.waitForTimeout(600)
    const resting = (await sample(page)).frame
    await page.waitForTimeout(450)
    expect((await sample(page)).frame).toBe(resting)
    await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
    const panel = page.getByRole('region', { name: 'Projektsternwarte', exact: true })
    await panel.getByLabel('Projekte suchen', { exact: true }).fill('NovaCore')
    await panel.getByRole('button', { name: 'Suchen', exact: true }).click()
    await expect
      .poll(
        async () =>
          JSON.parse((await page.getByTestId('atlas-observatory-state').textContent())!).visibleIds,
      )
      .toEqual(['novacore', 'nemisis'])
    await page.getByRole('button', { name: 'Projekterkundung schließen' }).click()
    // Nemisis truthfully mentions its NovaCore dependency and also matches this search.
    const matches = ['novacore', 'nemisis']
    expect((await checkLabels(page)).every((label) => matches.includes(label.id))).toBe(true)
    const hiddenLabel = moved.find((label) => !matches.includes(label.id))
    if (hiddenLabel) {
      const bounds = (await page.getByTestId('atlas-canvas').locator('canvas').boundingBox())!
      await page.mouse.click(
        bounds.x + hiddenLabel.x + hiddenLabel.width / 2,
        bounds.y + hiddenLabel.y + hiddenLabel.height / 2,
      )
      expect(new URL(page.url()).searchParams.get('focus')).toBeNull()
      expect(
        JSON.parse((await page.getByTestId('atlas-observatory-state').textContent())!).visibleIds,
      ).toEqual(matches)
    }
    await expect(page.locator('#atlas-projects article')).toHaveCount(7)
  })
}

test('cosmic GPU allocations remain bounded after repeated unmounts', async ({ page }) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/atlas/observatory/?cosmos=preview')
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  const counts: Sample[] = []
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.getByRole('link', { name: 'Ursprung', exact: true }).click()
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin')
    await page.goBack()
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
    await page.evaluate(() => new Promise<void>((resolve) => requestIdleCallback(() => resolve())))
    counts.push(await sample(page))
  }
  for (const current of counts.slice(1)) {
    expect(current.geometries).toBeLessThanOrEqual(counts[0].geometries)
    expect(current.textures).toBeLessThanOrEqual(counts[0].textures)
  }
  await expect(page.locator('canvas[data-engine]')).toHaveCount(1)
})

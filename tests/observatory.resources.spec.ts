import { expect, test, type Page } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

type RendererInfo = {
  world: string
  frame: number
  calls: number
  triangles: number
  geometries: number
  textures: number
  programs: number
}
async function info(page: Page, afterIdle = false): Promise<RendererInfo> {
  return page.getByTestId('atlas-renderer-info').evaluate(async (element, idle) => {
    // R3F disposes unmounted resources through Scheduler's IdlePriority queue.
    // A demand frame can finish before that work. Waiting alone cannot refresh
    // its DOM snapshot, so ask the live renderer after the browser becomes idle.
    if (idle) await new Promise<void>((resolve) => requestIdleCallback(() => resolve()))
    const output = element as HTMLOutputElement
    output.value = ''
    output.dispatchEvent(new Event('atlas:sample-renderer'))
    if (!output.value)
      throw new Error('Live renderer diagnostics did not answer the sample request')
    return JSON.parse(output.value)
  }, afterIdle)
}

test('demand frames stop at rest and repeated world changes release renderer resources', async ({
  page,
}, result) => {
  test.setTimeout(90_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?atlas=preview&world=observatory')
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory', { timeout: 30_000 })
  const samples: RendererInfo[] = []
  const poses: unknown[] = []
  // Warm both scenes once so lazy geometry/shader creation is not mistaken for a leak.
  for (let cycle = 0; cycle < 4; cycle++) {
    await page.getByRole('link', { name: 'Ursprung', exact: true }).click()
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin')
    await page.getByRole('link', { name: 'Sternwarte', exact: true }).click()
    await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
    await expect.poll(async () => (await info(page)).world).toBe('observatory')
    samples.push(await info(page, true))
    poses.push(JSON.parse((await page.getByTestId('atlas-pose').textContent())!))
    await expect(page.getByTestId('atlas-canvas').locator('canvas')).toHaveCount(1)
  }
  const baseline = samples[0]
  for (const current of poses.slice(1)) expect(current).toEqual(poses[0])
  for (const sample of samples.slice(1)) {
    expect(sample.geometries).toBeLessThanOrEqual(baseline.geometries)
    expect(sample.textures).toBeLessThanOrEqual(baseline.textures)
    expect(sample.programs).toBeLessThanOrEqual(baseline.programs)
    expect(sample.calls).toBeGreaterThan(0)
    expect(sample.triangles).toBeGreaterThan(0)
  }
  const rest = await info(page, true)
  await page.waitForTimeout(1000)
  expect((await info(page)).frame).toBe(rest.frame)
  // An empty real filter must cull project draw calls, while the spatial background remains.
  await page.getByRole('button', { name: 'Projekte erkunden', exact: true }).click()
  await page
    .getByRole('region', { name: 'Projektsternwarte', exact: true })
    .getByLabel('Projekte suchen', { exact: true })
    .fill('No project matches 875421')
  await page.getByRole('button', { name: 'Suchen', exact: true }).click()
  await expect.poll(async () => (await info(page)).calls).toBeLessThan(rest.calls)
  const empty = await info(page, true)
  expect(empty.triangles).toBeLessThan(rest.triangles)
  const evidence = JSON.stringify(
    {
      measurement: 'live renderer counters after browser idle; no render requested',
      samples,
      poses,
      idle: rest,
      empty,
    },
    null,
    2,
  )
  await writeFile(result.outputPath('observatory-renderer-resources.json'), evidence)
  await result.attach('observatory-renderer-resources.json', {
    body: evidence,
    contentType: 'application/json',
  })
})

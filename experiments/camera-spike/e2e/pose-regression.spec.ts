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

async function savedPose(page: Page): Promise<Pose> {
  return JSON.parse((await page.getByTestId('saved-pose').textContent()) ?? 'null') as Pose
}

test('Back restores previous selection and full camera pose', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop selection-history regression')
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Übersicht' })).toBeEnabled()
  await page.getByRole('button', { name: /Signal Raumpunkt A/ }).click()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(-8, 1)
  await page.getByRole('button', { name: /Kern Raumpunkt C/ }).click()
  const snapshot = await savedPose(page)
  expect(snapshot).not.toBeNull()
  await expect.poll(async () => (await pose(page)).target[0]).toBeCloseTo(8, 1)
  await page.getByRole('button', { name: /Zurück/ }).click()
  await expect
    .poll(async () => {
      const actual = await pose(page)
      const positions = actual.position.map((value, axis) =>
        Math.abs(value - snapshot.position[axis]),
      )
      const targets = actual.target.map((value, axis) => Math.abs(value - snapshot.target[axis]))
      return Math.max(...positions, ...targets)
    })
    .toBeLessThan(0.05)
  const result = await pose(page)
  expect(result.fov).toBe(snapshot.fov)
  expect(result.zoom).toBe(snapshot.zoom)
  await expect(
    page.getByRole('button', { name: /Signal Raumpunkt A/ }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('button', { name: /Kern Raumpunkt C/ }),
  ).toHaveAttribute('aria-pressed', 'false')
})

test('pinch and two-finger truck do not scroll the page', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile two-finger gesture regression')
  await page.goto('/')
  const canvas = page.getByTestId('camera-stage').locator('canvas')
  await expect(canvas).toBeVisible()
  await canvas.scrollIntoViewIfNeeded()
  const bounds = await canvas.boundingBox()
  expect(bounds).not.toBeNull()
  const x = bounds!.x + bounds!.width / 2
  const y = bounds!.y + bounds!.height / 2
  const before = await page.evaluate(() => window.scrollY)
  const client = await page.context().newCDPSession(page)
  const points = (spread: number, offset: number) => [
    { x: x - spread + offset, y, id: 1 },
    { x: x + spread + offset, y, id: 2 },
  ]
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(35, 0) })
  for (const spread of [45, 65, 85, 110]) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: points(spread, 0),
    })
    await page.waitForTimeout(50)
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  const afterPinch = await page.evaluate(() => window.scrollY)
  expect(Math.abs(afterPinch - before)).toBeLessThan(3)
  const truckStart = await page.evaluate(() => window.scrollY)
  const targetBefore = (await pose(page)).target
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(40, 0) })
  for (const offset of [8, 16, 24, 32, 40]) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: points(40, offset),
    })
    await page.waitForTimeout(45)
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect
    .poll(async () => {
      const after = await pose(page)
      const deltas = after.target.map((value, axis) => Math.abs(value - targetBefore[axis]))
      return Math.max(...deltas)
    })
    .toBeGreaterThan(0.1)
  const truckEnd = await page.evaluate(() => window.scrollY)
  expect(Math.abs(truckEnd - truckStart)).toBeLessThan(3)
  await client.detach()
})

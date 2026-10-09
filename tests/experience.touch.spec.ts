import { expect, test, devices } from '@playwright/test'

test('mobile pinch and two-finger pan stay inside the spatial stage', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['Pixel 5'] })
  const page = await context.newPage()
  try {
    await page.goto('http://127.0.0.1:4173/?atlas=preview')
    const canvas = page.getByTestId('atlas-canvas').locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 20_000 })
    await canvas.scrollIntoViewIfNeeded()
    const box = await canvas.boundingBox()
    expect(box).not.toBeNull()
    const x = box!.x + box!.width * 0.5
    const y = box!.y + box!.height * 0.45
    const startingScroll = await page.evaluate(() => window.scrollY)
    const startingPose = JSON.parse((await page.getByTestId('atlas-pose').textContent()) ?? '{}')
    const client = await context.newCDPSession(page)
    const fingers = (spread: number, offset: number) => [
      { x: x - spread + offset, y, id: 1 },
      { x: x + spread + offset, y, id: 2 },
    ]
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: fingers(28, 0),
    })
    for (const spread of [42, 56, 75, 93]) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: fingers(spread, 0),
      })
      await page.waitForTimeout(45)
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    const distance = (pose: { position: number[]; target: number[] }) =>
      Math.hypot(...pose.position.map((value, i) => value - pose.target[i]))
    await expect
      .poll(async () => {
        const current = JSON.parse((await page.getByTestId('atlas-pose').textContent()) ?? '{}')
        return Math.abs(distance(current) - distance(startingPose))
      })
      .toBeGreaterThan(0.2)
    const afterPinch = JSON.parse((await page.getByTestId('atlas-pose').textContent()) ?? '{}')
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: fingers(36, 0),
    })
    for (const offset of [10, 20, 30, 40]) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: fingers(36, offset),
      })
      await page.waitForTimeout(45)
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect
      .poll(async () => {
        const current = JSON.parse((await page.getByTestId('atlas-pose').textContent()) ?? '{}')
        return Math.max(
          ...current.target.map((value: number, i: number) =>
            Math.abs(value - afterPinch.target[i]),
          ),
        )
      })
      .toBeGreaterThan(0.1)
    const endScroll = await page.evaluate(() => window.scrollY)
    expect(Math.abs(endScroll - startingScroll)).toBeLessThan(3)
    await client.detach()
  } finally {
    await context.close()
  }
})

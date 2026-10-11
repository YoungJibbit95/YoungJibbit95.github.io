import { expect, test, type Page } from '@playwright/test'
import { originLandmarks } from '../src/experience/worlds/originModel'
import type { CameraPose } from '../src/experience/worldTypes'

test.describe.configure({ timeout: 90_000 })

test('preview loads no legacy application chunk or legacy animation tree', async ({ page }) => {
  const requests: string[] = []
  const errors: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  page.on('pageerror', (error) => errors.push(error.message))
  await open(page)
  await expect(page.locator('#tech-orbit')).toHaveCount(0)
  expect(requests.filter((url) => /\/assets\/App-[^/]+\.js$/.test(url))).toEqual([])
  expect(errors).toEqual([])
})
const readPose = async (page: Page) =>
  JSON.parse((await page.getByTestId('atlas-pose').textContent())!)
async function expectRestoredPose(page: Page, expected: CameraPose) {
  const values = (value: CameraPose) => [...value.position, ...value.target, value.fov, value.zoom]
  const target = values(expected)
  // CameraControls spherical round-trips use the same full-pose precision as G2-C.
  await expect
    .poll(async () =>
      Math.max(
        ...values(await readPose(page)).map((value, index) => Math.abs(value - target[index])),
      ),
    )
    .toBeLessThan(1e-7)
}
async function open(page: Page, width = 1440) {
  await page.setViewportSize({ width, height: width < 620 ? 844 : 900 })
  await page.goto('/?atlas=preview')
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin', { timeout: 20_000 })
  await page.evaluate(() => document.fonts.ready)
}

test('pause freezes real pixels and elapsed time while camera stays free; resume completes the graph', async ({
  page,
}, info) => {
  await open(page)
  const signal = page.getByTestId('origin-signal')
  await page.getByRole('button', { name: 'Abspielen', exact: true }).click()
  await page.getByRole('button', { name: 'Pause', exact: true }).click()
  await expect(signal).toHaveAttribute('data-playback', 'paused')
  const mask = await page.addStyleTag({
    content: '.atlas-v3__overlay {visibility:hidden !important}',
  })
  const frozen = await page.screenshot()
  await page.waitForTimeout(4500) // The entire dwell elapses: a paused timer must not fire.
  expect((await page.screenshot()).equals(frozen)).toBe(true)
  await mask.evaluate((element) => element.parentNode?.removeChild(element))
  await expect(signal).toHaveAttribute('data-step', '1')
  await page.screenshot({ path: info.outputPath('g2b-paused-1440.png') })
  const before = await readPose(page)
  await page.getByTestId('atlas-stage').focus()
  await page.keyboard.press('ArrowRight')
  await expect
    .poll(async () => Math.abs((await readPose(page)).target[0] - before.target[0]))
    .toBeGreaterThan(0.1)
  await expect(signal).toHaveAttribute('data-playback', 'paused')
  await page.getByRole('button', { name: 'Fortsetzen', exact: true }).click()
  await expect(signal).toHaveAttribute('data-step', '2', { timeout: 6000 })
  await expect(signal).toHaveAttribute('data-playback', 'complete', { timeout: 6000 })
  await page.screenshot({ path: info.outputPath('g2b-complete-1440.png') })
  const departure = await readPose(page)
  await page.getByRole('link', { name: 'Zur Sternwarte ↗', exact: true }).click()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
  await page.goBack()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin')
  await expect.poll(() => readPose(page)).toEqual(departure)
  await expect(signal).toHaveAttribute('data-step', '2')
})

test('replay restarts, step takes manual ownership and reset cancels every pending advance', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, 390)
  await page.getByRole('button', { name: 'Signal senden' }).click()
  await page.getByRole('button', { name: 'Signal weitergeben' }).click()
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
  const signal = page.getByTestId('origin-signal')
  await expect(signal).toHaveAttribute('data-step', '1')
  await expect(signal).toHaveAttribute('data-playback', 'playing')
  await page.getByRole('button', { name: 'Signal weitergeben' }).click()
  await expect(signal).toHaveAttribute('data-playback', 'manual')
  await expect(signal).toHaveAttribute('data-step', '2')
  await page.screenshot({ path: info.outputPath('g2b-complete-390.png') })
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
  await page.getByRole('button', { name: 'Signal zurücksetzen' }).click()
  await page.waitForTimeout(4500)
  await expect(signal).toHaveAttribute('data-step', '0')
  await expect(signal).toHaveAttribute('data-playback', 'manual')
  await page.screenshot({ path: info.outputPath('g2b-reset-390.png') })
})

test('each mobile landmark has its own framed pose and exact history return', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, 390)
  const wide = await readPose(page)
  for (const landmark of originLandmarks) {
    await page
      .getByRole('button', {
        name: landmark.title.replace(/^(Das|Die|Der) /, '') + ' ansehen',
        exact: true,
      })
      .click()
    await expect(page.getByTestId('atlas-transition')).toHaveText('focused')
    const actual = await readPose(page)
    expect(actual.target).toEqual(landmark.compactFocusPose!.target)
    actual.position.forEach((value: number, axis: number) =>
      expect(value).toBeCloseTo(landmark.compactFocusPose!.position[axis], 8),
    )
    await page.screenshot({ path: info.outputPath(`g2b-focus-${landmark.id}-390.png`) })
    await page.goBack()
    await expectRestoredPose(page, wide)
  }
  await page.getByRole('button', { name: 'Abspielen', exact: true }).click()
  await page.getByRole('link', { name: 'Sternwarte', exact: true }).click()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
  await page.screenshot({ path: info.outputPath('g2b-transition-390.png') })
  await page.waitForTimeout(4500)
  await page.goBack()
  await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-step', '1')
  await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-playback', 'paused')
  await expectRestoredPose(page, wide)
})

test('native navigation opens deep links in a new tab without changing this camera', async ({
  page,
}) => {
  await open(page)
  const before = await readPose(page)
  const popupPromise = page.context().waitForEvent('page', { timeout: 10000 })
  await page.getByRole('link', { name: /Der Horizont Entdeckung/ }).click({ button: 'middle' })
  const popup = await popupPromise
  await expect(popup).toHaveURL(/world=origin&focus=horizon/)
  expect(page.url()).not.toContain('focus=')
  expect(await readPose(page)).toEqual(before)
  await popup.close()
})

test('hidden document pauses autoplay and WebGL loss retains journey controls', async ({
  page,
}) => {
  await open(page)
  await page.getByRole('button', { name: 'Abspielen', exact: true }).click()
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-playback', 'paused')
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page
    .getByTestId('atlas-canvas')
    .locator('canvas')
    .evaluate((canvas) => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })))
  await expect(page.getByTestId('atlas-canvas')).toHaveCount(0)
  await page.getByRole('button', { name: 'Signal weitergeben' }).press('Enter')
  await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-step', '2')
  await page.getByRole('link', { name: 'Zur Sternwarte ↗', exact: true }).click()
  await expect(page.getByTestId('atlas-world-title')).toHaveText('Sternwarte')
  await expect(page.locator('#atlas-projects article')).toHaveCount(7)
})

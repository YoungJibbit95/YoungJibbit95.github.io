import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { PerspectiveCamera, Vector3 } from 'three'
import { originLandmarks } from '../src/experience/worlds/originModel'

test.describe.configure({ timeout: 90_000 })
const pose = async (page: Page) => JSON.parse((await page.getByTestId('atlas-pose').textContent())!)
async function openOrigin(page: Page, width = 1440) {
  await page.setViewportSize({ width, height: width < 620 ? 844 : 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?atlas=preview')
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin', { timeout: 20_000 })
  await expect(page.getByTestId('atlas-motion')).toHaveText('reduced')
  await page.evaluate(() => document.fonts.ready)
}

async function scenePixels(page: Page) {
  const mask = await page.addStyleTag({
    content: '.atlas-v3__overlay { visibility: hidden !important; }',
  })
  try {
    const box = await page.getByTestId('atlas-canvas').boundingBox()
    const png = await page.screenshot()
    return await page.evaluate(
      async ({ base64, box }) => {
        const image = new Image()
        image.src = 'data:image/png;base64,' + base64
        await image.decode()
        const sample = document.createElement('canvas')
        sample.width = 240
        sample.height = 150
        const ctx = sample.getContext('2d')!
        ctx.drawImage(image, box!.x, box!.y, box!.width, box!.height, 0, 0, 240, 150)
        return Array.from(ctx.getImageData(0, 0, 240, 150).data)
      },
      { base64: png.toString('base64'), box },
    )
  } finally {
    await mask.evaluate((element) => element.parentNode?.removeChild(element))
  }
}
const changedPixels = (a: number[], b: number[]) =>
  a.reduce(
    (sum, value, index) =>
      sum +
      (index % 4 === 0 &&
      Math.max(
        Math.abs(value - b[index]),
        Math.abs(a[index + 1] - b[index + 1]),
        Math.abs(a[index + 2] - b[index + 2]),
      ) > 18
        ? 1
        : 0),
    0,
  )

test('signal changes real geometry and both authored paths; reset restores the quiet frame', async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await openOrigin(page)
  const before = await scenePixels(page)
  const initial = await pose(page)
  await page.screenshot({ path: info.outputPath('g2a-origin-1440-quiet.png') })
  await page.getByRole('button', { name: 'Signal senden', exact: false }).click()
  await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-reached', 'signal,relation')
  await expect.poll(async () => changedPixels(before, await scenePixels(page))).toBeGreaterThan(250)
  await page.screenshot({ path: info.outputPath('g2a-origin-1440-open.png') })
  const connection = await scenePixels(page)
  await page.getByRole('button', { name: 'Signal weitergeben', exact: false }).click()
  await expect(page.getByTestId('origin-signal')).toHaveAttribute(
    'data-edges',
    'question-to-connection,connection-to-horizon',
  )
  await expect
    .poll(async () => changedPixels(connection, await scenePixels(page)))
    .toBeGreaterThan(15)
  await page.screenshot({ path: info.outputPath('g2a-origin-1440-horizon.png') })
  expect(await pose(page)).toEqual(initial)
  await page.getByRole('button', { name: 'Erneut senden', exact: false }).click()
  await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-step', '1')
  await page.getByRole('button', { name: 'Signal zurücksetzen' }).click()
  await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-reached', '')
  await expect.poll(async () => changedPixels(before, await scenePixels(page))).toBeLessThan(10)
  expect(errors).toEqual([])
})

test('raycast focuses the physical structure; drag keeps free camera ownership', async ({
  page,
}) => {
  await openOrigin(page)
  const canvas = page.getByTestId('atlas-canvas').locator('canvas')
  const box = (await canvas.boundingBox())!
  const start = await pose(page)
  const camera = new PerspectiveCamera(start.fov, box.width / box.height, 0.1, 230)
  camera.position.set(...(start.position as [number, number, number]))
  camera.lookAt(new Vector3(...(start.target as [number, number, number])))
  camera.updateMatrixWorld()
  const wing = new Vector3(...originLandmarks[1].position).add(new Vector3(6, 2, 0)).project(camera)
  const x = box.x + ((wing.x + 1) * box.width) / 2
  const y = box.y + ((1 - wing.y) * box.height) / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 100, y + 25, { steps: 12 })
  await page.mouse.up()
  await expect
    .poll(async () => Math.abs((await pose(page)).target[0] - start.target[0]))
    .toBeGreaterThan(1)
  expect(page.url()).not.toContain('focus=')
  await page.getByRole('button', { name: 'Übersicht', exact: true }).click()
  await expect(page.getByTestId('atlas-transition')).toHaveText('idle')
  await page.mouse.click(x, y)
  await expect(page).toHaveURL(/focus=relation/)
  await expect.poll(async () => (await pose(page)).target).toEqual([...originLandmarks[1].position])
})

test('far-field exploration and world return preserve scale, selection and signal', async ({
  page,
}) => {
  await openOrigin(page, 390)
  const wide = await pose(page)
  expect(wide.target[0]).toBe(9)
  await page.getByRole('button', { name: 'Signal senden', exact: false }).click()
  await page.getByRole('button', { name: /Der Horizont Entdeckung/ }).click()
  await expect.poll(async () => (await pose(page)).target).toEqual([...originLandmarks[2].position])
  await page.getByRole('button', { name: /Weiter zur Sternwarte/ }).click()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
  await page.goBack()
  await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin')
  await expect.poll(async () => (await pose(page)).target).toEqual([...originLandmarks[2].position])
  await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-step', '1')
  await page.goBack()
  await expect.poll(async () => (await pose(page)).position).toEqual(wide.position)
})

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`Origin viewport and primary actions remain readable at ${width}px`, async ({
    page,
  }, info) => {
    await openOrigin(page, width)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    const send = page.getByRole('button', { name: 'Signal senden', exact: false })
    await expect(send).toBeInViewport()
    const bounds = (await send.boundingBox())!
    expect(bounds.height).toBeGreaterThanOrEqual(44)
    await page.screenshot({ path: info.outputPath(`g2a-origin-${width}.png`) })
    await send.press('Enter')
    await expect(page.getByTestId('origin-signal')).toHaveAttribute('data-step', '1')
    await page.screenshot({ path: info.outputPath(`g2a-origin-${width}-signal.png`) })
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(
      axe.violations.filter((finding) => ['serious', 'critical'].includes(finding.impact ?? '')),
    ).toEqual([])
  })
}

test('signal model remains operable after WebGL loss and while motion is disabled', async ({
  page,
}) => {
  await openOrigin(page, 390)
  await page
    .getByTestId('atlas-canvas')
    .locator('canvas')
    .evaluate((canvas) => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })))
  await expect(page.getByTestId('atlas-canvas')).toHaveCount(0)
  await page.getByRole('button', { name: 'Signal senden', exact: false }).press('Enter')
  await expect(page.getByTestId('origin-signal')).toContainText(
    'Dein Impuls öffnet die Verbindung.',
  )
  await page.getByRole('button', { name: 'Signal weitergeben', exact: false }).press('Enter')
  await expect(page.getByTestId('origin-signal')).toContainText(
    'Die Verbindung erreicht den Horizont.',
  )
  await expect(page.locator('#atlas-projects article')).toHaveCount(7)
})

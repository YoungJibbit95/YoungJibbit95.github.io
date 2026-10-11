import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const evidence = 'docs/experience/evidence/g2d/mobile'
await mkdir(evidence, { recursive: true })
const browser = await chromium.launch({
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
})
const results = []
const directions = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c']
const ports = { a: 3011, b: 3012, c: 3013 }
const sample = (page, direction) =>
  page.evaluate((d) => {
    if (d === 'a') {
      document.dispatchEvent(new Event('aperture:sample'))
      const value = JSON.parse(document.querySelector('#renderer-evidence').value)
      return { ...value, position: value.eye }
    }
    return d === 'b' ? window.bCapture() : window.g2dC.diagnostics()
  }, direction)
const distance = ({ position, target }) =>
  Math.hypot(...position.map((value, i) => value - target[i]))
async function boundedTouch(cdp, payload) {
  let timer
  try {
    return await Promise.race([
      cdp.send('Input.dispatchTouchEvent', payload),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('CDP touch dispatch exceeded 10 s; no gesture PASS')),
          10000,
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}
async function gesture(cdp, points) {
  await boundedTouch(cdp, { type: 'touchStart', touchPoints: points(0) })
  for (let i = 1; i <= 12; i++) {
    await boundedTouch(cdp, { type: 'touchMove', touchPoints: points(i / 12) })
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
  await boundedTouch(cdp, { type: 'touchEnd', touchPoints: [] })
}
try {
  for (const direction of directions) {
    if (!(direction in ports)) continue
    for (const width of [390, 768]) {
      const page = await browser.newPage({
        viewport: { width, height: width === 390 ? 844 : 1024 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        reducedMotion: 'reduce',
      })
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.goto(
        `http://127.0.0.1:${ports[direction]}/experiments/g2d-design/direction-${direction}/index.html`,
      )
      await page.waitForFunction(
        (d) =>
          d === 'a'
            ? document.querySelector('#renderer-evidence')?.dataset.ready === 'true'
            : d === 'b'
              ? window.bReady
              : !!window.g2dC,
        direction,
      )
      if (direction === 'a') await page.getByRole('button', { name: 'Projekte', exact: true }).tap()
      await page.waitForTimeout(1100)
      const overview = await sample(page, direction)
      assert(overview.calls > 0 && overview.triangles > 1000, `${direction} real geometry`)
      await page.screenshot({ path: `${evidence}/${direction}-entry-${width}.png` })
      console.log(`${direction} ${width}: painted entry; starting touch`)
      await writeFile(
        `${evidence}/${direction}-entry-${width}.json`,
        JSON.stringify(overview, null, 2),
      )
      const targetAudit = await page.locator('button,a,select,summary').evaluateAll((elements) =>
        elements
          .map((element) => {
            const rect = element.getBoundingClientRect()
            const style = getComputedStyle(element)
            return {
              name: (element.textContent || element.getAttribute('aria-label') || '')
                .trim()
                .slice(0, 55),
              width: rect.width,
              height: rect.height,
              visible:
                rect.width > 0 &&
                rect.height > 0 &&
                rect.x >= 0 &&
                rect.y >= 0 &&
                rect.bottom <= innerHeight &&
                rect.right <= innerWidth &&
                style.visibility !== 'hidden' &&
                style.display !== 'none',
            }
          })
          .filter((item) => item.visible && (item.width < 44 || item.height < 44)),
      )
      const cdp = await page.context().newCDPSession(page)
      const x = width / 2
      const y = width === 390 ? 422 : 512
      await gesture(cdp, (t) => [
        { x: x - 45 - 38 * t, y, id: 1 },
        { x: x + 45 + 38 * t, y, id: 2 },
      ])
      await page.waitForTimeout(650)
      const pinched = await sample(page, direction)
      assert(
        Math.abs(distance(pinched) - distance(overview)) > 1,
        `${direction} pinch changes actual distance`,
      )
      await gesture(cdp, (t) => [{ x: x - 50 + t * 70, y: y + 65 + t * 18, id: 1 }])
      await page.waitForTimeout(650)
      const dragged = await sample(page, direction)
      assert(
        Math.hypot(...dragged.position.map((value, i) => value - pinched.position[i])) > 0.1,
        `${direction} drag changes actual camera`,
      )
      await page.screenshot({ path: `${evidence}/${direction}-touch-${width}.png` })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
      results.push({
        direction,
        width,
        overview,
        pinched,
        dragged,
        pinchDistanceDelta: distance(pinched) - distance(overview),
        undersizedVisibleTargets: targetAudit,
        horizontalOverflow: overflow,
        errors,
      })
      assert.equal(overflow, false)
      await page.close()
      await writeFile(
        `${evidence}/touch-${direction}.json`,
        JSON.stringify(
          results.filter((entry) => entry.direction === direction),
          null,
          2,
        ),
      )
    }
  }
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })
  await page.goto('http://127.0.0.1:3013/experiments/g2d-design/mobile/index.html')
  await page.getByRole('button', { name: 'Bei Nexus beginnen' }).tap()
  await page.getByRole('combobox', { name: 'Anderes Projekt' }).selectOption('jarvis')
  assert.equal(await page.locator('#actions').textContent(), 'select:jarvis')
  await page.getByRole('button', { name: 'Projekt lesen' }).tap()
  assert.equal(await page.locator('dialog').evaluate((element) => element.matches(':modal')), true)
  assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Schließen')
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab')
    assert.equal(
      await page.evaluate(() => document.activeElement?.closest('dialog') !== null),
      true,
    )
  }
  await page.keyboard.press('Escape')
  assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Projekt lesen')
  await page.getByText('Ansicht', { exact: true }).tap()
  await page.getByRole('button', { name: 'Näher heran', exact: true }).tap()
  assert.equal(await page.locator('#actions').textContent(), 'zoom:in')
  const bounds = await page
    .locator(
      '.mobile-journey-shelf button,.mobile-journey-shelf select,.mobile-journey-shelf summary',
    )
    .evaluateAll((elements) =>
      elements
        .map((element) => ({
          name: element.textContent?.trim(),
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        }))
        .filter((rect) => rect.height > 0),
    )
  assert(bounds.every((rect) => rect.width >= 44 && rect.height >= 44))
  await writeFile(
    `${evidence}/shelf.json`,
    JSON.stringify(
      {
        nativeModal: true,
        coveredFocusExcluded: true,
        escapeFocusRestored: true,
        projectSelection: 'jarvis',
        cameraAction: 'zoom:in',
        targets: bounds,
      },
      null,
      2,
    ),
  )
  await page.close()
} finally {
  await browser.close()
}
console.log(JSON.stringify(results, null, 2))

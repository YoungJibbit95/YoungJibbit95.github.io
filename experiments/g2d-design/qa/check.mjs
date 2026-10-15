import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const out = 'docs/experience/evidence/g2d/qa'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const results = []
const ports = { a: 3011, b: 3012, c: 3013 }
const requested = process.argv.slice(2)
const directions = requested.filter((arg) => arg in ports)
const selectedDirections = directions.length ? directions : ['a', 'b', 'c']
async function record(name, run) {
  console.log(`START ${name}`)
  try {
    results.push({ name, status: 'PASS', ...(await run()) })
    console.log(`PASS ${name}`)
  } catch (error) {
    results.push({ name, status: 'FAIL', error: error.stack })
    console.error(`FAIL ${name}: ${error.message}`)
  }
  await writeFile(
    `${out}/results-${requested.join('-') || 'all'}.json`,
    JSON.stringify(results, null, 2),
  )
}
const sample = (page, d) =>
  page.evaluate((direction) => {
    if (direction === 'a') {
      document.dispatchEvent(new Event('aperture:sample'))
      const result = JSON.parse(document.querySelector('#renderer-evidence').value)
      return { ...result, position: result.eye }
    }
    if (direction === 'b') return { ...window.bCapture(), frame: window.bFrames }
    return window.g2dC.diagnostics()
  }, d)
const distance = ({ position, target }) => Math.hypot(...position.map((n, i) => n - target[i]))
async function idle(page) {
  await page.evaluate(() => new Promise((resolve) => requestIdleCallback(resolve)))
  await page.waitForTimeout(900)
}
async function ready(page, d) {
  await page.waitForFunction(
    (direction) =>
      direction === 'a'
        ? document.querySelector('#renderer-evidence')?.dataset.ready === 'true'
        : direction === 'b'
          ? window.bReady
          : document.querySelector('main')?.dataset.ready === 'true',
    d,
  )
  if (d === 'a') await page.getByRole('button', { name: 'Projekte', exact: true }).click()
  await idle(page)
}
async function bounded(cdp, payload) {
  let timer
  try {
    return await Promise.race([
      cdp.send('Input.dispatchTouchEvent', payload),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('Native CDP touch dispatch exceeded 10 s')),
          10000,
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}
async function touch(cdp, points) {
  await bounded(cdp, { type: 'touchStart', touchPoints: points(0) })
  for (let i = 1; i <= 6; i++) await bounded(cdp, { type: 'touchMove', touchPoints: points(i / 6) })
  await bounded(cdp, { type: 'touchEnd', touchPoints: [] })
}
async function targets(page, selector = 'button,a,select,summary') {
  return page.locator(selector).evaluateAll((elements) =>
    elements
      .map((element) => {
        const box = element.getBoundingClientRect(),
          style = getComputedStyle(element)
        return {
          name: (element.getAttribute('aria-label') || element.textContent || '')
            .trim()
            .slice(0, 65),
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          right: box.right,
          bottom: box.bottom,
          visible:
            box.width > 0 &&
            box.height > 0 &&
            style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            box.bottom > 0 &&
            box.y < innerHeight &&
            box.right > 0 &&
            box.x < innerWidth,
        }
      })
      .filter(
        (item) =>
          item.visible &&
          (item.width < 44 || item.height < 44 || item.x < 0 || item.right > innerWidth),
      ),
  )
}
try {
  if (!requested.includes('shelf') || directions.length)
    for (const d of selectedDirections) {
      for (const width of [390, 768, 1440])
        await record(`${d}-${width}`, async () => {
          const context = await browser.newContext({
            viewport: { width, height: width === 390 ? 844 : width === 768 ? 1024 : 900 },
            reducedMotion: 'reduce',
            deviceScaleFactor: 1,
            isMobile: width < 1000,
            hasTouch: width < 1000,
          })
          const page = await context.newPage()
          page.setDefaultTimeout(15000)
          const errors = []
          page.on('pageerror', (e) => errors.push(e.message))
          page.on('console', (m) => {
            if (m.type() === 'error') errors.push(m.text())
          })
          try {
            await page.goto(
              `http://127.0.0.1:${ports[d]}/experiments/g2d-design/direction-${d}/index.html`,
            )
            await ready(page, d)
            const entry = await sample(page, d)
            assert(entry.calls > 0 && entry.triangles > 1000)
            assert.equal(await page.locator('canvas').count(), 1)
            await page.screenshot({ path: `${out}/${d}-entry-${width}.png` })
            const entryTargets = await targets(page)
            let gestures = null
            if (width < 1000) {
              const cdp = await context.newCDPSession(page),
                x = width / 2,
                y = width === 390 ? 430 : 530
              await touch(cdp, (t) => [
                { x: x - 44 - t * 35, y, id: 1 },
                { x: x + 44 + t * 35, y, id: 2 },
              ])
              await idle(page)
              const pinched = await sample(page, d)
              assert(
                Math.abs(distance(pinched) - distance(entry)) > 1,
                'Pinch must move physical camera distance',
              )
              await touch(cdp, (t) => [{ x: x - 55 + t * 80, y: y + 75 + t * 12, id: 1 }])
              await idle(page)
              const dragged = await sample(page, d)
              assert(
                Math.hypot(...dragged.position.map((n, i) => n - pinched.position[i])) > 0.1,
                'Drag must move physical camera',
              )
              gestures = {
                entry,
                pinched,
                dragged,
                pinchDelta: distance(pinched) - distance(entry),
              }
              await page.screenshot({ path: `${out}/${d}-touch-${width}.png` })
            }
            let keyboard = 'Native buttons activate destinations; free keyboard camera not checked'
            if (d !== 'b') {
              const before = await sample(page, d)
              await page.locator('.stage').focus()
              await page.keyboard.press('ArrowRight')
              await page.waitForTimeout(1500)
              const after = await sample(page, d)
              assert.notDeepEqual(after.target, before.target)
              keyboard = 'Physical camera target changed from ArrowRight'
            }
            const primary =
              d === 'a' ? 'Nexus entdecken' : d === 'b' ? 'Nexus erkunden' : 'Bei Nexus beginnen'
            await page.getByRole('button', { name: new RegExp(primary) }).focus()
            await page.keyboard.press('Enter')
            await page
              .getByRole('button', {
                name: new RegExp(
                  d === 'a'
                    ? 'Kammer öffnen'
                    : d === 'b'
                      ? 'Den Kern freilegen'
                      : 'Aufbau entdecken',
                ),
              })
              .click()
            await idle(page)
            const discovery = await sample(page, d)
            assert.notDeepEqual(discovery.position, entry.position)
            await page.screenshot({ path: `${out}/${d}-discovery-${width}.png` })
            const discoveryTargets = await targets(page)
            let reading = null
            if (d === 'a') {
              await page.getByRole('button', { name: 'Projekt lesen' }).click()
              assert.equal(await page.locator('.stage').getAttribute('inert'), '')
              await page.keyboard.press('Shift+Tab')
              assert.equal(await page.evaluate(() => document.activeElement.tagName), 'A')
              await page.keyboard.press('Escape')
              assert.match(
                await page.evaluate(() => document.activeElement.textContent),
                /Projekt lesen/,
              )
              reading = 'Modal trap, inert stage, Escape, opener focus checked'
            }
            if (d === 'b') {
              await page.getByRole('button', { name: 'Projekte +', exact: true }).click()
              assert.equal(await page.locator('#project-register button').count(), 7)
              await page.keyboard.press('Escape')
              assert.equal(
                await page.evaluate(() => document.activeElement.getAttribute('aria-controls')),
                'project-register',
              )
              reading = 'Seven-project register, Escape, opener focus checked'
            }
            const axe =
              width === 390
                ? await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
                    .analyze()
                : null
            if (axe) assert.deepEqual(axe.violations, [], 'No Axe violations in discovery')
            await idle(page)
            const beforeIdle = await sample(page, d)
            await page.waitForTimeout(1000)
            const afterIdle = await sample(page, d)
            assert.equal(afterIdle.frame, beforeIdle.frame, 'Demand frame count stable over 1 s')
            const worldCycles = []
            if (width === 1440) {
              await page.locator('canvas').evaluate((element) => {
                element.dataset.qaIdentity = 'persistent'
              })
              for (let cycle = 0; cycle < 3; cycle++) {
                await page.getByRole('button', { name: 'Ursprung', exact: true }).click()
                await idle(page)
                await page
                  .getByRole('button', {
                    name: d === 'a' ? 'Projekte' : d === 'b' ? 'Sternwarte' : 'Werkstatt',
                    exact: true,
                  })
                  .click()
                await idle(page)
                assert.equal(await page.locator('canvas').count(), 1)
                assert.equal(
                  await page.locator('canvas').getAttribute('data-qa-identity'),
                  'persistent',
                )
                worldCycles.push(await sample(page, d))
              }
              await writeFile(`${out}/${d}-world-cycles.json`, JSON.stringify(worldCycles, null, 2))
              assert(
                worldCycles.every(
                  (entry) =>
                    entry.geometries <= worldCycles[0].geometries &&
                    entry.textures <= worldCycles[0].textures,
                ),
                'Resources must not grow across identical world cycles',
              )
            }
            assert.deepEqual(errors, [])
            assert.equal(
              await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
              false,
            )
            return {
              entry,
              discovery,
              gestures,
              keyboard,
              reading,
              entryTargets,
              discoveryTargets,
              axe: axe?.violations ?? null,
              idleFrameDelta: afterIdle.frame - beforeIdle.frame,
              worldCycles,
              errors,
            }
          } finally {
            await context.close()
          }
        })
    }
  if (requested.includes('shelf') || !requested.length)
    await record('mobile-shelf', async () => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      })
      const page = await context.newPage()
      try {
        await page.goto('http://127.0.0.1:3013/experiments/g2d-design/mobile/index.html')
        await page.getByRole('button', { name: 'Bei Nexus beginnen' }).tap()
        await page.getByRole('combobox', { name: 'Anderes Projekt' }).selectOption('jarvis')
        assert.equal(await page.locator('#actions').textContent(), 'select:jarvis')
        await page.getByRole('button', { name: 'Projekt lesen' }).tap()
        assert.equal(await page.locator('dialog').evaluate((el) => el.matches(':modal')), true)
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press('Tab')
          assert(
            await page.evaluate(
              () =>
                document.querySelector('dialog').matches(':modal') &&
                (document.activeElement === document.body ||
                  !!document.activeElement?.closest('dialog')),
            ),
          )
        }
        const excluded = await page.evaluate(() =>
          [...document.querySelectorAll('a,button,select,[tabindex]')]
            .filter((el) => !el.closest('dialog'))
            .map((el) => {
              el.focus()
              return document.activeElement !== el
            }),
        )
        assert(
          excluded.length > 0 && excluded.every(Boolean),
          'Native modal must reject every background focus target',
        )
        await page.screenshot({ path: `${out}/mobile-reader-390.png` })
        await page.keyboard.press('Escape')
        assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Projekt lesen')
        await page.getByText('Ansicht', { exact: true }).tap()
        await page.getByRole('button', { name: 'Näher heran', exact: true }).tap()
        assert.equal(await page.locator('#actions').textContent(), 'zoom:in')
        const sizes = await targets(
          page,
          '.mobile-journey-shelf button,.mobile-journey-shelf select,.mobile-journey-shelf summary',
        )
        assert.deepEqual(sizes, [])
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
        assert.deepEqual(axe.violations, [], 'No Axe violations in mobile shelf')
        return {
          nativeModal: true,
          focusTrapEscapeReturn: true,
          nativeSelection: 'jarvis',
          zoomIntent: 'in',
          axe: axe.violations,
          targets: sizes,
        }
      } finally {
        await context.close()
      }
    })
} finally {
  await browser.close()
}
console.log(JSON.stringify(results.map(({ name, status }) => ({ name, status }))))
if (results.some((r) => r.status === 'FAIL')) process.exitCode = 1

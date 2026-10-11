// Reversible browser-only integration probe. No production dependency or startup hook.
// First: npm install --prefix .verification/lenis lenis@1.3.26 --ignore-scripts --no-audit --no-fund
// Then start the app and run: node experiments/lenis-spike/run.mjs
import { chromium, expect, devices } from '@playwright/test'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { resolve } from 'node:path'

const base = process.env.ATLAS_PROBE_URL || 'http://127.0.0.1:3000'
const packageRoot = resolve('.verification/lenis/node_modules/lenis')
const bundle = await readFile(resolve(packageRoot, 'dist/lenis.min.js'))
const results = {
  version: '1.3.26',
  at: new Date().toISOString(),
  browser: '',
  gzipBytes: gzipSync(bundle).length,
  cases: [],
}
const browser = await chromium.launch({
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
})
results.browser = browser.version()
const pose = async (page) => JSON.parse(await page.getByTestId('atlas-pose').textContent())
const distance = (p) => Math.hypot(...p.position.map((v, i) => v - p.target[i]))
try {
  for (const mobile of [false, true])
    for (const reduced of [false, true])
      for (const enabled of [false, true]) {
        const context = await browser.newContext({
          ...(mobile ? devices['Pixel 5'] : { viewport: { width: 1440, height: 900 } }),
          reducedMotion: reduced ? 'reduce' : 'no-preference',
        })
        const page = await context.newPage()
        const errors = []
        page.on('pageerror', (e) => errors.push(e.message))
        try {
          await page.goto(base + '/?atlas=preview')
          await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin', {
            timeout: 20000,
          })
          await expect(page.getByTestId('atlas-motion')).toHaveText(reduced ? 'reduced' : 'full')
          if (enabled) {
            await page.addScriptTag({ path: resolve(packageRoot, 'dist/lenis.min.js') })
            await page.addStyleTag({ path: resolve(packageRoot, 'dist/lenis.css') })
            await page.evaluate(() => {
              const state = {
                frames: 0,
                handle: 0,
                instance: new window.Lenis({
                  autoRaf: false,
                  anchors: true,
                  syncTouch: false,
                  respectReducedMotion: true,
                  prevent: (node) => Boolean(node.closest('[data-world-input]')),
                }),
              }
              const frame = (time) => {
                state.frames++
                state.instance.raf(time)
                state.handle = requestAnimationFrame(frame)
              }
              state.handle = requestAnimationFrame(frame)
              state.destroy = () => {
                cancelAnimationFrame(state.handle)
                state.instance.destroy()
              }
              window.lenisProbe = state
            })
          }
          const countBefore = await page.evaluate(() => window.lenisProbe?.frames ?? 0)
          await page.waitForTimeout(500)
          const idleCallbacks =
            (await page.evaluate(() => window.lenisProbe?.frames ?? 0)) - countBefore
          const canvas = page.getByTestId('atlas-canvas').locator('canvas')
          const box = await canvas.boundingBox()
          const x = box.x + box.width * 0.5,
            y = box.y + box.height * 0.46
          const start = await pose(page)
          const scrollBefore = await page.evaluate(() => window.scrollY)
          if (mobile) {
            const client = await context.newCDPSession(page)
            const fingers = (spread, offset = 0) => [
              { x: x - spread + offset, y, id: 1 },
              { x: x + spread + offset, y, id: 2 },
            ]
            await client.send('Input.dispatchTouchEvent', {
              type: 'touchStart',
              touchPoints: fingers(28),
            })
            for (const spread of [42, 56, 75, 93]) {
              await client.send('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: fingers(spread),
              })
              await page.waitForTimeout(45)
            }
            await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
            await expect
              .poll(async () => Math.abs(distance(await pose(page)) - distance(start)))
              .toBeGreaterThan(0.2)
            const pinch = await pose(page)
            await client.send('Input.dispatchTouchEvent', {
              type: 'touchStart',
              touchPoints: fingers(36),
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
              .poll(async () =>
                Math.max(...(await pose(page)).target.map((v, i) => Math.abs(v - pinch.target[i]))),
              )
              .toBeGreaterThan(0.1)
            await client.detach()
          } else {
            await page.mouse.move(x, y)
            await page.mouse.wheel(0, -180)
            await expect
              .poll(async () => Math.abs(distance(await pose(page)) - distance(start)))
              .toBeGreaterThan(0.2)
          }
          const stageScrollDelta = Math.abs(
            (await page.evaluate(() => window.scrollY)) - scrollBefore,
          )
          expect(stageScrollDelta).toBeLessThan(3)
          await page.getByRole('button', { name: 'Sternwarte', exact: true }).click()
          await expect(page.getByTestId('atlas-scene-ready')).toHaveText('observatory')
          await page.goBack()
          await expect(page.getByTestId('atlas-scene-ready')).toHaveText('origin')
          // Keyboard-accessible native anchor also works at mobile widths where the header link hides.
          await page.getByRole('link', { name: 'Direkt zu Projekten' }).focus()
          await page.keyboard.press('Enter')
          await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(700)
          const hash = await page.evaluate(() => location.hash)
          // Measure document wheel away from the spatial stage after the anchor settles.
          await page.waitForTimeout(1800)
          const project = await page.locator('#atlas-projects').boundingBox()
          await page.mouse.move(100, Math.max(160, Math.min(600, project.y + 250)))
          const docBefore = await page.evaluate(() => window.scrollY)
          await page.mouse.wheel(0, 300)
          await expect
            .poll(async () => page.evaluate(() => window.scrollY))
            .toBeGreaterThan(docBefore + 100)
          let cleanup = true
          if (enabled) {
            await page.evaluate(() => window.lenisProbe.destroy())
            const stopped = await page.evaluate(() => window.lenisProbe.frames)
            await page.waitForTimeout(150)
            cleanup = (await page.evaluate(() => window.lenisProbe.frames)) === stopped
            expect(cleanup).toBe(true)
          }
          await page.goto(base + '/#mensch')
          await expect(page.locator('#mensch')).toBeVisible()
          expect(new URL(page.url()).hash).toBe('#mensch')
          expect(errors).toEqual([])
          const record = {
            mobile,
            reduced,
            enabled,
            idleCallbacksPer500ms: idleCallbacks,
            stageScrollDelta,
            projectHash: hash,
            cleanup,
            pass: true,
          }
          results.cases.push(record)
          console.log(JSON.stringify(record))
        } finally {
          await context.close()
        }
      }
} finally {
  await browser.close()
  await mkdir('.verification/g2a', { recursive: true })
  await writeFile('.verification/g2a/lenis-result.json', JSON.stringify(results, null, 2) + '\n')
}

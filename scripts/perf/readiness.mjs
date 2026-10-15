import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const [url = 'http://127.0.0.1:4182/?atlas=preview', label = 'baseline-gzip', count = '3'] =
  process.argv.slice(2)
const out = resolve('docs/experience/performance', label)
const expectedWorld =
  new URL(url).searchParams.get('world') === 'observatory' ? 'observatory' : 'origin'
await mkdir(out, { recursive: true })
const samples = []
for (let index = 1; index <= Number(count); index++) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
  })
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1.75,
      isMobile: true,
      hasTouch: true,
    })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 1_600_000 / 8,
      uploadThroughput: 750_000 / 8,
    })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.addInitScript((world) => {
      window.__atlasPerf = { longTasks: [], glCalls: [], ready: null, cameraChanged: null }
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          window.__atlasPerf.longTasks.push({ start: entry.startTime, duration: entry.duration })
      }).observe({ type: 'longtask', buffered: true })
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (...args) {
        const start = performance.now()
        const result = original.apply(this, args)
        if (String(args[0]).startsWith('webgl'))
          window.__atlasPerf.glCalls.push({
            operation: 'getContext:' + args[0],
            start,
            duration: performance.now() - start,
            success: !!result,
          })
        return result
      }
      for (const name of ['compileShader', 'linkProgram', 'getProgramParameter']) {
        const method = WebGL2RenderingContext.prototype[name]
        WebGL2RenderingContext.prototype[name] = function (...args) {
          const start = performance.now()
          const result = method.apply(this, args)
          window.__atlasPerf.glCalls.push({
            operation: name,
            start,
            duration: performance.now() - start,
          })
          return result
        }
      }
      new MutationObserver(() => {
        const ready = document.querySelector('[data-testid="atlas-scene-ready"]')?.textContent
        if (ready === world && window.__atlasPerf.ready === null)
          window.__atlasPerf.ready = performance.now()
        const pose = document.querySelector('[data-testid="atlas-pose"]')?.textContent
        if (
          window.__atlasPerf.beforePose &&
          pose !== window.__atlasPerf.beforePose &&
          window.__atlasPerf.cameraChanged === null
        )
          window.__atlasPerf.cameraChanged = performance.now()
      }).observe(document, { childList: true, subtree: true, characterData: true })
    }, expectedWorld)
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => window.__atlasPerf.ready !== null, null, { timeout: 60_000 })
    await page.evaluate(() => {
      window.__atlasPerf.beforePose = document.querySelector(
        '[data-testid="atlas-pose"]',
      ).textContent
      window.__atlasPerf.inputSent = performance.now()
    })
    await page.getByTestId('atlas-stage').focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForFunction(() => window.__atlasPerf.cameraChanged !== null, null, {
      timeout: 15_000,
    })
    const measurements = await page.evaluate(() => ({
      ...window.__atlasPerf,
      resources: performance
        .getEntriesByType('resource')
        .map(({ name, startTime, duration, transferSize, encodedBodySize, decodedBodySize }) => ({
          name,
          startTime,
          duration,
          transferSize,
          encodedBodySize,
          decodedBodySize,
        })),
    }))
    const canvas = page.getByTestId('atlas-canvas').locator('canvas')
    await canvas.evaluate((element) =>
      element.scrollIntoView({ behavior: 'instant', block: 'center' }),
    )
    const bounds = await canvas.boundingBox()
    const mask = await page.addStyleTag({
      content: '.atlas-v3__overlay, .observatory-explorer { visibility:hidden!important }',
    })
    const png = await page.screenshot({ path: resolve(out, `ready-${index}.png`) })
    await mask.evaluate((element) => element.remove())
    const pixels = await page.evaluate(
      async ({ base64, bounds }) => {
        const image = new Image()
        image.src = 'data:image/png;base64,' + base64
        await image.decode()
        const sample = document.createElement('canvas')
        sample.width = 240
        sample.height = 150
        const ctx = sample.getContext('2d', { willReadFrequently: true })
        const sx = image.naturalWidth / innerWidth,
          sy = image.naturalHeight / innerHeight
        ctx.drawImage(
          image,
          (bounds.x + 8) * sx,
          (bounds.y + 8) * sy,
          (bounds.width - 16) * sx,
          (bounds.height - 80) * sy,
          0,
          0,
          240,
          150,
        )
        const data = ctx.getImageData(0, 0, 240, 150).data
        let lit = 0
        const colors = new Set()
        for (let i = 0; i < data.length; i += 4) {
          const high = Math.max(data[i], data[i + 1], data[i + 2])
          if (high > 85 && high - Math.min(data[i], data[i + 1], data[i + 2]) > 12) {
            lit++
            colors.add([data[i] >> 4, data[i + 1] >> 4, data[i + 2] >> 4].join('/'))
          }
        }
        return { lit, shades: colors.size }
      },
      { base64: png.toString('base64'), bounds },
    )
    if (pixels.lit <= 35 || pixels.shades <= 6 || errors.length)
      throw new Error(JSON.stringify({ pixels, errors }))
    samples.push({
      run: index,
      url,
      world: expectedWorld,
      methodology:
        'CDP actual 4x CPU; 150ms latency; 1.6Mbps down; 750Kbps up; fresh Chromium SwiftShader. Ready timestamp is first committed render-ready marker; composited screenshot verifies actual 3D pixels after keyboard input. Not exact GPU presentation timestamp.',
      measurements,
      pixels,
      errors,
    })
    await writeFile(resolve(out, 'readiness.json'), JSON.stringify(samples, null, 2) + '\n')
    console.log(
      JSON.stringify({
        label,
        index,
        ready: measurements.ready,
        cameraChanged: measurements.cameraChanged,
        pixels,
      }),
    )
  } finally {
    await browser.close()
  }
}

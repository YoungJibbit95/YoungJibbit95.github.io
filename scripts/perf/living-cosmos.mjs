import { chromium } from '@playwright/test'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { resolve } from 'node:path'

const base = process.argv[2] ?? 'http://127.0.0.1:4173'
const out = resolve(process.env.ATLAS_PERF_OUTPUT ?? '.verification/living-cosmos/performance')
await mkdir(out, { recursive: true })
const samples = []
for (const variant of process.argv.includes('--cosmos-only')
  ? ['cosmos']
  : ['existing', 'cosmos']) {
  const browser = await chromium.launch({
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
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
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
    await page.addInitScript(() => {
      window.__cosmosPerf = {
        firstHtml: null,
        rendered: null,
        input: null,
        cameraChanged: null,
        physicalCameraChanged: null,
      }
      const capture = () => {
        const metrics = window.__cosmosPerf
        if (metrics.firstHtml === null && document.querySelector('#atlas-projects article a'))
          metrics.firstHtml = performance.now()
        if (
          metrics.rendered === null &&
          document.querySelector('[data-testid="atlas-scene-ready"]')?.textContent === 'observatory'
        )
          metrics.rendered = performance.now()
        const pose = document.querySelector('[data-testid="atlas-pose"]')?.textContent
        if (metrics.beforePose && pose !== metrics.beforePose && metrics.cameraChanged === null)
          metrics.cameraChanged = performance.now()
      }
      new MutationObserver(capture).observe(document, {
        subtree: true,
        childList: true,
        characterData: true,
      })
    })
    const url =
      base +
      '/atlas/observatory/?world=observatory' +
      (variant === 'cosmos' ? '&cosmos=preview' : '')
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => window.__cosmosPerf.rendered !== null, null, {
      timeout: 60_000,
    })
    await page.getByTestId('atlas-stage').focus()
    await page.evaluate(() => {
      window.__cosmosPerf.beforePose = document.querySelector(
        '[data-testid="atlas-pose"]',
      ).textContent
      window.__cosmosPerf.input = performance.now()
      const output = document.querySelector('[data-testid="atlas-renderer-info"]')
      output.dispatchEvent(new Event('atlas:sample-renderer'))
      const before = JSON.parse(output.value).cameraPosition
      const observePhysicalCamera = () => {
        output.dispatchEvent(new Event('atlas:sample-renderer'))
        const current = JSON.parse(output.value).cameraPosition
        if (current.some((value, index) => Math.abs(value - before[index]) > 1e-7)) {
          window.__cosmosPerf.physicalCameraChanged = performance.now()
        } else requestAnimationFrame(observePhysicalCamera)
      }
      requestAnimationFrame(observePhysicalCamera)
    })
    await page.keyboard.press('ArrowRight')
    await page.waitForFunction(() => window.__cosmosPerf.cameraChanged !== null, null, {
      timeout: 15_000,
    })
    const metrics = await page.evaluate(() => ({
      ...window.__cosmosPerf,
      paints: performance
        .getEntriesByType('paint')
        .map(({ name, startTime }) => ({ name, startTime })),
      resources: performance
        .getEntriesByType('resource')
        .map(({ name, transferSize, decodedBodySize }) => ({
          name,
          transferSize,
          decodedBodySize,
        })),
      domNodes: document.querySelectorAll('*').length,
    }))
    const renderer = await page.getByTestId('atlas-renderer-info').evaluate(async (element) => {
      await new Promise((resolve) => requestIdleCallback(resolve))
      element.dispatchEvent(new Event('atlas:sample-renderer'))
      return JSON.parse(element.value)
    })
    await page.screenshot({ path: resolve(out, variant + '-after-camera.png') })
    if (errors.length || renderer.calls <= 0) throw new Error(JSON.stringify({ errors, renderer }))
    samples.push({ variant, url, browser: browser.version(), metrics, renderer, errors })
    console.log(
      JSON.stringify({
        variant,
        firstHtml: metrics.firstHtml,
        rendered: metrics.rendered,
        cameraChanged: metrics.cameraChanged,
        renderer,
      }),
    )
  } finally {
    await browser.close()
  }
}
const bundles = []
for (const file of await readdir('dist/assets')) {
  if (!/\.(js|css)$/.test(file)) continue
  const data = await readFile(resolve('dist/assets', file))
  bundles.push({ file, bytes: data.length, gzipBytes: gzipSync(data).length })
}
await writeFile(
  resolve(out, 'summary.json'),
  JSON.stringify(
    {
      methodology:
        'One exploratory sample per variant, fresh Chromium/SwiftShader; actual CDP 4x CPU, 150ms latency, 1.6Mbps down. firstHtml is observable prerendered link markup; FCP is the paint metric. rendered is the existing post-render readiness acknowledgement, not a GPU presentation timestamp. physicalCameraChanged samples the actual Three camera on browser rAF; cameraChanged is the later persisted rest pose. Input timing includes automation delivery. No phone/FPS/field CWV claim.',
      samples,
      bundles,
    },
    null,
    2,
  ) + '\n',
)

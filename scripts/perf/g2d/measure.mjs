import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'

const [url = 'http://127.0.0.1:4181/?atlas=preview', label = 'baseline-identity', count = '3'] =
  process.argv.slice(2)
const out = resolve(process.env.ATLAS_PERF_OUTPUT ?? '.verification/g2d/raw', label)
await mkdir(out, { recursive: true })
const lighthousePath = process.env.LIGHTHOUSE_MODULE
if (!lighthousePath)
  throw new Error('Set LIGHTHOUSE_MODULE to pinned lighthouse@13.5.0 core/index.js')
const { default: lighthouse } = await import(pathToFileURL(lighthousePath))
const results = []
for (let index = 1; index <= Number(count); index++) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--remote-debugging-port=9225',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=swiftshader',
    ],
  })
  try {
    const result = await lighthouse(url, {
      port: 9225,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance'],
      formFactor: 'mobile',
      throttlingMethod: 'simulate',
      disableStorageReset: false,
    })
    if (!result || result.lhr.runtimeError)
      throw new Error(JSON.stringify(result?.lhr.runtimeError))
    const { lhr, artifacts } = result
    const id = `${label}-${index}`
    await writeFile(resolve(out, `${id}.lhr.json.gz`), gzipSync(JSON.stringify(lhr)))
    await writeFile(resolve(out, `${id}.trace.json.gz`), gzipSync(JSON.stringify(artifacts.Trace)))
    await writeFile(
      resolve(out, `${id}.devtools.json.gz`),
      gzipSync(JSON.stringify(artifacts.DevtoolsLog)),
    )
    const audit = (key) => lhr.audits[key]
    const metrics = Object.fromEntries(
      [
        'first-contentful-paint',
        'largest-contentful-paint',
        'total-blocking-time',
        'cumulative-layout-shift',
        'speed-index',
      ].map((key) => [key, audit(key).numericValue]),
    )
    const summary = {
      id,
      lighthouseVersion: lhr.lighthouseVersion,
      fetchTime: lhr.fetchTime,
      score: lhr.categories.performance.score,
      metrics,
      settings: lhr.configSettings,
      warnings: lhr.runWarnings,
      mainthread: audit('mainthread-work-breakdown').details.items,
      bootup: audit('bootup-time').details.items,
      longTasks: audit('long-tasks')?.details?.items ?? [],
      requests: audit('network-requests').details.items.map(
        ({ url, transferSize, resourceSize, resourceType, rendererStartTime, networkEndTime }) => ({
          url,
          transferSize,
          resourceSize,
          resourceType,
          rendererStartTime,
          networkEndTime,
        }),
      ),
    }
    results.push(summary)
    await writeFile(resolve(out, 'summary.json'), JSON.stringify(results, null, 2) + '\n')
    console.log(JSON.stringify({ id, score: summary.score, ...metrics }))
  } finally {
    await browser.close()
  }
}

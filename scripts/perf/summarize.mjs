import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { gzipSync, gunzipSync } from 'node:zlib'

const root = resolve('docs/experience/performance')
const buildRoot = resolve(process.argv[2] ?? 'dist')
const assetOutput = process.argv[3] ?? 'asset-sizes.json'
const stats = (values) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  return {
    median: sorted[Math.floor(sorted.length / 2)],
    min: sorted[0],
    max: sorted.at(-1),
    samples: sorted.length,
  }
}
const output = {}
for (const label of await readdir(root)) {
  if (!(await stat(join(root, label))).isDirectory()) continue
  const runs = await readFile(join(root, label, 'summary.json'), 'utf8')
    .then(JSON.parse)
    .catch(() => [])
  const readiness = await readFile(join(root, label, 'readiness.json'), 'utf8')
    .then(JSON.parse)
    .catch(() => [])
  output[label] = { metrics: {}, readiness: {} }
  for (const metric of [
    'first-contentful-paint',
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift',
    'speed-index',
  ])
    output[label].metrics[metric] = stats(runs.map((r) => r.metrics[metric]))
  output[label].metrics.score = stats(runs.map((r) => 100 * r.score))
  output[label].metrics.downloadBytes = stats(
    runs.map((r) => r.requests.reduce((sum, x) => sum + x.transferSize, 0)),
  )
  output[label].metrics.decodedJavaScriptBytes = stats(
    runs.map((r) =>
      r.requests
        .filter((x) => x.resourceType === 'Script')
        .reduce((sum, x) => sum + x.resourceSize, 0),
    ),
  )
  output[label].metrics.mainThreadScriptParseCompileMs = stats(
    runs.map((r) => r.mainthread.find((x) => x.group === 'scriptParseCompile')?.duration),
  )
  output[label].metrics.scriptEvaluationMs = stats(
    runs.map((r) => r.mainthread.find((x) => x.group === 'scriptEvaluation')?.duration),
  )
  output[label].metrics.styleLayoutMs = stats(
    runs.map((r) => r.mainthread.find((x) => x.group === 'styleLayout')?.duration),
  )
  output[label].metrics.longestTaskMs = stats(
    runs.map((r) => Math.max(...r.longTasks.map((x) => x.duration))),
  )
  const parse = []
  for (const run of runs) {
    const trace = JSON.parse(
      gunzipSync(await readFile(join(root, label, run.id + '.trace.json.gz'))),
    )
    const events = trace.traceEvents.filter(
      (e) => e.name === 'BackgroundJSStreamManager::RunScriptStreamingTask',
    )
    parse.push(events.reduce((sum, e) => sum + (e.dur ?? 0) / 1000, 0))
  }
  output[label].metrics.backgroundParseStreamingMs = stats(parse)
  for (const name of ['ready', 'cameraChanged'])
    output[label].readiness[name] = stats(readiness.map((r) => r.measurements[name]))
  output[label].readiness.inputToPoseRestMs = stats(
    readiness.map((r) => r.measurements.cameraChanged - r.measurements.inputSent),
  )
  output[label].readiness.contextCreationMs = stats(
    readiness.map((r) =>
      r.measurements.glCalls
        .filter((c) => c.operation.startsWith('getContext'))
        .reduce((sum, c) => sum + c.duration, 0),
    ),
  )
  output[label].readiness.shaderProgramCallsMs = stats(
    readiness.map((r) =>
      r.measurements.glCalls
        .filter((c) => !c.operation.startsWith('getContext'))
        .reduce((sum, c) => sum + c.duration, 0),
    ),
  )
}
await writeFile(join(root, 'comparison.json'), JSON.stringify(output, null, 2) + '\n')
console.log(JSON.stringify(output, null, 2))

// Deterministic compression sizes are separate from browser transfer reporting.
const files = await readdir(join(buildRoot, 'assets'))
const sizes = []
for (const file of files) {
  const raw = await readFile(join(buildRoot, 'assets', file))
  sizes.push({ file, bytes: raw.length, gzipBytes: gzipSync(raw).length })
}
const html = await readFile(join(buildRoot, 'index.html'))
sizes.push({ file: 'index.html', bytes: html.length, gzipBytes: gzipSync(html).length })
await writeFile(join(root, assetOutput), JSON.stringify(sizes, null, 2) + '\n')

import { mkdir, readFile, readdir, writeFile, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join, relative } from 'node:path'

const root = '.verification/g2d'
const repaired = process.argv[2] === 'world-entry'
const rawRoot = repaired ? 'raw-world-entry' : 'raw'
const output = join(root, repaired ? 'summary-world-entry' : 'summary')
await mkdir(output, { recursive: true })
const read = async (path) => JSON.parse(await readFile(path, 'utf8'))
const spread = (values) => {
  const ordered = [...values].sort((a, b) => a - b)
  return {
    median: ordered[Math.floor(ordered.length / 2)],
    min: ordered[0],
    max: ordered.at(-1),
    samples: values,
  }
}
const groups = {}
const compactRuns = []
for (const world of repaired ? ['observatory'] : ['origin', 'observatory']) {
  groups[world] = {}
  for (const variant of ['baseline', 'candidate']) {
    const metrics = {}
    const push = (name, value) => (metrics[name] ??= []).push(value)
    for (let run = 1; run <= 3; run++) {
      const label = `${world}-${variant}-${run}`
      const [lh] = await read(join(root, rawRoot, label, 'summary.json'))
      const [actual] = await read(join(root, rawRoot, label, 'readiness.json'))
      for (const [name, value] of Object.entries(lh.metrics)) push(name, value)
      push('score', lh.score * 100)
      push('longestSimulatedTask', Math.max(...lh.longTasks.map((task) => task.duration)))
      const actualFcp = actual.measurements.paints.find(
        (paint) => paint.name === 'first-contentful-paint',
      )?.startTime
      push('actualFcp', actualFcp)
      push('actualFrameReady', actual.measurements.ready)
      push('actualCameraRestFromNavigation', actual.measurements.cameraChanged)
      push(
        'actualInputToCameraRest',
        actual.measurements.cameraChanged - actual.measurements.inputSent,
      )
      push(
        'actualLongestTask',
        Math.max(...actual.measurements.longTasks.map((task) => task.duration)),
      )
      push(
        'browserTransferBytes',
        lh.requests.reduce((sum, request) => sum + request.transferSize, 0),
      )
      push(
        'styleLayoutMs',
        lh.mainthread.find((group) => group.group === 'styleLayout')?.duration ?? 0,
      )
      compactRuns.push({
        label,
        fetchTime: lh.fetchTime,
        lighthouseVersion: lh.lighthouseVersion,
        browserVersion: actual.browserVersion,
        metrics: lh.metrics,
        score: lh.score,
        longTasks: lh.longTasks,
        mainthread: lh.mainthread,
        actual: {
          fcp: actualFcp,
          ready: actual.measurements.ready,
          inputSent: actual.measurements.inputSent,
          cameraChanged: actual.measurements.cameraChanged,
          longTasks: actual.measurements.longTasks,
          pixels: actual.pixels,
          errors: actual.errors,
        },
      })
    }
    groups[world][variant] = Object.fromEntries(
      Object.entries(metrics).map(([name, values]) => [name, spread(values)]),
    )
  }
}
const manifests = {
  baseline: await read(join(root, 'baseline-manifest.json')),
  candidate: await read(
    join(root, repaired ? 'candidate-world-manifest.json' : 'candidate-manifest.json'),
  ),
}
const summary = {
  capturedAt: new Date().toISOString(),
  methodology:
    'Three alternating paired repeats, unchanged manifested builds, dedicated quiet window. Lighthouse simulated mobile plus separate real CDP 4xCPU/150ms/1.6Mbps runs with full actual scene, pixels and successful physical keyboard camera input. Camera rest includes authored easing; not INP. Identity transport both ports.',
  sources: { baseline: manifests.baseline.source, candidate: manifests.candidate.source },
  groups,
}
await writeFile(join(output, 'comparison.json'), JSON.stringify(summary, null, 2) + '\n')
await writeFile(join(output, 'runs.json'), JSON.stringify(compactRuns, null, 2) + '\n')
const inventory = []
async function inspect(folder) {
  for (const name of await readdir(folder)) {
    const file = join(folder, name)
    if ((await stat(file)).isDirectory()) await inspect(file)
    else {
      const content = await readFile(file)
      inventory.push({
        path: relative(root, file).replaceAll('\\', '/'),
        bytes: content.length,
        sha256: createHash('sha256').update(content).digest('hex'),
      })
    }
  }
}
await inspect(join(root, rawRoot))
await writeFile(
  join(output, 'raw-manifest.json'),
  JSON.stringify({ sources: summary.sources, files: inventory }, null, 2) + '\n',
)
for (const [world, variants] of Object.entries(groups)) {
  console.log(world)
  for (const [variant, metrics] of Object.entries(variants))
    console.log(
      JSON.stringify({
        variant,
        fcp: metrics['first-contentful-paint'],
        lcp: metrics['largest-contentful-paint'],
        tbt: metrics['total-blocking-time'],
        ready: metrics.actualFrameReady,
        camera: metrics.actualCameraRestFromNavigation,
      }),
    )
}

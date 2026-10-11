import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'

if (process.env.ATLAS_PERF_QUIET !== 'confirmed')
  throw new Error('Run only after Lead confirms a quiet browser/build window')
await mkdir('.verification/g2d', { recursive: true })
const phase = process.argv[2] ?? 'initial'
const repaired = phase === 'world-entry'
const worlds = repaired ? ['observatory'] : ['origin', 'observatory']
const rawOutput = repaired ? '.verification/g2d/raw-world-entry' : '.verification/g2d/raw'
const runs = []
for (let repeat = 1; repeat <= 3; repeat++) {
  for (const world of worlds) {
    // Alternating order reduces systematic thermal/cache ordering bias.
    const variants = repeat % 2 ? ['baseline', 'candidate'] : ['candidate', 'baseline']
    for (const method of ['measure', 'readiness']) {
      for (const variant of variants) {
        const url =
          variant === 'baseline'
            ? `http://127.0.0.1:4183/?atlas=preview&world=${world}`
            : `http://127.0.0.1:4184/atlas/${repaired ? 'observatory/' : ''}?atlas=preview&world=${world}`
        const label = `${world}-${variant}-${repeat}`
        const startedAt = new Date().toISOString()
        const run = spawnSync(
          process.execPath,
          [`scripts/perf/g2d/${method}.mjs`, url, label, '1'],
          { encoding: 'utf8', env: { ...process.env, ATLAS_PERF_OUTPUT: rawOutput } },
        )
        process.stdout.write(run.stdout ?? '')
        process.stderr.write(run.stderr ?? '')
        runs.push({
          repeat,
          world,
          variant,
          method,
          url,
          label,
          startedAt,
          finishedAt: new Date().toISOString(),
          status: run.status,
        })
        await writeFile(
          `.verification/g2d/runs${repaired ? '-world-entry' : ''}.json`,
          JSON.stringify(runs, null, 2) + '\n',
        )
        if (run.status !== 0) process.exit(run.status ?? 1)
      }
    }
  }
}

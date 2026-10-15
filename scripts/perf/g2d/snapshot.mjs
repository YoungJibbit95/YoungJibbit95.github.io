import { cp, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { resolve, relative, join } from 'node:path'

const label = process.argv[2]
if (!['baseline', 'candidate', 'candidate-world'].includes(label))
  throw new Error('Use baseline, candidate or candidate-world')
const target = resolve('.verification/g2d/builds', label)
if (await stat(target).catch(() => null))
  throw new Error('Immutable snapshot exists; do not overwrite')
await mkdir(resolve('.verification/g2d/builds'), { recursive: true })
await cp(resolve('dist'), target, { recursive: true, force: false, errorOnExist: true })
const files = []
async function inspect(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name)
    if (entry.isDirectory()) await inspect(file)
    else {
      const content = await readFile(file)
      files.push({
        path: relative(target, file).replaceAll('\\', '/'),
        bytes: content.length,
        sha256: createHash('sha256').update(content).digest('hex'),
      })
    }
  }
}
await inspect(target)
await writeFile(
  resolve('.verification/g2d', `${label}-manifest.json`),
  JSON.stringify(
    {
      label,
      source: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      capturedAt: new Date().toISOString(),
      files,
    },
    null,
    2,
  ) + '\n',
)
console.log(`${label}: ${files.length} files captured`)

import { cp, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve, relative, join, sep } from 'node:path'

const source = resolve(process.argv[2] ?? 'dist')
const target = resolve(process.argv[3] ?? '.verification/perf/integrated-dist')
const allowedRoot = resolve('.verification/perf')
if (!target.startsWith(allowedRoot + sep))
  throw new Error('Snapshot target must stay in .verification/perf')
if (await stat(target).catch(() => null))
  throw new Error('Snapshot already exists; choose a fresh name to preserve immutability')
await mkdir(allowedRoot, { recursive: true })
await cp(source, target, { recursive: true, errorOnExist: true, force: false })
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
await mkdir('docs/experience/performance', { recursive: true })
await writeFile(
  'docs/experience/performance/integrated-build-manifest.json',
  JSON.stringify({ capturedAt: new Date().toISOString(), source, target, files }, null, 2) + '\n',
)
console.log(`Immutable snapshot: ${files.length} files in ${target}`)

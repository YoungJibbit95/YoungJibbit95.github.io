import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { gzipSync } from 'node:zlib'

// Same server/cache policy on both ports; only HTTP content encoding differs.
const root = resolve(process.argv[2] ?? 'dist')
const port = Number(process.argv[3] ?? 4181)
const compression = process.argv[4] === 'gzip'
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
}
const cache = new Map()
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    let file = resolve(root, '.' + pathname)
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end()
      return
    }
    if (file === root || (await stat(file).catch(() => null))?.isDirectory())
      file = resolve(file, 'index.html')
    let content = cache.get(file)
    if (!content) {
      const raw = await readFile(file)
      content = { raw, gzip: gzipSync(raw) }
      cache.set(file, content)
    }
    const zipped =
      compression &&
      /gzip/.test(req.headers['accept-encoding'] ?? '') &&
      /\.(html|js|css|json|svg)$/.test(file)
    const body = zipped ? content.gzip : content.raw
    res.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': body.length,
      Vary: 'Accept-Encoding',
      ...(zipped ? { 'Content-Encoding': 'gzip' } : {}),
    })
    res.end(body)
  } catch {
    res.writeHead(404).end('Not found')
  }
}).listen(port, '127.0.0.1', () => console.log(`Serving ${root} on ${port}; gzip=${compression}`))

import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

// Author-generated RGBA dust field. Run once during authoring, never in the app.
const size = 256
function noise(x, y) {
  const cell = (a, b) => {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123
    return n - Math.floor(n)
  }
  const ix = Math.floor(x),
    iy = Math.floor(y)
  let fx = x - ix,
    fy = y - iy
  fx = fx * fx * (3 - 2 * fx)
  fy = fy * fy * (3 - 2 * fy)
  const a = cell(ix, iy) * (1 - fx) + cell(ix + 1, iy) * fx
  const b = cell(ix, iy + 1) * (1 - fx) + cell(ix + 1, iy + 1) * fx
  return a * (1 - fy) + b * fy
}
const pixels = Buffer.alloc((size * 4 + 1) * size)
for (let y = 0; y < size; y++)
  for (let x = 0; x < size; x++) {
    const u = x / size,
      v = y / size
    let cloud = 0,
      amplitude = 0.55,
      frequency = 4
    for (let octave = 0; octave < 5; octave++) {
      cloud += noise(u * frequency + 23, v * frequency + 91) * amplitude
      amplitude *= 0.5
      frequency *= 2
    }
    const ribbon = v - 0.5 + Math.sin(u * 5.5) * 0.17
    const shape = Math.exp(-ribbon * ribbon * 12) * Math.pow(Math.sin(u * Math.PI), 1.1)
    const edge = Math.min(1, Math.min(u, v, 1 - u, 1 - v) * 8)
    const density = Math.pow(Math.max(0, cloud - 0.24) * 1.75, 2)
    const i = y * (size * 4 + 1) + 1 + x * 4
    pixels[i] = 190 + cloud * 45
    pixels[i + 1] = 170 + cloud * 55
    pixels[i + 2] = 255
    pixels[i + 3] = Math.min(255, shape * edge * density * 225)
  }
function chunk(type, data) {
  const name = Buffer.from(type)
  const source = Buffer.concat([name, data])
  let crc = 0xffffffff
  for (const byte of source) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  const length = Buffer.alloc(4),
    checksum = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0)
  return Buffer.concat([length, name, data, checksum])
}
const header = Buffer.alloc(13)
header.writeUInt32BE(size, 0)
header.writeUInt32BE(size, 4)
header[8] = 8
header[9] = 6
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', header),
  chunk('IDAT', deflateSync(pixels)),
  chunk('IEND', Buffer.alloc(0)),
])
writeFileSync(new URL('./nebula-dust.png', import.meta.url), png)
console.log(`nebula-dust.png: ${png.length} bytes`)

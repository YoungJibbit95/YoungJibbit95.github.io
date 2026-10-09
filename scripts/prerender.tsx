import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import Entry from '../src/experience/Entry'

const file = resolve('dist/index.html')
const template = await readFile(file, 'utf8')
if (!template.includes('<!--app-html-->'))
  throw new Error('Missing prerender placeholder in the production HTML.')
const markup = renderToString(
  <StrictMode>
    <Entry />
  </StrictMode>,
)
await writeFile(file, template.replace('<!--app-html-->', markup), 'utf8')
console.log('Prerendered portfolio content into dist/index.html.')

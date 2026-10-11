import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from '../src/App'
import ExperienceRoot from '../src/experience/ExperienceRoot'

const file = resolve('dist/index.html')
const template = await readFile(file, 'utf8')
if (!template.includes('<!--app-html-->'))
  throw new Error('Missing prerender placeholder in the production HTML.')
const markup = renderToString(
  <StrictMode>
    <App />
  </StrictMode>,
)
await writeFile(file, template.replace('<!--app-html-->', markup), 'utf8')
console.log('Prerendered portfolio content into dist/index.html.')

const atlasFile = resolve('dist/atlas/index.html')
const atlasTemplate = await readFile(atlasFile, 'utf8')
if (!atlasTemplate.includes('<!--app-html-->'))
  throw new Error('Missing atlas prerender placeholder.')
const atlasMarkup = renderToString(
  <StrictMode>
    <ExperienceRoot />
  </StrictMode>,
).replaceAll('href="/?atlas=preview', 'href="/atlas/?atlas=preview')
await writeFile(atlasFile, atlasTemplate.replace('<!--app-html-->', atlasMarkup), 'utf8')
console.log('Prerendered the complete semantic Experience into dist/atlas/index.html.')

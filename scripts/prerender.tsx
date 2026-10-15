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

for (const world of ['origin', 'observatory'] as const) {
  const atlasFile = resolve(
    world === 'origin' ? 'dist/atlas/index.html' : 'dist/atlas/observatory/index.html',
  )
  const atlasTemplate = await readFile(atlasFile, 'utf8')
  if (!atlasTemplate.includes('<!--app-html-->'))
    throw new Error('Missing atlas prerender placeholder.')
  const atlasMarkup = renderToString(
    <StrictMode>
      <ExperienceRoot initialWorld={world} />
    </StrictMode>,
  )
    .replaceAll(
      'href="/?atlas=preview&amp;world=origin',
      'href="/atlas/?atlas=preview&amp;world=origin',
    )
    .replaceAll(
      'href="/?atlas=preview&amp;world=observatory',
      'href="/atlas/observatory/?atlas=preview&amp;world=observatory',
    )
  await writeFile(atlasFile, atlasTemplate.replace('<!--app-html-->', atlasMarkup), 'utf8')
  console.log(`Prerendered ${world} into ${atlasFile}.`)
}

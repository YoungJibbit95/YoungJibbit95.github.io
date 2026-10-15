import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const evidence = []
const positions = {
  nexus: [-230, 35, -120],
  cerebri: [-110, 95, -370],
  novacore: [115, 15, -190],
  nemisis: [310, 5, -300],
  adventura: [255, -70, 40],
  yjse: [-70, -105, -470],
  jarvis: [-400, -15, -520],
}
for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('http://localhost:3001/docs/experience/evidence/g2c/art/study-harness.html')
  await page.waitForFunction(() => window.painted > 0)
  await page.waitForTimeout(300)
  await page.screenshot({ path: `docs/experience/evidence/g2c/art/final-overview-${width}.png` })
  evidence.push({
    view: `overview-${width}`,
    info: await page.evaluate(() => ({ render: window.art.capture(), lod: window.lod })),
  })
  for (const [id, target] of Object.entries(positions)) {
    if (width === 390 && id !== 'nexus') continue
    const offset = width === 390 ? [75, 65, 135] : [85, 60, 145]
    await page.evaluate(
      ({ target, offset }) =>
        window.art.setPose(
          target.map((x, i) => x + offset[i]),
          target,
        ),
      { target, offset },
    )
    await page.waitForTimeout(250)
    assert.equal(await page.evaluate((id) => window.lod.levels[id], id), 'micro')
    const info = await page.evaluate(
      (id) => ({
        render: window.art.capture(),
        lod: window.lod,
        meso: window.art.scene.getObjectByName('meso-' + id).visible,
        micro: window.art.scene.getObjectByName('micro-' + id).visible,
      }),
      id,
    )
    assert.equal(info.meso, true)
    assert.equal(info.micro, true)
    await page.screenshot({
      path: `docs/experience/evidence/g2c/art/final-${id}-micro-${width}.png`,
    })
    evidence.push({ view: `${id}-micro-${width}`, info })
  }
  await page.evaluate(() => window.art.setPose([-145, 130, 255], [-230, 35, -120]))
  await page.waitForTimeout(250)
  assert.equal(await page.evaluate(() => window.lod.levels.nexus), 'meso')
  await page.screenshot({ path: `docs/experience/evidence/g2c/art/final-nexus-meso-${width}.png` })
  const meso = await page.evaluate(() => ({
    render: window.art.capture(),
    lod: window.lod,
    micro: window.art.scene.getObjectByName('micro-nexus').visible,
  }))
  assert.equal(meso.micro, false)
  evidence.push({ view: `nexus-meso-${width}`, info: meso })
  await page.evaluate(() => window.setVisible(['novacore']))
  await page.waitForTimeout(200)
  const visibility = await page.evaluate(() =>
    ['nexus', 'cerebri', 'novacore', 'nemisis', 'adventura', 'yjse', 'jarvis'].map((id) => [
      id,
      window.art.scene.getObjectByName('observatory-' + id).visible,
    ]),
  )
  assert.deepEqual(
    visibility.filter(([, visible]) => visible).map(([id]) => id),
    ['novacore'],
  )
  assert.equal(
    await page.evaluate(
      () => window.art.scene.getObjectByName('edge-novacore-nemisis') === undefined,
    ),
    true,
  )
  const before = await page.evaluate(() => window.painted)
  await page.waitForTimeout(500)
  assert.equal(await page.evaluate(() => window.painted), before)
  assert.deepEqual(errors, [])
  evidence.push({ view: `filter-idle-${width}`, visibility, idleFrames: before, errors })
  await page.close()
}
await writeFile(
  'docs/experience/evidence/g2c/art/render-evidence.json',
  JSON.stringify(
    {
      method:
        'Isolated browser harness imports production ObservatoryWorld and source data; same R3F demand rendering and CameraControls. Final integration UI/history tested separately by QA.',
      evidence,
    },
    null,
    2,
  ),
)
console.log(
  'PASS: seven actual micro states, macro/meso/micro groups, filtered geometry+edges, no perpetual RAF, zero errors, desktop/mobile captures.',
)
await browser.close()

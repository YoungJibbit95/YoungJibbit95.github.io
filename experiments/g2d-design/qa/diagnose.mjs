import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const out = 'docs/experience/evidence/g2d/qa'
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  await page.goto('http://127.0.0.1:3012/experiments/g2d-design/direction-b/')
  await page.waitForFunction(() => window.bReady)
  await page.getByRole('button', { name: /Nexus erkunden/ }).click()
  await page.getByRole('button', { name: /Den Kern freilegen/ }).click()
  const resources = []
  for (let cycle = 0; cycle < 5; cycle++) {
    await page.getByRole('button', { name: 'Ursprung', exact: true }).click()
    await page.evaluate(() => new Promise((resolve) => requestIdleCallback(resolve)))
    await page.waitForTimeout(900)
    await page.getByRole('button', { name: 'Sternwarte', exact: true }).click()
    await page.evaluate(() => new Promise((resolve) => requestIdleCallback(resolve)))
    await page.waitForTimeout(900)
    const initial = await page.evaluate(() => window.bCapture())
    await page.evaluate(() => new Promise((resolve) => requestIdleCallback(resolve)))
    await page.waitForTimeout(900)
    const settled = await page.evaluate(() => window.bCapture())
    resources.push({ cycle, initial, settled })
    console.log(JSON.stringify(resources.at(-1)))
    await writeFile(`${out}/b-resource-recheck.json`, JSON.stringify(resources, null, 2))
  }
  await page.close()
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })
  await mobile.goto('http://127.0.0.1:3013/experiments/g2d-design/mobile/index.html')
  await mobile.getByRole('button', { name: 'Bei Nexus beginnen' }).tap()
  await mobile.getByRole('combobox', { name: 'Anderes Projekt' }).selectOption('jarvis')
  await mobile.getByRole('button', { name: 'Projekt lesen' }).tap()
  const focus = []
  for (let i = 0; i < 7; i++) {
    focus.push(
      await mobile.evaluate(() => ({
        tag: document.activeElement.tagName,
        text: document.activeElement.textContent.slice(0, 70),
        within: !!document.activeElement.closest('dialog'),
        modal: document.querySelector('dialog').matches(':modal'),
      })),
    )
    await mobile.keyboard.press('Tab')
  }
  const forcedBackground = await mobile.evaluate(() => {
    document.querySelector('main > a').focus()
    return {
      activeTag: document.activeElement.tagName,
      insideDialog: !!document.activeElement.closest('dialog'),
    }
  })
  await writeFile(
    `${out}/shelf-focus-diagnosis.json`,
    JSON.stringify({ focus, forcedBackground }, null, 2),
  )
  console.log(JSON.stringify({ focus, forcedBackground }))
  await mobile.screenshot({ path: `${out}/mobile-reader-390.png` })
  await mobile.keyboard.press('Escape')
  assert.equal(await mobile.evaluate(() => document.activeElement.textContent), 'Projekt lesen')
  await mobile.close()
  const a = await browser.newPage({
    viewport: { width: 768, height: 1024 },
    reducedMotion: 'reduce',
  })
  await a.goto('http://127.0.0.1:3011/experiments/g2d-design/direction-a/')
  await a.waitForFunction(
    () => document.querySelector('#renderer-evidence')?.dataset.ready === 'true',
  )
  await a.getByRole('button', { name: 'Projekte', exact: true }).click()
  await a.getByRole('button', { name: /Nexus entdecken/ }).click()
  await a.getByRole('button', { name: /Kammer öffnen/ }).click()
  await a.waitForTimeout(900)
  await a.screenshot({ path: `${out}/a-discovery-repaired-768.png` })
  const aFix = await a.locator('header,.project-index button').evaluateAll((elements) =>
    elements.map((el) => ({
      name: el.textContent.slice(0, 40),
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
      background: getComputedStyle(el).backgroundColor,
    })),
  )
  assert(aFix.slice(1).every((el) => el.width >= 44 && el.height >= 44))
  assert.equal(aFix[0].background, 'rgb(215, 216, 205)')
  await writeFile(`${out}/a-header-repair.json`, JSON.stringify(aFix, null, 2))
  await a.close()
} finally {
  await browser.close()
}

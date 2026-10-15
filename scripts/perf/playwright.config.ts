import { defineConfig, devices } from '@playwright/test'
import { resolve } from 'node:path'

// Isolated performance experiments reuse the unchanged product regression tests.
export default defineConfig({
  testDir: resolve('tests'),
  outputDir: resolve('.verification/perf/regression-results'),
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4181',
    trace: 'retain-on-failure',
    launchOptions: { args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'] },
  },
})

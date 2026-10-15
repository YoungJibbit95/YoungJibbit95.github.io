import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // SwiftShader WebGL and GSAP share the CI CPU; parallel browsers caused animation stalls.
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: { args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'] },
  },
  projects: [
    { name: 'chromium', testIgnore: 'portfolio.spec.ts', use: { ...devices['Desktop Chrome'] } },
    // Start a fresh browser for the legacy document after the WebGL workload.
    // CI traces showed context creation consuming 22–28 seconds of a 30-second test.
    {
      name: 'legacy-chromium',
      testMatch: 'portfolio.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
})

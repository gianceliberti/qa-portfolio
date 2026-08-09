import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the QA portfolio.
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // En CI usamos el reporter "blob": cada shard produce un fragmento que luego se
  // fusiona en UN solo reporte HTML (ver el workflow de GitHub Actions). En local,
  // HTML navegable + lista en la terminal.
  reporter: process.env.CI
    ? [['blob'], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

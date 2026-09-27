import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4000',
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  expect: {
    toBeVisibleOptions: { timeout: 15000 },
    toHaveTextOptions: { timeout: 5000 }
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});

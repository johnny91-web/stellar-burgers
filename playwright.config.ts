import { defineConfig } from '@playwright/test';


export default defineConfig({
  use: {
    baseURL: 'http://localhost:4000',
    headless: false, // для отладки
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  expect: {
    toBeVisibleOptions: { timeout: 15000 },
    toHaveTextOptions: { timeout: 5000 }
  }
});

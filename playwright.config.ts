import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000,
  retries: 0,
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: true,
    baseURL: 'https://www.saucedemo.com/',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
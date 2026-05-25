const { defineConfig } = require('@playwright/test');
const path = require('path');

const API_PORT = 4000;
const FRONTEND_PORT = 5173;
const BASE_URL = `http://localhost:${FRONTEND_PORT}`;

module.exports = defineConfig({
  testDir: '.',
  testMatch: '*.spec.js',
  timeout: 60000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: `node ${path.resolve(__dirname, '..', 'api', 'index.js')}`,
      port: API_PORT,
      timeout: 15000,
      reuseExistingServer: !process.env.CI,
      cwd: path.resolve(__dirname, '..', 'api'),
    },
    {
      command: `npx vite --port ${FRONTEND_PORT} --host 0.0.0.0`,
      port: FRONTEND_PORT,
      timeout: 30000,
      reuseExistingServer: !process.env.CI,
      cwd: path.resolve(__dirname, '..', 'pro'),
    },
  ],
});

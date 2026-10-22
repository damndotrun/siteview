import { defineConfig } from '@playwright/test';

// Az e2e a már megépített kiegészítőt tölti be (.output/chrome-mv3): előtte `npm run build`.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 2,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    trace: 'retain-on-failure',
  },
});

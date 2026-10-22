import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test as base, chromium, expect, type BrowserContext, type Page, type Worker } from '@playwright/test';
import { startFixtureServer } from './server';

export { expect };

/** A rögzített `key`-ből számolt azonosító (wxt.config.ts). */
export const EXTENSION_ID = 'bpeghpddlcamabdbmkekdoccaogngenl';
export const NATIVE_HOST_NAME = 'com.siteview.companion';
export const EXTENSION_PATH = resolve(import.meta.dirname, '..', '..', '.output', 'chrome-mv3');
export const FAKE_HOST_PATH = resolve(import.meta.dirname, '..', 'fake-host', 'host.mjs');

export interface TabState {
  id: number;
  url: string;
  title: string;
  active: boolean;
  discarded: boolean;
  pinned: boolean;
  audible: boolean;
  windowId: number;
}

type Fixtures = {
  nativeHost: boolean;
  userDataDir: string;
  context: BrowserContext;
  serviceWorker: Worker;
  extensionId: string;
  panel: Page;
};

type WorkerFixtures = { fixtureServer: Awaited<ReturnType<typeof startFixtureServer>> };

/** A hamis native host manifestje a profilmappa `NativeMessagingHosts` alá (Linuxon itt keresi a Chromium). */
export function writeNativeHostManifest(dir: string, name = NATIVE_HOST_NAME) {
  mkdirSync(dir, { recursive: true });
  const manifest = {
    name,
    description: 'Siteview hamis companion (e2e)',
    path: FAKE_HOST_PATH,
    type: 'stdio',
    allowed_origins: [`chrome-extension://${EXTENSION_ID}/`],
  };
  writeFileSync(join(dir, `${name}.json`), JSON.stringify(manifest, null, 2));
}

export const test = base.extend<Fixtures, WorkerFixtures>({
  fixtureServer: [
    async ({}, use) => {
      const server = await startFixtureServer();
      await use(server);
      server.server.close();
    },
    { scope: 'worker' },
  ],

  nativeHost: [false, { option: true }],

  userDataDir: async ({}, use) => {
    await use(mkdtempSync(join(tmpdir(), 'siteview-e2e-')));
  },

  context: async ({ fixtureServer, nativeHost, userDataDir }, use) => {
    if (nativeHost) writeNativeHostManifest(join(userDataDir, 'NativeMessagingHosts'));
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chromium',
      // A nézetméret-emuláció az altatott tab új célpontján összeomlasztja a böngészőt, ezért kikapcsolva.
      viewport: null,
      // A „hangot játszik” állapothoz kell a hang (a Playwright alapból némít).
      ignoreDefaultArgs: ['--mute-audio'],
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
        '--silent-debugger-extension-api',
        '--autoplay-policy=no-user-gesture-required',
        `--host-resolver-rules=MAP www.youtube.com 127.0.0.1:${fixtureServer.port}`,
      ],
    });
    await use(context);
    await context.close();
  },

  serviceWorker: async ({ context }, use) => {
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await use(worker);
  },

  extensionId: async ({ serviceWorker }, use) => {
    await use(new URL(serviceWorker.url()).host);
  },

  panel: async ({ context, extensionId }, use) => {
    // A panel e2e-ben lapként nyílik (az eszköztár-ikonra a Playwright nem tud kattintani).
    const page = context.pages()[0] ?? (await context.newPage());
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
    await use(page);
    expect(errors, 'a panel nem írhat hibát a konzolra').toEqual([]);
  },
});

/** `runAction` a panelből, a valódi háttérüzeneten át (Döntések: Tesztelhetőség). */
export async function runAction(panel: Page, name: string, data: Record<string, unknown> = {}) {
  return panel.evaluate(
    ([name, data]) => chrome.runtime.sendMessage({ type: 'runAction', name, data }),
    [name, data] as const,
  ) as Promise<{ ok: boolean; result?: unknown; error?: string }>;
}

export async function listTabs(panel: Page): Promise<TabState[]> {
  return panel.evaluate(async () =>
    (await chrome.tabs.query({})).map((tab) => ({
      id: tab.id!,
      // Dekódolva, hogy a tesztek az ékezetes ?cim= paraméterre is kereshessenek.
      url: decodeURIComponent(tab.url ?? tab.pendingUrl ?? ''),
      title: tab.title ?? '',
      active: tab.active,
      discarded: tab.discarded,
      pinned: tab.pinned,
      audible: !!tab.audible,
      windowId: tab.windowId,
    })),
  );
}

/** A tab állapota, vagy `undefined`, ha (még) nincs ilyen; `expect.poll`-hoz. */
export async function tabState(panel: Page, predicate: (tab: TabState) => boolean) {
  return (await listTabs(panel)).find(predicate);
}

export async function findTab(panel: Page, predicate: (tab: TabState) => boolean) {
  const tab = (await listTabs(panel)).find(predicate);
  if (!tab) throw new Error('Nincs ilyen tab');
  return tab;
}

/** Új tab Playwrighttal (előtérben nyílik), betöltve. */
export async function openPage(context: BrowserContext, url: string) {
  const page = await context.newPage();
  await page.goto(url);
  return page;
}

export async function setSettings(panel: Page, moduleId: string, patch: Record<string, unknown>) {
  await panel.evaluate(
    async ([moduleId, patch]) => {
      const key = `settings:${moduleId}`;
      const current = (await chrome.storage.sync.get(key))[key] ?? {};
      await chrome.storage.sync.set({ [key]: { ...current, ...patch } });
    },
    [moduleId, patch] as const,
  );
}

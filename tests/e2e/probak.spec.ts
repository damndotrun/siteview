import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { CDPSession, Page } from '@playwright/test';
import { NATIVE_HOST_NAME, expect, openPage, test, writeNativeHostManifest } from './fixtures';

// Az 1. munkacsomag kockázati próbái. Az eredményt a teszt jegyzetként (annotation) is rögzíti;
// a PR leírása ezekből készül.

const note = (type: string, description: string) => test.info().annotations.push({ type, description });

function isAlive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** Natív port a panel lapjából; a fogadott `tick` számlálót és a lezárást az ablakban tartja. */
async function connectFromPanel(panel: Page, host: string) {
  return panel.evaluate(
    (host) =>
      new Promise<{ pid?: number; error?: string }>((resolve) => {
        const state = { ticks: 0, disconnected: '' };
        (window as unknown as { probe: typeof state }).probe = state;
        const port = chrome.runtime.connectNative(host);
        port.onMessage.addListener((message: { type: string; pid?: number; n?: number }) => {
          if (message.type === 'pong') {
            port.postMessage({ type: 'start' });
            resolve({ pid: message.pid });
          }
          if (message.type === 'tick') state.ticks = message.n!;
        });
        port.onDisconnect.addListener(() => {
          state.disconnected = chrome.runtime.lastError?.message ?? 'lezárva';
          resolve({ error: state.disconnected });
        });
        port.postMessage({ type: 'ping' });
      }),
    host,
  );
}

const panelProbe = (panel: Page) =>
  panel.evaluate(() => (window as unknown as { probe: { ticks: number; disconnected: string } }).probe);

async function stopServiceWorkers(panel: Page): Promise<CDPSession> {
  const cdp = await panel.context().newCDPSession(panel);
  const statuses: string[] = [];
  cdp.on('ServiceWorker.workerVersionUpdated', ({ versions }) => {
    for (const version of versions) statuses.push(version.runningStatus);
  });
  await cdp.send('ServiceWorker.enable');
  await cdp.send('ServiceWorker.stopAllWorkers');
  await expect.poll(() => statuses.at(-1)).toBe('stopped');
  return cdp;
}

test.describe('Kockázati próbák', () => {
  test('(a) chrome.debugger.attach és Page.captureScreenshot működik Playwright alatt', async ({
    context,
    panel,
    fixtureServer,
  }) => {
    await openPage(context, fixtureServer.url('/oldal.html?cim=Képernyőkép'));
    const result = await panel.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ title: 'Képernyőkép' });
      const target = { tabId: tab!.id! };
      await chrome.debugger.attach(target, '1.3');
      try {
        const metrics = (await chrome.debugger.sendCommand(target, 'Page.getLayoutMetrics')) as {
          cssContentSize: { height: number };
        };
        const shot = (await chrome.debugger.sendCommand(target, 'Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: true,
        })) as { data: string };
        return { bytes: atob(shot.data).length, height: metrics.cssContentSize.height };
      } finally {
        await chrome.debugger.detach(target);
      }
    });
    expect(result.bytes).toBeGreaterThan(1000);
    note('próba (a)', `működik: ${result.bytes} bájtos PNG, captureBeyondViewport-tal`);
  });

  test('(b) hamis native host Linuxon: a profilmappa NativeMessagingHosts mappájából indul', async ({
    context,
    panel,
    userDataDir,
  }) => {
    test.skip(process.platform !== 'linux', 'A native host fájlalapú bekötése Linux-specifikus');

    // 1) A spec szerinti ~/.config/chromium/NativeMessagingHosts/ (más néven, hogy ne ütközzön).
    const homeDir = join(homedir(), '.config', 'chromium', 'NativeMessagingHosts');
    const homeName = 'com.siteview.probe_home';
    const createdHomeDir = !existsSync(homeDir);
    writeNativeHostManifest(homeDir, homeName);
    let fromHome: { pid?: number; error?: string };
    try {
      fromHome = await connectFromPanel(panel, homeName);
    } finally {
      rmSync(join(homeDir, `${homeName}.json`));
      if (createdHomeDir) rmSync(homeDir, { recursive: true, force: true });
    }

    // 2) A Playwright saját profilmappája (--user-data-dir) alatti NativeMessagingHosts/.
    writeNativeHostManifest(join(userDataDir, 'NativeMessagingHosts'));
    const fromProfile = await connectFromPanel(panel, NATIVE_HOST_NAME);

    note('próba (b) ~/.config/chromium', fromHome.pid ? 'megtalálja' : `nem találja: ${fromHome.error}`);
    note('próba (b) <user-data-dir>/NativeMessagingHosts', fromProfile.pid ? `működik (pid ${fromProfile.pid})` : `hiba: ${fromProfile.error}`);
    expect(fromProfile.pid).toBeGreaterThan(0);
    await expect.poll(async () => (await panelProbe(panel)).ticks).toBeGreaterThan(2);
    void context;
  });

  test.describe('(c) nyitott native port a service worker leállása után', () => {
    test.use({ nativeHost: true });

    test('a panelből nyitott port él, a service workerből nyitott lezárul; offscreenben nincs connectNative', async ({
      context,
      panel,
      serviceWorker,
      extensionId,
    }) => {
      void context;
      // Port a panelből.
      const fromPanel = await connectFromPanel(panel, NATIVE_HOST_NAME);
      expect(fromPanel.pid).toBeGreaterThan(0);

      // Összevetésnek port a service workerből.
      const swPid = await serviceWorker.evaluate(
        (host) =>
          new Promise<number>((resolve) => {
            const port = chrome.runtime.connectNative(host);
            port.onMessage.addListener((message: { type: string; pid: number }) => {
              if (message.type === 'pong') resolve(message.pid);
            });
            port.postMessage({ type: 'ping' });
            (self as unknown as { probePort: unknown }).probePort = port;
          }),
        NATIVE_HOST_NAME,
      );

      // Offscreen dokumentum: van-e benne connectNative? (Bármely kiegészítő-lap megfelel; a panelét használjuk.)
      await serviceWorker.evaluate(() =>
        chrome.offscreen.createDocument({
          url: 'sidepanel.html',
          reasons: [chrome.offscreen.Reason.WORKERS],
          justification: 'Siteview e2e próba: connectNative elérhetősége',
        }),
      );
      const browserCdp = await context.browser()!.newBrowserCDPSession();
      const { targetInfos } = await browserCdp.send('Target.getTargets');
      const offscreen = targetInfos.find(
        (target) => target.url === `chrome-extension://${extensionId}/sidepanel.html` && target.type !== 'page',
      );
      expect(offscreen, 'az offscreen dokumentum célpontja').toBeTruthy();
      const { sessionId } = await browserCdp.send('Target.attachToTarget', { targetId: offscreen!.targetId, flatten: false });
      const reply = new Promise<string>((resolve) => {
        browserCdp.on('Target.receivedMessageFromTarget', (event) => {
          const message = JSON.parse(event.message) as { id: number; result?: { result: { value: string } } };
          if (message.id === 1) resolve(message.result!.result.value);
        });
      });
      await browserCdp.send('Target.sendMessageToTarget', {
        sessionId,
        message: JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: { expression: 'typeof chrome.runtime.connectNative', returnByValue: true },
        }),
      });
      const offscreenConnectNative = await reply;

      await expect.poll(async () => (await panelProbe(panel)).ticks).toBeGreaterThan(2);
      await stopServiceWorkers(panel);
      const ticksAtStop = (await panelProbe(panel)).ticks;
      await panel.waitForTimeout(3000);
      const afterStop = await panelProbe(panel);

      const panelSurvives = afterStop.ticks > ticksAtStop + 5 && !afterStop.disconnected && isAlive(fromPanel.pid!);
      await expect.poll(() => isAlive(swPid), { timeout: 5000 }).toBe(false).catch(() => undefined);
      const swHostAlive = isAlive(swPid);

      note('próba (c) panel', panelSurvives ? `él: ${ticksAtStop} → ${afterStop.ticks} tick 3 mp alatt, a host fut` : `nem él: ${JSON.stringify(afterStop)}`);
      note('próba (c) service worker', swHostAlive ? 'a host a leállás után is fut' : 'a leállással a Chrome a hostot is leállította');
      note('próba (c) offscreen', `typeof chrome.runtime.connectNative = ${offscreenConnectNative}`);
      mkdirSync(test.info().outputDir, { recursive: true });
      writeFileSync(
        join(test.info().outputDir, 'proba-c.json'),
        JSON.stringify({ panelSurvives, ticksAtStop, afterStop, swHostAlive, offscreenConnectNative }, null, 2),
      );

      expect(panelSurvives).toBe(true);
      expect(swHostAlive).toBe(false);
      expect(offscreenConnectNative).toBe('undefined');
    });
  });
});


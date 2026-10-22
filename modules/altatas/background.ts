import { browser, type Browser } from 'wxt/browser';
import { getSettings } from '@/lib/core/settings';
import type { ModuleBackground } from '@/lib/core/types';
import { runBeforeDiscard } from './hooks';
import {
  contentBlocker,
  discardedNeighbour,
  isDiscardableUrl,
  isIdleLongEnough,
  neighbourTab,
  staticBlocker,
  type Blocker,
  type ContentState,
} from './logic';
import { altatas } from './module';
import { readState, updateState } from './state';

export const CHECK_ALARM = 'altatas.check';
const CONTENT_TIMEOUT_MS = 1000;

/** auto: időzített (ATD1); bulk: tömeges kézi (ATD2), a kivételeket betartja; manual: egy tab kézzel. */
type Mode = 'auto' | 'bulk' | 'manual';

export interface DiscardOutcome {
  /** Altatás után a tab új azonosítója (a Chrome altatáskor lecserélheti). */
  tabId: number;
  discarded: boolean;
  reason?: Blocker | string;
}

async function askContent<T>(tabId: number, message: { type: string }): Promise<T | null> {
  const reply = browser.tabs.sendMessage(tabId, message) as Promise<T>;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), CONTENT_TIMEOUT_MS);
    reply.then(
      (value) => {
        clearTimeout(timer);
        resolve(value ?? null);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
    );
  });
}

export async function discardTab(tabId: number, mode: Mode): Promise<DiscardOutcome> {
  let tab = await browser.tabs.get(tabId);
  if (tab.discarded) return { tabId, discarded: false, reason: 'már altatva' };
  if (!isDiscardableUrl(tab.url)) return { tabId, discarded: false, reason: 'nem altatható oldal' };

  if (mode === 'manual' && tab.active) {
    const siblings = await browser.tabs.query({ windowId: tab.windowId });
    const next = neighbourTab(siblings.filter((t) => t.id !== tabId), tab.index);
    if (!next?.id) return { tabId, discarded: false, reason: 'az ablak egyetlen tabja' };
    await browser.tabs.update(next.id, { active: true });
  }

  if (mode !== 'manual') {
    const [settings, state] = await Promise.all([getSettings(altatas), readState()]);
    const blocker = staticBlocker(tab, { exceptions: settings.exceptions, never: new Set(state.never) });
    if (blocker) return { tabId, discarded: false, reason: blocker };
  }

  const content = await askContent<ContentState>(tabId, { type: 'altatas.state' });
  if (mode !== 'manual') {
    const blocker = contentBlocker(content);
    if (blocker) return { tabId, discarded: false, reason: blocker };
  }

  await runBeforeDiscard(tabId);

  tab = await browser.tabs.get(tabId);
  if (tab.active || tab.discarded) {
    return { tabId, discarded: false, reason: tab.active ? 'aktív' : 'már altatva' };
  }

  // ATD7 és ATD10: a tartalomszkript `💤` előtagot tesz a címre, YouTube-on az időpontot az URL-be.
  if (content) await askContent(tabId, { type: 'altatas.prepare' });
  try {
    const result = await browser.tabs.discard(tabId);
    if (!result?.discarded) throw new Error('a Chrome nem altatta');
    return { tabId: result.id ?? tabId, discarded: true };
  } catch (error) {
    if (content) await askContent(tabId, { type: 'altatas.restore' });
    return { tabId, discarded: false, reason: error instanceof Error ? error.message : String(error) };
  }
}

/** ATD1: percenkénti ellenőrzés; a `minutes` perce inaktív tabokat altatja, a kivételeket betartva. */
export async function checkIdleTabs(now = Date.now()): Promise<DiscardOutcome[]> {
  const [settings, state, tabs] = await Promise.all([
    getSettings(altatas),
    readState(),
    browser.tabs.query({}),
  ]);
  const never = new Set(state.never);
  const missing: number[] = [];
  const candidates = tabs.filter((tab) => {
    if (tab.id === undefined) return false;
    if (staticBlocker(tab, { exceptions: settings.exceptions, never })) return false;
    const since = state.inactiveSince[tab.id];
    if (since === undefined) {
      missing.push(tab.id);
      return false;
    }
    return isIdleLongEnough(since, now, settings.minutes);
  });
  // Ismeretlen inaktivitás (pl. a kiegészítő telepítése előtt nyitott tab): mostantól számolunk.
  if (missing.length > 0) {
    await updateState((s) => {
      for (const id of missing) s.inactiveSince[id] ??= now;
    });
  }
  const outcomes: DiscardOutcome[] = [];
  for (const tab of candidates) outcomes.push(await discardTab(tab.id!, 'auto'));
  return outcomes;
}

async function discardMany(tabs: Browser.tabs.Tab[]) {
  const outcomes: DiscardOutcome[] = [];
  for (const tab of tabs) if (tab.id !== undefined) outcomes.push(await discardTab(tab.id, 'bulk'));
  return outcomes;
}

async function windowIdOf(data: { windowId?: number; tabId?: number }) {
  if (data.windowId !== undefined) return data.windowId;
  if (data.tabId !== undefined) return (await browser.tabs.get(data.tabId)).windowId;
  return (await browser.windows.getLastFocused()).id!;
}

async function wakeNeighbour(data: { windowId?: number; tabId?: number }, direction: 'next' | 'prev') {
  const windowId = await windowIdOf(data);
  const tabs = await browser.tabs.query({ windowId });
  const active = tabs.find((tab) => tab.active);
  const target = discardedNeighbour(tabs, active?.index ?? -1, direction);
  if (!target?.id) return null;
  await browser.tabs.reload(target.id);
  return target.id;
}

function requireTab(tabId: unknown): number {
  if (typeof tabId !== 'number') throw new Error('Hiányzik a tab azonosítója');
  return tabId;
}

// ATD9: a háttérben nyitott új tabok, amelyeket altatunk, amint ismert az URL-jük.
const pendingNewTabs = new Set<number>();

async function discardNewTab(tabId: number) {
  const [settings, state] = await Promise.all([getSettings(altatas), readState()]);
  const tab = await browser.tabs.get(tabId);
  if (staticBlocker(tab, { exceptions: settings.exceptions, never: new Set(state.never) })) return;
  await runBeforeDiscard(tabId);
  if ((await browser.tabs.get(tabId)).active) return;
  await browser.tabs.discard(tabId).catch(() => undefined);
}

export const altatasBackground: ModuleBackground = {
  alarms: [{ name: CHECK_ALARM, periodInMinutes: 1 }],
  contentScripts: [
    { id: 'altatas', js: ['/content-scripts/altatas.js'], matches: ['<all_urls>'], runAt: 'document_idle' },
  ],
  menus: [
    { id: 'menu', title: 'Altatás', contexts: ['page'] },
    { id: 'discard-this', parentId: 'menu', title: 'Ezt a tabot altasd', contexts: ['page'], action: 'altatas.discardTab' },
    { id: 'discard-others', parentId: 'menu', title: 'Az ablak többi tabját altasd', contexts: ['page'], action: 'altatas.discardOthers' },
    { id: 'discard-inactive', parentId: 'menu', title: 'Minden inaktív tabot altass', contexts: ['page'], action: 'altatas.discardAllInactive' },
    { id: 'wake-next', parentId: 'menu', title: 'Ébreszd a következő tabot', contexts: ['page'], action: 'altatas.wakeNext' },
    { id: 'wake-prev', parentId: 'menu', title: 'Ébreszd az előző tabot', contexts: ['page'], action: 'altatas.wakePrev' },
    { id: 'wake-window', parentId: 'menu', title: 'Ébreszd az ablak összes tabját', contexts: ['page'], action: 'altatas.wakeWindow' },
    { id: 'never', parentId: 'menu', title: 'Ezt a tabot ne altasd (be/ki)', contexts: ['page'], action: 'altatas.toggleNever' },
  ],
  actions: {
    'altatas.discardTab': (data) => discardTab(requireTab(data.tabId), 'manual'),
    'altatas.discardOthers': async (data) => {
      const windowId = await windowIdOf(data);
      const tabs = await browser.tabs.query({ windowId, active: false });
      return discardMany(tabs.filter((tab) => tab.id !== data.tabId));
    },
    'altatas.discardAllInactive': async () => discardMany(await browser.tabs.query({ active: false })),
    'altatas.wakeNext': (data) => wakeNeighbour(data, 'next'),
    'altatas.wakePrev': (data) => wakeNeighbour(data, 'prev'),
    'altatas.wakeWindow': async (data) => {
      const tabs = await browser.tabs.query({ windowId: await windowIdOf(data), discarded: true });
      await Promise.all(tabs.map((tab) => browser.tabs.reload(tab.id!)));
      return tabs.map((tab) => tab.id);
    },
    'altatas.toggleNever': async (data) => {
      const tabId = requireTab(data.tabId);
      const state = await updateState((s) => {
        s.never = s.never.includes(tabId) ? s.never.filter((id) => id !== tabId) : [...s.never, tabId];
      });
      return state.never.includes(tabId);
    },
  },

  onAlarm: async (alarm) => {
    if (alarm.name === CHECK_ALARM) await checkIdleTabs();
  },

  onStart: async () => {
    // Az épp aktív tabok ablakonként; a többi inaktivitását mostantól számoljuk, ha még nem tudjuk.
    const tabs = await browser.tabs.query({});
    const now = Date.now();
    await updateState((s) => {
      for (const tab of tabs) {
        if (tab.id === undefined) continue;
        if (tab.active) {
          s.activeByWindow[tab.windowId] = tab.id;
          delete s.inactiveSince[tab.id];
        } else {
          s.inactiveSince[tab.id] ??= now;
        }
      }
    });
  },

  onTabCreated: async (tab) => {
    if (tab.id === undefined || tab.active) return;
    pendingNewTabs.add(tab.id);
    await updateState((s) => {
      s.inactiveSince[tab.id!] = Date.now();
    });
    const settings = await getSettings(altatas);
    if (!settings.discardNewBackgroundTabs) {
      pendingNewTabs.delete(tab.id);
    } else if (isDiscardableUrl(tab.url) && pendingNewTabs.delete(tab.id)) {
      await discardNewTab(tab.id);
    }
  },

  onTabUpdated: async (tabId, changeInfo) => {
    if (!isDiscardableUrl(changeInfo.url) || !pendingNewTabs.delete(tabId)) return;
    const settings = await getSettings(altatas);
    if (settings.discardNewBackgroundTabs) await discardNewTab(tabId);
  },

  onTabActivated: async ({ tabId, windowId }) => {
    const now = Date.now();
    await updateState((s) => {
      const previous = s.activeByWindow[windowId];
      if (previous !== undefined && previous !== tabId) s.inactiveSince[previous] = now;
      s.activeByWindow[windowId] = tabId;
      delete s.inactiveSince[tabId];
    });
  },

  onTabReplaced: async (addedTabId, removedTabId) => {
    if (pendingNewTabs.delete(removedTabId)) pendingNewTabs.add(addedTabId);
    await updateState((s) => {
      const since = s.inactiveSince[removedTabId];
      delete s.inactiveSince[removedTabId];
      if (since !== undefined) s.inactiveSince[addedTabId] = since;
      s.never = s.never.map((id) => (id === removedTabId ? addedTabId : id));
      for (const [windowId, id] of Object.entries(s.activeByWindow)) {
        if (id === removedTabId) s.activeByWindow[windowId] = addedTabId;
      }
    });
  },

  onTabRemoved: async (tabId) => {
    pendingNewTabs.delete(tabId);
    await updateState((s) => {
      delete s.inactiveSince[tabId];
      s.never = s.never.filter((id) => id !== tabId);
    });
  },
};

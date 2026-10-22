import { browser, type Browser } from 'wxt/browser';
import { getSettings, settingsKey } from './settings';
import type {
  ActionData,
  ActionHandler,
  ActionResult,
  ModuleBackground,
  ModuleDef,
  RunActionMessage,
} from './types';

export interface RegisteredModule {
  def: ModuleDef;
  background: ModuleBackground;
}

export const ROOT_MENU_ID = 'siteview';

/** Billentyűparancs → `runAction` név. A parancsokat a manifest `commands` része sorolja fel. */
export const COMMAND_ACTIONS: Record<string, string> = {
  'open-panel': 'mag.openPanel',
};

type Hook = 'onAlarm' | 'onTabCreated' | 'onTabUpdated' | 'onTabActivated' | 'onTabRemoved' | 'onTabReplaced';

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

/**
 * A mag: modulregiszter, `runAction`, helyi menü keret, parancsok és a modulok be/kikapcsolása.
 *
 * Az MV3 service worker csak az első körben regisztrált figyelőkkel ébred fel, ezért a mag minden
 * böngésző-eseményre egyetlen figyelőt köt be indításkor, és azt csak a bekapcsolt moduloknak
 * továbbítja. A böngészőnél bejegyzett dolgokat (helyi menü, ébresztő, tartalomszkript) a kikapcsolt
 * modul nem kapja meg.
 */
export function createCore(modules: RegisteredModule[], coreActions: Record<string, ActionHandler>) {
  const enabled = new Map<string, boolean>();
  let loaded: Promise<void> | undefined;
  let isLoaded = false;

  const actions = new Map<string, { moduleId?: string; handler: ActionHandler }>();
  for (const [name, handler] of Object.entries(coreActions)) actions.set(name, { handler });
  for (const { def, background } of modules) {
    for (const [name, handler] of Object.entries(background.actions ?? {})) {
      actions.set(name, { moduleId: def.id, handler });
    }
  }

  const menuActions = new Map<string, string>();
  for (const { def, background } of modules) {
    for (const item of background.menus ?? []) {
      if (item.action) menuActions.set(`${def.id}:${item.id}`, item.action);
    }
  }

  function loadEnabled() {
    loaded ??= (async () => {
      for (const { def } of modules) enabled.set(def.id, (await getSettings(def)).enabled);
      isLoaded = true;
    })();
    return loaded;
  }

  const isEnabled = (moduleId: string) => enabled.get(moduleId) === true;

  /**
   * Egy művelet futtatása név szerint. Ha a modulok állapota már betöltődött, a kezelő még ebben a
   * körben elindul, így a felhasználói gesztushoz kötött API-k (pl. `sidePanel.open`) is működnek.
   */
  function runAction(name: string, data: ActionData = {}): Promise<ActionResult> {
    const entry = actions.get(name);
    if (!entry) return Promise.resolve({ ok: false, error: `Ismeretlen művelet: ${name}` });
    const call = async (): Promise<ActionResult> => {
      if (entry.moduleId && !isEnabled(entry.moduleId)) {
        return { ok: false, error: `A(z) „${entry.moduleId}” modul ki van kapcsolva` };
      }
      try {
        return { ok: true, result: await entry.handler(data) };
      } catch (error) {
        return { ok: false, error: errorMessage(error) };
      }
    };
    return isLoaded || !entry.moduleId ? call() : loadEnabled().then(call);
  }

  function handleMenuClick(info: Browser.contextMenus.OnClickData, tab?: Browser.tabs.Tab) {
    const action = menuActions.get(String(info.menuItemId));
    if (!action) return Promise.resolve<ActionResult>({ ok: false, error: 'Ismeretlen menüpont' });
    return runAction(action, {
      tabId: tab?.id,
      windowId: tab?.windowId,
      info: {
        menuItemId: String(info.menuItemId),
        pageUrl: info.pageUrl,
        linkUrl: info.linkUrl,
        srcUrl: info.srcUrl,
        selectionText: info.selectionText,
      },
    });
  }

  function handleCommand(command: string, tab?: Browser.tabs.Tab) {
    const action = COMMAND_ACTIONS[command];
    if (!action) return Promise.resolve<ActionResult>({ ok: false, error: `Ismeretlen parancs: ${command}` });
    return runAction(action, { tabId: tab?.id, windowId: tab?.windowId });
  }

  async function syncMenus() {
    await browser.contextMenus.removeAll();
    const items = modules.filter(({ def }) => isEnabled(def.id)).flatMap(({ def, background }) =>
      (background.menus ?? []).map((item) => ({ moduleId: def.id, item })),
    );
    if (items.length === 0) return;
    browser.contextMenus.create({ id: ROOT_MENU_ID, title: 'Siteview', contexts: ['all'] });
    for (const { moduleId, item } of items) {
      browser.contextMenus.create({
        id: `${moduleId}:${item.id}`,
        parentId: item.parentId ? `${moduleId}:${item.parentId}` : ROOT_MENU_ID,
        title: item.title,
        contexts: item.contexts,
      });
    }
  }

  async function syncAlarms() {
    for (const { def, background } of modules) {
      for (const alarm of background.alarms ?? []) {
        if (!isEnabled(def.id)) {
          await browser.alarms.clear(alarm.name);
        } else if (!(await browser.alarms.get(alarm.name))) {
          await browser.alarms.create(alarm.name, { periodInMinutes: alarm.periodInMinutes });
        }
      }
    }
  }

  async function syncContentScripts() {
    const registered = new Set(
      (await browser.scripting.getRegisteredContentScripts()).map((script) => script.id),
    );
    for (const { def, background } of modules) {
      for (const script of background.contentScripts ?? []) {
        if (isEnabled(def.id) && !registered.has(script.id)) {
          await browser.scripting.registerContentScripts([
            {
              id: script.id,
              js: script.js,
              matches: script.matches,
              runAt: script.runAt ?? 'document_idle',
              persistAcrossSessions: true,
            },
          ]);
        } else if (!isEnabled(def.id) && registered.has(script.id)) {
          await browser.scripting.unregisterContentScripts({ ids: [script.id] });
        }
      }
    }
  }

  /** A már nyitott tabokba is betölti a modulok tartalomszkriptjét (telepítéskor, bekapcsoláskor). */
  async function injectIntoOpenTabs(ids: string[]) {
    const files = modules
      .filter(({ def }) => ids.includes(def.id))
      .flatMap(({ background }) => background.contentScripts ?? [])
      .flatMap((script) => script.js);
    if (files.length === 0) return;
    const tabs = await browser.tabs.query({ url: ['http://*/*', 'https://*/*', 'file:///*'] });
    await Promise.all(
      tabs
        .filter((tab) => tab.id !== undefined && !tab.discarded)
        .map((tab) =>
          browser.scripting.executeScript({ target: { tabId: tab.id! }, files }).catch(() => undefined),
        ),
    );
  }

  // A bejegyzések (menü, ébresztő, tartalomszkript) egymás után futnak, hogy ne ütközzenek.
  let queue: Promise<unknown> = Promise.resolve();
  function serial<T>(task: () => Promise<T>): Promise<T> {
    const run = queue.then(task);
    queue = run.catch((error) => console.error('[siteview]', error));
    return run;
  }

  const enabledIds = () => modules.filter(({ def }) => isEnabled(def.id)).map(({ def }) => def.id);

  async function startModules(ids: string[]) {
    for (const { def, background } of modules) {
      if (ids.includes(def.id) && background.onStart) await background.onStart();
    }
  }

  function dispatch(hook: Hook, ...args: unknown[]) {
    return loadEnabled()
      .then(() =>
        Promise.all(
          modules
            .filter(({ def, background }) => isEnabled(def.id) && background[hook])
            .map(({ background }) => (background[hook] as (...a: unknown[]) => unknown)(...args)),
        ),
      )
      .catch((error) => console.error(`[siteview] ${hook}`, error));
  }

  async function onSettingsChanged(changes: Record<string, Browser.storage.StorageChange>) {
    await loadEnabled();
    const turnedOn: string[] = [];
    let changed = false;
    for (const { def } of modules) {
      const change = changes[settingsKey(def.id)];
      if (!change) continue;
      const next = { ...def.defaults, ...(change.newValue as object | undefined) }.enabled;
      if (next === isEnabled(def.id)) continue;
      enabled.set(def.id, next);
      changed = true;
      if (next) turnedOn.push(def.id);
    }
    if (!changed) return;
    await serial(async () => {
      await syncMenus();
      await syncAlarms();
      await syncContentScripts();
      await injectIntoOpenTabs(turnedOn);
      await startModules(turnedOn);
    });
  }

  /** A háttér belépési pontja hívja szinkron, az első körben. */
  function start() {
    browser.runtime.onMessage.addListener((message: RunActionMessage, _sender, sendResponse) => {
      if (message?.type !== 'runAction') return;
      runAction(message.name, message.data).then(sendResponse);
      return true;
    });
    browser.contextMenus.onClicked.addListener((info, tab) => void handleMenuClick(info, tab));
    browser.commands.onCommand.addListener((command, tab) => void handleCommand(command, tab));

    const hooks: [Hook, { addListener(callback: (...args: unknown[]) => void): void }][] = [
      ['onAlarm', browser.alarms.onAlarm],
      ['onTabCreated', browser.tabs.onCreated],
      ['onTabUpdated', browser.tabs.onUpdated],
      ['onTabActivated', browser.tabs.onActivated],
      ['onTabRemoved', browser.tabs.onRemoved],
      ['onTabReplaced', browser.tabs.onReplaced],
    ];
    for (const [hook, event] of hooks) {
      if (modules.some(({ background }) => background[hook])) {
        event.addListener((...args: unknown[]) => void dispatch(hook, ...args));
      }
    }

    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') void onSettingsChanged(changes);
    });

    browser.runtime.onInstalled.addListener(() => {
      void loadEnabled().then(() =>
        serial(async () => {
          await syncMenus();
          await syncContentScripts();
          await injectIntoOpenTabs(enabledIds());
        }),
      );
    });
    browser.runtime.onStartup.addListener(() => void loadEnabled().then(() => serial(syncMenus)));

    void browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => undefined);
    void loadEnabled().then(() =>
      serial(async () => {
        await syncAlarms();
        await syncContentScripts();
        await startModules(enabledIds());
      }),
    );
  }

  return { runAction, handleMenuClick, handleCommand, start, syncMenus, syncAlarms, loadEnabled };
}

/** Az ikon jelvénye a hosszú műveletek állapotához (pl. „45%”). Üres szöveg törli. */
export function setBadge(text: string, tabId?: number) {
  return browser.action.setBadgeText({ text, tabId });
}

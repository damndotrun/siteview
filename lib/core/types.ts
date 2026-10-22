import type { Browser } from 'wxt/browser';
import type { ScriptPublicPath } from 'wxt/utils/inject-script';

/** Egy `runAction` hívás adatai. A helyi menü és a billentyűparancs a tabot és az ablakot tölti ki. */
export interface ActionData {
  tabId?: number;
  windowId?: number;
  info?: {
    menuItemId?: string;
    pageUrl?: string;
    linkUrl?: string;
    srcUrl?: string;
    selectionText?: string;
  };
  [key: string]: unknown;
}

export type ActionHandler = (data: ActionData) => unknown | Promise<unknown>;

export type ActionResult = { ok: true; result?: unknown } | { ok: false; error: string };

/** A `runAction` háttérüzenet. Minden felhasználói indítás ezen megy át (helyi menü, parancs, gyorsgomb, e2e). */
export interface RunActionMessage {
  type: 'runAction';
  name: string;
  data?: ActionData;
}

export interface MenuItem {
  /** Modulon belül egyedi azonosító; a teljes azonosító `<modul>:<id>`. */
  id: string;
  title: string;
  contexts: [ContextType, ...ContextType[]];
  /** A `runAction` neve, amelyet a menüpont hív; almenü szülőjénél elhagyható. */
  action?: string;
  /** Modulon belüli szülő menüpont azonosítója; enélkül közvetlenül a „Siteview” almenübe kerül. */
  parentId?: string;
}

export interface ContentScriptDef {
  id: string;
  /** A WXT által épített fájl, pl. `/content-scripts/altatas.js`. */
  js: ScriptPublicPath[];
  matches: string[];
  runAt?: 'document_start' | 'document_end' | 'document_idle';
}

type ContextType = `${Browser.contextMenus.ContextType}`;

/** Egy modul háttér-része. A mag köti be: a böngésző-eseményeket csak bekapcsolt modulnak továbbítja. */
export interface ModuleBackground {
  actions?: Record<string, ActionHandler>;
  menus?: MenuItem[];
  alarms?: { name: string; periodInMinutes: number }[];
  contentScripts?: ContentScriptDef[];
  onAlarm?: (alarm: Browser.alarms.Alarm) => void | Promise<void>;
  onTabCreated?: (tab: Browser.tabs.Tab) => void | Promise<void>;
  onTabUpdated?: (
    tabId: number,
    changeInfo: Browser.tabs.OnUpdatedInfo,
    tab: Browser.tabs.Tab,
  ) => void | Promise<void>;
  onTabActivated?: (activeInfo: Browser.tabs.OnActivatedInfo) => void | Promise<void>;
  onTabRemoved?: (tabId: number, removeInfo: Browser.tabs.OnRemovedInfo) => void | Promise<void>;
  /** A tab azonosítója lecserélődött (a Chrome altatáskor is új azonosítót adhat). */
  onTabReplaced?: (addedTabId: number, removedTabId: number) => void | Promise<void>;
  /** Bekapcsoláskor és a háttér minden indulásakor, ha a modul be van kapcsolva. */
  onStart?: () => void | Promise<void>;
}

/** A modul közös leírása: a panel és a háttér is ezt látja. */
export interface ModuleDef<S extends ModuleSettings = ModuleSettings> {
  id: string;
  name: string;
  /** Egysoros leírás a beállítások nézetben. */
  description: string;
  defaults: S;
}

export interface ModuleSettings {
  enabled: boolean;
}

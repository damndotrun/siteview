import type { ReactNode } from 'react';
import type { Browser } from 'wxt/browser';

/** Amit egy modul a tablistához ad: állapotikon, sorművelet, ablakszintű művelet. */
export interface TabExtras {
  status?: (tab: Browser.tabs.Tab) => ReactNode;
  actions?: (tab: Browser.tabs.Tab) => ReactNode;
  windowActions?: (windowId: number) => ReactNode;
}

/** Egy modul panel-része. */
export interface ModulePanel {
  /** Hook: a tablista egyszer hívja meg, minden modulra, rögzített sorrendben. */
  useTabExtras?: () => TabExtras;
  /** A modul beállításai (a beállítások nézetben a modul sorára kattintva nyílik). */
  Settings?: () => ReactNode;
}

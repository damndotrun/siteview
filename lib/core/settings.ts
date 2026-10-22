import { browser } from 'wxt/browser';
import type { ModuleDef, ModuleSettings } from './types';

// Beállítások a `chrome.storage.sync`-ben, modulonként külön kulcson (a sync elemenként 8 KB-ot enged).
export const settingsKey = (moduleId: string) => `settings:${moduleId}`;

export async function getSettings<S extends ModuleSettings>(def: ModuleDef<S>): Promise<S> {
  const key = settingsKey(def.id);
  const stored = await browser.storage.sync.get(key);
  return { ...def.defaults, ...(stored[key] as Partial<S> | undefined) };
}

export async function updateSettings<S extends ModuleSettings>(
  def: ModuleDef<S>,
  patch: Partial<S>,
): Promise<S> {
  const next = { ...(await getSettings(def)), ...patch };
  await browser.storage.sync.set({ [settingsKey(def.id)]: next });
  return next;
}

/** Figyeli egy modul beállításainak változását (bármelyik eszközről érkező szinkront is). */
export function watchSettings<S extends ModuleSettings>(
  def: ModuleDef<S>,
  callback: (settings: S) => void,
): () => void {
  const key = settingsKey(def.id);
  const listener = (changes: Record<string, { newValue?: unknown }>, area: string) => {
    if (area !== 'sync' || !(key in changes)) return;
    callback({ ...def.defaults, ...(changes[key]?.newValue as Partial<S> | undefined) });
  };
  browser.storage.onChanged.addListener(listener);
  return () => browser.storage.onChanged.removeListener(listener);
}

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import { COMMAND_ACTIONS, ROOT_MENU_ID, createCore, type RegisteredModule } from '@/lib/core/core';
import { settingsKey } from '@/lib/core/settings';
import type { ActionHandler } from '@/lib/core/types';
import { BACKGROUND_MODULES } from '@/modules/background';

/** A valódi modulok menüi és ébresztői, de kémkedő (spy) műveletkezelőkkel. */
function spiedModules() {
  const spies = new Map<string, ReturnType<typeof vi.fn>>();
  const modules: RegisteredModule[] = BACKGROUND_MODULES.map(({ def, background }) => ({
    def,
    background: {
      ...background,
      actions: Object.fromEntries(
        Object.keys(background.actions ?? {}).map((name) => {
          const spy = vi.fn(() => `${name} kész`);
          spies.set(name, spy);
          return [name, spy as ActionHandler];
        }),
      ),
    },
  }));
  return { modules, spies };
}

describe('mag: runAction, helyi menü, parancs', () => {
  beforeEach(() => {
    fakeBrowser.reset();
    fakeBrowser.contextMenus.create = vi.fn() as never;
    fakeBrowser.contextMenus.removeAll = vi.fn(async () => undefined) as never;
  });

  it('minden helyi menüpont a hozzá rendelt runAction-t hívja a tab és az ablak azonosítójával', async () => {
    const { modules, spies } = spiedModules();
    const core = createCore(modules, {});
    const tab = { id: 11, windowId: 3 } as never;
    let checked = 0;
    for (const { def, background } of modules) {
      for (const item of background.menus ?? []) {
        if (!item.action) continue;
        const result = await core.handleMenuClick({ menuItemId: `${def.id}:${item.id}` } as never, tab);
        expect(result).toEqual({ ok: true, result: `${item.action} kész` });
        expect(spies.get(item.action)).toHaveBeenLastCalledWith(
          expect.objectContaining({ tabId: 11, windowId: 3 }),
        );
        checked++;
      }
    }
    expect(checked).toBeGreaterThanOrEqual(7);
  });

  it('a billentyűparancs a hozzá rendelt runAction-t hívja', async () => {
    const openPanel = vi.fn();
    const core = createCore([], { 'mag.openPanel': openPanel });
    expect(COMMAND_ACTIONS['open-panel']).toBe('mag.openPanel');
    await core.handleCommand('open-panel', { id: 5, windowId: 2 } as never);
    expect(openPanel).toHaveBeenCalledWith({ tabId: 5, windowId: 2 });
    expect(await core.handleCommand('nincs-ilyen')).toMatchObject({ ok: false });
  });

  it('a mag művelete még ugyanabban a körben indul (felhasználói gesztus a sidePanel.open-hez)', () => {
    const openPanel = vi.fn();
    const core = createCore([], { 'mag.openPanel': openPanel });
    void core.runAction('mag.openPanel', { windowId: 1 });
    expect(openPanel).toHaveBeenCalledTimes(1);
  });

  it('betöltött állapotnál a modul művelete is ugyanabban a körben indul', async () => {
    const { modules, spies } = spiedModules();
    const core = createCore(modules, {});
    await core.loadEnabled();
    void core.runAction('altatas.discardTab', { tabId: 1 });
    expect(spies.get('altatas.discardTab')).toHaveBeenCalledTimes(1);
  });

  it('kikapcsolt modul művelete nem fut', async () => {
    await fakeBrowser.storage.sync.set({ [settingsKey('altatas')]: { enabled: false } });
    const { modules, spies } = spiedModules();
    const core = createCore(modules, {});
    const result = await core.runAction('altatas.discardTab', { tabId: 1 });
    expect(result).toMatchObject({ ok: false });
    expect(spies.get('altatas.discardTab')).not.toHaveBeenCalled();
  });

  it('ismeretlen művelet hibát ad, a kezelő hibája eredményként jön vissza', async () => {
    const core = createCore([], {
      'mag.hibas': () => {
        throw new Error('rossz');
      },
    });
    expect(await core.runAction('nincs.ilyen')).toEqual({ ok: false, error: 'Ismeretlen művelet: nincs.ilyen' });
    expect(await core.runAction('mag.hibas')).toEqual({ ok: false, error: 'rossz' });
  });

  it('a helyi menü „Siteview” almenübe gyűlik, csak a bekapcsolt modulokból', async () => {
    const core = createCore(BACKGROUND_MODULES, {});
    await core.loadEnabled();
    await core.syncMenus();
    const created = vi.mocked(fakeBrowser.contextMenus.create).mock.calls.map(([item]) => item);
    expect(created[0]).toMatchObject({ id: ROOT_MENU_ID, title: 'Siteview' });
    expect(created.slice(1).every((item) => item.parentId === ROOT_MENU_ID || item.parentId === 'altatas:menu')).toBe(true);
    expect(created.map((item) => item.id)).toContain('altatas:discard-this');

    vi.mocked(fakeBrowser.contextMenus.create).mockClear();
    await fakeBrowser.storage.sync.set({ [settingsKey('altatas')]: { enabled: false } });
    const off = createCore(BACKGROUND_MODULES, {});
    await off.loadEnabled();
    await off.syncMenus();
    expect(fakeBrowser.contextMenus.create).not.toHaveBeenCalled();
  });

  it('az Altatás percenkénti ébresztője csak bekapcsolt modulnál él', async () => {
    const core = createCore(BACKGROUND_MODULES, {});
    await core.loadEnabled();
    await core.syncAlarms();
    expect(await fakeBrowser.alarms.get('altatas.check')).toMatchObject({ periodInMinutes: 1 });

    await fakeBrowser.storage.sync.set({ [settingsKey('altatas')]: { enabled: false } });
    const off = createCore(BACKGROUND_MODULES, {});
    await off.loadEnabled();
    await off.syncAlarms();
    expect(await fakeBrowser.alarms.get('altatas.check')).toBeUndefined();
  });
});

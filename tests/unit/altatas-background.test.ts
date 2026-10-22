import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import { settingsKey } from '@/lib/core/settings';
import { altatasBackground, checkIdleTabs } from '@/modules/altatas/background';
import { registerBeforeDiscard } from '@/modules/altatas/hooks';
import { readState, updateState } from '@/modules/altatas/state';

const minute = 60_000;

function mockTabs(tabs: Record<string, unknown>[]) {
  const byId = new Map(tabs.map((tab) => [tab.id as number, { windowId: 1, index: 0, ...tab }]));
  vi.spyOn(fakeBrowser.tabs, 'query').mockImplementation(async () => [...byId.values()] as never);
  vi.spyOn(fakeBrowser.tabs, 'get').mockImplementation(async (id: number) => byId.get(id) as never);
  const discard = vi.fn(async (id: number) => ({ ...byId.get(id), discarded: true }));
  fakeBrowser.tabs.discard = discard as never;
  // Tartalomszkript nincs: a sendMessage elbukik, az altatás ettől még megy.
  fakeBrowser.tabs.sendMessage = vi.fn(async () => {
    throw new Error('nincs fogadó');
  }) as never;
  return discard;
}

describe('Altatás háttér: időzítés és állapot', () => {
  beforeEach(() => {
    fakeBrowser.reset();
    vi.restoreAllMocks();
  });

  it('a tab inaktivitását az átváltás pillanatától számolja', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1000);
    await altatasBackground.onTabActivated!({ tabId: 1, windowId: 9 });
    vi.spyOn(Date, 'now').mockReturnValue(5000);
    await altatasBackground.onTabActivated!({ tabId: 2, windowId: 9 });
    const state = await readState();
    expect(state.inactiveSince).toEqual({ '1': 5000 });
    expect(state.activeByWindow).toEqual({ '9': 2 });

    await altatasBackground.onTabRemoved!(1, { windowId: 9, isWindowClosing: false });
    expect((await readState()).inactiveSince).toEqual({});
  });

  it('csak a beállított percnél régebben inaktív tabot altatja, a kivételeket kihagyja', async () => {
    await fakeBrowser.storage.sync.set({ [settingsKey('altatas')]: { enabled: true, minutes: 1 } });
    const now = 10 * minute;
    await updateState((s) => {
      s.inactiveSince = { '1': now - minute, '2': now - minute + 1, '3': now - 5 * minute, '4': now - 5 * minute };
      s.never = [4];
    });
    const discard = mockTabs([
      { id: 1, url: 'https://a.test/' },
      { id: 2, url: 'https://b.test/' },
      { id: 3, url: 'https://c.test/', pinned: true },
      { id: 4, url: 'https://d.test/' },
      { id: 5, url: 'https://e.test/', active: true },
    ]);
    const outcomes = await checkIdleTabs(now);
    expect(outcomes).toEqual([{ tabId: 1, discarded: true }]);
    expect(discard).toHaveBeenCalledTimes(1);
    expect(discard).toHaveBeenCalledWith(1);
  });

  it('ismeretlen inaktivitású tabnál mostantól kezd számolni, és most nem altat', async () => {
    const discard = mockTabs([{ id: 8, url: 'https://a.test/' }]);
    expect(await checkIdleTabs(123)).toEqual([]);
    expect(discard).not.toHaveBeenCalled();
    expect((await readState()).inactiveSince).toEqual({ '8': 123 });
  });

  it('altatás előtt lefut a beforeDiscard horog', async () => {
    await fakeBrowser.storage.sync.set({ [settingsKey('altatas')]: { enabled: true, minutes: 1 } });
    await updateState((s) => {
      s.inactiveSince = { '1': 0 };
    });
    const order: string[] = [];
    const discard = mockTabs([{ id: 1, url: 'https://a.test/' }]);
    discard.mockImplementation(async () => {
      order.push('discard');
      return { discarded: true } as never;
    });
    const unregister = registerBeforeDiscard((tabId) => void order.push(`hook:${tabId}`));
    await checkIdleTabs(5 * minute);
    unregister();
    expect(order).toEqual(['hook:1', 'discard']);
  });
});

import { expect, findTab, tabState, openPage, runAction, test } from './fixtures';

test.describe('Oldalpanel: tablista (TS1)', () => {
  test('a tablista megjelenik címmel és domainnel, és élőben frissül', async ({ context, panel, fixtureServer }) => {
    await openPage(context, fixtureServer.url('/oldal.html?cim=Első oldal'));
    await openPage(context, fixtureServer.url('/oldal.html?cim=Második oldal'));
    await panel.bringToFront();

    const list = panel.getByRole('region', { name: 'Tabok' });
    const first = list.locator('.tab-row', { hasText: 'Első oldal' });
    await expect(first).toBeVisible();
    await expect(first.locator('.tab-domain')).toHaveText('127.0.0.1');
    await expect(list.locator('.tab-row', { hasText: 'Második oldal' })).toBeVisible();

    await openPage(context, fixtureServer.url('/oldal.html?cim=Harmadik oldal'));
    await expect(list.locator('.tab-row', { hasText: 'Harmadik oldal' })).toBeVisible();
  });

  test('a Chrome tabcsoport összecsukható fejlécként jelenik meg, darabszámmal és színnel', async ({
    context,
    panel,
    fixtureServer,
  }) => {
    await openPage(context, fixtureServer.url('/oldal.html?cim=Csoportos A'));
    await openPage(context, fixtureServer.url('/oldal.html?cim=Csoportos B'));
    await openPage(context, fixtureServer.url('/oldal.html?cim=Csoporton kívül'));
    await panel.bringToFront();

    const a = await findTab(panel, (tab) => tab.title === 'Csoportos A');
    const b = await findTab(panel, (tab) => tab.title === 'Csoportos B');
    await panel.evaluate(async (ids) => {
      const groupId = (await chrome.tabs.group({ tabIds: ids as [number, ...number[]] })) as number;
      await chrome.tabGroups.update(groupId, { title: 'Munka', color: 'green' });
    }, [a.id, b.id]);

    const header = panel.getByRole('button', { name: /Munka/ });
    await expect(header).toBeVisible();
    await expect(header.locator('.group-count')).toHaveText('2');
    await expect(header).toHaveAttribute('style', /--group-green/);

    const group = panel.locator('.group', { has: header });
    await expect(group.locator('.tab-row')).toHaveCount(2);
    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(group.locator('.tab-row')).toHaveCount(0);
    await expect(panel.locator('.tab-row', { hasText: 'Csoporton kívül' })).toBeVisible();
  });

  test('alapból az aktuális ablak, kapcsolóval minden ablak tabjai', async ({ panel, fixtureServer }) => {
    await panel.evaluate((url) => chrome.windows.create({ url, focused: false }), fixtureServer.url('/oldal.html?cim=Másik ablak'));
    const otherRow = panel.locator('.tab-row', { hasText: 'Másik ablak' });
    await expect.poll(() => panel.evaluate(async () => (await chrome.windows.getAll()).length)).toBe(2);
    await expect(otherRow).toHaveCount(0);

    await panel.getByLabel('Minden ablak').check();
    await expect(otherRow).toBeVisible();
    await expect(panel.locator('.window-section')).toHaveCount(2);
  });

  test('az altatott tab halványan, 💤 jellel látszik; kattintásra felébred', async ({ context, panel, fixtureServer }) => {
    await openPage(context, fixtureServer.url('/oldal.html?cim=Altatandó'));
    await panel.bringToFront();
    const tab = await findTab(panel, (t) => t.title === 'Altatandó');
    expect(await runAction(panel, 'altatas.discardTab', { tabId: tab.id })).toMatchObject({ ok: true });

    // A Chrome altatáskor új azonosítót adhat a tabnak, ezért URL alapján keressük újra.
    const discarded = await findTab(panel, (t) => t.url.includes('cim=Altatand'));
    const row = panel.locator(`.tab-row[data-tab-id="${discarded.id}"]`);
    await expect(row).toHaveAttribute('data-discarded', 'true');
    await expect(row).toHaveClass(/is-discarded/);
    await expect(row.getByRole('img', { name: 'Altatva' })).toBeVisible();
    expect(await row.locator('.tab-main').evaluate((el) => getComputedStyle(el).opacity)).toBe('0.5');

    await row.locator('.tab-main').click();
    await expect.poll(async () => (await tabState(panel, (t) => t.url.includes('cim=Altatand')))?.discarded).toBe(false);
  });
});

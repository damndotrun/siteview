import { expect, findTab, tabState, listTabs, openPage, runAction, setSettings, test, type TabState } from './fixtures';

test.describe('Altatás', () => {
  test('tesztidővel (1 perc) altat; a rögzített, hangot játszó, kitöltött űrlapos és szüneteltetett tab nem altat', async ({
    context,
    panel,
    fixtureServer,
  }) => {
    test.setTimeout(240_000);

    // A beállítást a panel beállítás-nézetén át adjuk meg (1 perc).
    await panel.getByRole('button', { name: 'Beállítások' }).click();
    await panel.getByRole('button', { name: /^Altatás/ }).click();
    await panel.getByLabel('Altatás ennyi perc inaktivitás után').fill('1');
    await expect
      .poll(() => panel.evaluate(async () => (await chrome.storage.sync.get('settings:altatas'))['settings:altatas']))
      .toMatchObject({ minutes: 1 });

    await openPage(context, fixtureServer.url('/oldal.html?cim=Sima'));
    await openPage(context, fixtureServer.url('/oldal.html?cim=Rögzített'));
    await openPage(context, fixtureServer.url('/hang.html'));
    const form = await openPage(context, fixtureServer.url('/urlap.html'));
    await form.locator('#nev').fill('félkész');
    const player = await openPage(context, fixtureServer.url('/lejatszo.html'));
    await expect(player).toHaveTitle('Szüneteltetett lejátszó (kész)');
    await panel.bringToFront();

    const pinned = await findTab(panel, (tab) => tab.title === 'Rögzített');
    await panel.evaluate((id) => chrome.tabs.update(id, { pinned: true }), pinned.id);
    await expect.poll(async () => (await tabState(panel, (tab) => tab.url.endsWith('/hang.html')))?.audible).toBe(true);

    // A percenkénti ébresztő a valódi úton altat (legfeljebb két ébresztésnyi idő).
    await expect
      .poll(async () => (await tabState(panel, (tab) => tab.url.includes('cim=Sima')))?.discarded, {
        timeout: 200_000,
        intervals: [5_000],
      })
      .toBe(true);

    const tabs = await listTabs(panel);
    const byUrl = (part: string) => tabs.find((tab) => tab.url.includes(part)) as TabState;
    expect(byUrl('cim=Sima').title).toBe('💤 Sima');
    expect(byUrl('cim=Rögzített')).toMatchObject({ pinned: true, discarded: false });
    expect(byUrl('/hang.html')).toMatchObject({ audible: true, discarded: false });
    expect(byUrl('/urlap.html').discarded).toBe(false);
    expect(byUrl('/lejatszo.html').discarded).toBe(false);
    // A panel lapja aktív, azt soha nem altatja.
    expect(byUrl('sidepanel.html').discarded).toBe(false);
  });

  test('ATD10: YouTube-szerű nézőoldalon altatáskor a `t=` időpont bekerül az URL-be', async ({ context, panel }) => {
    const watch = await openPage(context, 'http://www.youtube.com/watch?v=teszt&ugras=3');
    await expect(watch).toHaveTitle('YouTube-szerű nézőoldal 3');
    await panel.bringToFront();

    const tab = await findTab(panel, (t) => t.url.includes('/watch?v=teszt'));
    expect(await runAction(panel, 'altatas.discardTab', { tabId: tab.id })).toMatchObject({
      ok: true,
      result: { discarded: true },
    });
    const discarded = await findTab(panel, (t) => t.url.includes('/watch?v=teszt'));
    expect(discarded.discarded).toBe(true);
    expect(new URL(discarded.url).searchParams.get('t')).toBe('3s');
    expect(discarded.title.startsWith('💤 ')).toBe(true);
  });

  test('ATD9: a háttérben nyitott új tab azonnal altatódik, amint ismert az URL-je', async ({ panel, fixtureServer }) => {
    const url = fixtureServer.url('/oldal.html?cim=Háttérben');
    await panel.evaluate((url) => chrome.tabs.create({ url, active: false }), url);
    await expect.poll(async () => (await tabState(panel, (t) => t.url === url))?.discarded).toBe(true);

    // Kikapcsolva nem altat.
    await setSettings(panel, 'altatas', { discardNewBackgroundTabs: false });
    const otherId = await panel.evaluate(
      async (url) => (await chrome.tabs.create({ url, active: false })).id!,
      fixtureServer.url('/oldal.html?cim=Háttérben 2'),
    );
    await expect.poll(async () => (await tabState(panel, (t) => t.id === otherId))?.title).toBe('Háttérben 2');
    expect((await findTab(panel, (t) => t.id === otherId)).discarded).toBe(false);
  });

  test('ATD2 és ATD5: az ablak többi tabja altat, a kivételeket betartva; ébresztés', async ({
    context,
    panel,
    fixtureServer,
  }) => {
    await setSettings(panel, 'altatas', { exceptions: ['localhost'] });
    await openPage(context, fixtureServer.url('/oldal.html?cim=Egy'));
    await openPage(context, fixtureServer.url('/oldal.html?cim=Kettő'));
    await openPage(context, fixtureServer.url('/oldal.html?cim=Ezt ne'));
    await openPage(context, fixtureServer.url('/oldal.html?cim=Listán').replace('127.0.0.1', 'localhost'));
    await panel.bringToFront();

    const never = await findTab(panel, (t) => t.title === 'Ezt ne');
    expect(await runAction(panel, 'altatas.toggleNever', { tabId: never.id })).toEqual({ ok: true, result: true });
    await expect(panel.locator(`.tab-row[data-tab-id="${never.id}"]`).getByRole('img', { name: 'Altatási kivétel' })).toBeVisible();

    const windowId = (await findTab(panel, (t) => t.url.endsWith('sidepanel.html'))).windowId;
    expect(await runAction(panel, 'altatas.discardOthers', { windowId })).toMatchObject({ ok: true });

    const after = await listTabs(panel);
    const state = (title: string) => after.find((t) => t.title.replace('💤 ', '') === title)?.discarded;
    expect(state('Egy')).toBe(true);
    expect(state('Kettő')).toBe(true);
    expect(state('Ezt ne')).toBe(false);
    expect(state('Listán')).toBe(false);

    const woken = await runAction(panel, 'altatas.wakeWindow', { windowId });
    expect(woken.ok).toBe(true);
    await expect
      .poll(async () => (await listTabs(panel)).filter((t) => t.discarded).length)
      .toBe(0);
  });
});

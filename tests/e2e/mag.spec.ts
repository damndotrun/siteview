import { EXTENSION_ID, expect, runAction, test } from './fixtures';

test.describe('Mag', () => {
  test('a kiegészítő a rögzített azonosítóval töltődik be, a panel megnyílik', async ({ extensionId, panel }) => {
    expect(extensionId).toBe(EXTENSION_ID);
    await expect(panel.getByRole('heading', { name: 'Siteview' })).toBeVisible();
    await expect(panel.getByRole('region', { name: 'Tabok' })).toBeVisible();
  });

  test('a beállításokban a modulok listája kapcsolókkal; a kikapcsolt modul művelete nem fut', async ({ panel }) => {
    await panel.getByRole('button', { name: 'Beállítások' }).click();
    const settings = panel.getByRole('region', { name: 'Beállítások' });
    await expect(settings.getByText('Oldalpanel', { exact: true })).toBeVisible();
    await expect(settings.getByText('Altatás', { exact: true })).toBeVisible();

    const altatasSwitch = settings.getByRole('switch', { name: 'Altatás bekapcsolva' });
    await expect(altatasSwitch).toBeChecked();
    await altatasSwitch.uncheck();

    // A beállítás a sync tárolóba kerül, modulonként külön kulcson.
    await expect
      .poll(() => panel.evaluate(async () => (await chrome.storage.sync.get('settings:altatas'))['settings:altatas']))
      .toMatchObject({ enabled: false });
    await expect.poll(async () => (await runAction(panel, 'altatas.wakeWindow')).ok).toBe(false);

    await altatasSwitch.check();
    await expect.poll(async () => (await runAction(panel, 'altatas.wakeWindow')).ok).toBe(true);
  });

  test('a modul sorára kattintva a modul saját beállításai nyílnak', async ({ panel }) => {
    await panel.getByRole('button', { name: 'Beállítások' }).click();
    await panel.getByRole('button', { name: /^Altatás/ }).click();
    const view = panel.getByRole('region', { name: 'Altatás beállításai' });
    await expect(view.getByLabel('Altatás ennyi perc inaktivitás után')).toHaveValue('30');
    await expect(view.getByRole('note')).toContainText('Memóriakímélő');
  });

  test('ismeretlen műveletre érthető hiba jön', async ({ panel }) => {
    expect(await runAction(panel, 'nincs.ilyen')).toEqual({ ok: false, error: 'Ismeretlen művelet: nincs.ilyen' });
  });
});

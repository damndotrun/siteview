import { basename, dirname, join } from 'node:path';
import type { Page } from '@playwright/test';
import {
  DOWNLOADS_DIR,
  downloadedFile,
  expect,
  findTab,
  openPage,
  runAction,
  test,
  useChromeDownloads,
  type DownloadedFile,
} from './fixtures';

type Rgba = [number, number, number, number];
type SaveResult = { downloadId: number; filename: string; source: string };

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** A fájl valódi formátuma a bájtjai alapján (nem a kiterjesztésből). */
function formatOf(bytes: Buffer) {
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'jpg';
  if (bytes.subarray(0, 8).equals(PNG_SIGNATURE)) return 'png';
  return 'ismeretlen';
}

/** A letöltött kép mérete és két képpontja: a bal (piros) és a jobb (eredetileg átlátszó) feléből. */
async function samplePixels(panel: Page, file: DownloadedFile) {
  return panel.evaluate(
    async ([base64, mime]) => {
      const blob = await (await fetch(`data:${mime};base64,${base64}`)).blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext('2d')!;
      context.drawImage(bitmap, 0, 0);
      const at = (x: number, y: number) => [...context.getImageData(x, y, 1, 1).data] as Rgba;
      return { width: bitmap.width, height: bitmap.height, left: at(5, 10), right: at(30, 10) };
    },
    [file.bytes.toString('base64'), file.mime] as const,
  );
}

const near = (actual: Rgba, expected: Rgba, tolerance = 8) =>
  actual.every((value, i) => Math.abs(value - expected[i]!) <= tolerance);

const RED: Rgba = [220, 30, 30, 255];
const WHITE: Rgba = [255, 255, 255, 255];

async function openImages(context: Parameters<typeof openPage>[0], panel: Page, url: string) {
  const page = await openPage(context, url);
  await panel.bringToFront();
  const tab = await findTab(panel, (t) => t.title === 'Képek');
  return { page, tab };
}

/** A helyi menü „Mentés JPG/PNG-ként” pontjával azonos `runAction` hívás. */
async function save(panel: Page, format: 'Jpg' | 'Png', tab: { id: number; url: string }, srcUrl: string) {
  return runAction(panel, `kepmentes.save${format}`, { tabId: tab.id, info: { srcUrl, pageUrl: tab.url } });
}

test.describe('Képmentés (SI1, SI4)', () => {
  for (const source of ['atlatszo.png', 'atlatszo.webp']) {
    test(`${source}: JPG-ként az átlátszó rész fehér, PNG-ként átlátszó marad`, async ({ context, panel, fixtureServer }) => {
      const { tab } = await openImages(context, panel, fixtureServer.url('/kepek.html'));
      const srcUrl = fixtureServer.url(`/${source}`);

      const jpg = await save(panel, 'Jpg', tab, srcUrl);
      expect(jpg).toMatchObject({ ok: true, result: { filename: 'atlatszo.jpg', source: 'letöltés' } });
      const jpgFile = await downloadedFile(panel, (jpg.result as SaveResult).downloadId);
      expect(formatOf(jpgFile.bytes)).toBe('jpg');
      expect(jpgFile.mime).toBe('image/jpeg');
      const jpgPixels = await samplePixels(panel, jpgFile);
      expect(jpgPixels).toMatchObject({ width: 40, height: 20 });
      expect(near(jpgPixels.left, RED), `bal: ${jpgPixels.left}`).toBe(true);
      expect(near(jpgPixels.right, WHITE), `jobb: ${jpgPixels.right}`).toBe(true);

      const png = await save(panel, 'Png', tab, srcUrl);
      expect(png).toMatchObject({ ok: true, result: { filename: 'atlatszo.png', source: 'letöltés' } });
      const pngFile = await downloadedFile(panel, (png.result as SaveResult).downloadId);
      expect(formatOf(pngFile.bytes)).toBe('png');
      expect(pngFile.mime).toBe('image/png');
      const pngPixels = await samplePixels(panel, pngFile);
      expect(pngPixels).toMatchObject({ width: 40, height: 20 });
      expect(near(pngPixels.left, RED, 0), `bal: ${pngPixels.left}`).toBe(true);
      expect(pngPixels.right[3], 'a jobb fele átlátszó').toBe(0);
    });
  }

  test('hotlink-védett kép: a tartalék az oldalon betöltött képből menti', async ({ context, panel, fixtureServer }) => {
    const { page, tab } = await openImages(context, panel, fixtureServer.url('/kepek.html'));
    await expect.poll(() => page.locator('#vedett').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(40);

    const result = await save(panel, 'Jpg', tab, fixtureServer.url('/vedett/atlatszo.png'));
    expect(result).toMatchObject({ ok: true, result: { filename: 'atlatszo.jpg', source: 'oldal' } });
    const file = await downloadedFile(panel, (result.result as SaveResult).downloadId);
    expect(formatOf(file.bytes)).toBe('jpg');
    const pixels = await samplePixels(panel, file);
    expect(near(pixels.left, RED), `bal: ${pixels.left}`).toBe(true);
    expect(near(pixels.right, WHITE), `jobb: ${pixels.right}`).toBe(true);
  });

  test('hotlink-védett kép más domainről: érthető hibaüzenet az oldalon', async ({ context, panel, fixtureServer }) => {
    const { page, tab } = await openImages(context, panel, fixtureServer.url('/kepek.html'));
    await expect.poll(() => page.locator('#idegen').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(40);

    const result = await save(panel, 'Png', tab, `http://localhost:${fixtureServer.port}/vedett/atlatszo.webp`);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('más domainről jön');
    expect(await panel.evaluate(() => chrome.downloads.search({}))).toEqual([]);
    await expect(page.getByRole('alert')).toContainText('Képmentés: A képet nem sikerült letölteni');
  });

  test('SI4: a beállított sablon szerinti névvel és minőséggel ment, „Mentés másként” ablak nélkül', async ({
    context,
    panel,
    fixtureServer,
    userDataDir,
  }) => {
    await panel.getByRole('button', { name: 'Beállítások' }).click();
    await panel.getByRole('button', { name: /^Képmentés/ }).click();
    const view = panel.getByRole('region', { name: 'Képmentés beállításai' });
    await expect(view.getByLabel(/JPG minőség/)).toHaveValue('92');
    await expect(view.getByLabel('Fájlnév-sablon')).toHaveValue('{eredeti}');
    await expect(view.getByLabel('„Mentés másként” ablak mentés előtt')).not.toBeChecked();
    await view.getByLabel('Fájlnév-sablon').fill('{domain} {eredeti} {dátum}');
    await view.getByLabel('Fájlnév-sablon').blur();
    await view.getByLabel(/JPG minőség/).fill('100');
    await expect
      .poll(() => panel.evaluate(async () => (await chrome.storage.sync.get('settings:kepmentes'))['settings:kepmentes']))
      .toMatchObject({ filenameTemplate: '{domain} {eredeti} {dátum}', jpegQuality: 100, saveAs: false });

    // A kért fájlnevet csak a Chrome saját letöltéskezelője tartja meg (a Playwrighté azonosítóra cseréli).
    await useChromeDownloads(context, panel);
    const { tab } = await openImages(context, panel, fixtureServer.url('/kepek.html'));
    const srcUrl = fixtureServer.url('/atlatszo.webp');
    const today = await panel.evaluate(() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const expected = `127.0.0.1 atlatszo ${today}`;

    const best = await save(panel, 'Jpg', tab, srcUrl);
    expect(best).toMatchObject({ ok: true, result: { filename: `${expected}.jpg` } });
    const bestFile = await downloadedFile(panel, (best.result as SaveResult).downloadId);
    expect(dirname(bestFile.path)).toBe(join(userDataDir, DOWNLOADS_DIR));
    expect(basename(bestFile.path)).toBe(`${expected}.jpg`);
    expect(formatOf(bestFile.bytes)).toBe('jpg');

    // Ugyanaz a név még egyszer: a Chrome sorszámot tesz mellé; alacsony minőségnél kisebb a fájl.
    await panel.getByRole('region', { name: 'Képmentés beállításai' }).getByLabel(/JPG minőség/).fill('10');
    await expect
      .poll(() => panel.evaluate(async () => (await chrome.storage.sync.get('settings:kepmentes'))['settings:kepmentes']))
      .toMatchObject({ jpegQuality: 10 });
    const low = await save(panel, 'Jpg', tab, srcUrl);
    const lowFile = await downloadedFile(panel, (low.result as SaveResult).downloadId);
    expect(basename(lowFile.path)).toBe(`${expected} (1).jpg`);
    expect(lowFile.bytes.length).toBeLessThan(bestFile.bytes.length);
  });
});

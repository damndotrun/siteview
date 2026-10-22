import { browser } from 'wxt/browser';
import { getSettings } from '@/lib/core/settings';
import type { ActionData, ModuleBackground } from '@/lib/core/types';
import { buildFilename, clampQuality, type ImageFormat } from './logic';
import { kepmentes } from './module';
import { readLoadedImage, showPageMessage, type LoadedImage } from './page';

export interface SaveOutcome {
  downloadId: number;
  filename: string;
  /** Honnan jöttek a bájtok: a háttér letöltötte, vagy az oldalon már betöltött képből (tartalék). */
  source: 'letöltés' | 'oldal';
}

/** A kép bájtjai a háttérből, a felhasználó sütijeivel (a host jogosultság miatt más domainről is). */
async function fetchImage(srcUrl: string): Promise<ImageBitmap> {
  const response = await fetch(srcUrl, { credentials: 'include' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return createImageBitmap(await response.blob());
}

/** Tartalék: a tab kereteiben a már betöltött `<img>`-ből kért képadat, ha a canvas nem „szennyezett”. */
async function imageFromPage(tabId: number, srcUrl: string): Promise<ImageBitmap> {
  const results = await browser.scripting.executeScript({
    target: { tabId, allFrames: true },
    func: readLoadedImage,
    args: [srcUrl],
  });
  const answers = results.map((result) => result.result as LoadedImage | undefined);
  const found = answers.find((answer) => answer?.dataUrl);
  if (found?.dataUrl) return createImageBitmap(await (await fetch(found.dataUrl)).blob());
  if (answers.some((answer) => answer?.error === 'tainted')) {
    throw new Error(
      'A képet nem sikerült letölteni, és az oldalon betöltött kép sem olvasható ki, mert más domainről jön. ' +
        'Nyisd meg a képet külön tabon, és onnan mentsd.',
    );
  }
  throw new Error('A képet nem sikerült letölteni, és az oldalon sem található betöltött példánya.');
}

async function encode(bitmap: ImageBitmap, format: ImageFormat, quality: number): Promise<Blob> {
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Nem érhető el a 2D canvas');
  if (format === 'jpg') {
    // A JPG-nek nincs átlátszósága: az átlátszó rész fehér lesz.
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas.convertToBlob(
    format === 'jpg' ? { type: 'image/jpeg', quality: quality / 100 } : { type: 'image/png' },
  );
}

/** A service workerben nincs `URL.createObjectURL`, ezért a letöltés `data:` címről indul. */
async function toDataUrl(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return `data:${blob.type};base64,${btoa(binary)}`;
}

export async function saveImage(data: ActionData, format: ImageFormat): Promise<SaveOutcome> {
  const srcUrl = data.info?.srcUrl;
  if (!srcUrl) throw new Error('Hiányzik a kép címe');
  const tabId = data.tabId;
  const tab = tabId !== undefined ? await browser.tabs.get(tabId).catch(() => undefined) : undefined;
  const settings = await getSettings(kepmentes);

  let bitmap: ImageBitmap;
  let source: SaveOutcome['source'] = 'letöltés';
  try {
    bitmap = await fetchImage(srcUrl);
  } catch (error) {
    if (tabId === undefined) throw error;
    bitmap = await imageFromPage(tabId, srcUrl);
    source = 'oldal';
  }

  const blob = await encode(bitmap, format, clampQuality(settings.jpegQuality));
  const filename = buildFilename({
    template: settings.filenameTemplate,
    format,
    srcUrl,
    pageUrl: data.info?.pageUrl ?? tab?.url,
    pageTitle: tab?.title,
    date: new Date(),
  });
  const downloadId = await browser.downloads.download({
    url: await toDataUrl(blob),
    filename,
    saveAs: settings.saveAs,
    conflictAction: 'uniquify',
  });
  return { downloadId, filename, source };
}

/** A hibát a felhasználó is lássa (a helyi menüből indított műveletnek nincs más felülete), majd tovább dobja. */
async function withPageError<T>(data: ActionData, task: () => Promise<T>): Promise<T> {
  try {
    return await task();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (data.tabId !== undefined) {
      await browser.scripting
        .executeScript({ target: { tabId: data.tabId }, func: showPageMessage, args: [`Képmentés: ${message}`] })
        .catch(() => undefined);
    }
    throw error;
  }
}

export const kepmentesBackground: ModuleBackground = {
  menus: [
    { id: 'save-jpg', title: 'Mentés JPG-ként', contexts: ['image'], action: 'kepmentes.saveJpg' },
    { id: 'save-png', title: 'Mentés PNG-ként', contexts: ['image'], action: 'kepmentes.savePng' },
  ],
  actions: {
    'kepmentes.saveJpg': (data) => withPageError(data, () => saveImage(data, 'jpg')),
    'kepmentes.savePng': (data) => withPageError(data, () => saveImage(data, 'png')),
  },
};

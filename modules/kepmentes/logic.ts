// A Képmentés tiszta logikája: fájlnév a sablonból, minőség. Böngésző API nélkül, Vitesttel tesztelve.
import { dateTokens, renderTemplate, sanitizeFilename } from '@/lib/filename';

export type ImageFormat = 'jpg' | 'png';

export const MIN_QUALITY = 1;
export const MAX_QUALITY = 100;
/** Ha a sablonból (vagy a kép címéből) nem jön ki név. */
export const FALLBACK_NAME = 'kép';

export const TOKENS = ['{cím}', '{domain}', '{dátum}', '{idő}', '{eredeti}'] as const;

export function clampQuality(value: number): number {
  if (!Number.isFinite(value)) return MAX_QUALITY;
  return Math.min(MAX_QUALITY, Math.max(MIN_QUALITY, Math.round(value)));
}

/** `{eredeti}`: a kép címének utolsó útvonal-eleme kiterjesztés nélkül; `data:` és `blob:` címnél üres. */
export function originalName(srcUrl: string): string {
  let url: URL;
  try {
    url = new URL(srcUrl);
  } catch {
    return '';
  }
  if (!/^(https?|file):$/.test(url.protocol)) return '';
  const last = url.pathname.split('/').filter(Boolean).at(-1) ?? '';
  let name = last;
  try {
    name = decodeURIComponent(last);
  } catch {
    // Hibás %-kódolás: marad, ahogy van.
  }
  return name.replace(/\.[^.]*$/, '');
}

/** `{domain}`: az oldal hostneve `www.` nélkül (ha nincs oldal, a képé). */
export function domainOf(...urls: (string | undefined)[]): string {
  for (const url of urls) {
    try {
      const host = new URL(url ?? '').hostname;
      if (host) return host.replace(/^www\./i, '');
    } catch {
      // következő
    }
  }
  return '';
}

export interface FilenameInput {
  template: string;
  format: ImageFormat;
  srcUrl: string;
  pageUrl?: string;
  pageTitle?: string;
  date: Date;
}

/** A letöltés fájlneve: a sablon kitöltve, megtisztítva, a formátum kiterjesztésével. */
export function buildFilename({ template, format, srcUrl, pageUrl, pageTitle, date }: FilenameInput): string {
  const tokens = {
    cím: pageTitle ?? '',
    domain: domainOf(pageUrl, srcUrl),
    eredeti: originalName(srcUrl),
    ...dateTokens(date),
  };
  return `${sanitizeFilename(renderTemplate(template, tokens), FALLBACK_NAME)}.${format}`;
}

// Fájlnév-sablon tokenekkel (`{cím}`, `{domain}`, `{dátum}`, `{idő}`, ...). Böngésző API nélkül, Vitesttel tesztelve.

/** A Windows fájlnévben tiltott karakterek és a vezérlőkarakterek. */
const ILLEGAL = /[<>:"/\\|?*\u0000-\u001f\u007f]/g;
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
export const MAX_NAME_LENGTH = 150;

const pad = (value: number) => String(value).padStart(2, '0');

/** `{dátum}` és `{idő}` helyi időben; az idő kettőspont nélkül, mert az Windowson tilos a fájlnévben. */
export function dateTokens(date: Date): { dátum: string; idő: string } {
  return {
    dátum: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    idő: `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`,
  };
}

/** Egyetlen fájlnév (kiterjesztés nélkül), amelyet a Chrome és a Windows is elfogad; üresnél `fallback`. */
export function sanitizeFilename(name: string, fallback: string): string {
  let clean = name.replace(ILLEGAL, '_').replace(/\s+/g, ' ');
  clean = [...clean].slice(0, MAX_NAME_LENGTH).join('');
  clean = clean.replace(/^[\s.]+|[\s.]+$/g, '');
  if (!clean) return fallback;
  return RESERVED.test(clean) ? `_${clean}` : clean;
}

/** A sablon tokenjeit behelyettesíti; az ismeretlen token szó szerint marad. */
export function renderTemplate(template: string, tokens: Record<string, string>): string {
  return template.replace(/\{([^{}]+)\}/g, (match, name: string) => tokens[name] ?? match);
}

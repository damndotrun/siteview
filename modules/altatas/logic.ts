// Az Altatás tiszta logikája: kivételek, időzítés, YouTube időpont. Böngésző API nélkül, Vitesttel tesztelve.

export const SLEEP_PREFIX = '💤 ';
export const MIN_MINUTES = 1;
export const MAX_MINUTES = 1440;

export interface TabLike {
  id?: number;
  url?: string;
  active?: boolean;
  pinned?: boolean;
  audible?: boolean;
  discarded?: boolean;
}

export interface ContentState {
  pausedMedia: boolean;
  dirtyForm: boolean;
}

export type Blocker =
  | 'aktív'
  | 'már altatva'
  | 'nem altatható oldal'
  | 'rögzített'
  | 'hangot játszik'
  | 'kivétellista'
  | 'ezt ne altasd'
  | 'még nem telt le az idő'
  | 'szüneteltetett lejátszó'
  | 'el nem küldött űrlap';

export function clampMinutes(value: number): number {
  if (!Number.isFinite(value)) return MIN_MINUTES;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(value)));
}

export function isDiscardableUrl(url: string | undefined): boolean {
  return !!url && /^(https?|file):/i.test(url);
}

/** Szövegmezőből (soronként egy) kivétellista: üres sorok és szóközök nélkül. */
export function parseExceptions(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Igaz, ha az URL illik a kivétellista valamelyik elemére (host aldomainekkel, vagy `re:` kifejezés). */
export function matchesException(url: string | undefined, patterns: string[]): boolean {
  if (!url) return false;
  let host = '';
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return patterns.some((pattern) => {
    if (pattern.startsWith('re:')) {
      try {
        return new RegExp(pattern.slice(3)).test(url);
      } catch {
        return false;
      }
    }
    const wanted = pattern.toLowerCase().replace(/^\*\./, '');
    return host === wanted || host.endsWith(`.${wanted}`);
  });
}

/** Ami a tab adataiból látszik (tartalomszkript nélkül): ezek miatt soha nem altatunk automatikusan. */
export function staticBlocker(
  tab: TabLike,
  options: { exceptions: string[]; never: ReadonlySet<number> },
): Blocker | null {
  if (tab.discarded) return 'már altatva';
  if (tab.active) return 'aktív';
  if (!isDiscardableUrl(tab.url)) return 'nem altatható oldal';
  if (tab.pinned) return 'rögzített';
  if (tab.audible) return 'hangot játszik';
  if (tab.id !== undefined && options.never.has(tab.id)) return 'ezt ne altasd';
  if (matchesException(tab.url, options.exceptions)) return 'kivétellista';
  return null;
}

/** ATD1: a tab legalább `minutes` perce inaktív-e. */
export function isIdleLongEnough(inactiveSince: number, now: number, minutes: number): boolean {
  return now - inactiveSince >= minutes * 60_000;
}

/** ATD4: a tartalomszkript jelzése (szüneteltetett lejátszó, el nem küldött űrlap). */
export function contentBlocker(state: ContentState | null): Blocker | null {
  if (!state) return null;
  if (state.pausedMedia) return 'szüneteltetett lejátszó';
  if (state.dirtyForm) return 'el nem küldött űrlap';
  return null;
}

export function isYouTubeWatch(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const isYouTube = host === 'youtube.com' || host.endsWith('.youtube.com');
    return isYouTube && parsed.pathname === '/watch' && parsed.searchParams.has('v');
  } catch {
    return false;
  }
}

/** ATD10: a YouTube nézőoldal URL-je `t=<mp>s` paraméterrel; `null`, ha nem YouTube nézőoldal. */
export function withYouTubeTime(url: string, seconds: number): string | null {
  if (!isYouTubeWatch(url) || !(seconds > 0)) return null;
  const parsed = new URL(url);
  parsed.searchParams.set('t', `${Math.floor(seconds)}s`);
  return parsed.toString();
}

export function addSleepPrefix(title: string): string {
  return title.startsWith(SLEEP_PREFIX) ? title : SLEEP_PREFIX + title;
}

export function removeSleepPrefix(title: string): string {
  return title.startsWith(SLEEP_PREFIX) ? title.slice(SLEEP_PREFIX.length) : title;
}

/** A tab melletti tab, amelyre altatás előtt átvált (jobbra, ha nincs, balra). */
export function neighbourTab<T extends { index: number }>(tabs: T[], index: number): T | undefined {
  const sorted = [...tabs].sort((a, b) => a.index - b.index);
  return sorted.find((tab) => tab.index > index) ?? [...sorted].reverse().find((tab) => tab.index < index);
}

/** ATD2 ébresztés: a következő vagy előző altatott tab az aktívhoz képest. */
export function discardedNeighbour<T extends { index: number; discarded?: boolean }>(
  tabs: T[],
  activeIndex: number,
  direction: 'next' | 'prev',
): T | undefined {
  const sorted = [...tabs].sort((a, b) => a.index - b.index).filter((tab) => tab.discarded);
  return direction === 'next'
    ? sorted.find((tab) => tab.index > activeIndex)
    : sorted.reverse().find((tab) => tab.index < activeIndex);
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(undefined), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(undefined);
      },
    );
  });
}

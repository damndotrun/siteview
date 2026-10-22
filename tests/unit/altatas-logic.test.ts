import { describe, expect, it } from 'vitest';
import {
  addSleepPrefix,
  clampMinutes,
  contentBlocker,
  discardedNeighbour,
  isIdleLongEnough,
  matchesException,
  neighbourTab,
  parseExceptions,
  removeSleepPrefix,
  staticBlocker,
  withYouTubeTime,
  type TabLike,
} from '@/modules/altatas/logic';

const base: TabLike = { id: 7, url: 'https://example.com/a', active: false };
const options = { exceptions: [] as string[], never: new Set<number>() };

describe('kivétel-logika (ATD4, ATD5)', () => {
  it.each<[string, TabLike, Partial<typeof options>, string | null]>([
    ['sima inaktív tab altatható', base, {}, null],
    ['aktív tab', { ...base, active: true }, {}, 'aktív'],
    ['már altatott', { ...base, discarded: true }, {}, 'már altatva'],
    ['rögzített', { ...base, pinned: true }, {}, 'rögzített'],
    ['hangot játszik', { ...base, audible: true }, {}, 'hangot játszik'],
    ['chrome:// oldal', { ...base, url: 'chrome://settings' }, {}, 'nem altatható oldal'],
    ['kiegészítő oldala', { ...base, url: 'chrome-extension://abc/sidepanel.html' }, {}, 'nem altatható oldal'],
    ['„ezt ne altasd”', base, { never: new Set([7]) }, 'ezt ne altasd'],
    ['kivétellista hostnévvel', base, { exceptions: ['example.com'] }, 'kivétellista'],
    ['kivétellista re: kifejezéssel', base, { exceptions: ['re:/a$'] }, 'kivétellista'],
    ['más host nem kivétel', base, { exceptions: ['example.org'] }, null],
  ])('%s', (_name, tab, extra, expected) => {
    expect(staticBlocker(tab, { ...options, ...extra })).toBe(expected);
  });

  it('a hostnév az aldomaineket is lefedi, de a hasonló nevűt nem', () => {
    expect(matchesException('https://www.youtube.com/watch?v=1', ['youtube.com'])).toBe(true);
    expect(matchesException('https://m.youtube.com/', ['YouTube.com'])).toBe(true);
    expect(matchesException('https://notyoutube.com/', ['youtube.com'])).toBe(false);
    expect(matchesException('https://mail.google.com/', ['*.google.com'])).toBe(true);
  });

  it('a hibás reguláris kifejezés nem dob hibát, csak nem illik', () => {
    expect(matchesException('https://example.com/', ['re:(['])).toBe(false);
  });

  it('a kivétellista szövegmezőből soronként, üres sorok nélkül', () => {
    expect(parseExceptions(' example.com \n\n re:^https://x\n')).toEqual(['example.com', 're:^https://x']);
  });

  it('a tartalomszkript jelzése: szüneteltetett lejátszó és el nem küldött űrlap', () => {
    expect(contentBlocker(null)).toBeNull();
    expect(contentBlocker({ pausedMedia: false, dirtyForm: false })).toBeNull();
    expect(contentBlocker({ pausedMedia: true, dirtyForm: false })).toBe('szüneteltetett lejátszó');
    expect(contentBlocker({ pausedMedia: false, dirtyForm: true })).toBe('el nem küldött űrlap');
  });
});

describe('időzítés (ATD1)', () => {
  const minute = 60_000;

  it('pontosan N perc után altat, előtte nem', () => {
    expect(isIdleLongEnough(0, 30 * minute - 1, 30)).toBe(false);
    expect(isIdleLongEnough(0, 30 * minute, 30)).toBe(true);
    expect(isIdleLongEnough(0, minute, 1)).toBe(true);
  });

  it('a beállított percet 1 és 1440 közé szorítja', () => {
    expect(clampMinutes(0)).toBe(1);
    expect(clampMinutes(5000)).toBe(1440);
    expect(clampMinutes(30.4)).toBe(30);
    expect(clampMinutes(Number.NaN)).toBe(1);
  });
});

describe('YouTube időpont (ATD10)', () => {
  it('a nézőoldal URL-jébe `t=<mp>s` kerül', () => {
    expect(withYouTubeTime('https://www.youtube.com/watch?v=abc', 75.9)).toBe(
      'https://www.youtube.com/watch?v=abc&t=75s',
    );
    expect(withYouTubeTime('https://youtube.com/watch?v=abc&t=10s', 20)).toBe(
      'https://youtube.com/watch?v=abc&t=20s',
    );
  });

  it('nem nézőoldalon vagy 0 mp-nél nem változtat', () => {
    expect(withYouTubeTime('https://www.youtube.com/feed', 20)).toBeNull();
    expect(withYouTubeTime('https://example.com/watch?v=abc', 20)).toBeNull();
    expect(withYouTubeTime('https://www.youtube.com/watch?v=abc', 0)).toBeNull();
  });
});

describe('cím előtag (ATD7)', () => {
  it('egyszer teszi fel, és le is veszi', () => {
    expect(addSleepPrefix('Cím')).toBe('💤 Cím');
    expect(addSleepPrefix('💤 Cím')).toBe('💤 Cím');
    expect(removeSleepPrefix('💤 Cím')).toBe('Cím');
    expect(removeSleepPrefix('Cím')).toBe('Cím');
  });
});

describe('szomszéd tabok (ATD2)', () => {
  const tabs = [
    { id: 1, index: 0, discarded: true },
    { id: 2, index: 1 },
    { id: 3, index: 2, discarded: true },
    { id: 4, index: 3 },
    { id: 5, index: 4, discarded: true },
  ];

  it('altatás előtt jobbra vált, a sor végén balra', () => {
    expect(neighbourTab(tabs, 1)?.id).toBe(3);
    expect(neighbourTab(tabs.filter((t) => t.index !== 4), 4)?.id).toBe(4);
  });

  it('a következő és az előző altatott tab az aktívhoz képest', () => {
    expect(discardedNeighbour(tabs, 3, 'next')?.id).toBe(5);
    expect(discardedNeighbour(tabs, 3, 'prev')?.id).toBe(3);
    expect(discardedNeighbour(tabs, 4, 'next')).toBeUndefined();
  });
});

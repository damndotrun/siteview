import { describe, expect, it } from 'vitest';
import { MAX_NAME_LENGTH, dateTokens, renderTemplate, sanitizeFilename } from '@/lib/filename';
import { buildFilename, clampQuality, domainOf, originalName } from '@/modules/kepmentes/logic';

// 2026. október 21., 9:05:07 helyi időben.
const date = new Date(2026, 9, 21, 9, 5, 7);
const base = {
  template: '{eredeti}',
  format: 'jpg' as const,
  srcUrl: 'https://cdn.example.com/kepek/Nyári%20fotó.final.webp?w=800#x',
  pageUrl: 'https://www.pelda.hu/cikk/1',
  pageTitle: 'Egy cikk: „idézet” / alcím',
  date,
};

describe('fájlnév-sablon (SI4)', () => {
  it.each<[string, Partial<typeof base>, string]>([
    ['alap: {eredeti}, kiterjesztés a formátum szerint', {}, 'Nyári fotó.final.jpg'],
    ['PNG-nél .png', { format: 'png' as never }, 'Nyári fotó.final.png'],
    ['{domain}: az oldalé, www. nélkül', { template: '{domain}' }, 'pelda.hu.jpg'],
    ['{domain}: oldal nélkül a képé', { template: '{domain}', pageUrl: undefined }, 'cdn.example.com.jpg'],
    ['{dátum} {idő}: helyi idő, kettőspont nélkül', { template: '{dátum} {idő}' }, '2026-10-21 09-05-07.jpg'],
    ['{cím}: a tiltott karakterek helyett _', { template: '{cím}' }, 'Egy cikk_ „idézet” _ alcím.jpg'],
    ['több token szöveggel', { template: '{domain} - {eredeti} ({dátum})' }, 'pelda.hu - Nyári fotó.final (2026-10-21).jpg'],
    ['ismeretlen token szó szerint marad', { template: '{eredeti} {nincs}' }, 'Nyári fotó.final {nincs}.jpg'],
    ['data: kép: {eredeti} üres → „kép”', { srcUrl: 'data:image/png;base64,AAAA' }, 'kép.jpg'],
    ['blob: kép: {eredeti} üres → „kép”', { srcUrl: 'blob:https://pelda.hu/1234-5678' }, 'kép.jpg'],
    ['útvonal nélküli cím → „kép”', { srcUrl: 'https://pelda.hu/' }, 'kép.jpg'],
    ['kiterjesztés nélküli eredeti', { srcUrl: 'https://pelda.hu/kep/12345' }, '12345.jpg'],
    ['üres cím → „kép”', { template: '{cím}', pageTitle: undefined }, 'kép.jpg'],
    ['Windows foglalt név elé _', { template: 'CON' }, '_CON.jpg'],
    ['pont és szóköz a szélekről le', { template: ' ..{eredeti}. ' }, 'Nyári fotó.final.jpg'],
  ])('%s', (_name, patch, expected) => {
    expect(buildFilename({ ...base, ...patch })).toBe(expected);
  });

  it('a túl hosszú nevet levágja', () => {
    const name = buildFilename({ ...base, template: 'á'.repeat(400) });
    expect(name).toBe(`${'á'.repeat(MAX_NAME_LENGTH)}.jpg`);
  });

  it('a sablon tokenjei és a tisztítás külön is', () => {
    expect(renderTemplate('{a}-{b}-{a}', { a: '1', b: '2' })).toBe('1-2-1');
    expect(sanitizeFilename('a<b>c:d"e/f\\g|h?i*j\u0001k', 'x')).toBe('a_b_c_d_e_f_g_h_i_j_k');
    expect(sanitizeFilename('  ', 'x')).toBe('x');
    expect(dateTokens(new Date(2026, 0, 2, 3, 4, 5))).toEqual({ dátum: '2026-01-02', idő: '03-04-05' });
  });

  it('{eredeti} és {domain} segédfüggvényei', () => {
    expect(originalName('https://a.hu/x/kép.png')).toBe('kép');
    expect(originalName('https://a.hu/x/hibas%E0.png')).toBe('hibas%E0');
    expect(originalName('nem url')).toBe('');
    expect(domainOf(undefined, 'nem url', 'https://WWW.Pelda.hu/x')).toBe('pelda.hu');
    expect(domainOf()).toBe('');
  });
});

describe('JPG minőség', () => {
  it.each([
    [92, 92],
    [0, 1],
    [150, 100],
    [55.6, 56],
    [Number.NaN, 100],
  ])('%s → %s', (input, expected) => {
    expect(clampQuality(input)).toBe(expected);
  });
});

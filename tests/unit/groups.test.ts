import { describe, expect, it } from 'vitest';
import { buildSections, displayDomain } from '@/modules/oldalpanel/groups';

const tab = (id: number, index: number, groupId = -1, windowId = 1) => ({ id, index, groupId, windowId });

describe('tablista szerkezete (TS1)', () => {
  it('az egymás melletti azonos csoportú tabok egy fejléc alá kerülnek, sorrendben', () => {
    const [section] = buildSections(
      [tab(4, 3), tab(1, 0), tab(2, 1, 10), tab(3, 2, 10)],
      [{ id: 10, title: 'Munka', color: 'blue' }],
    );
    expect(section!.tabCount).toBe(4);
    expect(section!.items.map((item) => (item.kind === 'tab' ? item.tab.id : `g${item.group.id}:${item.tabs.length}`))).toEqual([
      1,
      'g10:2',
      4,
    ]);
    const group = section!.items[1];
    expect(group?.kind === 'group' && group.group.title).toBe('Munka');
  });

  it('ismeretlen csoport szürke fejlécet kap', () => {
    const [section] = buildSections([tab(1, 0, 99)], []);
    const item = section!.items[0];
    expect(item?.kind === 'group' && item.group.color).toBe('grey');
  });

  it('minden ablaknál az aktuális ablak kerül előre', () => {
    const sections = buildSections([tab(1, 0, -1, 5), tab(2, 0, -1, 3), tab(3, 0, -1, 9)], [], 9);
    expect(sections.map((s) => s.windowId)).toEqual([9, 3, 5]);
  });

  it('domain www nélkül, nem webes oldalnál a séma', () => {
    expect(displayDomain('https://www.example.com/x')).toBe('example.com');
    expect(displayDomain('chrome://extensions')).toBe('chrome');
    expect(displayDomain('file:///tmp/a.html')).toBe('fájl');
    expect(displayDomain(undefined)).toBe('');
  });
});

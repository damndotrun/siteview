// TS1: a tablista szerkezete (ablakok, a Chrome tabcsoportok fejlécei). Tiszta függvény, Vitesttel tesztelve.

export interface TabInfo {
  id?: number;
  index: number;
  windowId: number;
  groupId: number;
  title?: string;
  url?: string;
  active?: boolean;
}

export interface GroupInfo {
  id: number;
  title?: string;
  color: string;
  collapsed?: boolean;
}

export type ListItem<T extends TabInfo> =
  | { kind: 'tab'; tab: T }
  | { kind: 'group'; group: GroupInfo; tabs: T[] };

export interface WindowSection<T extends TabInfo> {
  windowId: number;
  items: ListItem<T>[];
  tabCount: number;
}

const NO_GROUP = -1;

/** Ablakonként (az aktuális elöl) a tabok sorrendben; az egymás melletti, azonos csoportú tabok egy fejléc alá. */
export function buildSections<T extends TabInfo>(
  tabs: T[],
  groups: GroupInfo[],
  currentWindowId?: number,
): WindowSection<T>[] {
  const groupById = new Map(groups.map((group) => [group.id, group]));
  const byWindow = new Map<number, T[]>();
  for (const tab of tabs) {
    const list = byWindow.get(tab.windowId) ?? [];
    list.push(tab);
    byWindow.set(tab.windowId, list);
  }
  const windowIds = [...byWindow.keys()].sort((a, b) =>
    a === currentWindowId ? -1 : b === currentWindowId ? 1 : a - b,
  );
  return windowIds.map((windowId) => {
    const windowTabs = byWindow.get(windowId)!.sort((a, b) => a.index - b.index);
    const items: ListItem<T>[] = [];
    for (const tab of windowTabs) {
      const last = items.at(-1);
      if (tab.groupId === NO_GROUP) {
        items.push({ kind: 'tab', tab });
      } else if (last?.kind === 'group' && last.group.id === tab.groupId) {
        last.tabs.push(tab);
      } else {
        const group = groupById.get(tab.groupId) ?? { id: tab.groupId, color: 'grey' };
        items.push({ kind: 'group', group, tabs: [tab] });
      }
    }
    return { windowId, items, tabCount: windowTabs.length };
  });
}

/** A sorban mutatott domain: `www.` nélkül; nem webes oldalnál a séma (pl. `chrome`). */
export function displayDomain(url: string | undefined): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.hostname.replace(/^www\./, '');
    }
    return parsed.protocol === 'file:' ? 'fájl' : parsed.protocol.replace(/:$/, '');
  } catch {
    return '';
  }
}

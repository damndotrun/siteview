import { browser } from 'wxt/browser';

// Futásidejű állapot a `chrome.storage.session`-ben: túléli a service worker leállását, a böngésző
// bezárását nem (a tabazonosítók úgyis újak lesznek).
export const STATE_KEY = 'altatas:state';

export interface AltatasState {
  /** Ablakonként az aktív tab, hogy tudjuk, melyik vált épp inaktívvá. */
  activeByWindow: Record<string, number>;
  /** Tabonként az időpont (ms), amióta inaktív. */
  inactiveSince: Record<string, number>;
  /** ATD5: „ezt a tabot ne altasd”, a tab élettartamára. */
  never: number[];
}

const empty = (): AltatasState => ({ activeByWindow: {}, inactiveSince: {}, never: [] });

export async function readState(): Promise<AltatasState> {
  const stored = await browser.storage.session.get(STATE_KEY);
  return { ...empty(), ...(stored[STATE_KEY] as Partial<AltatasState> | undefined) };
}

let queue: Promise<unknown> = Promise.resolve();

/** Sorban futó olvasás-módosítás-írás, hogy az egymást követő tabesemények ne írják felül egymást. */
export function updateState(change: (state: AltatasState) => void): Promise<AltatasState> {
  const run = queue.then(async () => {
    const state = await readState();
    change(state);
    await browser.storage.session.set({ [STATE_KEY]: state });
    return state;
  });
  queue = run.catch(() => undefined);
  return run;
}

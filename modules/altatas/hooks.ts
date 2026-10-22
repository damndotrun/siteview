import { withTimeout } from './logic';

/** Altatás előtt hívott horog; a 7. csomagban a tartalom szerinti keresés ide köti a friss kinyerést. */
export type BeforeDiscardHook = (tabId: number) => void | Promise<void>;

export const BEFORE_DISCARD_TIMEOUT_MS = 2000;

const hooks = new Set<BeforeDiscardHook>();

export function registerBeforeDiscard(hook: BeforeDiscardHook): () => void {
  hooks.add(hook);
  return () => hooks.delete(hook);
}

/** Lefuttatja a horgokat, és legfeljebb `timeoutMs`-ig vár rájuk; a hibás horog nem állítja meg az altatást. */
export async function runBeforeDiscard(tabId: number, timeoutMs = BEFORE_DISCARD_TIMEOUT_MS) {
  if (hooks.size === 0) return;
  const runs = [...hooks].map((hook) => Promise.resolve().then(() => hook(tabId)));
  await withTimeout(Promise.allSettled(runs), timeoutMs);
}

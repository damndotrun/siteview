import { afterEach, describe, expect, it, vi } from 'vitest';
import { BEFORE_DISCARD_TIMEOUT_MS, registerBeforeDiscard, runBeforeDiscard } from '@/modules/altatas/hooks';

describe('beforeDiscard horog', () => {
  const cleanups: (() => void)[] = [];
  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
    vi.useRealTimers();
  });

  it('megvárja a horgokat, és megkapja a tab azonosítóját', async () => {
    const seen: number[] = [];
    cleanups.push(registerBeforeDiscard(async (tabId) => void seen.push(tabId)));
    await runBeforeDiscard(42);
    expect(seen).toEqual([42]);
  });

  it('legfeljebb 2 mp-ig vár', async () => {
    vi.useFakeTimers();
    cleanups.push(registerBeforeDiscard(() => new Promise(() => undefined)));
    let done = false;
    const run = runBeforeDiscard(1).then(() => (done = true));
    await vi.advanceTimersByTimeAsync(BEFORE_DISCARD_TIMEOUT_MS - 1);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await run;
    expect(done).toBe(true);
    expect(BEFORE_DISCARD_TIMEOUT_MS).toBe(2000);
  });

  it('a hibás horog nem állítja meg az altatást', async () => {
    cleanups.push(registerBeforeDiscard(() => {
      throw new Error('hiba');
    }));
    await expect(runBeforeDiscard(1)).resolves.toBeUndefined();
  });
});

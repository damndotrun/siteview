import type { browser } from '@wxt-dev/browser';

// Az e2e a `page.evaluate`-ben a kiegészítő lapjain futtat kódot, ahol a `chrome` objektum elérhető.
declare global {
  const chrome: typeof browser;
}

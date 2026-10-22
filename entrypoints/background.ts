import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import { createCore } from '@/lib/core/core';
import { BACKGROUND_MODULES } from '@/modules/background';

export default defineBackground({
  type: 'module',
  main() {
    const core = createCore(BACKGROUND_MODULES, {
      'mag.openPanel': (data) => {
        // Szinkron hívás kell, különben a Chrome nem tekinti felhasználói műveletnek.
        if (data.windowId !== undefined) return browser.sidePanel.open({ windowId: data.windowId });
        if (data.tabId !== undefined) return browser.sidePanel.open({ tabId: data.tabId });
        throw new Error('Hiányzik az ablak azonosítója');
      },
    });
    core.start();
  },
});

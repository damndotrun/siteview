import { defineConfig } from 'wxt';

// A rögzített kulcsból számolt azonosító: bpeghpddlcamabdbmkekdoccaogngenl.
// A companion app (native messaging host) csak ennek az azonosítónak válaszol.
export const EXTENSION_KEY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAju5PEBNQ6v1IFCvqSV9iDvO81RAIUwBKpvPI3U7YiQuh0Srx5SwnFz2ldvil0X0ktLWOsl6eY8ahkEemSS2BsetkEsmFFiz2DqhpIsWqDvb5gXXsQCt2JbtrrF4yacbsUv1PMsdzKbABJvgwAFjDv1CzoCghM9y1CUenft1Crwu0L3Wg+QMklalad7RX03RWqWY3wGvGSQ26f8bMQ92Eo3/2ncCJkFTK3QV8szBvrzSHvW5A+NCglpgtj1uAIX6d7tJjidgo9lY2KjHSv+0f4M1aRE8aagLYt51Kg0/p45H/N4qhrNetUUrKiaGbQHYf4B7dX1c71ZQuDVyL75hjLwIDAQAB';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  // A `modules/` mappa a Siteview moduljaié (spec: `modules/<név>/`), nem a WXT-modulaké.
  modulesDir: 'wxt-modules',
  manifest: {
    name: 'Siteview',
    description: 'Egy ikon, egy közös oldalpanel: tabok, altatás és a kiválasztott funkciók.',
    key: EXTENSION_KEY,
    minimum_chrome_version: '121',
    permissions: [
      'tabs',
      'tabGroups',
      'storage',
      'unlimitedStorage',
      'alarms',
      'contextMenus',
      'sidePanel',
      'downloads',
      'scripting',
      'offscreen',
      'nativeMessaging',
      'debugger',
      'webRequest',
      'cookies',
    ],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Siteview oldalpanel',
    },
    commands: {
      'open-panel': {
        suggested_key: { default: 'Alt+Shift+S' },
        description: 'Siteview oldalpanel megnyitása',
      },
    },
  },
});

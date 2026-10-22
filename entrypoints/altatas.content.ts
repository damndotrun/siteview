import { defineContentScript } from 'wxt/utils/define-content-script';
import { setupAltatasContent } from '@/modules/altatas/content';

// Futásidőben bejegyzett tartalomszkript: csak akkor fut, ha az Altatás modul be van kapcsolva.
export default defineContentScript({
  matches: ['<all_urls>'],
  registration: 'runtime',
  main() {
    setupAltatasContent();
  },
});

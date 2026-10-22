import { browser } from 'wxt/browser';
import { addSleepPrefix, removeSleepPrefix, withYouTubeTime, type ContentState } from './logic';

declare global {
  interface Window {
    __siteviewAltatas?: boolean;
  }
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return (
    !!target.closest('form') ||
    target.matches('input, textarea, select') ||
    (target as HTMLElement).isContentEditable
  );
}

function hasPausedMedia(): boolean {
  return [...document.querySelectorAll<HTMLMediaElement>('video, audio')].some(
    (media) => media.currentTime > 0 && media.paused,
  );
}

/** ATD10: YouTube-on az aktuális időpont az URL-be, hogy ébredéskor onnan folytatódjon. */
function rememberYouTubeTime() {
  const video = document.querySelector<HTMLVideoElement>('video');
  if (!video) return;
  const url = withYouTubeTime(location.href, video.currentTime);
  if (url) history.replaceState(history.state, '', url);
}

/** Az Altatás tartalomszkriptje: ATD4 kivételek jelzése, ATD7 cím előtag, ATD10. */
export function setupAltatasContent() {
  if (window.__siteviewAltatas) return;
  window.__siteviewAltatas = true;

  let dirtyForm = false;
  const markDirty = (event: Event) => {
    if (isEditable(event.target)) dirtyForm = true;
  };
  document.addEventListener('input', markDirty, true);
  document.addEventListener('change', markDirty, true);
  document.addEventListener('submit', () => (dirtyForm = false), true);

  browser.runtime.onMessage.addListener((message: { type?: string }, _sender, sendResponse) => {
    switch (message?.type) {
      case 'altatas.state': {
        const state: ContentState = { pausedMedia: hasPausedMedia(), dirtyForm };
        sendResponse(state);
        return;
      }
      case 'altatas.prepare':
        rememberYouTubeTime();
        document.title = addSleepPrefix(document.title);
        sendResponse({ ok: true });
        return;
      case 'altatas.restore':
        document.title = removeSleepPrefix(document.title);
        sendResponse({ ok: true });
        return;
    }
  });
}

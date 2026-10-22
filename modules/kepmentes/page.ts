// Az oldalba injektált függvények (`scripting.executeScript` `func`): önállóak, nem hivatkozhatnak semmi
// másra a fájlból, mert a Chrome csak a függvény szövegét viszi át.

export interface LoadedImage {
  dataUrl?: string;
  error?: 'nincs' | 'tainted';
}

/** SI1 tartalék: a már betöltött `<img>` képadata PNG-ként, ha a canvas nem „szennyezett”. */
export function readLoadedImage(srcUrl: string): LoadedImage {
  const image = [...document.images].find(
    (img) => (img.currentSrc === srcUrl || img.src === srcUrl) && img.complete && img.naturalWidth > 0,
  );
  if (!image) return { error: 'nincs' };
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext('2d')?.drawImage(image, 0, 0);
  try {
    return { dataUrl: canvas.toDataURL('image/png') };
  } catch {
    // SecurityError: más domainről CORS nélkül betöltött kép.
    return { error: 'tainted' };
  }
}

/** Rövid üzenet az oldal jobb alsó sarkában, Shadow DOM-ban, hogy az oldal stílusa ne érje el. */
export function showPageMessage(text: string) {
  const id = 'siteview-uzenet';
  document.getElementById(id)?.remove();
  const host = document.createElement('div');
  host.id = id;
  const root = host.attachShadow({ mode: 'open' });
  const box = document.createElement('div');
  box.setAttribute('role', 'alert');
  box.textContent = text;
  box.style.cssText = [
    'position:fixed',
    'right:16px',
    'bottom:16px',
    'z-index:2147483647',
    'max-width:360px',
    'padding:10px 14px',
    'border-radius:6px',
    'background:#1f2328',
    'color:#ffffff',
    'font:14px/1.4 system-ui,sans-serif',
    'box-shadow:0 4px 12px rgba(0,0,0,.25)',
  ].join(';');
  root.append(box);
  document.documentElement.append(host);
  setTimeout(() => host.remove(), 6000);
}

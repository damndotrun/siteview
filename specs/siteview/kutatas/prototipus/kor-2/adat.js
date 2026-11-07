// Közös adat a három irány prototípusához. A tabok Karesz világából: a Siteview fejlesztése (spec, PR-ok, API-k),
// a felirat-kutatás, egy porszívó-összehasonlítás (a spec „ár ≤ 20 000” példájának mintájára, valódi árszinttel),
// és a saját témái (Revit, TrueNAS, discord.js). A tartalmi részletek a tartalom szerinti keresést (TC3) mutatják.

window.SV = (function () {
  const groups = {
    siteview: { title: 'Siteview', color: 'blue' },
    felirat: { title: 'Felirat', color: 'green' },
    porszivo: { title: 'Porszívó', color: 'orange' },
  };
  const groupColor = {
    grey: '#5f6368', blue: '#1a73e8', red: '#d93025', yellow: '#f9ab00', green: '#1e8e3e',
    pink: '#d01884', purple: '#9334e6', cyan: '#007b83', orange: '#fa903e',
  };

  // last: hány perce volt aktív. unread: háttérben nyílt, még nem volt aktív (ATD9).
  const tabs = [
    { id: 1, win: 1, pinned: true, group: null, icon: 'googlesheets', title: 'Kiadások 2026 – Google Táblázatok', url: 'https://docs.google.com/spreadsheets/d/1x…/edit#gid=0', last: 95,
      text: 'Lakás, rezsi, autó, szoftver előfizetések. Claude Max x20: 200 USD havonta. Áram november: 18 420 Ft.' },
    { id: 2, win: 1, group: 'siteview', icon: 'github', title: '5. munkacsomag: Képmentés (SI1, SI4) · Pull Request #4 · damndotrun/siteview', url: 'https://github.com/damndotrun/siteview/pull/4', last: 41,
      text: 'A háttér tölti le a kép bájtjait credentials: include beállítással, OffscreenCanvas-on konvertál; JPG-nél az átlátszó rész fehér. Öt saját döntés a leírásban.' },
    { id: 3, win: 1, group: 'siteview', icon: 'wxt', title: 'Content Script UI – WXT', url: 'https://wxt.dev/guide/key-concepts/content-script-ui.html', last: 0, active: true,
      text: 'createShadowRootUi isolates your UI from the page styles. The shadow root is attached to a custom element; use cssInjectionMode: "ui" to load your CSS into it.' },
    { id: 4, win: 1, group: 'siteview', icon: 'googlechrome', title: 'chrome.tabs | API | Chrome for Developers', url: 'https://developer.chrome.com/docs/extensions/reference/api/tabs', last: 180,
      text: 'discard(): Discards a tab from memory. Discarded tabs are still visible on the tab strip and are reloaded when activated. autoDiscardable: whether the tab can be discarded automatically by the browser when resources are low.' },
    { id: 5, win: 1, group: 'siteview', icon: 'googlechrome', title: 'chrome.sidePanel | API | Chrome for Developers', url: 'https://developer.chrome.com/docs/extensions/reference/api/sidePanel', last: 1440 + 200, discarded: true,
      text: 'Use the chrome.sidePanel API to host content in the browser’s side panel alongside the main content of a webpage. setPanelBehavior({ openPanelOnActionClick: true }).' },
    { id: 6, win: 1, group: 'siteview', icon: null, title: 'Page.captureScreenshot – Chrome DevTools Protocol', url: 'https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureScreenshot', last: 1440 + 380, discarded: true,
      text: 'captureBeyondViewport: Capture the screenshot beyond the viewport. Defaults to false. clip: Capture the screenshot of a given region only. fromSurface: Capture the screenshot from the surface, rather than the view.' },
    { id: 7, win: 1, group: 'siteview', icon: 'stackoverflow', title: 'javascript - MutationObserver performance with thousands of links - Stack Overflow', url: 'https://stackoverflow.com/questions/68239…/mutationobserver-performance', last: 3 * 1440, discarded: true,
      text: 'Debounce the callback and only process addedNodes that contain anchors. Using requestIdleCallback kept the main thread free on pages with 5000+ links.' },
    { id: 8, win: 1, group: 'felirat', icon: 'youtube', title: 'Faster Whisper on CPU – Transcribe 1 Hour of Audio in 5 Minutes', url: 'https://www.youtube.com/watch?v=Qf2kA9…&t=724s', last: 6, audible: true,
      text: 'In this video I compare openai-whisper and faster-whisper on a laptop CPU. With int8 quantization the small.en model transcribes one hour of English audio in about five minutes. VAD filter removes the silent parts.' },
    { id: 9, win: 1, group: 'felirat', icon: 'github', title: 'SYSTRAN/faster-whisper: Faster Whisper transcription with CTranslate2', url: 'https://github.com/SYSTRAN/faster-whisper', last: 52,
      text: 'faster-whisper is a reimplementation of OpenAI’s Whisper model using CTranslate2. This implementation is up to 4 times faster than openai/whisper for the same accuracy while using less memory. vad_filter=True' },
    { id: 10, win: 1, group: 'felirat', icon: 'github', title: 'yt-dlp/README.md at master · yt-dlp/yt-dlp', url: 'https://github.com/yt-dlp/yt-dlp/blob/master/README.md', last: 1440 + 60, discarded: true,
      text: 'FORMAT SELECTION: -f "bestaudio/worst" downloads the best audio-only format, or the worst video if none is available. --cookies-from-browser BROWSER' },
    { id: 11, win: 1, group: 'felirat', icon: 'huggingface', title: 'Systran/faster-whisper-small.en · Hugging Face', url: 'https://huggingface.co/Systran/faster-whisper-small.en', last: 1440 + 61, discarded: true, unread: true,
      text: 'Whisper small.en model for CTranslate2. This repository contains the conversion of openai/whisper-small.en to the CTranslate2 model format.' },
    { id: 12, win: 1, group: 'porszivo', icon: null, title: 'Philips XC3131/01 Series 3000 akkus álló porszívó – Árak – Árukereső.hu', url: 'https://www.arukereso.hu/porszivo-c3045/philips/xc3131-01-p869321541/', last: 23,
      fields: { ar: 54990 },
      text: 'Akkumulátoros álló porszívó, 25 V. Üzemidő: 60 perc. Mosható HEPA szűrő, 0,6 literes portartály. 32 bolt ajánlata, legolcsóbb 54 990 Ft.' },
    { id: 13, win: 1, group: 'porszivo', icon: null, title: 'Dyson V8 Absolute vezeték nélküli porszívó | eMAG.hu', url: 'https://www.emag.hu/dyson-v8-absolute-porszivo/pd/D5V8ABS/', last: 30, discarded: true,
      fields: { ar: 129990 },
      text: 'Teljes HEPA szűrési rendszer, amely a mikroszkopikus részecskék 99,99%-át megköti. Akár 40 perc működés. 2 év garancia, ingyenes szállítás.' },
    { id: 14, win: 1, group: 'porszivo', icon: 'mediamarkt', title: 'XIAOMI Robot Vacuum S20+ robotporszívó, fehér - MediaMarkt', url: 'https://www.mediamarkt.hu/hu/product/_xiaomi-robot-vacuum-s20-1462190.html', last: 27,
      fields: { ar: 119999 },
      text: 'LDS lézeres navigáció, 6000 Pa szívóerő, automatikus portalanító állomás. Online ár: 119 999 Ft. Készleten, holnap átvehető.' },
    { id: 15, win: 1, group: 'porszivo', icon: null, title: 'Tefal X-Force Flex 9.60 Aqua TY2039WO kézi porszívó | Alza.hu', url: 'https://www.alza.hu/tefal-x-force-flex-9-60-aqua-ty2039wo-d7302245.htm', last: 25, discarded: true, unread: true,
      fields: { ar: 89990 },
      text: 'Hajlítható cső a bútorok alá. Felmosó fej Aqua funkcióval. Ciklonos szűrés, mosható szűrő. Ár: 89 990 Ft.' },
    { id: 16, win: 1, group: null, icon: 'autodeskrevit', title: 'Duct Class – Revit API 2024', url: 'https://www.revitapidocs.com/2024/duct-class.htm', last: 300,
      text: 'Duct.Create(Document, ElementId systemTypeId, ElementId ductTypeId, ElementId levelId, XYZ startPoint, XYZ endPoint). Represents a duct in the project.' },
    { id: 17, win: 1, group: null, icon: 'truenas', title: 'Apps – TrueNAS SCALE 25.04 – TrueNAS Documentation Hub', url: 'https://www.truenas.com/docs/scale/25.04/scaleuireference/apps/', last: 2 * 1440, discarded: true,
      text: 'The Apps screen shows installed applications. Use Discover Apps to install new ones. Each app runs in its own container; the dataset must be on a pool.' },
    { id: 18, win: 1, group: null, icon: 'discord', title: 'Display components | discord.js Guide', url: 'https://discordjs.guide/popular-topics/display-components.html', last: 4 * 1440, discarded: true,
      text: 'Components V2: Container, Section, TextDisplay, Separator, MediaGallery. Set the IsComponentsV2 message flag to use them.' },
    { id: 19, win: 1, group: null, icon: null, title: 'Légcsatornák méretezése nyomásveszteség alapján – épületgépész kézikönyv', url: 'https://www.epuletgepeszet.hu/legcsatorna-meretezes', last: 6 * 1440, discarded: true,
      text: 'A fajlagos súrlódási nyomásveszteség lakásszellőzésnél 0,8–1,2 Pa/m. Az idomok alaki ellenállás-tényezőjét a gyártói katalógusból vegyük.' },
    { id: 20, win: 1, group: null, icon: 'claude', title: 'Run Claude Code programmatically – Claude Docs', url: 'https://docs.claude.com/en/docs/claude-code/headless', last: 9 * 60, discarded: true,
      text: 'Use --output-format stream-json to stream events. The init event contains the session_id; pass it to --resume to continue the conversation.' },
    { id: 21, win: 1, group: null, icon: null, title: 'Budapest időjárás – 10 napos előrejelzés – Időkép', url: 'https://www.idokep.hu/elorejelzes/Budapest', last: 75,
      text: 'Kedd: 9 °C, borult, szitálás. Szerda: 11 °C, napos idő. Hétvégén lehűlés, éjjel fagy.' },
    // 2. ablak
    { id: 22, win: 2, group: null, icon: 'gmail', title: 'Beérkezett üzenetek (3) – Gmail', url: 'https://mail.google.com/mail/u/0/#inbox', last: 15, text: '' },
    { id: 23, win: 2, group: null, icon: 'youtube', title: 'Hogyan készül a 3D nyomtatott légcsatorna-idom? – YouTube', url: 'https://www.youtube.com/watch?v=hA8…', last: 2 * 1440, discarded: true,
      text: 'PETG anyagból nyomtatott szűkítő idom 160/125 mm-re. Rétegmagasság 0,28 mm, nyomtatási idő 6 óra.' },
    { id: 24, win: 2, group: null, icon: 'reddit', title: 'r/truenas – Best way to back up a pool to an external drive?', url: 'https://www.reddit.com/r/truenas/comments/1k…', last: 3 * 1440, discarded: true,
      text: 'Use replication tasks to a pool on the external disk, or rsync tasks if the drive is formatted as something else.' },
    { id: 25, win: 2, group: null, icon: 'wikipedia', title: 'Hővisszanyerős szellőztetés – Wikipédia', url: 'https://hu.wikipedia.org/wiki/Hővisszanyerős_szellőztetés', last: 5 * 1440, discarded: true,
      text: 'A hővisszanyerős szellőztetés során az elszívott levegő hőjét hőcserélő adja át a friss levegőnek; a hatásfok 70–95%.' },
    { id: 26, win: 2, group: null, icon: 'googledocs', title: 'Ajánlat – Kovács lakás szellőzés – Google Dokumentumok', url: 'https://docs.google.com/document/d/1p…/edit', last: 160, text: 'Központi hővisszanyerős rendszer, 4 befúvó és 3 elszívó pont. Légcsatorna: 125 mm-es félmerev cső, 38 fm, hangcsillapító a gép után. Anyagköltség becslés.' },
  ];

  function domain(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
  }
  function ago(min) {
    if (min < 1) return 'most';
    if (min < 60) return `${min} perce`;
    if (min < 1440) return `${Math.round(min / 60)} órája`;
    const d = Math.round(min / 1440);
    return d === 1 ? 'tegnap' : `${d} napja`;
  }
  function huf(n) { return n.toLocaleString('hu-HU').replace(/ /g, ' ') + ' Ft'; }
  function fold(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function esc(s) { return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
  // Kiemelés: a találat helyét ékezet nélkül keresi, de az eredeti szöveget jelöli.
  function mark(text, q, cls) {
    if (!q) return esc(text);
    const f = fold(text), fq = fold(q);
    let out = '', i = 0, j;
    while ((j = f.indexOf(fq, i)) !== -1) { out += esc(text.slice(i, j)) + `<mark class="${cls}">` + esc(text.slice(j, j + q.length)) + '</mark>'; i = j + q.length; }
    return out + esc(text.slice(i));
  }
  function snippet(text, q, span = 70) {
    const j = fold(text).indexOf(fold(q));
    if (j < 0) return null;
    const a = Math.max(0, j - span), b = Math.min(text.length, j + q.length + span);
    return (a > 0 ? '…' : '') + text.slice(a, b).trim() + (b < text.length ? '…' : '');
  }
  // Keresés: cím, URL, tartalom. Visszaadja, hol talált.
  function search(q, list) {
    if (!q) return [];
    const fq = fold(q);
    const res = [];
    for (const t of list) {
      const inTitle = fold(t.title).includes(fq);
      const inUrl = fold(t.url).includes(fq);
      const inText = !!t.text && fold(t.text).includes(fq);
      if (inTitle || inUrl || inText) res.push({ tab: t, inTitle, inUrl, inText, snip: inText ? snippet(t.text, q) : null });
    }
    res.sort((a, b) => (b.inTitle - a.inTitle) || (a.tab.last - b.tab.last));
    return res;
  }
  function favicon(t, size = 16) {
    const ic = t.icon && window.SV_ICONS && window.SV_ICONS[t.icon];
    // Ahol nincs kéznél márkajel, a Chrome alap jele (földgömb) áll, ahogy a böngésző is mutatja favicon nélkül.
    if (!ic) return window.lineIcon ? window.lineIcon('globe', size, 'fav fav-none') : `<span class="fav fav-none" aria-hidden="true"></span>`;
    return `<svg class="fav" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><path fill="${ic.hex}" d="${ic.path}"/></svg>`;
  }
  const extracted = tabs.filter((t) => t.text).length;

  // Claude összefoglaló a WXT oldalról (CS4: teljes oldal).
  const summary = {
    source: 'Content Script UI – WXT',
    domain: 'wxt.dev',
    paragraphs: [
      'Az oldal azt mutatja be, hogyan tehetsz saját felületet egy weboldalba úgy, hogy az oldal stílusa ne rontsa el.',
      'Három út van: az integrált (az oldal stílusai rád is hatnak), a Shadow Root (a createShadowRootUi elszigeteli a felületet, a CSS a cssInjectionMode: "ui" beállítással kerül bele), és az IFrame (teljes elszigetelés, de lassabb és nehezebb üzenni vele).',
      'A Siteview HUD-jához és elemkijelölőjéhez a Shadow Root a megfelelő: gyors, és az oldal CSS-e nem ér el hozzá. Figyelni kell, hogy a',
    ],
  };
  // Generált felirat darabjai (SG6: darabonként érkezik).
  const subtitle = { line: 'with int8 quantization the small model runs on the CPU', pct: 42, step: 'Átírás' };

  // Modulindítók (a spec moduljai). Billentyű csak ott, ahol a spec megadja.
  const modules = [
    { id: 'osszefoglalo', name: 'Összefoglalás Claude-dal', short: 'Összefoglaló', icon: 'file-text' },
    { id: 'kepernyokep', name: 'Teljes oldalas képernyőkép', short: 'Képernyőkép', icon: 'camera', key: 'Alt+Shift+P' },
    { id: 'kijelolo', name: 'Mező kijelölése az oldalon', short: 'Kijelölő', icon: 'square-dashed-mouse-pointer' },
    { id: 'felirat', name: 'Felirat készítése a videóhoz', short: 'Felirat', icon: 'captions' },
    { id: 'altatas', name: 'Altatás', short: 'Altatás', icon: 'moon' },
  ];
  // Karesz sorrendje: a prototípusban húzással átrendezhető, és megmarad (böngészőnként).
  function moduleOrder(key) {
    try { const ids = JSON.parse(localStorage.getItem('sv-order-' + key) || 'null'); if (ids) return ids.map((id) => modules.find((m) => m.id === id)).filter(Boolean); } catch (e) {}
    return modules.slice();
  }
  function saveOrder(key, ids) { try { localStorage.setItem('sv-order-' + key, JSON.stringify(ids)); } catch (e) {} }
  // Egyszerű húzásos átrendezés egy konténer közvetlen gyerekeire (data-id).
  function sortable(box, key, onChange) {
    let drag = null;
    box.querySelectorAll('[data-id]').forEach((el) => {
      el.draggable = true;
      el.addEventListener('dragstart', (e) => { drag = el; e.dataTransfer.effectAllowed = 'move'; el.classList.add('dragging'); });
      el.addEventListener('dragend', () => { el.classList.remove('dragging'); drag = null; saveOrder(key, [...box.querySelectorAll('[data-id]')].map((x) => x.dataset.id)); onChange && onChange(); });
      el.addEventListener('dragover', (e) => {
        e.preventDefault(); if (!drag || drag === el) return;
        const r = el.getBoundingClientRect();
        const after = r.width > r.height * 1.5 ? e.clientX > r.left + r.width / 2 : e.clientY > r.top + r.height / 2;
        el.parentNode.insertBefore(drag, after ? el.nextSibling : el);
      });
    });
  }

  return { modules, moduleOrder, sortable, groups, groupColor, tabs, domain, ago, huf, fold, esc, mark, snippet, search, favicon, extracted, summary, subtitle };
})();

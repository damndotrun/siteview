// A prototípus kerete: böngészőablak, aktuális oldal, a Chrome oldalpanel fejléce és az állapotváltó.
// Nem része az iránynak. A panel működése a közös `mukodes.js` (M), a panel és a HUD rajza az irányé.
window.Keret = (function () {
  const STATES = [
    ['lista', 'Lista'], ['kereses', 'Keresés'], ['ures', 'Nincs találat'], ['szuro', 'Szűrő'], ['kijeloles', 'Kijelölés'],
    ['osszefoglalo', 'Összefoglaló'], ['video', 'Videó'], ['felirat', 'Felirat'], ['atirat', 'Átirat'],
  ];
  const video = { vol: 65, t: 724, dur: 2470, speed: 1.5, playing: true };
  let dir = null, hideTimer = null, hudEv = null;

  function fmt(s) { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, '0')}`; }

  function articlePage() {
    return `<div class="article"><div class="crumbs">wxt.dev › Guide › Key Concepts</div>
      <h1>Content Script UI</h1>
      <p>There are three ways to mount a UI from a content script: <b>Integrated</b>, <b>Shadow Root</b> and <b>IFrame</b>. Each has its own pros and cons.</p>
      <p>The shadow root option isolates your UI from the page’s styles. Use <code>createShadowRootUi</code> and set <code>cssInjectionMode: "ui"</code> so WXT loads your CSS into the shadow root instead of the page.</p>
      <p>IFrames give full isolation but are slower to load and need messaging to talk to the content script.</p>
      <p>When the page changes the DOM, re-mount the UI with <code>autoMount()</code> and an anchor selector.</p></div>`;
  }
  // Egy másik tab oldala: a cím és a kinyert szöveg, a talált szó a Chrome oldalon belüli keresésének jelölésével.
  function tabPage(t, q) {
    const body = t.text ? SV.mark(t.text, q || '', 'find') : '';
    return `<div class="article"><div class="crumbs">${SV.esc(SV.domain(t.url))}</div><h1>${SV.esc(t.title)}</h1><p>${body}</p></div>`;
  }
  // A videókép: egy képernyőfelvétel diája, kódban rajzolva (a saját lejátszó és az előnézet is ezt mutatja).
  function slideHTML() {
    return `<div class="slide"><h2>One hour of English audio, laptop CPU</h2>
          <div class="bar"><span>openai-whisper (small.en)</span><i class="slow" style="width:58%"></i><span>58 min</span></div>
          <div class="bar"><span>faster-whisper fp32</span><i style="width:16%"></i><span>16 min</span></div>
          <div class="bar"><span>faster-whisper int8 + VAD</span><i style="width:5%"></i><span>5 min</span></div>
          <div class="note">Intel i5-1240P · 4 threads · beam size 5</div></div>`;
  }
  function videoPage() {
    return `<div class="vpage">
      <div class="video" data-video>
        ${slideHTML()}
        <span class="ph">videókép: kódban rajzolt helykitöltő</span>
        <div class="native"><span>${video.playing ? '❚❚' : '▶'}</span><div class="track"><b style="width:${(video.t / video.dur) * 100}%"></b></div><span>${fmt(video.t)} / ${fmt(video.dur)}</span></div>
        <div data-hud></div>
      </div>
      <h1>Faster Whisper on CPU – Transcribe 1 Hour of Audio in 5 Minutes</h1>
      <div class="ch">Local AI Lab · 48 ezer megtekintés · 3 hete</div></div>`;
  }

  // Az irány saját állapotai (pl. a választott B csoportsávja, saját lejátszója) a közösek után jönnek.
  const allStates = () => STATES.concat((dir && dir.extraStates) || []);
  function current() { const h = location.hash.slice(1); return allStates().some(([k]) => k === h) ? h : 'lista'; }

  function render() {
    const state = current();
    Object.assign(video, { vol: 65, t: 724, speed: 1.5, playing: true });
    hudEv = null; clearTimeout(hideTimer);
    M.setup(state);
    if (dir.setup) dir.setup(state);
    const a = M.active();
    document.querySelector('.url').textContent = a.url;
    document.querySelectorAll('.proto a[href^="#"]').forEach((x) => x.classList.toggle('on', x.getAttribute('href') === '#' + state));
    const page = document.querySelector('.page');
    const own = dir.pageHTML ? dir.pageHTML(state) : null; // az irány saját oldala (pl. saját lejátszó, VD8)
    page.innerHTML = own != null ? own : a.id === M.VIDEO_TAB ? videoPage() : articlePage();
    const vEl = page.querySelector('[data-video]');
    if (vEl) bindVideo(vEl);
    M.mount(dir, document.querySelector('.panel-body'));
  }
  // Az ikon jelvénye (SG6): az irány adja a színt, a szöveg a felirat állapota.
  function setBadge(b) {
    const el = document.querySelector('.ext-badge'); if (!el) return;
    el.hidden = !b; if (!b) return;
    el.textContent = b.text; el.style.background = b.bg; el.style.color = b.fg;
  }

  // A panel hívja, ha egy tabra kattintottak: a tab aktív lesz, az oldal a talált szövegnél nyílik (TC3).
  function openTab(t, q) {
    SV.tabs.forEach((x) => { x.active = x.id === t.id; });
    const wasDiscarded = !!t.discarded;
    t.discarded = false; t.last = 0;
    document.querySelector('.url').textContent = t.url;
    const page = document.querySelector('.page');
    hudEv = null;
    if (t.id === 3) page.innerHTML = articlePage();
    else if (t.id === M.VIDEO_TAB) { page.innerHTML = videoPage(); bindVideo(page.querySelector('[data-video]')); }
    else page.innerHTML = tabPage(t, q);
    const hit = page.querySelector('mark.find'); if (hit) hit.scrollIntoView({ block: 'center' });
    return { wasDiscarded };
  }

  function sync() {
    const el = document.querySelector('[data-video]'); if (!el) return;
    if (dir.sync) dir.sync(video);
    const b = el.querySelector('.native b'); if (b) b.style.width = (video.t / video.dur) * 100 + '%';
    const tt = el.querySelector('.native span:last-child'); if (tt) tt.textContent = `${fmt(video.t)} / ${fmt(video.dur)}`;
    const pp = el.querySelector('.native span:first-child'); if (pp) pp.textContent = video.playing ? '❚❚' : '▶';
  }
  function seek(t) { video.t = Math.max(0, Math.min(video.dur, t)); sync(); refreshSub(); }
  // A generált felirat sora a videón (SG4): csak ha a lejátszás helyéig már átíródott.
  function refreshSub() {
    const el = document.querySelector('[data-video]'); if (!el) return;
    const line = M.subLine(video.t);
    let s = el.querySelector('[data-sv="sub"]');
    if (!line) { if (s) s.remove(); return; }
    if (!s) { el.querySelector('[data-hud]').insertAdjacentHTML('beforebegin', '<div class="sub" data-sv="sub"></div>'); s = el.querySelector('[data-sv="sub"]'); }
    s.textContent = line;
  }
  // A HUD: az irány rajzolja a közös tartalomból (M.hudModel). 1,1 mp után eltűnik, ha nem áll rajta az egér.
  function paintHud() {
    const el = document.querySelector('[data-video]'); if (!el) return;
    el.querySelector('[data-hud]').innerHTML = dir.hudHTML(M.hudModel(video, hudEv), fmt);
  }
  function showHud(ev) {
    hudEv = ev; paintHud();
    clearTimeout(hideTimer);
    if (ev && !ev.frozen) hideTimer = setTimeout(hideLater, 1100);
  }
  function hideLater() {
    const hud = document.querySelector('[data-hud]');
    if (hud && hud.matches(':hover')) { hideTimer = setTimeout(hideLater, 600); return; }
    hudEv = null; paintHud();
  }
  // Zónás irány (VD2 a Video Dominator mintájára): az irány megmondja, a kurzor helyén mit csinál a bemenet.
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  function apply(z) {
    if (z.vol != null) video.vol = clamp(video.vol + z.vol, 0, 100);
    if (z.seek != null) video.t = clamp(video.t + z.seek, 0, video.dur);
    if (z.seekPct != null) video.t = clamp(video.t + video.dur * z.seekPct / 100, 0, video.dur);
    if (z.speed != null) video.speed = clamp(Math.round((video.speed + z.speed) * 100) / 100, 0.07, 16);
    if (z.speedSet != null) video.speed = z.speedSet;
    if (z.play) video.playing = !video.playing;
    sync(); refreshSub();
    if (z.player && dir.player) return dir.player(z.player);
    showHud({ side: z.side, kind: z.kind, step: z.step || 0 });
  }
  function zoneAt(el, e, input, step) {
    if (!dir.zoneAction) return null;
    const r = el.getBoundingClientRect();
    return dir.zoneAction(input, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, step);
  }
  function bindVideo(el) {
    const hud = el.querySelector('[data-hud]');
    hud.addEventListener('click', (e) => { const b = e.target.closest('[data-op]'); if (b) { e.stopPropagation(); M.op(b.dataset.op, b.dataset.arg); } });
    if (dir.bindVideo) dir.bindVideo(el);
    el.addEventListener('wheel', (e) => {
      if (e.target.closest('[data-hud] button')) return;
      e.preventDefault();
      const z = zoneAt(el, e, 'gorgo', e.deltaY < 0 ? 1 : -1);
      if (z) return apply(z);
      if (dir.zoneAction) return; // zónás iránynál a zóna nélküli hely nem csinál semmit
      const r = el.getBoundingClientRect();
      const side = e.clientX - r.left < r.width / 2 ? 'bal' : 'jobb';
      const step = e.deltaY < 0 ? 1 : -1;
      if (side === 'bal') video.vol = Math.max(0, Math.min(100, video.vol + 5 * step)); // VD2: bal fél görgő = hangerő ±5%
      else video.t = Math.max(0, Math.min(video.dur, video.t + 5 * step)); // jobb fél görgő = ugrás ±5 mp
      sync(); refreshSub();
      showHud({ side, step });
    }, { passive: false });
    el.addEventListener('mousedown', (e) => {
      if (dir.zoneAction) {
        if (e.target.closest('[data-hud] [data-op], [data-seek]')) return; // a saját lejátszó sávja nem zóna
        const z = zoneAt(el, e, (e.altKey ? 'alt-' : '') + ['bal', 'kozep', 'jobb'][e.button], 0);
        if (z) { e.preventDefault(); apply(z); }
        return;
      }
      if (e.button !== 1) return; // középső gomb = lejátszás/szünet
      e.preventDefault(); video.playing = !video.playing; sync();
      showHud({ side: 'kozep' });
    });
    paintHud(); refreshSub();
  }

  function init(direction) {
    dir = direction;
    document.title = direction.title;
    document.body.innerHTML = `<div class="browser">
      <div class="topbar"><div class="url"></div>
        <span class="ext" title="A Siteview ikonja a Chrome eszköztárán, jelvénnyel (SG6)"><span class="ext-ico"></span><span class="ext-badge" hidden></span></span>
        <nav class="proto" aria-label="Prototípus állapotai">${location.protocol === 'file:' ? '' : '<a class="home" href="../index.html">← Áttekintés</a>'}<span>${SV.esc(direction.title)}:</span>${allStates().map(([k, l]) => `<a href="#${k}">${l}</a>`).join('')}</nav></div>
      <main class="page"></main>
      <aside class="panel-host" aria-label="Siteview oldalpanel">
        <div class="cp-head" title="A Chrome oldalpanel saját fejléce (nem a Siteview része)"><span class="cp-ico"></span>Siteview<span class="cp-caret">▾</span><span class="cp-sp"></span><span class="cp-btn">${lineIcon('pin', 14)}</span><span class="cp-btn">${lineIcon('x', 14)}</span></div>
        <div class="panel-body"></div>
      </aside></div>`;
    window.addEventListener('hashchange', render);
    render();
  }
  // Az oldal cseréje állapotváltás nélkül (a saját lejátszó megnyitása és bezárása, VD8); null: az aktív tab oldala.
  function setPage(html) {
    const page = document.querySelector('.page');
    hudEv = null; clearTimeout(hideTimer);
    page.innerHTML = html != null ? html : M.active().id === M.VIDEO_TAB ? videoPage() : articlePage();
    const vEl = page.querySelector('[data-video]');
    if (vEl) bindVideo(vEl);
  }
  // Teszteléshez: egy HUD-állapot rögzítése képernyőképhez, és az időzítők megállítása.
  function freezeHud(side) {
    M.freeze();
    if (side === 'bal') video.vol = 70; else if (side === 'jobb') video.t = 729;
    sync(); refreshSub();
    showHud({ side, step: 1, frozen: true });
  }
  return { init, video, fmt, freezeHud, openTab, setBadge, current, seek, refreshSub, paintHud, showHud, slideHTML, setPage, rerender: render, go: (s) => { location.hash = s; } };
})();

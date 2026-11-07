// A prototípus kerete: böngészőablak, aktuális oldal, a Chrome oldalpanel fejléce és az állapotváltó.
// Nem része az iránynak; az irány a panel tartalmát (render) és a videón a HUD-ot (hud) rajzolja.
window.Keret = (function () {
  const STATES = [
    ['lista', 'Lista'], ['kereses', 'Keresés'], ['ures', 'Nincs találat'],
    ['osszefoglalo', 'Összefoglaló'], ['video', 'Videó'], ['felirat', 'Felirat'],
  ];
  // A keresés állapot alapszava: két ok (cím, szöveg) és két ablak egyszerre.
  const QUERY = { kereses: 'légcsatorna', ures: 'dyson v15' };
  const video = { vol: 65, t: 724, dur: 2470, speed: 1.5, playing: true };
  let dir = null;
  let opened = null; // a panelből megnyitott tab (találatra kattintás)

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
  function videoPage(withSub) {
    const sub = withSub ? `<div class="sub" data-sv="sub">${SV.esc(SV.subtitle.line)}</div>` : '';
    return `<div class="vpage">
      <div class="video" data-video>
        <div class="slide"><h2>One hour of English audio, laptop CPU</h2>
          <div class="bar"><span>openai-whisper (small.en)</span><i class="slow" style="width:58%"></i><span>58 min</span></div>
          <div class="bar"><span>faster-whisper fp32</span><i style="width:16%"></i><span>16 min</span></div>
          <div class="bar"><span>faster-whisper int8 + VAD</span><i style="width:5%"></i><span>5 min</span></div>
          <div class="note">Intel i5-1240P · 4 threads · beam size 5</div></div>
        <span class="ph">videókép: kódban rajzolt helykitöltő</span>
        ${sub}
        <div class="native"><span>${video.playing ? '❚❚' : '▶'}</span><div class="track"><b style="width:${(video.t / video.dur) * 100}%"></b></div><span>${fmt(video.t)} / ${fmt(video.dur)}</span></div>
        <div data-hud></div>
      </div>
      <h1>Faster Whisper on CPU – Transcribe 1 Hour of Audio in 5 Minutes</h1>
      <div class="ch">Local AI Lab · 48 ezer megtekintés · 3 hete</div></div>`;
  }

  function current() { const h = location.hash.slice(1); return STATES.some(([k]) => k === h) ? h : 'lista'; }

  function render() {
    const state = current();
    opened = null;
    const isVideo = state === 'video' || state === 'felirat';
    const active = isVideo ? SV.tabs.find((t) => t.id === 8) : SV.tabs.find((t) => t.id === 3);
    SV.tabs.forEach((t) => { t.active = t.id === active.id; });
    document.querySelector('.url').textContent = active.url;
    document.querySelectorAll('.proto a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + state));
    const page = document.querySelector('.page');
    page.innerHTML = isVideo ? videoPage(state === 'felirat') : articlePage();
    dir.render(state, document.querySelector('.panel-body'), { activeId: active.id, query: QUERY[state] || '' });
    if (isVideo) bindVideo(page.querySelector('[data-video]'), state);
    setBadge(state === 'felirat' && dir.badge ? dir.badge() : null);
  }
  // Az ikon jelvénye: az irány adja a színt; szöveg a felirat állapota.
  function setBadge(b) {
    const el = document.querySelector('.ext-badge'); if (!el) return;
    el.hidden = !b; if (!b) return;
    el.textContent = b.text; el.style.background = b.bg; el.style.color = b.fg;
  }

  // A panel hívja, ha egy tabra kattintottak: a tab aktív lesz, az oldal a talált szövegnél nyílik.
  function openTab(t, q) {
    opened = t;
    SV.tabs.forEach((x) => { x.active = x.id === t.id; });
    const wasDiscarded = !!t.discarded;
    t.discarded = false; t.unread = false; t.last = 0;
    document.querySelector('.url').textContent = t.url;
    const page = document.querySelector('.page');
    if (t.id === 3) page.innerHTML = articlePage();
    else if (t.id === 8) { page.innerHTML = videoPage(false); bindVideo(page.querySelector('[data-video]'), 'video'); }
    else page.innerHTML = tabPage(t, q);
    const hit = page.querySelector('mark.find'); if (hit) hit.scrollIntoView({ block: 'center' });
    return { wasDiscarded };
  }

  let hideTimer;
  function bindVideo(el, state) {
    const hud = el.querySelector('[data-hud]');
    const ctx = { el, hud, video, fmt, state };
    const mode = state === 'felirat' ? 'felirat' : 'video';
    dir.hud && dir.hud(ctx, mode, null);
    function sync() {
      const b = el.querySelector('.native b'); if (b) b.style.width = (video.t / video.dur) * 100 + '%';
      const tt = el.querySelector('.native span:last-child'); if (tt) tt.textContent = `${fmt(video.t)} / ${fmt(video.dur)}`;
      const pp = el.querySelector('.native span:first-child'); if (pp) pp.textContent = video.playing ? '❚❚' : '▶';
    }
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const side = e.clientX - r.left < r.width / 2 ? 'bal' : 'jobb';
      const step = e.deltaY < 0 ? 1 : -1;
      if (e.shiftKey) { video.speed = Math.max(0.25, Math.min(3, Math.round((video.speed + 0.25 * step) * 100) / 100)); }
      else if (side === 'bal') video.vol = Math.max(0, Math.min(100, video.vol + 5 * step));
      else video.t = Math.max(0, Math.min(video.dur, video.t + 5 * step));
      sync();
      dir.hud(ctx, mode, { side: e.shiftKey ? 'sebesseg' : side, step });
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => dir.hud(ctx, mode, null), 1100);
    }, { passive: false });
    el.addEventListener('mousedown', (e) => {
      if (e.button !== 1) return;
      e.preventDefault(); video.playing = !video.playing; sync();
      dir.hud(ctx, mode, { side: 'kozep' });
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => dir.hud(ctx, mode, null), 1100);
    });
  }

  function init(direction) {
    dir = direction;
    document.title = direction.title;
    document.body.innerHTML = `<div class="browser">
      <div class="topbar"><div class="url"></div>
        <span class="ext" title="A Siteview ikonja a Chrome eszköztárán, jelvénnyel (SG6)"><span class="ext-ico"></span><span class="ext-badge" hidden></span></span>
        <nav class="proto" aria-label="Prototípus állapotai">${location.protocol === 'file:' ? '' : '<a class="home" href="../index.html">← Áttekintés</a>'}<span>${SV.esc(direction.title)}:</span>${STATES.map(([k, l]) => `<a href="#${k}">${l}</a>`).join('')}</nav></div>
      <main class="page"></main>
      <aside class="panel-host" aria-label="Siteview oldalpanel">
        <div class="cp-head" title="A Chrome oldalpanel saját fejléce (nem a Siteview része)"><span class="cp-ico"></span>Siteview<span class="cp-caret">▾</span><span class="cp-sp"></span><span class="cp-btn">${lineIcon('pin', 14)}</span><span class="cp-btn">${lineIcon('x', 14)}</span></div>
        <div class="panel-body"></div>
      </aside></div>`;
    window.addEventListener('hashchange', render);
    render();
  }
  // Teszteléshez: egy HUD-állapot rögzítése képernyőképhez.
  function freezeHud(side) {
    const el = document.querySelector('[data-video]'); if (!el) return;
    clearTimeout(hideTimer);
    const hud = el.querySelector('[data-hud]');
    if (side === 'bal') video.vol = 70; else if (side === 'jobb') video.t = 729;
    const b = el.querySelector('.native b'); if (b) b.style.width = (video.t / video.dur) * 100 + '%';
    const tt = el.querySelector('.native span:last-child'); if (tt) tt.textContent = `${fmt(video.t)} / ${fmt(video.dur)}`;
    dir.hud({ el, hud, video, fmt, state: current() }, current() === 'felirat' ? 'felirat' : 'video', { side, step: 1, frozen: true });
  }
  return { init, video, fmt, freezeHud, openTab, setBadge, current, QUERY, rerender: render, go: (s) => { location.hash = s; } };
})();

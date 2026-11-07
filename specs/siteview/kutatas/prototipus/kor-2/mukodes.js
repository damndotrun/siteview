// A három irány KÖZÖS működése. Karesz, 2026-11-07: „most a kinézettel funkciót is választok”.
// Minden, amit a panel tud, itt van egy helyen: keresés, szűrő, ablak, csoport, kijelölés és rendezés, altatás,
// sűrűség, összefoglaló, felirat és átirat, a HUD tartalma, és a menük tételei is. Az irányok csak azt döntik el,
// hol és hogyan jelenik meg: a `draw`, `menuHTML` és `hudHTML` függvényükkel rajzolnak, a gombjaik `data-op`
// attribútummal ezt a modult hívják. Így a három prototípus funkcióban azonos.
//
// A forrás a spec (SPEC.md): TS1, TS2 (helyi menü), TS4, TS5, TS10, ATD2, ATD4, ATD5, ATD7, TC3, TC4, CS4, CS5,
// TS11, SG4, SG5, SG6, VD2, VD7, és a modul gyorsgombok sora.
window.M = (function () {
  const T = SV.tabs; // a tömb sorrendje ablakonként a tabsor sorrendje
  const CUR = 1; // az aktuális ablak
  const VIDEO_TAB = 8;
  const SORTS = [['cim', 'Cím', 'cím'], ['domain', 'Domain', 'domain'], ['last', 'Utolsó használat', 'utolsó használat'], ['ar', 'Ár (mező)', 'ár']];
  const NEW_GROUP_COLORS = ['cyan', 'pink', 'red', 'yellow', 'grey'];

  const INIT_TABS = JSON.parse(JSON.stringify(T));
  const INIT_GROUPS = JSON.parse(JSON.stringify(SV.groups));
  function restoreData() {
    T.splice(0, T.length, ...JSON.parse(JSON.stringify(INIT_TABS)));
    for (const k of Object.keys(SV.groups)) if (!(k in INIT_GROUPS)) delete SV.groups[k];
    Object.assign(SV.groups, JSON.parse(JSON.stringify(INIT_GROUPS)));
  }

  function fresh() {
    return { view: 'lista', q: '', scope: 'tartalom', onlySlept: false, onlyAudible: false, win: 'ez', group: 'mind',
      priceMax: null, sel: new Set(), anchor: null, collapsed: new Set(), note: null, menu: null };
  }
  const st = fresh();
  st.density = 'kenyelmes';
  try { const d = localStorage.getItem('sv-suruseg'); if (d === 'kompakt' || d === 'kenyelmes') st.density = d; } catch (e) {}
  const ui = {}; // megjelenítési állapot, amelyet az irány használ (pl. nyitott keresőmező)

  let dir = null, host = null, frozen = false;

  // --- Tabok, csoportok, szűrés -------------------------------------------------------------------------------
  const tab = (id) => T.find((t) => t.id === +id);
  const active = () => T.find((t) => t.active) || T[0];
  const gkey = (t) => (t.pinned ? 'rogzitett' : t.group || 'nincs');
  function ginfo(k) {
    if (k === 'rogzitett') return { title: 'Rögzítve', color: null };
    if (k === 'nincs') return { title: 'Csoport nélkül', color: null };
    const g = SV.groups[k];
    return { title: g.title, color: SV.groupColor[g.color] };
  }
  const inWin = (t) => st.win === 'mind' || t.win === CUR;
  const passGroup = (t) => st.group === 'mind' || (t.group || 'nincs') === st.group;
  function passOther(t) {
    if (st.onlySlept && !t.discarded) return false;
    if (st.onlyAudible && !t.audible) return false;
    if (st.priceMax != null && !(t.fields && t.fields.ar != null && t.fields.ar <= st.priceMax)) return false;
    return true;
  }
  const pass = (t) => passGroup(t) && passOther(t);
  const short = (s, n = 46) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

  // A lista: ablakonként, a tabsor sorrendjében, csoportfuttatásokra bontva (TS1).
  function sections() {
    const wins = st.win === 'mind' ? [...new Set(T.map((t) => t.win))].sort() : [CUR];
    return wins.map((w) => {
      const all = T.filter((t) => t.win === w);
      const shown = all.filter(pass);
      const groups = [];
      for (const t of shown) {
        const k = gkey(t), last = groups[groups.length - 1];
        if (!last || last.key !== k) groups.push({ key: k, id: `${w}:${k}`, ...ginfo(k), tabs: [], collapsed: st.collapsed.has(`${w}:${k}`) });
        groups[groups.length - 1].tabs.push(t);
      }
      return { win: w, current: w === CUR, title: w === CUR ? 'Ez az ablak' : `${w}. ablak`, total: all.length, shown: shown.length, groups };
    });
  }
  // A csoportszűrő lehetőségei (Szűrő „csoport”), darabszámmal az ablak és a többi szűrő szerint.
  function groupOptions() {
    const base = T.filter((t) => inWin(t) && passOther(t));
    const keys = Object.keys(SV.groups).filter((k) => base.some((t) => t.group === k));
    return [{ key: 'mind', title: 'Mind', n: base.length }]
      .concat(keys.map((k) => ({ key: k, ...ginfo(k), n: base.filter((t) => t.group === k).length })))
      .concat([{ key: 'nincs', title: 'Csoport nélkül', n: base.filter((t) => !t.group).length }]);
  }
  function activeFilters() {
    const f = [];
    if (st.scope === 'cim') f.push({ label: 'Csak cím', op: 'scope', arg: 'tartalom' });
    if (st.onlySlept) f.push({ label: 'Csak altatott', op: 'onlySlept' });
    if (st.onlyAudible) f.push({ label: 'Csak hangot játszó', op: 'onlyAudible' });
    if (st.group !== 'mind') f.push({ label: `Csoport: ${ginfo(st.group).title}`, op: 'group', arg: 'mind' });
    if (st.priceMax != null) f.push({ label: `Ár ≤ ${SV.huf(st.priceMax)}`, op: 'price', arg: '' });
    return f;
  }

  // --- Keresés (TS4, TC3) ----------------------------------------------------------------------------------
  function match(t, fq) {
    const deep = st.scope === 'tartalom';
    const inTitle = SV.fold(t.title).includes(fq);
    const inUrl = deep && SV.fold(t.url).includes(fq);
    const inText = deep && !!t.text && SV.fold(t.text).includes(fq);
    if (!inTitle && !inUrl && !inText) return null;
    return { tab: t, inTitle, inUrl, inText, why: inTitle ? 'cim' : inText ? 'szoveg' : 'url' };
  }
  function results() {
    const q = st.q.trim();
    if (!q) return null;
    const fq = SV.fold(q);
    const all = T.filter(pass).map((t) => match(t, fq)).filter(Boolean)
      .sort((a, b) => (b.inTitle - a.inTitle) || (a.tab.last - b.tab.last));
    const list = all.filter((r) => inWin(r.tab));
    const other = all.filter((r) => !inWin(r.tab));
    const searched = T.filter((t) => inWin(t) && pass(t));
    return { q, list, other, searched: searched.length, searchedText: searched.filter((t) => t.text).length,
      n: { cim: list.filter((r) => r.why === 'cim').length, szoveg: list.filter((r) => r.why === 'szoveg').length, url: list.filter((r) => r.why === 'url').length } };
  }
  const WHY = { cim: 'a címben', szoveg: 'a szövegben', url: 'az URL-ben' };
  const scopeText = () => (st.win === 'mind' ? 'minden ablakban' : 'ebben az ablakban');
  function countLine(r) {
    const parts = ['cim', 'szoveg', 'url'].filter((k) => r.n[k]).map((k) => `${r.n[k]} ${WHY[k]}`);
    return `${r.list.length} találat${parts.length ? ' · ' + parts.join(', ') : ''}`;
  }
  // Ha más ablakban is van találat, de az ablakszűrő „Ez az ablak”: ezt kimondja, és egy kattintással mutatja.
  function otherHint(r) {
    if (!r || !r.other.length) return null;
    const wins = [...new Set(r.other.map((x) => x.tab.win))].map((w) => `${w}.`).join(' és ');
    return { text: `A ${wins} ablakban még ${r.other.length} találat`, label: 'Mutasd', op: 'win', arg: 'mind' };
  }
  function empty(r) {
    const where = st.scope === 'tartalom' ? `${r.searched} tab címében és URL-jében, ${r.searchedText} tab szövegében` : `${r.searched} tab címében`;
    const filters = activeFilters().length;
    return { title: 'Nincs találat', text: `„${r.q}”: ${where} kerestem, ${scopeText()}.`,
      action: filters ? { label: 'Szűrők törlése', op: 'clearFilters' } : { label: 'Keresés törlése', op: 'clearSearch' } };
  }
  function emptyList() {
    return { title: 'Nincs találat', text: `A szűrőknek ${scopeText()} egy tab sem felel meg.`, action: { label: 'Szűrők törlése', op: 'clearFilters' } };
  }

  // Egy tab állapota (TS1 állapotikonok: hang, altatott, kivétel; és a rögzítés), mindhárom irányban ugyanezekkel a szavakkal.
  function states(t) {
    const s = [];
    if (t.audible) s.push({ k: 'hang', label: 'Hangot ad', icon: 'volume-2' });
    if (t.discarded) s.push({ k: 'altatva', label: 'Altatva', icon: 'moon' });
    if (t.noSleep) s.push({ k: 'kivetel', label: 'Ne altasd', icon: 'lock' });
    if (t.pinned) s.push({ k: 'rogzitett', label: 'Rögzítve', icon: 'pin' });
    return s;
  }
  const price = (t) => (t.fields && t.fields.ar != null ? SV.huf(t.fields.ar) : null);

  // --- Kijelölés és rendezés (TS5, TC4) ---------------------------------------------------------------------
  function selectRow(id, e) {
    if (e.shiftKey && st.anchor != null) {
      const order = [...host.querySelectorAll('[data-tab]')].map((el) => +el.dataset.tab);
      const a = order.indexOf(st.anchor), b = order.indexOf(id);
      if (a > -1 && b > -1) { const [x, y] = a < b ? [a, b] : [b, a]; order.slice(x, y + 1).forEach((i) => st.sel.add(i)); return; }
    }
    if (st.sel.has(id)) st.sel.delete(id); else st.sel.add(id);
    st.anchor = id;
  }
  function sortTargets() {
    if (st.sel.size) return T.filter((t) => st.sel.has(t.id));
    const r = results();
    if (r) return r.list.map((x) => x.tab);
    return T.filter((t) => inWin(t) && pass(t));
  }
  function cmp(key) {
    return (a, b) => {
      if (key === 'cim') return a.title.localeCompare(b.title, 'hu');
      if (key === 'domain') return SV.domain(a.url).localeCompare(SV.domain(b.url), 'hu') || a.title.localeCompare(b.title, 'hu');
      if (key === 'last') return a.last - b.last;
      const pa = a.fields && a.fields.ar, pb = b.fields && b.fields.ar;
      if (pa == null && pb == null) return 0;
      if (pa == null) return 1;
      if (pb == null) return -1;
      return pa - pb;
    };
  }
  // A célzott tabok a saját csoportjukon belül, a saját helyeiken rendeződnek; a többi tab nem mozdul.
  // A böngészőben ez chrome.tabs.move (TS5), itt a közös tabsor tömbje.
  function sortBy(key) {
    const targets = new Set(sortTargets());
    const segs = new Map();
    T.forEach((t, i) => {
      if (!targets.has(t)) return;
      const k = `${t.win}:${gkey(t)}`;
      if (!segs.has(k)) segs.set(k, []);
      segs.get(k).push(i);
    });
    let moved = 0;
    for (const idx of segs.values()) {
      const sorted = idx.map((i) => T[i]).sort(cmp(key));
      sorted.forEach((t, j) => { if (T[idx[j]] !== t) moved++; T[idx[j]] = t; });
    }
    const label = SORTS.find((s) => s[0] === key)[2];
    note(moved ? `Átrendezve a böngészőben is: ${targets.size} tab ${label} szerint, csoporton belül.` : `Már ${label} szerint álltak, nem kellett mozgatni.`);
  }

  // --- Altatás (ATD2, ATD4, ATD5, ATD7) és csoportba rakás (TS2 helyi menü) --------------------------------------
  const sleepable = (t) => !t.active && !t.pinned && !t.audible && !t.noSleep && !t.discarded; // ATD4 kivételei
  function switchAway(t) { // az aktív tabot a böngésző nem altatja: előbb a legutóbb használt másikra vált
    const next = T.filter((x) => x.win === t.win && x !== t && !x.discarded).sort((a, b) => a.last - b.last)[0];
    if (next) Keret.openTab(next, '');
  }
  function sleepTab(id) {
    const t = tab(id);
    if (t.discarded) return;
    if (t.active) switchAway(t);
    t.discarded = true;
    note(`Altatva: ${short(t.title)}`);
  }
  function wakeTab(id) { const t = tab(id); t.discarded = false; note(`Felébresztve: ${short(t.title)}`); }
  function toggleNoSleep(id) { const t = tab(id); t.noSleep = !t.noSleep; note(t.noSleep ? `Nem altatódik: ${short(t.title)}` : `Újra altatható: ${short(t.title)}`); }
  function sleepMany(kind) {
    const a = active();
    if (kind === 'ezt') return sleepTab(a.id);
    const list = T.filter((t) => sleepable(t) && (kind === 'inaktiv' || t.win === a.win));
    list.forEach((t) => { t.discarded = true; });
    note(list.length ? `Altatva: ${list.length} tab ${kind === 'inaktiv' ? 'minden ablakban' : 'ebben az ablakban'}.` : 'Nincs altatható tab (a rögzített, a hangot adó és a „ne altasd” tab kivétel).');
  }
  function wakeMany(kind) {
    const a = active();
    const w = T.filter((t) => t.win === a.win);
    const i = w.indexOf(a);
    let list;
    if (kind === 'kov') list = w.slice(i + 1).filter((t) => t.discarded).slice(0, 1);
    else if (kind === 'elozo') list = w.slice(0, i).filter((t) => t.discarded).slice(-1);
    else list = w.filter((t) => t.discarded);
    list.forEach((t) => { t.discarded = false; });
    if (!list.length) note(kind === 'kov' ? 'Az aktív tab után nincs altatott tab.' : kind === 'elozo' ? 'Az aktív tab előtt nincs altatott tab.' : 'Ebben az ablakban nincs altatott tab.');
    else note(list.length === 1 ? `Felébresztve: ${short(list[0].title)}` : `Felébresztve: ${list.length} tab ebben az ablakban.`);
  }
  function groupDomain(id) {
    const t = tab(id), d = SV.domain(t.url);
    const same = T.filter((x) => x.win === t.win && SV.domain(x.url) === d && !x.pinned);
    if (same.length < 2) return note(`Ezen az oldalon (${d}) csak ez az egy tab van.`);
    const key = 'oldal-' + d;
    if (!SV.groups[key]) {
      const used = Object.values(SV.groups).map((g) => g.color);
      SV.groups[key] = { title: d, color: NEW_GROUP_COLORS.find((c) => !used.includes(c)) || 'grey' };
    }
    const at = T.indexOf(same[0]);
    same.forEach((x) => T.splice(T.indexOf(x), 1));
    T.splice(at, 0, ...same);
    same.forEach((x) => { x.group = key; });
    note(`Új csoport: ${d}, ${same.length} tab.`);
  }

  // Egy csoport műveletei (a választott B csoportfejlécének gyorsgombjai; az A, B, C nem hívja őket).
  // Az altatás az ATD4 kivételeivel; a mentés a TS3 munkamenete; az áthelyezés a böngészőben chrome.tabs.move.
  function groupTabs(gid) { const [w, k] = String(gid).split(':'); return T.filter((t) => t.win === +w && gkey(t) === k); }
  const gtitle = (gid) => ginfo(String(gid).split(':')[1]).title;
  function sleepGroup(gid) {
    const all = groupTabs(gid), list = all.filter(sleepable), skip = all.filter((t) => !t.discarded && !sleepable(t)).length;
    list.forEach((t) => { t.discarded = true; });
    note(list.length ? `Altatva a „${gtitle(gid)}” csoportból: ${list.length} tab.${skip ? ` Kivétel: ${skip} (aktív, rögzített, hangot ad vagy „ne altasd”).` : ''}`
      : `A „${gtitle(gid)}” csoportban nincs altatható tab.`);
  }
  function saveGroup(gid) { note(`Munkamenetként mentve: „${gtitle(gid)}”, ${groupTabs(gid).length} tab.`); }
  function moveGroup(arg) {
    const [gid, to] = String(arg).split('|');
    const list = groupTabs(gid);
    if (!list.length) return;
    const target = to === 'uj' ? Math.max(...T.map((t) => t.win)) + 1 : +to;
    const a = active();
    if (list.includes(a)) switchAway(a);
    list.forEach((t) => T.splice(T.indexOf(t), 1));
    let at = -1; T.forEach((t, i) => { if (t.win === target) at = i; });
    if (at < 0) at = T.length - 1;
    T.splice(at + 1, 0, ...list);
    list.forEach((t) => { t.win = target; t.active = false; });
    st.collapsed.delete(gid);
    note(`Áthelyezve: „${gtitle(gid)}”, ${list.length} tab → ${to === 'uj' ? `új ablak (${target}. ablak)` : target === CUR ? 'ez az ablak' : `${target}. ablak`}.`);
  }

  // --- Megnyitás és modulindítók ------------------------------------------------------------------------------
  function openTab(id) {
    const t = tab(id);
    const r = Keret.openTab(t, st.q.trim());
    note(r.wasDiscarded ? `Felébresztve és megnyitva: ${short(t.title)}` : null);
  }
  function launch(id) {
    const a = active();
    if (id === 'osszefoglalo') {
      if (a.id === 3) startSummary();
      else note('A prototípusban az összefoglaló a „Content Script UI – WXT” oldalhoz készült el; azon a tabon próbáld.');
    } else if (id === 'felirat') {
      if (a.id !== VIDEO_TAB) note('Ezen az oldalon nincs videó.');
      else { if (!job || job.state !== 'fut') startJob(); st.view = 'atirat'; }
    } else if (id === 'kepernyokep') note('A prototípusban nincs: a képernyőkép új lapon, az eredményoldalon nyílna (Alt+Shift+P).');
    else if (id === 'kijelolo') note('A prototípusban nincs: az elemkijelölő az oldalon indulna, Esc-kel lépsz ki.');
    else if (id === 'altatas') st.menu = st.menu && st.menu.kind === 'altatas' ? null : { kind: 'altatas', anchor: '[data-launch][data-id="altatas"]' };
  }

  // --- Összefoglaló (CS4, CS5) -------------------------------------------------------------------------------
  const sum = { state: 'nincs', words: 0, total: 0, qa: [], source: '', domain: '', kind: 'Teljes oldal' };
  let sumTimer = null;
  const sumWords = () => SV.summary.items.map((s) => s.split(' '));
  function startSummary(at) {
    sum.source = SV.summary.source; sum.domain = SV.summary.domain; sum.kind = 'Teljes oldal';
    sum.total = sumWords().reduce((n, w) => n + w.length, 0);
    sum.words = at ? Math.round(sum.total * at) : 0;
    sum.state = 'fut'; sum.qa = []; sum.prompt = SV.prompts[0];
    st.view = 'osszefoglalo';
    clearInterval(sumTimer);
    sumTimer = setInterval(() => {
      if (frozen || sum.state !== 'fut') return;
      sum.words = Math.min(sum.total, sum.words + 2);
      if (sum.words >= sum.total) { sum.state = 'kesz'; clearInterval(sumTimer); }
      if (st.view === 'osszefoglalo' || (dir && dir.liveLaunchers)) render(); // a választott B az indítón is mutatja
    }, 160);
  }
  function sumItems() {
    let left = sum.words;
    const out = [];
    for (const w of sumWords()) { if (left <= 0) break; out.push(w.slice(0, left).join(' ')); left -= w.length; }
    return out;
  }
  const sumStateText = () => ({ fut: 'Claude írja…', leallitva: 'Leállítva', kesz: 'Kész' })[sum.state] || '';

  // --- Felirat és átirat (SG4, SG6) ---------------------------------------------------------------------------
  let job = null, jobTimer = null, jobTicks = 0;
  function startJob(at) {
    job = Object.assign({ tab: VIDEO_TAB, step: 'Letöltés', pct: 0, state: 'fut', until: 0 }, at || {});
    clearInterval(jobTimer);
    jobTimer = setInterval(() => {
      if (frozen || !job || job.state !== 'fut') return;
      jobTicks++;
      if (job.step === 'Letöltés') { job.pct += 10; if (job.pct >= 100) { job.step = 'Átírás'; job.pct = 0; } }
      else if (jobTicks % 5 === 0) { job.pct += 1; if (job.pct >= 100) { job.step = 'Kész'; job.pct = 100; job.state = 'kesz'; clearInterval(jobTimer); note('A felirat elkészült.'); } }
      else return;
      render();
    }, 300);
  }
  function cancelJob() {
    if (!job || job.state !== 'fut') return;
    job.until = transcribedUntil();
    job.state = 'megszakitva';
    clearInterval(jobTimer);
    note('Felirat megszakítva. Az eddig átírt rész megmaradt.');
  }
  function transcribedUntil() {
    if (!job) return -1;
    if (job.state === 'kesz') return Infinity;
    if (job.state === 'megszakitva') return job.until;
    return job.step === 'Átírás' ? (job.pct / 100) * Keret.video.dur : -1;
  }
  const segments = () => SV.transcript.filter(([t]) => t <= transcribedUntil());
  function subLine(t) { // a videón látszó feliratsor a lejátszás helyén, ha az a rész már átíródott
    const segs = segments();
    let cur = null;
    for (const s of segs) if (s[0] <= t) cur = s;
    if (!cur) return null;
    const i = SV.transcript.indexOf(cur), next = SV.transcript[i + 1];
    return next && t >= next[0] ? null : cur[1];
  }
  function jobText() {
    if (!job) return '';
    if (job.state === 'kesz') return 'Felirat kész';
    if (job.state === 'megszakitva') return 'Felirat megszakítva';
    return `Felirat készül · ${job.step} ${job.pct}%`;
  }
  const badge = () => (job && job.state === 'fut' ? `${job.pct}%` : null);

  // A HUD tartalma (VD2 alap, VD7): mindhárom irány ugyanezt mutatja, csak máshol és másképp.
  function hudModel(v, ev) {
    const j = job && job.tab === VIDEO_TAB ? job : null;
    return { ev: ev ? ev.side : null, kind: ev && ev.kind ? ev.kind : null, step: ev ? ev.step : 0, vol: v.vol, t: v.t, dur: v.dur, speed: v.speed, playing: v.playing,
      job: j && j.state === 'fut' ? { step: j.step, pct: j.pct } : null,
      offer: !!ev && !(j && (j.state === 'fut' || j.state === 'kesz')) }; // „Felirat” gomb, ha még nincs felirat
  }
  const speedText = (s) => String(s).replace('.', ',') + '×';
  // A HUD szövegei: mindhárom irány ugyanezeket az értékeket mutatja (hangerőnél a hangerő; ugrásnál az idő, a lépés,
  // a hossz és a sebesség; középső gombnál az állapot; felirat közben a munka), csak máshol és másképp.
  function hudText(m) {
    const f = Keret.fmt;
    return { vol: `${m.vol}%`, volLabel: 'Hangerő', time: f(m.t), dur: f(m.dur), step: `${m.step > 0 ? '+5' : '−5'} mp`,
      speed: speedText(m.speed), speedLabel: 'Sebesség', play: m.playing ? 'Lejátszás' : 'Szünet',
      job: m.job ? `Felirat készül · ${m.job.step} ${m.job.pct}%` : null, jobAction: { label: 'Megszakítás', op: 'jobCancel' },
      offer: m.offer ? 'Nincs felirat' : null, offerAction: { label: 'Felirat', op: 'jobStart' } };
  }
  // Az átirat műveletei (SG5 export, SG6 megszakítás és újraindítás): mindhárom irány ezeket mutatja.
  function transcriptActions() {
    const j = job, fut = j && j.state === 'fut', done = j && j.state === 'kesz';
    const a = [];
    if (fut) a.push({ label: 'Megszakítás', op: 'jobCancel' });
    else if (!done) a.push({ label: 'Felirat készítése', op: 'jobStart' });
    a.push({ label: '.srt', op: 'export', arg: 'srt', disabled: !done, title: done ? 'Mentés .srt fájlba' : 'A felirat elkészülte után' });
    a.push({ label: '.vtt', op: 'export', arg: 'vtt', disabled: !done, title: done ? 'Mentés .vtt fájlba' : 'A felirat elkészülte után' });
    return a;
  }

  // --- Menük: a tételek mindhárom irányban ugyanezek, ebben a sorrendben ------------------------------------------
  const menus = {
    szuro: () => [
      { t: 'head', label: 'Hol keressen' },
      { t: 'radio', label: 'Csak cím', on: st.scope === 'cim', op: 'scope', arg: 'cim' },
      { t: 'radio', label: 'Tartalomban is', on: st.scope === 'tartalom', op: 'scope', arg: 'tartalom' },
      { t: 'sep' },
      { t: 'check', label: 'Csak altatott', on: st.onlySlept, op: 'onlySlept' },
      { t: 'check', label: 'Csak hangot játszó', on: st.onlyAudible, op: 'onlyAudible' },
      { t: 'head', label: 'Ablak' },
      { t: 'radio', label: 'Ez az ablak', on: st.win === 'ez', op: 'win', arg: 'ez' },
      { t: 'radio', label: 'Minden ablak', on: st.win === 'mind', op: 'win', arg: 'mind' },
      { t: 'head', label: 'Csoport' },
      ...groupOptions().map((g) => ({ t: 'radio', label: g.title, color: g.color, n: g.n, on: st.group === g.key, op: 'group', arg: g.key })),
      { t: 'head', label: 'Mező' },
      { t: 'price', label: 'Ár ≤', value: st.priceMax },
      { t: 'sep' },
      { t: 'act', label: 'Szűrők törlése', op: 'clearFilters', disabled: !activeFilters().length },
    ],
    rendezes: () => [
      { t: 'head', label: st.sel.size ? `Rendezés: ${st.sel.size} kijelölt tab` : `Rendezés: ${sortTargets().length} tab` },
      ...SORTS.map(([k, l]) => ({ t: 'act', label: l, op: 'sort', arg: k })),
      { t: 'note', label: 'Csoporton belül, a böngészőben is.' },
    ],
    altatas: () => {
      const a = active();
      return [
        { t: 'head', label: 'Altatás' },
        { t: 'act', label: 'Ezt a tabot', op: 'sleep', arg: 'ezt' },
        { t: 'act', label: 'Az ablak többi tabját', op: 'sleep', arg: 'tobbi' },
        { t: 'act', label: 'Minden inaktívat', op: 'sleep', arg: 'inaktiv' },
        { t: 'head', label: 'Ébresztés' },
        { t: 'act', label: 'Következő', op: 'wake', arg: 'kov' },
        { t: 'act', label: 'Előző', op: 'wake', arg: 'elozo' },
        { t: 'act', label: 'Az ablak összes', op: 'wake', arg: 'osszes' },
        { t: 'sep' },
        { t: 'check', label: 'Ezt a tabot ne altasd', on: !!a.noSleep, op: 'noSleep', arg: a.id },
      ];
    },
    sor: (id) => {
      const t = tab(id);
      return [
        { t: 'head', label: short(t.title, 40) },
        t.discarded ? { t: 'act', label: 'Ébresztés', op: 'wakeTab', arg: id } : { t: 'act', label: 'Altatás', op: 'sleepTab', arg: id },
        { t: 'check', label: 'Ezt a tabot ne altasd', on: !!t.noSleep, op: 'noSleep', arg: id },
        { t: 'act', label: 'Az oldal összes tabja egy csoportba', op: 'groupDomain', arg: id },
        ...(+id === VIDEO_TAB && job ? [{ t: 'act', label: 'Átirat', op: 'jobOpen' }] : []),
      ];
    },
    ablak: () => [
      { t: 'radio', label: 'Ez az ablak', on: st.win === 'ez', op: 'win', arg: 'ez' },
      { t: 'radio', label: 'Minden ablak', on: st.win === 'mind', op: 'win', arg: 'mind' },
    ],
    mozgatas: (gid) => {
      const w = +String(gid).split(':')[0];
      const wins = [...new Set(T.map((t) => t.win))].filter((x) => x !== w).sort();
      return [{ t: 'head', label: `Áthelyezés: ${gtitle(gid)}` }, { t: 'act', label: 'Új ablakba', op: 'moveGroup', arg: `${gid}|uj` },
        ...wins.map((x) => ({ t: 'act', label: x === CUR ? 'Ebbe az ablakba' : `A ${x}. ablakba`, op: 'moveGroup', arg: `${gid}|${x}` }))];
    },
    csoport: () => groupOptions().map((g) => ({ t: 'radio', label: g.title, color: g.color, n: g.n, on: st.group === g.key, op: 'group', arg: g.key })),
    tobb: () => [
      { t: 'head', label: 'Sűrűség' },
      { t: 'radio', label: 'Kompakt', on: st.density === 'kompakt', op: 'density', arg: 'kompakt' },
      { t: 'radio', label: 'Kényelmes', on: st.density === 'kenyelmes', op: 'density', arg: 'kenyelmes' },
      { t: 'sep' },
      { t: 'act', label: 'Beállítások', op: 'settings' },
    ],
  };

  // --- Visszajelzés ------------------------------------------------------------------------------------------
  let noteTimer = null, noteSeq = 0;
  function note(text) {
    clearTimeout(noteTimer);
    st.note = text ? { text, id: ++noteSeq } : null;
    if (text) noteTimer = setTimeout(() => { st.note = null; render(); }, 5000);
  }

  // --- Műveletek: minden gomb ezt hívja (data-op, data-arg) ------------------------------------------------------
  function op(name, arg, el) {
    const fromMenu = el && el.closest && el.closest('[data-menubox]');
    switch (name) {
      case 'scope': st.scope = arg; break;
      case 'onlySlept': st.onlySlept = !st.onlySlept; break;
      case 'onlyAudible': st.onlyAudible = !st.onlyAudible; break;
      case 'win': st.win = arg; break;
      case 'group': st.group = arg; break;
      case 'price': st.priceMax = arg === '' || arg == null ? null : +arg; break;
      case 'clearFilters': Object.assign(st, { scope: 'tartalom', onlySlept: false, onlyAudible: false, group: 'mind', priceMax: null }); break;
      case 'clearSearch': st.q = ''; break;
      case 'sort': sortBy(arg); break;
      case 'sleep': sleepMany(arg); break;
      case 'wake': wakeMany(arg); break;
      case 'sleepTab': sleepTab(arg); break;
      case 'wakeTab': wakeTab(arg); break;
      case 'noSleep': toggleNoSleep(arg); break;
      case 'groupDomain': groupDomain(arg); break;
      case 'density': st.density = arg; try { localStorage.setItem('sv-suruseg', arg); } catch (e) {} break;
      case 'settings': note('A prototípusban nincs: modulok, altatási idő, kivétellista, mentett promptok.'); break;
      case 'collapse': if (st.collapsed.has(arg)) st.collapsed.delete(arg); else st.collapsed.add(arg); break;
      case 'selClear': st.sel.clear(); st.anchor = null; break;
      case 'open': openTab(arg); break;
      case 'launch': launch(arg); break;
      case 'back': st.view = 'lista'; break;
      case 'sumStop': if (sum.state === 'fut') { sum.state = 'leallitva'; clearInterval(sumTimer); } break;
      case 'prompt': startSummary(); break;
      case 'jobStart': startJob(); break;
      case 'jobCancel': cancelJob(); break;
      case 'jobOpen': st.view = 'atirat'; break;
      case 'export': note(`A prototípus nem ment fájlt: a kész felirat .${arg} fájlként töltődne le (SG5).`); break;
      case 'ask': ask(); break;
      case 'dismiss': clearTimeout(noteTimer); st.note = null; break;
      case 'seek': Keret.seek(+arg); break;
      case 'search': ui.searchOpen = true; ui.focusSearch = true; break;
      case 'closeSearch': ui.searchOpen = false; st.q = ''; break;
      case 'sleepGroup': sleepGroup(arg); break;
      case 'saveGroup': saveGroup(arg); break;
      case 'moveGroup': moveGroup(arg); break;
      default: if (!dir || !dir.op || !dir.op(name, arg, el)) return; // az irány saját műveletei (pl. csoportsáv)
    }
    // A Szűrő menü nyitva marad (több kapcsoló egymás után), a többi menü a választás után bezárul.
    if (fromMenu && !(st.menu && (st.menu.kind === 'szuro' || (dir && dir.keepOpen && dir.keepOpen.includes(st.menu.kind))))) st.menu = null;
    render();
  }

  // --- Rajzolás és események -----------------------------------------------------------------------------------
  let lastSig = null;
  function render() {
    if (!host || !dir) return;
    const f = document.activeElement;
    let focusSel = null, caret = null;
    if (f && host.contains(f)) {
      for (const a of ['q', 'price', 'ask']) if (f.dataset && a in f.dataset) focusSel = `[data-${a}]`;
      try { caret = f.selectionStart; } catch (e) {}
    }
    const L = host.querySelector('[data-list]');
    const top = L ? L.scrollTop : 0;
    const sig = st.view + '|' + st.q;

    host.innerHTML = dir.draw();
    if (st.menu) {
      const root = host.querySelector('[data-root]');
      const mk = (dir.menus && dir.menus[st.menu.kind]) || menus[st.menu.kind]; // az irány felülírhat egy közös menüt
      root.insertAdjacentHTML('beforeend', dir.menuHTML(st.menu.kind, mk(st.menu.arg)));
      place();
    }
    const box = host.querySelector('[data-launchers]');
    if (box) SV.sortable(box, dir.key);
    const L2 = host.querySelector('[data-list]');
    if (L2 && sig === lastSig) L2.scrollTop = top;
    if (L2 && ui.scrollTo) {
      const h = host.querySelector(`[data-g="${ui.scrollTo}"]`);
      if (h) L2.scrollTop += h.getBoundingClientRect().top - L2.getBoundingClientRect().top - 4;
      delete ui.scrollTo;
      if (st.menu) place();
    }
    lastSig = sig;
    if (ui.focusSearch) { focusSel = '[data-q]'; caret = null; delete ui.focusSearch; }
    if (focusSel) {
      const n = host.querySelector(focusSel);
      if (n) { n.focus(); if (caret != null) try { n.setSelectionRange(caret, caret); } catch (e) {} }
    }
    const b = badge();
    Keret.setBadge(b ? { text: b, bg: dir.badge.bg, fg: dir.badge.fg } : null);
    Keret.paintHud();
    Keret.refreshSub();
  }
  // A menü helye: a nyitó elem alatt; ha nem fér ki, fölötte; oldalsávból jobbra.
  function place() {
    const root = host.querySelector('[data-root]'), boxEl = root && root.querySelector('[data-menubox]');
    if (!boxEl) return;
    const R = root.getBoundingClientRect();
    let a = null;
    if (st.menu.point) a = { left: st.menu.point.x, right: st.menu.point.x, top: st.menu.point.y, bottom: st.menu.point.y, width: 0 };
    else {
      const all = [...root.querySelectorAll(st.menu.anchor)].filter((n) => !boxEl.contains(n));
      const n = all[st.menu.index != null ? st.menu.index : all.length - 1];
      if (n) a = n.getBoundingClientRect();
      if (n && n.dataset.menuSide === 'right') a = { left: a.right + 4, right: a.right + 4, top: a.top - 4, bottom: a.top - 4, width: 0 };
    }
    if (!a) { boxEl.style.left = '8px'; boxEl.style.top = '8px'; return; }
    boxEl.style.maxHeight = (R.height - 16) + 'px';
    const w = boxEl.offsetWidth, h = Math.min(boxEl.offsetHeight, R.height - 16);
    let left = a.left - R.left;
    if (left + w > R.width - 8) left = a.right - R.left - w;
    left = Math.max(8, Math.min(left, R.width - w - 8));
    let top = a.bottom - R.top + 4;
    if (top + h > R.height - 8) top = a.top - R.top - h - 4;
    top = Math.max(8, Math.min(top, R.height - h - 8));
    boxEl.style.left = left + 'px';
    boxEl.style.top = top + 'px';
  }

  function onClick(e) {
    const inMenu = e.target.closest('[data-menubox]');
    const opener = e.target.closest('[data-menu]');
    let closed = false;
    if (st.menu && !inMenu && !(opener && opener.dataset.menu === st.menu.kind) && !e.target.closest('[data-launch][data-id="altatas"]')) { st.menu = null; closed = true; }
    if (opener) {
      const kind = opener.dataset.menu, arg = opener.dataset.menuArg;
      if (st.menu && st.menu.kind === kind && st.menu.arg === arg) st.menu = null;
      else {
        const sel = arg != null ? `[data-menu="${kind}"][data-menu-arg="${arg}"]` : `[data-menu="${kind}"]`;
        st.menu = { kind, arg, anchor: sel, index: [...host.querySelectorAll(sel)].indexOf(opener) };
      }
      return render();
    }
    const rm = e.target.closest('[data-rowmenu]');
    if (rm) { e.stopPropagation(); st.menu = { kind: 'sor', arg: +rm.dataset.rowmenu, anchor: `[data-rowmenu="${rm.dataset.rowmenu}"]` }; return render(); }
    const o = e.target.closest('[data-op]');
    if (o) return op(o.dataset.op, o.dataset.arg, o);
    const l = e.target.closest('[data-launch]');
    if (l) { launch(l.dataset.id); return render(); }
    const r = e.target.closest('[data-tab]');
    if (r) {
      const id = +r.dataset.tab;
      if (e.ctrlKey || e.metaKey || e.shiftKey) { e.preventDefault(); selectRow(id, e); }
      else openTab(id);
      return render();
    }
    if (closed) render();
  }
  function onContext(e) {
    const r = e.target.closest('[data-tab]');
    if (!r) return;
    e.preventDefault();
    st.menu = { kind: 'sor', arg: +r.dataset.tab, point: { x: e.clientX, y: e.clientY } };
    render();
  }
  function onInput(e) {
    const el = e.target;
    if ('q' in el.dataset) { st.q = el.value; render(); }
    else if ('price' in el.dataset) { const v = el.value.replace(/\D/g, ''); st.priceMax = v === '' ? null : +v; render(); }
    else if ('ask' in el.dataset) ui.askDraft = el.value;
  }
  function onKey(e) {
    const el = e.target;
    if ('q' in el.dataset && e.key === 'Enter') { const first = host.querySelector('[data-tab]'); if (first) { openTab(+first.dataset.tab); render(); } }
    if ('ask' in el.dataset && e.key === 'Enter') { ui.askDraft = el.value; ask(); render(); }
  }
  // Utókérdés (CS5): a prototípus nem küldi el, de az előzménybe kerül.
  function ask() {
    const q = (ui.askDraft || '').trim();
    if (!q) return;
    sum.qa.push({ q, a: 'A prototípus nem küldi el a kérdést. A valódi panelben itt érkezne a válasz, ugyanígy folyamatosan.' });
    ui.askDraft = '';
  }
  // TS11: URL szöveg ráhúzása a panelre új tabot nyit (az aktuális ablak végén).
  function onDragOver(e) { if ([...e.dataTransfer.types].some((t) => t === 'text/uri-list' || t === 'text/plain')) e.preventDefault(); }
  function onDrop(e) {
    const raw = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || '').trim().split(/\s+/)[0];
    if (!/^https?:\/\/\S+$/i.test(raw)) return;
    e.preventDefault();
    const t = { id: Math.max(...T.map((x) => x.id)) + 1, win: CUR, group: null, icon: null, title: SV.domain(raw), url: raw, last: 0, text: '' };
    let at = -1; T.forEach((x, i) => { if (x.win === CUR) at = i; });
    T.splice(at + 1, 0, t);
    Keret.openTab(t, '');
    note(`Új tab: ${SV.domain(raw)}`);
    render();
  }
  document.addEventListener('keydown', (e) => {
    if (!host) return;
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (e.key === 'Escape') {
      if (st.menu) { st.menu = null; return render(); }
      if (typing && 'q' in document.activeElement.dataset) {
        if (st.q) st.q = ''; else { ui.searchOpen = false; document.activeElement.blur(); }
        return render();
      }
      if (st.sel.size) { st.sel.clear(); st.anchor = null; return render(); }
      if (st.view !== 'lista') { st.view = 'lista'; return render(); }
    }
    if (e.key === '/' && !typing && st.view === 'lista') { e.preventDefault(); ui.searchOpen = true; ui.focusSearch = true; render(); }
  });

  function mount(direction, el) {
    dir = direction;
    if (host !== el) {
      host = el;
      host.addEventListener('click', onClick);
      host.addEventListener('contextmenu', onContext);
      host.addEventListener('input', onInput);
      host.addEventListener('keydown', onKey);
      host.addEventListener('dragover', onDragOver);
      host.addEventListener('drop', onDrop);
    }
    lastSig = null;
    render();
  }

  // Egy prototípus-állapot forgatókönyve: mindhárom irányban ugyanaz.
  function setup(state) {
    restoreData();
    const keepDensity = st.density;
    Object.assign(st, fresh(), { density: keepDensity });
    for (const k of Object.keys(ui)) delete ui[k];
    clearInterval(sumTimer); clearInterval(jobTimer); clearTimeout(noteTimer);
    job = null; sum.state = 'nincs'; frozen = false;
    const vid = ['video', 'felirat', 'atirat'].includes(state);
    T.forEach((t) => { t.active = t.id === (vid ? VIDEO_TAB : 3); });
    if (state === 'kereses') st.q = 'légcsatorna';
    if (state === 'ures') st.q = 'dyson v15';
    if (state === 'szuro') { st.priceMax = 100000; st.menu = { kind: 'szuro', anchor: '[data-menu="szuro"]' }; }
    if (state === 'kijeloles') { [12, 13, 14, 15].forEach((i) => st.sel.add(i)); st.anchor = 12; st.menu = { kind: 'rendezes', anchor: '[data-menu="rendezes"]' }; ui.scrollTo = '1:porszivo'; }
    if (state === 'osszefoglalo') startSummary(0.6);
    if (state === 'felirat' || state === 'atirat') startJob({ step: 'Átírás', pct: 42 });
    if (state === 'atirat') st.view = 'atirat';
    if (st.q) ui.searchOpen = true;
  }

  return {
    st, ui, sum, menus, SORTS, CUR, VIDEO_TAB,
    tab, active, sections, groupOptions, activeFilters, results, countLine, otherHint, empty, emptyList, WHY, scopeText,
    states, price, short, sumItems, sumStateText, segments, subLine, jobText, job: () => job, badge, hudModel, speedText, hudText, transcriptActions,
    op, render, mount, setup, note, freeze: () => { frozen = true; },
  };
})();

# Siteview: saját böngésző-kiegészítő
Verzió: 1 · 2026-10-21 · Állapot: tervezet

## Cél és kész-feltétel

**Cél:** egyetlen saját Chrome-kiegészítő (Siteview) egy ikonnal és egy közös oldalpanellel, amely Karesz régóta
használt kiegészítőiből csak a kiválasztott funkciókat tudja, kiegészítve két új funkcióval (tartalom szerinti
tabkeresés, felirat generálása). Mellé egy companion app fut a Windows gépén a feliratokhoz és a Claude-hoz.

**Kész, ha** mind teljesül:
1. `npm run build` hiba nélkül lefut, és a `.output/chrome-mv3` mappa kicsomagolt kiegészítőként betölthető a Chrome-ba
   hiba nélkül (a `chrome://extensions` oldalon nincs „Errors” jelzés).
2. `npm test` (Vitest egységtesztek) és `npm run e2e` (Playwright, a kiegészítővel betöltött Chromiumban) zöld, és
   minden modulnak legalább egy e2e forgatókönyve van (a Munkacsomagok tábla szerint).
3. A companion app tesztjei (`uv run pytest` a `companion/` mappában) zöldek.
4. A „Végponttól végpontig tartó ellenőrzés” forgatókönyve Karesz gépén végigmegy, és Karesz ezt visszaigazolja.

## Hatókör

**Benne van** (a kódok a válogató oldal kódjai; a forrás: `/mnt/project-files/specs/sajat-extension/` és a
„Saját extension: válogatás és alternatívák” dokumentum):

| Modul | Funkciók |
| --- | --- |
| Mag | egy ikon, közös oldalpanel, modulok ki/bekapcsolása, beállítások szinkronja Google fiókon át (TS9, ATD12 és DT7 helyett) |
| Altatás | ATD1, ATD2, ATD4 (szűkítve), ATD5, ATD7, ATD9, ATD10 |
| Oldalpanel | TS1, TS2, TS3, TS4 (+TC), TS5 (valódi átrendezéssel), TS10, TS11 |
| Duplikátumok | DT1, DT2, DT3 (jobb klikkes kivétel), DT4 (két kapcsoló), DT6, DT8, új: linkjelölés |
| Videóvezérlés | VD1 (vegyes mód), VD2–VD7, VD8 (alapváltozat), VD10 |
| Claude | CS2, CS4 (jobb klikk: kijelölés nélkül az oldal, kijelöléssel a kijelölés), CS5 |
| Képmentés | SI1 (csak JPG és PNG), SI4 |
| Képernyőkép | GF1–GF6 |
| Tartalom szerinti keresés | TC1–TC5 |
| Felirat | SG1, SG3, SG4, SG5, SG6 (állapotjelzéssel) |
| Companion app | Windows native messaging host: `claude -p` hívás, yt-dlp letöltés, faster-whisper átírás, telepítő szkript |

**Nincs benne:** Firefox; Chrome Web Store feltöltés; felhős felirat-API; élő tab-hang rögzítése (SG2); inkognitó mód
(DT5); a kimaradt kódok (VD9, ATD3, ATD6, ATD8, ATD11, TS6, TS7, TS8, CS1, CS3, SI2–SI3 mint külön funkció, GF7, GF8);
a saját lejátszó (VD8) részletes testreszabása, amelyet Karesz később külön tervez; bejelentkezést igénylő oldalak
videóinak letöltése; DRM-védett videó.

## Kontextus

- **Felhasználó:** Karesz, Windows, Chrome (Edge és Brave másodlagos). Csak magának, fejlesztői módban betöltve;
  később esetleg feltölti, ezért a modulok egyenként kikapcsolhatók.
- **Repó:** `damndotrun/siteview` (nyilvános). A spec és a kutatás: `specs/siteview/`.
- **Eredeti kiegészítők, amelyek mintául szolgálnak:** Video Dominator (InzkDev), Auto Tab Discard
  ([rNeomy/auto-tab-discard](https://github.com/rNeomy/auto-tab-discard), MPL-2.0), Tab Shelf, Duplicate Tabs
  Preventor, ChatGPT Summarizer, Save Image As, GoFullPage. Kódmintának használható nyílt forrás: Auto Tab Discard,
  [Deep Tab Search](https://github.com/MrViolets/Deep-Tab-Search) (GPL-3, csak ötletnek, kódot ne másolj),
  [extension-summarize-translate-claude](https://github.com/sh2/extension-summarize-translate-claude) (MIT),
  [yt-whisper](https://github.com/m1guelpf/yt-whisper) (MIT).
- **Chrome adottságok:** a `chrome.tabs.discard` a böngésző saját altatása; altatott tabban nem fut tartalomszkript. A
  Chrome 2026 áprilisa óta saját függőleges tablistát is tud, ezt nem tudjuk testreszabni, és nem is pótoljuk: a saját
  panel a keresés és a modulok miatt kell. A Chrome Memóriakímélő (Memory Saver) a mi tudtunk nélkül is altathat.
- **Claude az előfizetésből:** az Anthropic leírása szerint a `claude -p` Karesz Max előfizetési keretéből fogy
  ([forrás](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)). Tartalék:
  saját API kulcs, amit a Max havi API kreditje fedez.
- **Felirat:** angol nyelv elég. A faster-whisper `small.en` modell az alap (a yt-whisper is ezt ajánlja angolra).
  YouTube-on gyakran már van automatikus felirat, ezért előbb azt ellenőrizzük.
- **Dizájnkutatás:** `specs/siteview/kutatas/` (README, oldalpanel, oldalon-belul, eredmenyek). A belőle jövő
  döntések lent, a Döntések táblában, forrással.

## Döntések

| Döntés | Választás | Miért |
| --- | --- | --- |
| Böngésző és platform | Chrome MV3; Edge és Brave „ha működik” szinten | Karesz válasza (1a); mindhárom Chromium. |
| Keretrendszer | [WXT](https://wxt.dev) + TypeScript + React, Vitest, Playwright | Kész MV3 támogatás oldalpanelhez, tartalomszkriptekhez, Shadow DOM-os oldalon belüli felülethez és teszteléshez. |
| Felület az oldalon belül | Shadow DOM-ba zárt komponensek (WXT `createShadowRootUi`) | Az oldal stílusa ne rontsa el a mi felületünket, és fordítva. |
| Beállítások tárolása | `chrome.storage.sync` (beállítások, szabályok, mentett promptok); `chrome.storage.local` (munkamenetek); IndexedDB (kinyert tartalom, feliratok) | TS9: Google fiókon át szinkron; a nagy adat nem fér a sync kvótába (100 KB). |
| Bővítmény-azonosító | rögzített `key` a manifestben | A companion app csak egy ismert azonosítójú kiegészítőnek válaszol. |
| Companion app | Python 3.12, `uv`, native messaging host; telepítés `install.ps1` szkripttel (HKCU, admin nélkül) | Karesz válasza (2: companion app); a VDH CoApp mintája. |
| Claude elérés | companion app → `claude -p --output-format stream-json`; utókérdés `--resume <session>`; tartalék: Messages API saját kulccsal | Karesz döntése (saját modul, Max előfizetés). |
| Felirat motor | faster-whisper, `small.en` alap, beállításban választható modell; VAD szűrés | Angolra elég pontos CPU-n is; GPU-t magától használ, ha van. |
| Hangforrás sorrendje | 1) már van felirat → nem generál; 2) külön hangsáv (SG1); 3) yt-dlp a legkisebb minőséggel vagy csak hanggal (SG3) | Karesz kérése; a YouTube automatikus felirata gyakran elég. |
| Teljes oldalas kép | alapút: `chrome.debugger` + `Page.captureScreenshot` `captureBeyondViewport`-tal, előtte görgetés a lusta képekhez; tartalék: görgetés és összefűzés belső görgetésű oldalaknál | Egy lépésben kevesebb hiba; a sárga „hibakeresés” sáv elfogadott (második kör). |
| URL-összevetés | `#` utáni rész elhagyva; http/https, `www.`, záró perjel egyenértékű; követő paraméterek (`utm_*`, `fbclid`, `gclid`, `mc_cid`, `mc_eid`) elhagyva; oldalanként bővíthető lista (alap: YouTube `t`, `si`, `pp`) | DT2 javaslat, Karesz nem kifogásolta. |
| Duplikátum viselkedés | alapból átvált a már nyitott tabra, és az újat bezárja (DT8) | DT8 javaslat, Karesz nem kifogásolta. |
| Videó aktiválás | alap: Video Element mód (gomb nélkül), ha a kurzor alatti legfelső elem a videó; különben Overlay mód aktiváló gombbal (alap: jobb egérgomb nyomva tartva, beállítható Alt/Ctrl/Shift); oldalanként kijelölhető videókonténer (elemkijelölővel) | Karesz VD1 megjegyzése. |
| Altatás kivételei | csak: rögzített tab, médiát játszik, szüneteltetett lejátszó, el nem küldött űrlap, kivétellista, „ezt ne” | Karesz ATD4 megjegyzése. |
| Memóriakímélő | a beállításokban figyelmeztetés, hogy kapcsolja ki | Különben a TC kinyerés előtt altathat. |
| Oldalpanel felépítés | fent modul gyorsgombok (átrendezhető), alatta keresés + szűrő lenyíló, alatta tablista csoportfejlécekkel | Kutatás: Linear csoportfejlécek, Slite szűrő lenyíló (kutatas/oldalpanel.md). |
| Hosszú műveletek | lépésjelző (Letöltés → Átírás → Kész), százalék, megszakítás | Kutatás: Grok lépésjelző (kutatas/eredmenyek.md). |
| Képernyőkép export | előnézet + jobb oldali sáv: PNG, JPEG, PDF, vágólap | Kutatás: Excalidraw export (kutatas/eredmenyek.md). |
| Vizuális irány | a 2. munkacsomag állítja be a `refero-design` skillel; addig semleges tokenek egy fájlban | A dizájnkutatás útja: előbb vizuális irány, utána a felületek. |

## Részletes működés modulonként

### Mag
- Egy eszköztár-ikon: kattintásra megnyitja az oldalpanelt (`chrome.sidePanel`).
- Modulregiszter: minden modul egy mappa (`modules/<név>/`) saját háttér-, tartalom- és panel-résszel, és egy
  `enabled` kapcsolóval. Kikapcsolt modul nem regisztrál eseményfigyelőt, tartalomszkriptet, helyi menüt.
- Beállítások nézet a panelben: modulonként egy sor kapcsolóval és egysoros leírással; a sorra kattintva a modul
  beállításai nyílnak.
- Helyi menü (jobb klikk) a moduloktól gyűjtve, „Siteview” almenüben.
- Ikon jelvény (badge) a hosszú műveletek állapotához (pl. „45%”).
- Billentyűparancs: `Alt+Shift+P` képernyőkép, `Ctrl+Shift+O`-hoz hasonló panelnyitó (a Chrome `commands` alapján,
  felülírható a `chrome://extensions/shortcuts` oldalon).

### Altatás
- ATD1: a háttér `chrome.alarms` percenként ellenőriz; altat minden inaktív tabot, amely `N` perce nem volt aktív
  (alap 30, beállítható 1–1440).
- ATD4 kivételek: rögzített; `audible`; szüneteltetett lejátszó (tartalomszkript jelzi: van videó/hang `currentTime >
  0` és `paused`); el nem küldött űrlap (tartalomszkript: `input`/`change` esemény egy `form`-on vagy szerkeszthető
  mezőn, amit nem követett `submit`).
- ATD5: kivétellista hostnévvel vagy `re:` előtagú reguláris kifejezéssel; „ezt a tabot ne altasd” a panelben és a
  helyi menüben (a tab élettartamára).
- ATD2: panelben és helyi menüben: ezt a tabot, az ablak többi tabját, minden inaktívat; ébresztés: következő, előző,
  az ablak összes.
- ATD7: altatás előtt a tartalomszkript a címet `💤 ` előtaggal látja el; a panelben az altatott tab halvány.
- ATD9: háttérben nyitott új tab azonnali altatása, amint az URL ismert (kapcsolható, alap: be).
- ATD10: YouTube-on altatás előtt az aktuális időpont bekerül az URL-be (`t=<mp>s`, `history.replaceState`), így
  ébredéskor onnan folytatódik.
- Altatás előtt a TC modul friss kinyerést kér a tabtól (ha be van kapcsolva).

### Oldalpanel
- TS1: az aktuális ablak tabjai függőlegesen; kapcsolóval minden ablak. Sor: favicon, cím, domain, állapotikonok
  (hang, altatott, kivétel). A Chrome tabcsoportok összecsukható fejlécként, darabszámmal és a csoport színével.
- TS2: csoportosítási szabályok (domain vagy URL minta → csoportnév és szín), minden ablakra alkalmazva; tabsor helyi
  menü: „Az oldal összes tabja egy csoportba”.
- TS3: munkamenet mentése: csoport, ablak, minden ablak; lista a panelben; visszaállítás, átnevezés, törlés
  (megerősítéssel). Tárolás: `chrome.storage.local`.
- TS4: keresőmező a panel tetején: cím, URL, és a TC modul tartalmai. Mellette „Szűrő” lenyíló kapcsolókkal (csak
  cím, tartalomban is, csak altatott, csak hangot játszó, ablak, csoport) és „Szűrők törlése” sorral. Üres
  találatnál: „Nincs találat” + „Szűrők törlése”.
- TS5: több tab kijelölése a panelben (Ctrl/Shift kattintás); „Rendezés” művelet: cím, domain, utolsó használat vagy
  egy TC mező szerint; a tabok a böngészőben is átrendeződnek (`chrome.tabs.move`), csoporton belül maradva.
- TS10: világos/sötét a rendszer szerint, kiemelő szín választható, két sűrűség (kompakt, kényelmes).
- TS11: URL szöveg ráhúzása a panelre új tabot nyit.
- Fent a modul gyorsgombok sora (képernyőkép, összefoglaló, elemkijelölő, felirat): húzással átrendezhető, a sorrend
  szinkronizálódik.

### Duplikátumok
- DT1 + DT8: amikor egy tab URL-je egy már nyitott tab normalizált URL-jével egyezik, a régi tab aktív lesz, az új
  bezárul. DT6 szerint egyenként kapcsolható, mikor fut: indításkor, tab frissítéskor, létrehozáskor, cserekor,
  ablakok közti mozgatáskor (alap: mind be).
- DT2: a normalizálás a Döntések tábla szerint; az oldalankénti paraméterlista a beállításokban szerkeszthető.
- DT4: két kapcsoló: „melyik marad: a régebbi / az újabb” (alap: régebbi) és „az aktív tab mindig marad” (alap: be).
  Ha a kettő ütközik, az aktív tab védelme erősebb.
- DT3: helyi menü linkre: „Megnyitás kivételként” (az így nyitott tab soha nem zárul duplikátumként); helyi menü
  oldalon: „Ezen az oldalon ne figyelje a duplikátumokat” (host a kivétellistára; a listát a beállításokban lehet
  törölni).
- Linkjelölés (új): a tartalomszkript megjelöli azokat a linkeket, amelyek normalizált címe már nyitott tabban van
  (visszafogott jelölés, a vizuális irány szerint, címmel a tooltipben: „Már nyitva: <tab címe>”). Kattintásra a
  meglévő tabra vált. A jelölés élőben frissül tabnyitásnál és -zárásnál, és az új linkeknél (MutationObserver,
  ritkítva). Kapcsolható.

### Videóvezérlés
- VD1: lásd Döntések. A kijelölt videókonténer oldalanként (host + URL minta) szabályként mentődik.
- VD2: zónák: a videó vízszintesen bal és jobb félre, opcionálisan 3×3 rácsra osztva; zónánként és bemenetenként
  (görgő fel/le, középső gomb, oldalsó gombok) választható akció. Alap: bal fél görgő = hangerő ±5%, jobb fél görgő =
  ugrás ±5 mp, középső gomb = lejátszás/szünet.
- VD3–VD6 akciók: lejátszás/szünet; ugrás mp-ben, képkockában (1/30 mp), százalékban; sebesség állítása és lépésekben
  0,07–16x; hangerő és némítás; kép a képben.
- VD7: HUD a videó jobb felső sarkában kb. 1 mp-ig: hangerő, sebesség, idő/hossz vagy hátralévő idő (a sebességgel
  korrigált idő kapcsolható).
- VD8 alapváltozat: a videó teljes ablakos vagy teljes képernyős saját keretbe kerül, saját folyamatsávval, beállítható
  billentyűparancsokkal, és itt jelenik meg a generált felirat. Menü: felirat, sebesség, kép a képben.
- VD10: oldalszűrő: mindenhol / feketelista / fehérlista.

### Claude
- CS4: helyi menü „Összefoglalás Claude-dal”: kijelölés nélkül a teljes oldal olvasható szövege (Mozilla Readability),
  kijelöléssel a kijelölt szöveg. Almenüben a mentett promptok.
- A panel Claude nézete: fejlécben a forrás (oldal címe vagy „Kijelölés”), a válasz folyamatosan érkezik, „Leállítás”
  gomb, lent utókérdés mező (CS5), fölötte a mentett promptok chipként.
- CS5: mentett promptok listája (név + szöveg), alap: „Összefoglaló (magyarul, pontokban)”. Szerkeszthető a
  beállításokban, szinkronizálódik.
- CS2 út: a kiegészítő a companion appnak küldi a szöveget és a promptot; az `claude -p --output-format stream-json`
  kimenetét továbbítja; utókérdésnél ugyanazzal a munkamenettel (`--resume`). Ha a companion app nem fut: magyarázó
  üres állapot a telepítés lépésével, és ha van API kulcs, felajánlja a tartalék utat.
- Tartalék: Messages API saját kulccsal, a kulcs `chrome.storage.local`-ban (nem szinkronizálódik), a modell a
  beállításokban választható.

### Képmentés
- SI1: helyi menü képen: „Mentés JPG-ként”, „Mentés PNG-ként”. A kép bájtjait a háttér tölti le (így más domainről is
  működik), `OffscreenCanvas`-on konvertál, JPG-nél az átlátszó rész fehér.
- SI4: JPG minőség (alap 92), fájlnév-sablon tokenekkel: `{cím}`, `{domain}`, `{dátum}`, `{idő}`, `{eredeti}`; alap:
  `{eredeti}`. Mentés `chrome.downloads`-szal, „Mentés másként” ablakkal vagy anélkül (kapcsoló).

### Képernyőkép
- GF1–GF2: indítás: gyorsgomb, `Alt+Shift+P`, helyi menü. Alapút a Döntések szerint; előtte az oldal végiggörgetése
  a lusta képek betöltéséhez, és a rögzített (fixed/sticky) elemek ideiglenes elrejtése az első képernyő után.
  Tartalék: ha a fő görgető egy belső elem, görgetés és összefűzés.
- GF3: ha a kép magasabb, mint amit egy kép elbír (16 384 px felett), több képre bontja.
- GF4–GF5: eredményoldal: előnézet, PNG, JPEG, PDF (papírméret A4/Letter, álló/fekvő, oldaltörés szövegsor közé: a
  tartalomszkript előre összegyűjti a szövegsorok függőleges helyét), vágólapra másolás, `Ctrl+S`, a kép kihúzható az
  asztalra.
- GF6: fájlnév: `{domain} {dátum} {idő}.{kiterjesztés}`, beállítható almappa a Letöltéseken belül, automatikus
  letöltés kapcsoló.
- Hiba: nem rögzíthető oldal (pl. `chrome://`, Web Store) → érthető hibaüzenet az eredményoldal helyett.

### Tartalom szerinti keresés
- TC1 elemkijelölő: indítás gyorsgombbal vagy helyi menüből. Rámutatáskor keret + címke (elem típusa, méret);
  kattintásra rögzül, és nem fut le az oldal saját kattintása. Kis eszköztár: szülő/gyerek elemre lépés, mező neve,
  típusa (szöveg, szám, ár, dátum), mentés, mégse; `Esc` kilép. A szabály: URL minta (alap: host + az útvonal
  általánosítva, pl. `/termek/*`, szerkeszthető) + mezők (név, típus, CSS szelektor). A szelektor stabil jegyekre
  épül (id, `data-*`, beszédes osztály), sorszámos szelektort csak végső esetben használ. Mentés előtt előnézet a
  kinyert értékkel.
- TC2: a szabályos oldalakon betöltéskor és DOM-változáskor (ritkítva, a betöltés után 10 mp-ig), valamint altatás
  előtt kinyeri a mezőket IndexedDB-be. Ha a szabály URL-je illik, de a szelektor nem talál semmit: a szabály „nem
  talál” jelzést kap a panelben.
- TC5: szabály nélkül is: az olvasható főszöveg (Readability) kinyerése, legfeljebb 50 KB oldalanként (kapcsolható,
  alap: be).
- TC3: teljes szöveges keresés (MiniSearch) cím, URL, főszöveg és mezők fölött; mezőszűrő a lenyílóban (pl. „ár ≤
  50 000”); találatnál szövegrészlet a kiemelt szóval; kattintásra a tabra vált, és az oldalon a talált szövegre
  görget (altatott tabnál előbb ébreszt).
- TC4: rendezés típusos mező szerint; számok és árak magyar és angol formában (`12 990 Ft`, `1,299.00`), dátumok
  (`2026. okt. 21.`, ISO) felismerése.
- Takarítás: bezárt tab adatai 7 nap után törlődnek, kivéve ha mentett munkamenetben szerepel.

### Felirat
- Indítás: a HUD „Felirat” gombja, helyi menü videón, vagy panel gyorsgomb.
- Ellenőrzés: ha a videónak már van felirata (`textTracks`, YouTube-on a lejátszó feliratlistája, az automatikus is),
  nem generál, hanem jelzi, és felajánlja a bekapcsolást.
- SG1: a kiegészítő tabonként figyeli a médiakéréseket (`webRequest`, csak olvasás): `.m3u8`, `.mpd`, külön hangsáv;
  ha van külön hang, azt adja a companion appnak.
- SG3: különben az oldal URL-jét adja a yt-dlp-nek `bestaudio/worst` formátummal.
- Átírás: faster-whisper, szegmensenként visszaküldve, így a felirat darabonként jelenik meg (SG6 „nézd felirat
  nélkül, és jön”).
- SG4: felirat-overlay a videón (méret, hely: lent/fent, háttér átlátszósága beállítható); teljes képernyőn is
  látszik (a `fullscreenElement`-be kerül); a saját lejátszóban (VD8) is. Átirat nézet a panelben időbélyegekkel,
  kattintásra ugrik.
- SG5: gyorsítótár: kulcs a YouTube videóazonosító, egyébként a normalizált oldal-URL + a videó hossza egész mp-re.
  Tárolás IndexedDB-ben WebVTT-ként, a companion appban is (`%LOCALAPPDATA%\Siteview\subs`). Export `.srt` és `.vtt`.
- SG6: állapot: Letöltés → Átírás → Kész, százalékkal, a HUD-on és az ikon jelvényén; megszakítás gomb.

### Companion app
- `companion/` mappa, Python 3.12, `uv`; függőségek: `yt-dlp`, `faster-whisper`, ffmpeg (`imageio-ffmpeg`-ből vagy
  telepített ffmpeg).
- Native messaging (stdio, 4 bájtos hosszelőtag); a hostból a kiegészítőnek menő üzenet legfeljebb 1 MB, ezért a
  feliratot és a Claude választ darabokban küldi.
- Parancsok: `ping` (verzió, elérhető eszközök: `claude`, `yt-dlp`, ffmpeg, modell), `claude.run` (stream, megszakítható),
  `subtitle.start` / `subtitle.cancel` (állapot- és szegmensüzenetekkel), `subtitle.get` (gyorsítótárból).
- `install.ps1`: a host manifestjét a `%LOCALAPPDATA%\Siteview\` alá írja, és bejegyzi a
  `HKCU\Software\Google\Chrome\NativeMessagingHosts\com.siteview.companion` és a
  `HKCU\Software\Microsoft\Edge\NativeMessagingHosts\com.siteview.companion` kulcsot; `allowed_origins` csak a
  Siteview rögzített azonosítója. `uninstall.ps1` mindezt visszaveszi.
- A `claude` parancsot a PATH-ból hívja; ha hiányzik vagy nincs bejelentkezve, a `ping` ezt jelzi.

## Munkacsomagok

Minden csomag ellenőrzése a saját parancsain túl: `npm run build && npm test && npm run e2e` zöld marad (a companion
csomagoknál `uv run pytest` is). Az e2e tesztek helyi tesztoldalakon futnak (`tests/fixtures/`, kis statikus
szerverrel), külső oldalra nem mennek.

| # | Mit | Függ ettől | Párhuzamosítható | Ellenőrzés (parancs vagy lépés) |
| --- | --- | --- | --- | --- |
| 1 | **Próba.** WXT váz, rögzített `key`, mag (modulregiszter, beállítások sync, oldalpanel héj semleges tokenekkel, helyi menü keret), oldalpanel alap tablista (TS1 csoportfejlécekkel), Altatás modul teljesen; CI (GitHub Actions: build, Vitest, Playwright xvfb alatt) | – | – | Vitest: kivétel-logika, időzítés; e2e: tablista megjelenik; tesztidővel (1 perc) altat; rögzített, hangot játszó, kitöltött űrlapos tab nem altat; ATD10 YouTube-szerű tesztoldalon `t=` bekerül; CI zöld |
| 2 | Vizuális irány a `refero-design` skillel: tokenek, tipográfia, közös komponensek (lista sor, kapcsoló, lenyíló, HUD, lépésjelző); `kutatas/vizualis-irany.md` | 1 | – | a panel és egy tesztoldal HUD-ja világos és sötét módban képernyőképpel a PR-ban; e2e zöld |
| 3 | Oldalpanel teljes: TS2, TS3, TS4 (cím/URL keresés, szűrő lenyíló, üres állapot), TS5, TS10, TS11, gyorsgomb sor | 2 | 4-gyel | e2e: szabály szerint csoportosít; munkamenet ment/visszaállít; keresés szűr; kijelölt tabok rendezése a böngészőben is; URL ráhúzása tabot nyit |
| 4 | Duplikátumok + linkjelölés | 1 | 3-mal, 5-tel | Vitest: normalizálás (táblázatos esetek); e2e: duplikátum → régi tab aktív, új bezárul; aktív védelem; „Megnyitás kivételként”; linkjelölés megjelenik és eltűnik a tab bezárásakor |
| 5 | Képmentés (SI1, SI4) | 1 | 4-gyel, 6-tal | Vitest: fájlnév-sablon; e2e: PNG/WebP tesztkép mentése JPG-ként és PNG-ként, a letöltött fájl formátuma helyes, átlátszó → fehér |
| 6 | Képernyőkép (GF1–GF6) | 2 | 5-tel | Vitest: oldaltörés-számítás; e2e: hosszú tesztoldal (lusta képekkel, sticky fejléccel) → egy kép a teljes magassággal; nagyon hosszú oldal → több kép; PDF letöltés; belső görgetésű tesztoldal tartalék úton |
| 7 | TC1–TC2, TC5: elemkijelölő, szabályok, kinyerés, „nem talál” jelzés | 3 | 8-cal | Vitest: szelektor-generálás, mezőtípus-értelmezés; e2e: terméklistás tesztoldalon ár mező kijelölése, mentés, másik termékoldalon kinyerés IndexedDB-be; elrontott szabály „nem talál” |
| 8 | Videóvezérlés (VD1–VD7, VD10) és a videókonténer kijelölése | 2 | 7-tel | e2e: tesztvideón görgő bal/jobb félen hangerő/ugrás; HUD megjelenik; overlay mód gombbal takart videón; sebesség 16x-ig; PiP hívás; feketelistán nem működik |
| 9 | TC3–TC4: tartalom szerinti keresés, mezőszűrő, rendezés mező szerint, találatra ugrás | 7 | 10-zel | e2e: három nyitott tesztoldal közül a tartalom alapján talál; „ár ≤” szűrő; rendezés ár szerint; altatott tabnál ébresztés és görgetés |
| 10 | Companion app alap + `install.ps1`/`uninstall.ps1` + Claude modul (CS2, CS4, CS5, tartalék API) | 1 | 9-cel | pytest: üzenetkeretezés, `claude.run` hamis `claude` paranccsal; e2e: hamis native hosttal a panel folyamatosan mutatja a választ, utókérdés, leállítás, „companion nem fut” állapot. **Kézi lépés Karesz gépén, jóváhagyással:** `install.ps1`, majd valódi összefoglaló egy oldalról |
| 11 | VD8 alapváltozat + Felirat (SG1, SG3, SG4, SG5, SG6) | 8, 10 | – | pytest: rövid angol hangmintán `tiny.en` modellel szegmensek; e2e: hamis hosttal darabonként érkező felirat a videón, állapot a HUD-on és a jelvényen, gyorsítótárból második alkalommal azonnal, `.srt` export, meglévő felirat esetén nem generál |
| 12 | Végponttól végpontig ellenőrzés és átadás | 1–11 | – | a lenti forgatókönyv e2e változata zöld; Karesz gépén kézi végigpróba |

## Végponttól végpontig tartó ellenőrzés

Automatikusan (Playwright, hamis companion hosttal) és Karesz gépén kézzel, valódi companion appal:

1. A kiegészítő betöltődik, az ikonra kattintva megnyílik a panel; a beállításokban a modulok listája kapcsolókkal.
2. Három termékoldalt nyit; az elsőn elemkijelölővel kijelöli az árat „ár” mezőként (szám), mentés. A panelben az
   „ár ≤ 20 000” szűrő csak az olcsóbbat mutatja, a „rendezés ár szerint” a böngészőben is átrendezi a tabokat.
3. Egy linkre kattint, amely már nyitott oldalra mutat: a link jelölve volt, és a kattintás a meglévő tabra vált.
4. 1 percre állított altatás után a háttér tabok altatottak (💤), a keresés továbbra is megtalálja őket tartalom
   alapján; a találatra kattintva a tab felébred, és a talált szövegre görget.
5. A termékoldalon jobb klikk → „Összefoglalás Claude-dal”: a panelben folyamatosan érkezik a válasz; utókérdés is
   működik.
6. Egy kép jobb klikkel JPG-ként mentődik a sablon szerinti névvel.
7. `Alt+Shift+P`: a teljes oldalról kép készül; PDF-be mentés A4-en.
8. Egy felirat nélküli tesztvideón görgővel hangerő és ugrás működik, a HUD mutatja; „Felirat”: Letöltés → Átírás
   állapot, a felirat darabonként megjelenik; újratöltés után a gyorsítótárból azonnal ott van.

## Kockázatok és jóváhagyást igénylő lépések

- **Jóváhagyás kell:** a companion app telepítése Karesz gépére (`install.ps1` registry-kulcsot ír, HKCU); bármilyen
  merge a `main` ágra; a repó nyilvános marad (Karesz döntése).
- `claude -p` Karesz előfizetési keretéből fogy; a hosszú oldalak szövegét a kiegészítő 50 KB-ra vágja.
- yt-dlp: oldalankénti változások miatt időnként frissíteni kell (`uv lock --upgrade-package yt-dlp`); a
  bejelentkezést igénylő oldalak nincsenek benne.
- `chrome.debugger` alatt a Chrome sárga sávot mutat; ha zavaró, a tartalék út kapcsolóval alapútra tehető.
- A Chrome Memóriakímélő a TC kinyerés előtt altathat; ezt a beállítások figyelmeztetése kezeli.
- Brave native messaging registry-útvonala eltérhet; ezt a 10. csomag kézi lépése ellenőrzi, és ha kell, a telepítő
  bővül (spec-módosítás nélkül, mert a hatókörben benne van).
- Playwright e2e-ben a kiegészítő csak Chromiummal tölthető be; a CI xvfb alatt, nem fej nélkül futtatja.

## Nyitott kérdések

(nincs)

## Változásnapló
- v1 2026-10-21: első változat a KAPU 1 összefoglalója, a válogató (69 funkció), a második kör és a dizájnkutatás
  alapján.

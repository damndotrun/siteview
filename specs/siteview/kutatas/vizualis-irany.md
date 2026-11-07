Tömörítés után: töltsd be újra a `dizajnkutatas` és a `refero-design` skillt, olvasd el az `anti-ai-slop.md`-t és ennek a fájlnak a sablonellenőrzését, mielőtt tervezel.
# Vizuális irány: Siteview
Állapot: javaslat (2. kör) · Spec: specs/siteview/SPEC.md v1 · Előző kör: `vizualis-irany-elvetve-1.md`

## Kulcskérdés és szempontok
Forrás: `munkafolyamat.md`. Kulcskérdés: hogyan lehet sok háttérben nyitott oldal címe, helye és állapota egy
pillantással átfutható, és szűkülhet azonnal a beírt szóra a tartalom alapján is (látszó okkal), miközben a modulok
indítói és a futó munkák kéznél vannak, de háttérbe szorulhatnak?
1. Mennyire támogatja a munkát (keresés egy gépeléssel és egy kattintással, látszó ok; sok tabnál is átfutható; a
   videón olvasható, de nem takar). 2. Karesz saját, fix elrendezése. 3. Egyediség (csak döntetlennél).
Kulcslépések: (K1) tabok átfutása és keresés tartalom szerint; (K2) visszajelzés a videón görgetéskor; (K3) felirat
készítésének állapota.

## Lekérdezésnapló
| # | Lekérdezés (szó szerint) | Eszköz | Mire szól | Megnyitott találatok |
| --- | --- | --- | --- | --- |
| 1 | tab manager | Refero `refero_search_sites` | terület neve | nincs tabkezelő; az első öt (Google Classroom, Kitchen.co, Aboard, Mapbox, Wrike) nem a terület terméke, nem nyitottam meg |
| 2 | browser tab manager with list of open tabs | Mobbin `search_screens` (web, deep) | terület neve | Hashnode, Mistral AI, Perplexity (előnézet megnézve; egyik sem tabkezelő) |
| 3 | browser | Refero `refero_search_sites` | terület neve | nincs böngésző-termék (Steel, Manus, Bezi, Webflow, Modyfi: nem a terület), nem nyitottam meg |
| 4 | read later | Refero `refero_search_sites` | terület a munka szerint (olvasási sor) | Matter, Pocket, Literal.club, Skiff, Oku: a Mattert a 5. és 11. sor képei fedik; Pocket, Literal, Skiff, Oku nem nyitva (keret) |
| 5 | AdGuard | Refero `refero_search_sites` | Karesz terméke | nincs találat (Steel, Tella, Cosmos…) |
| 6 | read later app with list of saved articles and search | Mobbin `search_screens` (web, deep) | terület a munka szerint | Matter, Substack, The New York Times, mymind, Hashnode (képek: `refs/`) |
| 7 | Google Chrome tab search | Mobbin `search_screens` (web, standard) | Karesz terméke (Chrome) | a Chrome nincs a Mobbinban; NYT, Shopify, Dropbox Dash, Telegram, Notion előnézete |
| 8 | search results list with highlighted matching text snippet under each title | Mobbin `search_screens` (web, deep) | K1 kezelési probléma | Dovetail, Juicebox, Contractbook, Basecamp, Langdock, Fireflies, Voicenotes, Coda, Unity, Elicit, Sana, Confluence |
| 9 | email inbox with category tabs and bulk selected messages | Mobbin `search_screens` (web, deep) | K1/rend: sok elem csoportokra bontva, többes kijelölés | Notion Mail, Superhuman Mail, Front, ClickUp, ManyChat… |
| 10 | video player with volume level overlay on the video | Mobbin `search_screens` (web, deep) | K2 kezelési probléma | Prime Video, Arcade, Whereby, Contra, Synthesia, The Leap, SuperHi |
| 11 | table of saved products with a price column sorted by price | Mobbin `search_screens` (web, deep) | K1/6. lépés: rendezés mező szerint, csoporton belül | Programa, Fresha, QuickBooks, Wix, Midday, HubSpot, Patreon, Amazon, Binance, Square |
| 12 | generating a transcript for an uploaded video with progress | Mobbin `search_flows` (web) | K3 lépéssor | Fireflies „Uploading a file”, Matter „Requesting video transcript”, ElevenLabs „Transcribing a file”, Dovetail „Transcribing a video” |

Keret: 12 lekérdezés, 15 mentett kép, 4 lépéssor. A Mobbin képei csak előnézeti méretben (768 px) érhetők el innen, a
`mobbin.com` letöltést a hálózat tiltja; a vonásokat ezekről olvastam, a színeket pixelmintával.

## Referencianapló (Menet 1.)
| Termék | Kép | Szerep | Indok |
| --- | --- | --- | --- |
| Video Dominator | nem néztem meg | nem vizsgált: nincs a Refero és a Mobbin könyvtárában, a webáruház innen nem érhető el | – |
| Auto Tab Discard | nem néztem meg | nem vizsgált: mint fent | – |
| Tab Shelf | nem néztem meg | nem vizsgált: mint fent | – |
| Duplicate Tabs Preventor | nem néztem meg | nem vizsgált: mint fent | – |
| ChatGPT Summarizer | nem néztem meg | nem vizsgált: mint fent | – |
| Save Image As | nem néztem meg | nem vizsgált: mint fent | – |
| GoFullPage | nem néztem meg | nem vizsgált: mint fent | – |
| AdGuard | nem néztem meg | nem vizsgált: a Refero keresés (5.) nem hozta | – |
| Video DownloadHelper | nem néztem meg | nem vizsgált: nincs a könyvtárakban | – |
| Chrome | nem néztem meg | nem vizsgált: a Mobbin keresés (7.) nem hozta | – |
| Matter | `refs/matter-kereses.jpg` ([Mobbin](https://mobbin.com/screens/cae30201-5eac-4644-b476-19a5df22c410)), `refs/matter-atirat-folyamatban.jpg`, `refs/matter-atirat-kesz.jpg` ([lépéssor](https://mobbin.com/flows/ff3956b1-2297-4abd-9f44-1c872e4a2006)) | alap termék: A irány | olvasási sor a weboldalakra; a keresés a szövegben talál, kiemelt részlettel (K1), és videóhoz átiratot készít folyamatjelzővel (K3) |
| Superhuman Mail | `refs/superhuman-split-inbox.jpg` ([Mobbin](https://mobbin.com/screens/671cbc3b-478c-4b84-96da-f5e31f328352)) | alap termék: B irány | sok elem gyors szétválogatása: csoportok fülként felül, egysoros sorok, soron belüli műveletek, visszavonható értesítés (K1, rend) |
| Programa | `refs/programa-rendezes-ar.jpg` ([Mobbin](https://mobbin.com/screens/f26ad582-4e04-4df5-980a-e47d0e863486)) | alap termék: C irány | termékek összehasonlítása mezőkkel, ár szerinti rendezés „szakaszon belül” kapcsolóval (TC4, TS5) |
| Prime Video | `refs/prime-video-hangero.jpg` ([Mobbin](https://mobbin.com/screens/97c1d205-499f-4982-ac01-51862117089f)) | részlet: A irány HUD | függőleges, keskeny hangerőcsúszka a videón (K2) |
| Notion Mail | `refs/notion-mail-kijeloles.jpg` ([Mobbin](https://mobbin.com/screens/d6e0ee95-105c-47cc-8375-a4c3caf0389d)) | részlet: B irány | kijelölt sorok halványkék háttere, „2 selected” sáv (6. lépés) |
| Coda | `refs/coda-kereses.jpg` ([Mobbin](https://mobbin.com/screens/9d2e6129-e275-4386-8da0-d4b4fe0bd89d)) | részlet: C irány | találatok csoportosítva az ok szerint (Pages / Text), K1 |
| Fireflies | `refs/fireflies-kereses.jpg` ([Mobbin](https://mobbin.com/screens/1be334c3-ea77-49a2-b7d3-18fbbf9f11b9)) | elvetve | az idézett részletek jók, de a Matter ugyanezt a weboldalakra mutatja; a lila kiemelőszín sablontünet |
| The Leap | `refs/the-leap-felirat.jpg` ([Mobbin](https://mobbin.com/screens/d86f77bd-1812-4d7d-a7e7-cfe172b2c63a)) | elvetve | szavanként kiemelt felirat; Karesz kérése a sima felirat, és a zöldessárga más szerepű, mint bármelyik alapnál |
| Substack, The New York Times, mymind, Hashnode | `refs/substack-mentett.jpg`, `refs/nyt-olvasasi-lista.jpg`, `refs/mymind.jpg`, `refs/hashnode-konyvjelzok.jpg` | elvetve | mentett cikkek nagy képpel vagy kártyával; a tabokhoz nincs kép, a kártya csak helyet vesz el |
| Midday | `refs/midday-termekek.jpg` ([Mobbin](https://mobbin.com/screens/667e0990-d6d7-40d3-af9e-8c8ae8e744d2)) | elvetve | termékár-táblázat, de a szakaszon belüli rendezést a Programa mutatja |

A terület saját termékei (tabkezelők, böngészők) nincsenek a könyvtárakban; mindhárom alap másik terület terméke,
amelyben ugyanez a munka folyik, és a szerkezetéért vettem: olvasási sor (Matter), sok beérkező elem szétválogatása
(Superhuman Mail), termékek összehasonlítása mezőkkel (Programa).

## Összevetés (szempontok és szerkezeti eltérések)
| | A · Olvasási sor (Matter) | B · Szétválogatás (Superhuman Mail) | C · Összehasonlító lap (Programa) |
| --- | --- | --- | --- |
| Fő interakció | olvasva átfutni, gépelve keresni; a találat szövegrészlettel | billentyűvel végigmenni és dönteni (altat, bezár, megnyit), visszavonással | mezők szerint rendezni és szűrni, majd a böngészőben is átrendezni |
| Hol vannak a csoportok | kis nagybetűs szakaszcímek a listában | fülek felül (a csoportok egymás mellett, darabszámmal) | szakaszok a lapon, morzsamenüvel |
| Modulindítók | keskeny ikonoszlop a panel bal szélén, fix sorrendben | apró ikonsor a panel alján, és parancslista | szöveges eszközsor a panel alján |
| Egy tabsor | két sor: cím; domain · csoport · idő; kereséskor harmadik sor a kiemelt részlettel | egy sor: pötty, cím, szürke domain, idő jobbra | doboz: cím és domain, mellette mezőértékek kis nagybetűs címkével |
| HUD (K2) | ott jelenik meg, ahol görgetsz: bal szélen függőleges csúszka, jobb szélen idődoboz | egysoros értesítéssáv a videó bal felső sarkában, paranccsal | mezősáv a bal felső sarokban: érték fölül, kis nagybetűs címke alatta |
| Felirat állapota (K3) | 2 px-es csík és egy sor szöveg (Matter átirat): a videón sötét dobozban, a panelben a tab alatt | ugyanaz az értesítéssáv „Megszakítás” paranccsal, a videón és a panel alján | állapotcímke körrel és százalékkal; az alsó eszközsorban „Felirat 42%” |
| Eltérés a spectől | nincs gyorsgombsor; a szűrők a keresősor alatt szövegként | nincs gyorsgombsor, nincsenek összecsukható csoportfejlécek | nincs gyorsgombsor; „Lista / Mezők” nézetváltó |
| 1. szempont: erősség | a „miért találat” a legjobban látszik (K1) | a legtöbb tab a legkevesebb helyen; a rendrakás a leggyorsabb | a mező szerinti összehasonlítás és a böngészőben is érvényes rendezés (TS5) |
| 1. szempont: gyengeség | sorhossz: kevesebb tab fér ki (400 px-en kb. 12) | a tartalmi találat oka kevésbé hangsúlyos (320 px-en csak a szó környezete látszik); a lista az utolsó használat szerint áll, nem a tabsor sorrendjében | ahol nincs mező, a dobozos sor sok helyet vesz el (400 px-en kb. 8 tab) |

## A irány: Matter (olvasási sor)
### Szerkezet
A panel egy olvasási sor. Felül a keresősor: szegély nélküli szövegmező, alatta hajszálvonal (Matter keresés). Alatta
a tabok két soros tételként (cím; „domain · idő” és az állapot jobbra), a csoportok kis nagybetűs szürke
szakaszcímekkel (a Matter „NNGROUP” forráscímkéje). Kereséskor a tétel harmadik sora a szövegrészlet, benne a talált
szó halványsárga kiemeléssel; a meta megmondja, hol talált („a szövegben” / „a címben”). A modulindítók a bal szélen,
keskeny ikonoszlopban, felirat nélkül, súgóval (a Matter olvasónézetének bal oldali ikonoszlopa). Az összefoglaló és
az átirat olvasónézet: kis nagybetűs forráscímke, félkövér cím, szürke meta, fülek alsó vonallal, talpas
olvasóbetűvel írt szöveg. Spec-eltérés (javaslat): a „fent modul gyorsgombok sora” helyett bal oldali ikonoszlop; a
„Szűrő” lenyíló helyett szöveges szűrők a keresősor alatt, csak keresés közben.

### Vonások forrásai (Kapuk 2.)
| Vonás | Érték | Forráskép és hely | Szerepe a forrásban | Eltérés és oka |
| --- | --- | --- | --- | --- |
| Alap | `#ffffff` | matter-kereses: lista háttere (mért) | olvasófelület | – |
| Cím | `#141414`, félkövér (600), 14 px | matter-kereses: tételcímek (mért `#141414`) | tétel címe | 15 → 14 px a keskeny panel miatt |
| Meta | `#6f6f6f`, 12 px | matter-kereses: „Viktor · July 26” sor (mért `#787878`, élsimítással halványabb) | forrás, dátum | sötétebbre vettem az olvashatóságért (4,5:1) |
| Jobb oldali állapot | `#9a9a9a`, 12 px, „9 min · Unread” mintájára „2 órája · Altatva” | matter-kereses: jobb szél (mért `#b3b3b3`) | olvasási idő és állapot | sötétebb, mert állapotot hordoz |
| Kiemelés | háttér `#fbf3c6`, szöveg változatlan | matter-kereses: „products” szavak háttere (mért `#fcfad6`–`#fcf8d0`) | csak a keresési találat | a JPEG halványít, kicsit telítettebbre vettem; csak keresési találatra |
| Elválasztó | 1 px `#eeeeee` | matter-kereses: tételek közti vonal | tételek elválasztása | – |
| Forráscímke | 11 px, nagybetű, 0,08 em betűköz, `#808080` | matter-atirat-kesz: „NNGROUP” (mért `#818181`) | a cikk forrása | csoport- és ablakcímként; mellé a Chrome csoportszín 6 px-es pöttyként (kötöttség) |
| Olvasónézet címe | 22 px, 800-as vastagság, szűk sorköz | matter-atirat-kesz: „Anatomy of Good Icons” | cikk címe | 26 → 22 px a panel miatt |
| Fülek | 13 px, aktív 600 + 2 px `#0c0c0c` alsó vonal, alattuk hajszálvonal | matter-atirat-kesz: „Transcript / Video” | nézetváltás | – |
| Olvasóbetű | talpas, 15 px / 1,6; Windows-on Sitka Text vagy Georgia | matter-atirat-kesz: az átirat szövege | olvasott szöveg | a betű neve nem azonosítható; csak hosszú olvasott szövegre (összefoglaló, átirat) |
| Felületi betű | rendszerbetű (Windows: Segoe UI) | – | – | a Matter felületi betűje a képről nem azonosítható, ezért rendszerbetű, kimondva |
| Folyamatjelző | 2 px, sín `#cccccc`, kitöltés `#000000`, alatta 12 px szürke szöveg | matter-atirat-folyamatban: „Generating transcript…” (mért) | átirat készül | ugyanígy a felirathoz és az összefoglalóhoz |
| Modulindítók | 18 px vonalas ikonok `#7f7f7f`, felirat nélkül, függőlegesen 36 px-enként | matter-atirat-kesz: bal oldali ▷, archív, Aa, ⋯ oszlop | olvasónézet műveletei | modulindítóként; súgóban a név és a billentyű |
| Aktuális tab | félkövér cím, háttér `#f4f4f4` | matter-kereses: kiválasztott menüpont kiemelése | kiválasztás | – |
| Altatott tab | cím `#8a8a8a`, jobbra „Altatva” | (saját döntés a meta színéből) | – | a forrásban nincs ilyen állapot |
| Forráscímke színe | `#808080` | matter-atirat-kesz: „NNGROUP” (mért `#818181`) | forrás neve | csoport- és ablakcím |
| Aktív fül vonala | 2 px `#0c0c0c` | matter-atirat-kesz: „Transcript” alatt | kiválasztott fül | csak az olvasónézet fülein |
| Favicon | 16 px a valódi favicon, 28 px-es `#f4f4f4` lekerekített (6 px) négyzetben | matter-kereses: 32 px-es forráslogók | forrás azonosítása | a favicon 16 px-es, nagyítva elmosódna; a prototípusban márkajelek (simple-icons), ahol nincs kéznél, a Chrome alap földgömbje (mindhárom irányban így) |
| HUD hangerő | függőleges csúszka: `#444444` 92%-os, 6 px sarok, 2 px fehér sín, 14 px fehér gomb | prime-video-hangero: a hangerő-csúszka | hangerő | ott jelenik meg, ahol görgetsz (bal szél), 1 mp-ig |
| HUD idő | a jobb szélen, ugyanabban a sötét dobozban: idő 15 px 600 fehér, alatta „+5 mp · hossz · sebesség” 11 px, alatta 96 px-es 2 px fehér csík | matter-atirat-folyamatban (csík formája) + prime-video (doboz, fehér a sötéten) | állapotcsík | a videó alján a lejátszó saját sávja és a felirat van, ezért ott, ahol görgetsz (jobb fél) |
| Felirat munka a videón | sötét doboz (`--a-hud`) a bal felső sarokban: „Felirat készül · Átírás 42% · Megszakítás”, alatta 2 px fehér csík | matter-atirat-folyamatban („Generating transcript…”) | folyamat | lent a felirat van; a panelben ugyanez a sor a tab alatt, és az indítóoszlop Felirat ikonja alatt 2 px csík |

### Reference lock
- Elsődleges: Matter (keresés és átirat).
- Megőrzendő: fehér alap kártyák nélkül, hajszálvonallal; két soros tétel (félkövér cím, szürke meta, jobbra állapot);
  halványsárga kiemelés csak a keresési találaton; kis nagybetűs forráscímke; 2 px-es fekete csík és egy sor szöveg a
  folyamatra; talpas betű csak olvasott szövegre.
- Csak átvett: Prime Video függőleges hangerőcsúszkája (HUD).
- Szerepszabályok: a sárga csak találat; a fekete csík csak folyamat; a talpas betű csak olvasott szöveg; a
  csoportszín csak a csoport pöttye.
- Elutasítva: kártyák, színes kiemelőszín a gombokon, nagy csempék, sötét alap.

### Tokenek
```css
--a-bg:#ffffff; --a-text:#141414; --a-meta:#6f6f6f; --a-state:#9a9a9a; --a-line:#eeeeee;
--a-hit:#fbf3c6; --a-selected:#f4f4f4; --a-icon:#7f7f7f; --a-progress-track:#cccccc; --a-progress:#000000;
--a-hud:rgba(68,68,68,.92); --a-label-color:#808080; --a-dim:#8a8a8a; --a-tab-line:#0c0c0c;
--a-font-ui:"Segoe UI",system-ui,sans-serif; --a-font-read:"Sitka Text",Charter,"Bitstream Charter",Georgia,serif;
--a-title:600 14px/1.3 var(--a-font-ui); --a-meta-font:400 12px/1.35 var(--a-font-ui);
--a-label:600 11px/1 var(--a-font-ui) /* nagybetű, 0.08em */; --a-read:400 15px/1.6 var(--a-font-read);
--a-radius-icon:6px; --a-row-pad:10px 14px;
```

## B irány: Superhuman Mail (szétválogatás)
### Szerkezet
Felül a csoportok fülként egymás mellett, könnyű, nagyobb betűvel és darabszámmal (a Superhuman „split inbox”
fülei): „Minden 21 · Siteview 6 · Felirat 4 · Porszívó 4 · Többi 7”; a kiválasztott sötét, a többi halvány. A lista
egysoros: kék pötty, ha a tab háttérben nyílt és még nem nézted meg (a Superhuman olvasatlan pöttye), cím, szürke
domain, jobbra az utolsó használat nagybetűs kis szöveggel; időelválasztók („Ma”, „Tegnap”, „Korábban”). A kijelölt
sor halványkék háttér és a bal szélen lila csík; rámutatáskor a sor végén műveletek (altat, bezár, kivétel). Billentyűk:
J/K, Enter, H (altat), E (bezár), `/` (keresés), Ctrl+K (parancsok). Minden tömeges művelet után egysoros értesítés a
bal alsó sarokban „VISSZAVONÁS” paranccsal. A modulindítók apró ikonsorként a panel alján. Spec-eltérés (javaslat):
gyorsgombsor és összecsukható csoportfejlécek helyett fülek és alsó ikonsor.

### Vonások forrásai (Kapuk 2.)
| Vonás | Érték | Forráskép és hely | Szerepe a forrásban | Eltérés és oka |
| --- | --- | --- | --- | --- |
| Alap | `#ffffff` | superhuman: lista háttere | lista | – |
| Fülek | 16 px, 300-as vastagság; aktív `#2f3033`, többi `#a9abaf`; darabszám 11 px | superhuman: „Important 405+ … Pitches 22” (mért `#7a7a7a` / `#b7b7b7` vékony betűn) | szétválogatott postafiókok | 17 → 16 px; az aktív sötétebb, mert a mért érték élsimítás miatt világos |
| Sor | egy sor, 34 px magas, cím 13 px 500 `#3a3c40`, domain 13 px `#9a9ca0` | superhuman: feladó, tárgy, részlet sorai (sorköz ~35 px) | levél | – |
| Idő | 11 px nagybetű, 0,04 em, `#a6a6a6`, jobbra | superhuman: „AUG 25” | érkezés ideje | „14:05”, „TEGNAP”, „OKT 21” |
| Időelválasztó | 13 px `#b0b0b0`, fölötte 18 px hely | superhuman: „August 22nd”, „Earlier this month” | csoportosítás idő szerint | utolsó használat szerint |
| Olvasatlan pötty | 6 px `#5aa0cf` | superhuman: kék pötty a feladó előtt (mért halványabb) | olvasatlan | háttérben nyílt, még meg nem nézett tab (ATD9) |
| Kijelölt sor | háttér `#eef3f9`, bal szélen 3 px `#c4c8ea` | superhuman: első sor (mért `#f0f4f8`, csík `#ccd0e8`) | kurzor alatti sor | – |
| Többes kijelölés | háttér `#dfeaf7`, felül „3 kijelölve” sáv | notion-mail-kijeloles: kijelölt sorok (mért `#e0ecf8`) | kijelölt levelek | részlet a Notion Mailből |
| Soron belüli műveletek | 16 px vonalas ikonok `#9a9ca0` a sor végén, rámutatáskor | superhuman: ✓, óra, archív ikon az első sorban | gyors döntés | altat, bezár, kivétel |
| Címke | 11 px, a csoportszín 18%-os tónusán, 3 px sarok | superhuman: „pitch” címke (mért `#ecd3f2`) | melyik szétválogatásba tartozik | a „Minden” fülön a csoport neve, a Chrome csoportszínéből (kötöttség) |
| Értesítés | fehér, 4 px bal csík `#7fb6d8`, 13 px `#7a7a7a`, parancs 12 px nagybetű `#4f97c4`, ×, enyhe árnyék | superhuman: „Split Inbox turned on: Pitches · SPLIT INBOX SETTINGS” | visszaigazolás művelettel | visszavonásra; a HUD is ez a sáv |
| Felületi betű | rendszerbetű (Windows: Segoe UI) | – | – | a Superhuman betűje a képről nem azonosítható |
| Modulindítók | 16 px vonalas ikonok `#9a9ca0` egy sorban a panel alján, balra „1. ablak ▾” | superhuman: jobb alsó ikonsor és „Add to Team” | eszközök | az ablakválasztó a szöveges helyre került |
| Favicon | 14 px a pötty után | (saját döntés) | – | a Superhuman soraiban nincs kép; a tabot a böngészőben is a faviconról ismered fel |
| Találat a sorban | a szürke rész a találat környezete, a talált szó 600 `#2f3033` | superhuman: a tárgy sötét, a részlet szürke | részlet | új kiemelőszín helyett a sötét szöveg; 340 px alatt az idő kimarad, hogy a környezet látsszon |
| HUD | ugyanaz az értesítéssáv a videó bal felső sarkában: „Hangerő: 70% · NÉMÍTÁS”, „12:09 / 41:10 · +5 mp · VISSZAVONÁS” | superhuman: értesítés | visszaigazolás paranccsal | a bal alsó sarokban a felirattal ütközött, ezért felül |

### Reference lock
- Elsődleges: Superhuman Mail (split inbox lista).
- Megőrzendő: fülek felül a szétválogatott csoportokkal; egysoros, sűrű sorok halvány szürke részlettel; nagybetűs kis
  idő jobbra; időelválasztók; kék pötty csak az „még nem nézted meg” jelzésre; rámutatásra megjelenő sorműveletek;
  egysoros értesítés paranccsal.
- Csak átvett: a Notion Mail kijelölt sorai és „kijelölve” sávja.
- Szerepszabályok: a kék pötty csak olvasatlan; a lila csík csak a kurzor alatti sor; a csoportszín csak címkén és
  fülpöttyön; az értesítés kék csíkja csak visszaigazolás.
- Elutasítva: összecsukható fejlécek, kártyák, gombcsempék, sötét alap.

### Tokenek
```css
--b-bg:#ffffff; --b-text:#3a3c40; --b-strong:#2f3033; --b-muted:#9a9ca0; --b-faint:#a9abaf; --b-time:#a6a6a6;
--b-sep:#b0b0b0; --b-unread:#5aa0cf; --b-cursor-bg:#eef3f9; --b-cursor-bar:#c4c8ea; --b-selected:#dfeaf7;
--b-toast-bar:#7fb6d8; --b-toast-link:#4f97c4; --b-toast-text:#7a7a7a; --b-toast-shadow:0 2px 10px rgba(0,0,0,.12);
--b-font:"Segoe UI",system-ui,sans-serif; --b-split:300 16px/1 var(--b-font); --b-row:500 13px/34px var(--b-font);
--b-time-font:500 11px/1 var(--b-font) /* nagybetű, 0.04em */;
```

## C irány: Programa (összehasonlító lap)
### Szerkezet
Felül morzsamenü: „1. ablak / Porszívó ▾” (a Programa „Projects / … / Untitled schedule ▾”), jobbra „⋯”. Alatta
szürke alapú szegmentált váltó: „Lista | Mezők”, jobbra szöveges ikongombok: „Keresés”, „Szűrő”, „Rendezés”. A tabok
szakaszokban (a Chrome-csoportok), keretes sorokban; a sorban a cím félkövéren, alatta a domain kis nagybetűs
címkével, mellette mezőértékek fölül, kis nagybetűs címke alattuk („54 990 Ft / ÁR”, „2 órája / UTOLJÁRA”). A
„Rendezés” felugró: „Rendezés:” lenyíló (Ár, Cím, Domain, Utolsó használat), ↓/↑, ×, és „Csoporton belül”
jelölőnégyzet (a Programa „Sort within sections”). Ha van rendezés, megjelenik a fekete fő gomb: „Sorrend a
böngészőben is”. Kereséskor a találatok az ok szerint csoportosítva: „Cím” és „Szöveg” (Coda keresés). A
modulindítók szöveges ikongombok a panel alján. Spec-eltérés (javaslat): gyorsgombsor helyett alsó eszközsor;
„Lista / Mezők” nézetváltó; a rendezés a böngészőre alkalmazása fő gombként.

### Vonások forrásai (Kapuk 2.)
| Vonás | Érték | Forráskép és hely | Szerepe a forrásban | Eltérés és oka |
| --- | --- | --- | --- | --- |
| Alap | `#ffffff`, a panel alja `#f8f8f8` | programa: tartalom és oldalsáv (mért `#ffffff`, `#f8f8f8`) | munkalap, eszközök | az oldalsáv színe az alsó eszközsoré |
| Sor | 1 px `#e8e8e8` keret, 4 px sarok, 8 px köz | programa: termék sorok kerete | egy tétel | – |
| Mezőérték | 13 px `#2b2b2b` | programa: „1500”, „natural” | érték | – |
| Mezőcímke | 9 px nagybetű, 0,06 em, `#a8a8a8`, az érték alatt | programa: „WIDTH (MM)”, „BRAND” (mért `#c0c1c2` élsimítva) | mi az érték | sötétebb, olvashatóságért |
| Cím | 13 px 600 `#1a1a1a` | programa: „Latex Mattress” (mért `#505252` élsimítva) | tétel neve | – |
| Morzsamenü | 13 px `#8a8a8a`, utolsó tag 600 `#1a1a1a` és ▾ | programa: „Projects / … / Untitled schedule ▾” | hol vagy | ablak / csoport |
| Szegmentált váltó | háttér `#f0f0f0`, aktív fehér 1 px kerettel, 12 px | programa: „Summary / Financial / Approvals” (mért) | nézetváltás | „Lista / Mezők” |
| Szöveges ikongombok | 12 px `#6b6b6b`, előtte 14 px vonalas ikon | programa: „Search · Filter · Sort” | lap műveletei | – |
| Fő gomb | `#161616` háttér, fehér 12 px 600, 6 px sarok | programa: „Share” (mért `#181818`) | a lap fő művelete | „Sorrend a böngészőben is”, csak ha van rendezés |
| Másodlagos gomb | `#f2f2f2` háttér, `#2b2b2b` szöveg | programa: „Bulk Quotes”, „Details” | mellékművelet | – |
| Rendezés felugró | fehér, árnyék, „Rendezés:” címke, lenyíló, ↓/↑, ×, „Csoporton belül” jelölő | programa: „Sort by · Price · ↓↑ · × · Sort within sections” | rendezés | magyarul, a TS5 szerint |
| Állapotcímke | 11 px, üres kör + szöveg + ▾, 1 px keret, 4 px sarok | programa: „◯ Quoting ▾” | tétel állapota | „Altatva”, „Hangot ad”, a felirat munka állapota |
| Találat ok szerint | szakaszcím 12 px 600, alatta tételek | coda-kereses: „Pages / Text / Docs” | találatok csoportja | részlet a Codából |
| Felületi betű | rendszerbetű (Windows: Segoe UI) | – | – | a Programa betűje a képről nem azonosítható |
| HUD | fehér sáv 1 px kerettel, 4 px sarok; csak a változott mező (ugrásnál az idő és a sebesség): érték 14 px 600, nagybetűs címke 9 px alatta | programa: mezősor | értékek | a videó bal felső sarkában (lent a felirat van); felirat közben az állapotcímke alatt |
| Találat kiemelése | háttér `#f6e3d1` | coda-kereses: „Tasks” kiemelése a listában (mért `#f3e1d3`–`#f6e6d7`) | keresési találat | csak keresési találatra, a Coda-részlettel együtt |
| Felugró | fehér, 1 px `#e8e8e8` keret, 6 px sarok, enyhe árnyék | programa: „Sort by” felugró | rendezés | szűrőhöz is („Ár ≤ 20 000 Ft”, a spec példája) |
| Folyamat az állapotcímkén | a kör kitöltése a százalék szerint | (saját döntés a Programa „◯ Quoting” körére) | állapot | felirat és összefoglaló készülése |

### Reference lock
- Elsődleges: Programa (termék-ütemterv).
- Megőrzendő: keretes, 4 px-es sorok; érték fölül, kis nagybetűs címke alatta; morzsamenü; szürke szegmentált váltó;
  szöveges ikongombok; egyetlen fekete fő gomb; rendezés felugró „szakaszon belül” kapcsolóval.
- Csak átvett: a Coda ok szerint csoportosított találatai.
- Szerepszabályok: fekete csak a fő művelet; a sárga (Programa „Upgrade”) nem kerül be; a csoportszín csak a
  szakaszcím pöttye.
- Elutasítva: termékfotók (a taboknak nincs képe), kártyarács, sötét alap.

### Tokenek
```css
--c-bg:#ffffff; --c-tools:#f8f8f8; --c-border:#e8e8e8; --c-text:#1a1a1a; --c-value:#2b2b2b; --c-label:#a8a8a8;
--c-crumb:#8a8a8a; --c-seg:#f0f0f0; --c-btn2:#f2f2f2; --c-primary:#161616; --c-icon:#6b6b6b; --c-hit:#f6e3d1;
--c-pop-shadow:0 6px 20px rgba(0,0,0,.08);
--c-font:"Segoe UI",system-ui,sans-serif; --c-title:600 13px/1.3 var(--c-font); --c-value-font:400 13px/1.2 var(--c-font);
--c-label-font:600 9px/1.2 var(--c-font) /* nagybetű, 0.06em */; --c-radius:4px; --c-radius-btn:6px;
```

## Sötét mód (mindhárom irány)
A TS10 a rendszer szerinti sötét módot kéri. Egyik alap sötét képét sem néztem meg, ezért a prototípusok világosak;
a választott irány sötét tokenjei a döntés után, az alap sötét képeiből készülnek, az „elfogadva” előtt.

## Sablonellenőrzés
Az `anti-ai-slop.md` és a skill sorai szerint, a bejárás képein ellenőrizve, irányonként. Mindhárom: fehér alap, világos
mód (a TS10 sötét módja a döntés után), nincs indigó, színátmenet, üvegpanel, emoji (a megépült `TabList.tsx` 🔊 💤
jelei helyett szöveg vagy vonalas ikon), betűs ál-favicon, gyorsgomb-csempe; a szöveg a spec és a munkafolyamat
szavaival (Altatva, Hangot ad, Felirat, Átírás, Megszakítás, Szűrő törlése).

### A · Olvasási sor
| Sor | Eredmény |
| --- | --- |
| Külső | van: talpas betű az összefoglaló szövegén; indok: az alap képén (matter-atirat-kesz) az átirat talpas, ugyanabban a szerepben (hosszú olvasott szöveg), a háttér fehér, nem krém, a felület rendszerbetűs. A halványsárga csak keresési találat (matter-kereses). |
| Szerkezet | van: keskeny ikonoszlop + lista, ami az „oldalsáv + tartalom” héjra hasonlít; indok: az alap képe (matter-atirat-kesz bal oszlopa) és a 2. szempont (Karesz: „az extension felületen nem lehet őket fixen elrendezni”): az indítók fix helyen, húzással átrendezhetők, és nem vesznek el sort a taboktól. Egy fő művelet van (keresés). |
| Tartalom és szöveg | nincs: Karesz világából vett, változó hosszúságú tabok (26, két ablakban); üres találatnál a következő lépés (keresés a weben, részleges egyezés: „dyson” → Dyson V8). |
| Mozgás | van: az „Claude még írja” csík csúszik; indok: állapotváltás jelzése, a Matter „Generating transcript…” csíkja mintájára. Más mozgás nincs. |
| Folyamat (csereteszt) | nincs: a vázat a Matter képei indokolják; a tabokra jellemző rész a csoportszakasz Chrome-színnel, az altatás és a hang állapota, az ablak, és a HUD a videón. |

### B · Szétválogatás
| Sor | Eredmény |
| --- | --- |
| Külső | van: levendula (lilás) kurzorcsík `#c4c8ea`; indok: az alap képén (superhuman-split-inbox) ugyanez jelöli a kurzor alatti sort, ugyanabban a szerepben, halvány, nem kiemelőszín. Az értesítés bal csíkja a visszaigazolást jelöli (ugyanaz a forrás). A csoportcímkék a Chrome csoportszínei (kötöttség). |
| Szerkezet | van: a fülek egyenrangúak; indok: az alap képe (split inbox) és a munka (a csoportok közti váltás egy kattintás); a fő művelet a sor kiválasztása billentyűvel (J/K, Enter, H, E). |
| Tartalom és szöveg | nincs: lásd A; az értesítések a műveletet nevezik meg („Altatva: …”, „VISSZAVONÁS”). |
| Mozgás | nincs: az értesítés 5 mp után átmenet nélkül tűnik el. |
| Folyamat (csereteszt) | nincs: a vázat a Superhuman képe indokolja; a tabokra jellemző rész a „háttérben nyílt, még nem nézted meg” pötty (ATD9), az altatás- és hangjel, az ablakválasztó. |

### C · Összehasonlító lap
| Sor | Eredmény |
| --- | --- |
| Külső | van: minden tab keretes, 4 px-es sorban („kártya mindenhol”); indok: az alap képén (programa-rendezes-ar) a termékek így állnak, és a sor kattintható tétel mezőkkel. Egyetlen fekete gomb, csak rendezésnél („Sorrend a böngészőben is”, a Programa „Share” szerepében). |
| Szerkezet | van: „Lista / Mezők” váltó + Keresés, Szűrő, Rendezés egyenrangú gombok; indok: az alap képe ugyanígy; a fő művelet egyetlen fekete gomb, és csak akkor jelenik meg, ha van rendezés (TS5, Karesz: „ha a kijelölt tabokat ténylegesen is rendezni lehetne”). |
| Tartalom és szöveg | nincs: lásd A; az ár mező a spec példája szerint („ár ≤ 20 000”), üres szűrőnél a legolcsóbb tab és egy kattintásos javítás („Ár ≤ 54 990 Ft”). |
| Mozgás | nincs. |
| Folyamat (csereteszt) | van, kérdésként: a videó HUD-ja (érték fölött kis nagybetűs címke) rokona az 1. kör elvetett „címke–érték” HUD-jának; különbség: egy-két mező, nagy szám, sáv és lépésjelző nélkül, a bal felső sarokban, a Programa mezősorának formájában. A döntésnél érdemes megnézni. |

## Bejárás
Playwright, Chromium, Linuxon: a képeken a Segoe UI helyett tartalék betű áll (Windows-on a Segoe UI jelenik meg, kicsit
keskenyebb). Két méret: asztali ablak 1440×900 (400 px-es oldalpanel) és a legkisebb támogatott 1024×720 (320 px-es
panel, a Chrome legkisebb oldalpanel-szélessége körül). Állapotok: Lista; Keresés („légcsatorna”: két találat a címben,
egy a szövegben, két ablakból); Nincs találat („dyson v15”); Összefoglaló (a válasz még érkezik); Videó (görgetés a bal
félen, hangerő 70%); Felirat (átírás 42%, közben ugrás +5 mp a jobb félen). A C-nél kettő plusz: rendezés felugró
(ár szerint, csoporton belül) és üres szűrő („Ár ≤ 20 000 Ft”). Interakció ellenőrizve (Playwright): élő keresés,
találatra kattintva a tab aktív lesz, és az oldal a talált szónál nyílik; görgő a videón; B: J, H, Visszavonás, fül
váltás, `/`; C: rendezés irányváltása, „Sorrend a böngészőben is”, Mezők nézet, „Ár ≤” szűrő. Konzolhiba nem volt.

| Állapot | A (`prototipus/kor-2/a-olvasasi-sor/`) | B (`…/b-szetvalogatas/`) | C (`…/c-osszehasonlito/`) |
| --- | --- | --- | --- |
| Lista | `lista-1440.png`, `lista-1024.png` | `lista-1440.png`, `lista-1024.png` | `lista-1440.png`, `lista-1024.png` |
| Keresés | `kereses-1440.png`, `kereses-1024.png` | `kereses-1440.png`, `kereses-1024.png` | `kereses-1440.png`, `kereses-1024.png` |
| Nincs találat | `ures-1440.png`, `ures-1024.png` | `ures-1440.png`, `ures-1024.png` | `ures-1440.png`, `ures-1024.png` |
| Összefoglaló | `osszefoglalo-1440.png`, `osszefoglalo-1024.png` | `osszefoglalo-1440.png`, `osszefoglalo-1024.png` | `osszefoglalo-1440.png`, `osszefoglalo-1024.png` |
| Videó (HUD) | `video-1440.png`, `video-1024.png` | `video-1440.png`, `video-1024.png` | `video-1440.png`, `video-1024.png` |
| Felirat | `felirat-1440.png`, `felirat-1024.png` | `felirat-1440.png`, `felirat-1024.png` | `felirat-1440.png`, `felirat-1024.png` |
| Rendezés, üres szűrő | – | – | `lista-rendez-1440.png`, `lista-rendez-1024.png`, `lista-szuro-1440.png`, `lista-szuro-1024.png` |

Mit javítottam a visszanézés után:
- A: 320 px-en a szövegrészlet a talált szó előtt elvágódott → rövidebb környezet, a cím kereséskor két soros, a meta
  sorában elöl az ok („a címben”, „a szövegben”). A felirat munkajelzője világos videóképen olvashatatlan volt, majd
  1024-en a felirattal ütközött → sötét HUD-doboz a bal felső sarokban. Az idő HUD a lejátszó saját sávjára került
  volna → a jobb szélen, ahol görgetsz.
- B: 320 px-en a keresési sorban nem látszott a találat → a szürke rész a találat környezete, az idő kimarad; a domain
  1–2 betűre vágódott → 340 px alatt elrejtve. A HUD-értesítés a bal alsó sarokban a felirattal ütközött → bal felül.
- Mindhárom: a favicon nélküli tab üres négyzete jelölőnégyzetnek látszott (B-ben ez félrevezető, mert ott van
  többes kijelölés) → a Chrome alap földgömbje.
- C: a mezősáv 1024-en a felirattal ütközött → bal felül, a feliratjelző alatt; 400 px-en az alsó eszközsor levágta
  az ötödik indítót → ott ikon nélkül, felirattal, a Beállítások a „⋯” menübe került; nyitott felugrónál az első
  kattintás elveszett → javítva.

## Prototípus
Mappák: `prototipus/kor-2/a-olvasasi-sor/`, `prototipus/kor-2/b-szetvalogatas/`, `prototipus/kor-2/c-osszehasonlito/`
(közös: `keret.css`, `keret.js`, `adat.js`, `ikonok.js` simple-icons márkajelekkel, `vonalas-ikonok.js` Lucide
ikonokkal). Helyben: a mappa `index.html`-je böngészőben, fent a „Prototípus” sorban az állapotok. A keret (böngészőablak,
a Chrome oldalpanel szürke fejléce, az oldal, a videókép) nem része az iránynak.
Közzétéve (áttekintő oldal, rajta a három prototípus): https://claude.ai/artifact/SXrwPU4XAdfMvBMW6us1qo

## Elvetett
Az 1. kör elvetett vonásai: `vizualis-irany-elvetve-1.md` „Elvetett” szakasza.

## Ellenőrzőlista az 5. lépéshez
(a döntés után)

## Változásnapló
- 2026-11-07: 2. kör, tiszta lappal a frissített `dizajnkutatas` skill szerint. Az 1. kör fájlja nem volt a repóban,
  a képeiből és a koordinátor összefoglalójából megírtam a `vizualis-irany-elvetve-1.md`-t. Függő választás nincs
  (téma, elrendezés, ajánlott irány): az 1. körnek nem volt elfogadott iránya.
- 2026-11-07: tömörítés után újraolvastam a `dizajnkutatas` skillt, az `anti-ai-slop.md`-t, ezt a fájlt és az 1. kör
  elvetett listáját, és újranyitottam az alapok képeit (matter-kereses, matter-atirat-kesz, matter-atirat-folyamatban,
  superhuman-split-inbox, programa-rendezes-ar, prime-video-hangero, coda-kereses). Függő választás továbbra sincs.
- 2026-11-07: a három prototípus elkészült, bejárva két méreten; a bejárás után változott vonások (HUD-helyek, B
  találatsor, C kiemelés a Codából, földgömb a hiányzó favicon helyén) a táblákba és a tokenekbe is bekerültek.

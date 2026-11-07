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

Kötött (Karesz, 2026-11-07, a 2. kör első bemutatása után): „az a baj, hogy ez így nagyon nehéz, mert funkcionálisan
is teljesen más mind a három, nem csak az a kérdés, hogy hogyan nézzen ki, mert most a kinézettel funkciót is
választok”. Ezért a funkciót a spec adja, és mindhárom irányban ugyanaz (Közös funkciókészlet); az irányok csak abban
térnek el, mi hol van a panelen, és hogyan néz ki. Ami megbukott: a szerkezet, mert az alap termékből a funkcióit is
áthozta (B: egyszerre egy csoport, időrend, visszavonás, billentyűs rendrakás; C: táblázat nézet, külön „Sorrend a
böngészőben is” lépés), és mindhárom irány a spec funkcióinak csak egy részét mutatta (a böngészőbeli rendezés csak a
C-ben, a többes kijelölés csak a B-ben, a csoportok összecsukása csak az A-ban). Az alapok, a vonások és a kinézet
nem kaptak kifogást, ezek maradtak; a nyitott döntési kérdés lezárult („Egyik sem, vagy változtatással”).

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
`mobbin.com` letöltést a hálózat tiltja; a vonásokat ezekről olvastam, a színeket pixelmintával. A funkció és a kinézet
szétválasztásához nem kellett új lekérdezés: az új részleteket a már mentett képekről olvastam ki.

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
| Superhuman Mail | `refs/superhuman-split-inbox.jpg` ([Mobbin](https://mobbin.com/screens/671cbc3b-478c-4b84-96da-f5e31f328352)) | alap termék: B irány | sok elem gyors szétválogatása: csoportok fülként felül, egysoros sorok, soron belüli műveletek, értesítés paranccsal (K1, rend) |
| Programa | `refs/programa-rendezes-ar.jpg` ([Mobbin](https://mobbin.com/screens/f26ad582-4e04-4df5-980a-e47d0e863486)) | alap termék: C irány | termékek összehasonlítása mezőkkel, ár szerinti rendezés szakaszon belül (TC4, TS5) |
| Prime Video | `refs/prime-video-hangero.jpg` ([Mobbin](https://mobbin.com/screens/97c1d205-499f-4982-ac01-51862117089f)) | részlet: A irány HUD | függőleges, keskeny hangerőcsúszka a videón (K2) |
| Notion Mail | `refs/notion-mail-kijeloles.jpg` ([Mobbin](https://mobbin.com/screens/d6e0ee95-105c-47cc-8375-a4c3caf0389d)) | részlet: B irány | kijelölt sorok halványkék háttere és jelölőnégyzete, „2 selected” sáv (TS5); a címkeválasztó lenyíló formája a menükhöz |
| Coda | `refs/coda-kereses.jpg` ([Mobbin](https://mobbin.com/screens/9d2e6129-e275-4386-8da0-d4b4fe0bd89d)) | részlet: C irány | találatok csoportosítva az ok szerint (Pages / Text), és a találat kiemelése (K1) |
| Fireflies | `refs/fireflies-kereses.jpg` ([Mobbin](https://mobbin.com/screens/1be334c3-ea77-49a2-b7d3-18fbbf9f11b9)) | elvetve | az idézett részletek jók, de a Matter ugyanezt a weboldalakra mutatja; a lila kiemelőszín sablontünet |
| The Leap | `refs/the-leap-felirat.jpg` ([Mobbin](https://mobbin.com/screens/d86f77bd-1812-4d7d-a7e7-cfe172b2c63a)) | elvetve | szavanként kiemelt felirat; Karesz kérése a sima felirat, és a zöldessárga más szerepű, mint bármelyik alapnál |
| Substack, The New York Times, mymind, Hashnode | `refs/substack-mentett.jpg`, `refs/nyt-olvasasi-lista.jpg`, `refs/mymind.jpg`, `refs/hashnode-konyvjelzok.jpg` | elvetve | mentett cikkek nagy képpel vagy kártyával; a tabokhoz nincs kép, a kártya csak helyet vesz el |
| Midday | `refs/midday-termekek.jpg` ([Mobbin](https://mobbin.com/screens/667e0990-d6d7-40d3-af9e-8c8ae8e744d2)) | elvetve | termékár-táblázat, de a szakaszon belüli rendezést a Programa mutatja |

A terület saját termékei (tabkezelők, böngészők) nincsenek a könyvtárakban; mindhárom alap másik terület terméke,
amelyben ugyanez a munka folyik, és a szerkezetéért vettem: olvasási sor (Matter), sok beérkező elem szétválogatása
(Superhuman Mail), termékek összehasonlítása mezőkkel (Programa).

## Közös funkciókészlet
Forrás: SPEC.md v1. Mindhárom prototípus ugyanazt tudja: a működést, a menük tételeit és a felület szövegeit egy közös
modul adja (`prototipus/kor-2/mukodes.js`), az irány csak rajzol (`draw`, `menuHTML`, `hudHTML`). A videón a generált
felirat és a lejátszó saját sávja a keret része, mindháromban ugyanaz. Ellenőrzés: ugyanaz a 35 lépéses interakciós
teszt mindhárom irányon, mindkét méreten (Bejárás).

| Funkció (a felület szavaival) | Spec | A · Olvasási sor | B · Szétválogatás | C · Összehasonlító lap |
| --- | --- | --- | --- | --- |
| Az ablak tabjai, kapcsolóval minden ablak | TS1, TS4 | meta sor: „Ez az ablak ▾” | alsó sor: „Ez az ablak ▾” | morzsamenü: „Ez az ablak ▾” |
| Tabsor: favicon, cím, domain, állapotjelek (Hangot ad, Altatva, Ne altasd, Rögzítve); az altatott halvány | TS1, ATD7 | két sor, az állapot szöveggel jobbra | egy sor, az állapot ikonnal | keretes sor mezőkkel, az állapot címkében |
| Csoportok: összecsukható fejléc, darabszám, csoportszín | TS1 | kis nagybetűs szakaszcím, nyíl a végén | elválasztó formájú fejléc nyíllal (a „Mind” fülön) | szakaszcím, előtte nyíl |
| Keresés: cím, URL, tartalom; látszó ok és kiemelt részlet; Enter az első találatra | TS4, TC3 | a keresősor mindig nyitva; az ok a meta elején, a részlet alatta | ikon vagy `/`: a felső sor keresősorrá válik; az ok jobbra, a részlet a találattól | „Keresés” gomb vagy `/`: mező az eszközsorban; a találatok az ok szerint csoportosítva |
| Találatra kattintás: a tab aktív, az oldal a talált szövegnél nyílik; az altatott tab felébred | TC3 | ugyanúgy | ugyanúgy | ugyanúgy |
| Más ablak találatai: „A 2. ablakban még 2 találat · Mutasd” | TS1, TS4 | a lista végén | a lista végén | a lista végén |
| Nincs találat: hol keresett, és a következő lépés („Keresés törlése” vagy „Szűrők törlése”) | TS4 | cím, szöveg, szöveges parancs | szürke szöveg, parancs | cím, szöveg, másodlagos gomb |
| Szűrő: Csak cím / Tartalomban is, Csak altatott, Csak hangot játszó, Ablak, Csoport, Ár ≤ (mező), Szűrők törlése; a bekapcsoltak egyenként kikapcsolhatók | TS4, TC3 | „Szűrő” a meta sorban; „Szűrve:” sor | ikon a felső sorban, számmal; „Szűrve:” sor | „Szűrő” az eszközsorban, számmal; a bekapcsoltak másodlagos gombként |
| Csoport választása | TS4 | a Szűrőben | a Szűrőben, és fülként felül | a Szűrőben, és a morzsamenüben |
| Többes kijelölés (Ctrl, Shift) | TS5 | pipa a favicon helyén; „N kijelölve · Rendezés · Mégse” a meta sor helyén | jelölőnégyzet, halványkék sor; „N kijelölve · Rendezés · ×” a felső sor helyén | jelölőnégyzet; alul „N kijelölve · Mégse · Rendezés” |
| Rendezés: Cím, Domain, Utolsó használat, Ár (mező); csoporton belül, a böngészőben is | TS5, TC4 | „Rendezés” a meta sorban | ikon a felső sorban | „Rendezés” az eszközsorban és a kijelölési sávban |
| Sor helyi menüje: Altatás vagy Ébresztés, Ezt a tabot ne altasd, Az oldal összes tabja egy csoportba; a videós tabon Átirat | TS2, ATD2, ATD5 | jobb klikk, vagy „⋯” rámutatásra | jobb klikk, vagy „⋯” rámutatásra; mellette altatás vagy ébresztés ikonja | jobb klikk, vagy „···” a sor végén |
| Altatás: ezt a tabot, az ablak többi tabját, minden inaktívat; ébresztés: következő, előző, az ablak összes | ATD2 | az indítók Altatás gombja | ugyanígy | ugyanígy |
| Két sűrűség (kompakt, kényelmes), Beállítások | TS10 | „⋯” az ikonoszlop alján | fogaskerék az alsó sorban | „⋯” a morzsamenü végén |
| Modulindítók: összefoglaló, képernyőkép, elemkijelölő, felirat, altatás; húzással átrendezhetők | gyorsgombsor | ikonoszlop balra | ikonsor alul | eszközsor alul, ikonnal és felirattal |
| URL ráhúzása a panelre új tabot nyit | TS11 | ugyanúgy | ugyanúgy | ugyanúgy |
| Összefoglaló: forrás a fejlécben, a válasz folyamatosan érkezik, Leállítás, utókérdés, mentett prompt | CS4, CS5 | olvasónézet; „Claude írja… Leállítás” a szöveg alatt; lent prompt és mező (Enter) | teljes panel; „Claude írja… LEÁLLÍTÁS” értesítés; lent promptok és mező (Enter) | lap mezősorral és állapotcímkével, Leállítás gomb; lent prompt, mező, „Küldés” |
| Felirat állapota: Letöltés, Átírás, Kész, százalékkal; megszakítás; az ikon jelvényén is | SG6 | csík és sor a videós tab alatt; csík a Felirat indítón | értesítés alul (Átirat, Megszakítás); a sor idejének helyén „felirat 42%” | állapotcímke körrel a soron; „Felirat 42%” az eszközsorban |
| Átirat: időbélyeg, kattintásra ugrik; mentés .srt és .vtt (a felirat elkészülte után) | SG4, SG5 | olvasónézet | teljes panel | lap, táblázat |
| HUD: hangerő; idő, hossz, lépés, sebesség; lejátszás vagy szünet; a felirat állapota Megszakítással, vagy „Nincs felirat · Felirat” | VD2, VD7, SG6 | ahol görgetsz: balra csúszka, jobbra idődoboz; a felirat bal felül | értesítéssávok bal felül | mezősáv bal felül, fölötte állapotcímke |

Nincs a prototípusban, mindháromban ugyanúgy: csoportosítási szabályok (TS2), munkamenetek (TS3), sötét mód és
kiemelő szín (TS10, a döntés után), a beállítások (ATD1, ATD5 kivétellista, CS5 promptok szerkesztése), a
képernyőkép és az elemkijelölő működése (az indító csak jelzi), további videóakciók és saját lejátszó (VD3–VD6, VD8),
a felirat beállításai (SG4).

Kivett többletfunkciók (a 2. kör első változatából; nem kéri a spec): visszavonás a műveletek után (B, C);
billentyűs rendrakás J/K, H, E és parancslista (B); „háttérben nyílt, még nem nézted meg” pötty (B; az ATD9 az ilyen
tab altatásáról szól, jelölést nem kér); időrendi lista és egyszerre egy csoport (B); bezárás a panelből (B);
„Lista / Mezők” táblázat nézet (C); külön „Sorrend a böngészőben is” lépés, rendezési irány és „Csoporton belül”
kapcsoló (C; a spec szerint a rendezés mindig csoporton belül és a böngészőben is); „Keresés a weben” és „Részben
egyezik” javaslat üres találatnál (mindhárom); némítás a HUD-on (B). Ha valamelyik kell, mindháromba bekerül.

## Összevetés (szempontok és szerkezeti eltérések)
A funkció mindhárom irányban ugyanaz; a tábla azt mutatja, mi hol van, és hogyan néz ki.

| | A · Olvasási sor (Matter) | B · Szétválogatás (Superhuman Mail) | C · Összehasonlító lap (Programa) |
| --- | --- | --- | --- |
| A lista fölött mindig | keresősor; meta sor: ablak, darabszám, Szűrő, Rendezés | a csoportok fülként; keresés, Szűrő, Rendezés ikonja | morzsamenü (ablak / csoport); eszközsor: darabszám, Keresés, Szűrő, Rendezés |
| Keresés | mindig nyitott mező | ikon vagy `/`, a felső sor helyén | gomb vagy `/`, mező az eszközsorban |
| Egy tab (kényelmes / kompakt) | két sor: cím; domain, ár, idő, az állapot jobbra / egy sor | egy sor, az idő jobbra / alacsonyabb sor | keretes sor mezőkkel és címkékkel / címkék nélkül |
| Ennyi tab fér ki, 1440×900, 400 px-es panel (kényelmes / kompakt) | 10 / 18 | 16 / 20 | 7 / 10 |
| Ennyi tab fér ki, 1024×720, 320 px-es panel | 7 / 13 | 12 / 15 | 4 / 7 |
| A találat oka | szóval a meta elején („a szövegben”), a részlet a harmadik sorban | röviden jobbra („szöveg”), a szürke részlet a talált szótól | szakaszcím (Cím, Szöveg, URL), a részlet a sorban |
| Kijelölés és Rendezés | a meta sor helyén | a felső sor helyén | alsó sáv, fekete fő gombbal |
| Altatás egy tabon | helyi menü (⋯, jobb klikk) | rámutatásra a hold vagy a nap ikonja a soron, és helyi menü | „···” mindig a sor végén, jobb klikk |
| Modulindítók | ikonoszlop balra | ikonsor alul | eszközsor alul, felirattal |
| Összefoglaló, átirat | olvasónézet talpas olvasóbetűvel | teljes panel, levélnézetként | lap mezősorral; az átirat táblázat |
| Futó felirat a panelben | csík és sor a videós tab alatt; csík a Felirat indítón | értesítéssáv alul; „felirat 42%” a soron | állapotcímke körrel a soron; „Felirat 42%” alul |
| HUD (K2) | ott, ahol görgetsz | bal felül, értesítéssáv | bal felül, mezősáv |
| Spec-eltérés (elrendezés) | gyorsgombok balra; a Szűrő a keresősor alatt; a HUD nem jobb felül | gyorsgombok alul; a keresőmező ikon mögött; csoport fülként is; a HUD bal felül | gyorsgombok alul; a keresőmező gomb mögött; csoport a morzsamenüben is; a HUD bal felül |
| 1. szempont: erősség (bejárás) | a keresés egy gépelés; a találat oka és részlete a legolvashatóbb | a legtöbb tab egy képernyőn; csoportváltás és altatás egy kattintás | minden soron látszik a webhely, az ár és az utolsó használat; az ár szerinti összevetés a legkönnyebb |
| 1. szempont: gyengeség (bejárás) | a két soros tétel miatt kevesebb tab fér ki | a keresés egy kattintással vagy `/`-rel nyílik; 320 px-en a domain kimarad | a keretes sor sok helyet vesz el; 320 px-en 4 tab fér ki |

## A irány: Matter (olvasási sor)
### Szerkezet
A panel egy olvasási sor. A bal szélen keskeny ikonoszlop a modulindítókkal (a Matter olvasónézetének ▷, archív, Aa,
⋯ oszlopa), felirat nélkül, súgóval, húzással átrendezhető; alul „⋯” (sűrűség, beállítások). Felül a keresősor,
mindig nyitva: szegély nélküli mező, alatta hajszálvonal (Matter keresés). Alatta meta sor a Matter „Viktor · July 26”
hangján: „Ez az ablak ▾ · 21 tab”, jobbra „Szűrő” és „Rendezés”; kereséskor alatta a találatok száma és oka. A tabok
két soros tételként (cím; domain · ár · idő, az állapot jobbra szöveggel), a csoportok kis nagybetűs szürke
szakaszcímmel (a Matter „NNGROUP” forráscímkéje), pöttyel, darabszámmal, nyíllal összecsukhatók. Kereséskor a meta
elején az ok („a szövegben”), alatta a szövegrészlet halványsárga kiemeléssel. Kijelöléskor a favicon helyén pipa, a
meta sor helyén „N kijelölve · Rendezés · Mégse”. A helyi menü jobb klikkre vagy a rámutatáskor megjelenő „⋯” gombra
nyílik. Az összefoglaló és az átirat olvasónézet: „← Tabok”, kis nagybetűs forráscímke, félkövér cím, szürke meta,
talpas olvasóbetű; a futó munka 2 px-es csík és egy sor szöveg. Spec-eltérés (javaslat): a „fent modul gyorsgombok
sora” helyett bal oldali ikonoszlop; a „Szűrő” nem a keresőmező mellett, hanem alatta, a meta sorban; a HUD nem a
videó jobb felső sarkában, hanem ott, ahol görgetsz.

### Vonások forrásai (Kapuk 2.)
| Vonás | Érték | Forráskép és hely | Szerepe a forrásban | Eltérés és oka |
| --- | --- | --- | --- | --- |
| Alap | `#ffffff` | matter-kereses: lista háttere (mért) | olvasófelület | – |
| Cím | `#141414`, félkövér (600), 14 px | matter-kereses: tételcímek (mért `#141414`) | tétel címe | 15 → 14 px a keskeny panel miatt; kereséskor két sorig törik |
| Meta | `#6f6f6f`, 12 px: „domain · ár · 2 órája” | matter-kereses: „Viktor · July 26” sor (mért `#787878`, élsimítással halványabb) | forrás, dátum | sötétebbre vettem az olvashatóságért (4,5:1) |
| Jobb oldali állapot | `#9a9a9a`, 12 px, szöveggel: „Altatva”, „Ne altasd”, „Hangot ad” | matter-kereses: „9 min · Unread” (mért `#b3b3b3`) | olvasási idő és állapot | sötétebb, mert állapotot hordoz |
| Keresősor | szegély nélküli 15 px-es mező, előtte nagyító, alatta hajszálvonal; mindig látszik | matter-kereses: „productivity” mező | keresés | – |
| Meta sor (vezérlők) | „Ez az ablak ▾ · 21 tab”, jobbra „Szűrő”, „Rendezés” a meta hangján; bekapcsolva 600 és `#141414`; előttük 13 px-es vonalas ikon, 300 px alatt nélküle | matter-kereses: „Viktor · July 26” sor | forrás, dátum | a lista vezérlői szövegként, hogy ne legyen gombsor; az ikon saját döntés (Lucide) |
| Kiemelés | háttér `#fbf3c6`, szöveg változatlan | matter-kereses: „products” szavak háttere (mért `#fcfad6`–`#fcf8d0`) | csak a keresési találat | a JPEG halványít, kicsit telítettebbre vettem; csak keresési találatra |
| Elválasztó | 1 px `#eeeeee` | matter-kereses: tételek közti vonal | tételek elválasztása | a menü kerete is |
| Forráscímke | 11 px, nagybetű, 0,08 em betűköz, `#808080` | matter-atirat-kesz: „NNGROUP” (mért `#818181`) | a cikk forrása | csoport- és ablakcím, menüfejléc, az olvasónézet forrása; mellé a Chrome csoportszín 6 px-es pöttyként (kötöttség) |
| Csoportcím nyila | 14 px vonalas nyíl `#7f7f7f` a sor végén | (saját döntés) | – | az összecsukás jele (TS1); a Matterben nincs összecsukható szakasz |
| Aktuális tab | háttér `#f4f4f4`, a favicon négyzete fehér | matter-kereses: a bal menü kiválasztott pontja („Search”) | kiválasztás | a menüben a rámutatás is ez |
| Kijelölt tab | pipa a favicon négyzetében | (saját döntés) | – | a Matterben nincs többes kijelölés; a négyzet már ott van, így a sor nem mozdul |
| Altatott tab | cím `#8a8a8a`, jobbra „Altatva” | (saját döntés a meta színéből) | – | ATD7: az altatott halvány |
| Favicon | 16 px a valódi favicon, 28 px-es `#f4f4f4` lekerekített (6 px) négyzetben | matter-kereses: 32 px-es forráslogók | forrás azonosítása | a favicon 16 px-es, nagyítva elmosódna; a prototípusban márkajelek (simple-icons), ahol nincs kéznél, a Chrome alap földgömbje (mindhárom irányban így) |
| Kompakt sűrűség | egy sor: 18 px favicon négyzet nélkül, cím, jobbra a meta | (saját döntés a két soros tételből) | – | TS10 |
| Szöveges parancs | aláhúzott szöveg, 1 px, a szöveg színében | (saját döntés) | – | „Leállítás”, „Mutasd”, „Keresés törlése”, „Megszakítás”: gomb nélkül, a Matter szöveges felületén |
| Menü (Szűrő, Rendezés, helyi menü) | fehér, 1 px `#eeeeee` keret, 6 px sarok, árnyék `0 4px 16px` 8%; fejléc a forráscímke formájában; pipa a bejelölt tételnél; rámutatáskor `#f4f4f4` | elválasztó és kiválasztás: matter-kereses; fejléc: matter-atirat-kesz | – | a felugró forma és az árnyék saját döntés: a Matter képein nincs felugró |
| Ár mező (Szűrő) | szegély nélküli mező, alatta hajszálvonal | matter-kereses: a keresőmező | bevitel | – |
| Olvasónézet címe | 22 px, 800-as vastagság, szűk sorköz (300 px-nél keskenyebb panelen 19 px) | matter-atirat-kesz: „Anatomy of Good Icons” | cikk címe | 26 → 22 px a panel miatt |
| Olvasóbetű | talpas, 15 px / 1,6; Windows-on Sitka Text vagy Georgia | matter-atirat-kesz: az átirat szövege | olvasott szöveg | a betű neve nem azonosítható; csak hosszú olvasott szövegre (összefoglaló, átirat) |
| Felületi betű | rendszerbetű (Windows: Segoe UI) | – | – | a Matter felületi betűje a képről nem azonosítható, ezért rendszerbetű, kimondva |
| Folyamatjelző | 2 px, sín `#cccccc`, kitöltés `#000000`, alatta 12 px szürke szöveg; az összefoglaló futásakor határozatlan (18 px-es szakasz csúszik) | matter-atirat-folyamatban: „Generating transcript…” (mért) | átirat készül | ugyanígy a felirathoz és az összefoglalóhoz |
| Modulindítók | 18 px vonalas ikonok `#7f7f7f`, felirat nélkül, 36 px-enként; alul „⋯”; futó feliratnál 2 px-es csík az ikon alatt | matter-atirat-kesz: bal oldali ▷, archív, Aa, ⋯ oszlop | olvasónézet műveletei | modulindítóként; súgóban a név és a billentyű; a csík a folyamatjelzőé |
| Jelvény az ikonon | fekete alap, fehér szöveg („42%”) | matter-atirat-folyamatban: a csík fekete kitöltése | folyamat | SG6 (kötött: Karesz kérése) |
| HUD hangerő | függőleges csúszka: `#444444` 92%-os, 6 px sarok, 2 px fehér sín, 14 px fehér gomb, fölötte a szám („70%”) | prime-video-hangero: a hangerő-csúszka | hangerő | ott jelenik meg, ahol görgetsz (bal szél), kb. 1 mp-ig; a szám a VD7 miatt (a Prime Videón nincs) |
| HUD idő | a jobb szélen, ugyanabban a sötét dobozban: idő 15 px 600 fehér, alatta „+5 mp · 41:10 · 1,5×” 11 px, alatta 96 px-es 2 px fehér csík | matter-atirat-folyamatban (csík formája) + prime-video (doboz, fehér a sötéten) | állapotcsík | a videó alján a lejátszó saját sávja és a felirat van, ezért ott, ahol görgetsz (jobb fél) |
| Felirat munka a videón | sötét doboz (`--a-hud`) a bal felső sarokban: „Felirat készül · Átírás 42% · Megszakítás”, alatta 2 px fehér csík; felirat nélkül „Nincs felirat · Felirat” | matter-atirat-folyamatban („Generating transcript…”) | folyamat | lent a felirat van |

### Reference lock
- Elsődleges: Matter (keresés és átirat).
- Megőrzendő: fehér alap kártyák nélkül, hajszálvonallal; két soros tétel (félkövér cím, szürke meta, jobbra állapot);
  a vezérlők szövegként a meta hangján; halványsárga kiemelés csak a keresési találaton; kis nagybetűs forráscímke;
  2 px-es fekete csík és egy sor szöveg a folyamatra; talpas betű csak olvasott szövegre; keskeny ikonoszlop.
- Csak átvett: a Prime Video függőleges hangerőcsúszkája (HUD).
- Szerepszabályok: a sárga csak találat; a fekete csak folyamat (csík, jelvény); a talpas betű csak olvasott szöveg;
  a csoportszín csak a csoport pöttye; a `#f4f4f4` csak kiválasztás (aktuális tab, rámutatott menüpont, favicon
  négyzete).
- Elutasítva: kártyák, színes kiemelőszín a gombokon, nagy csempék, sötét alap, fülek az olvasónézetben.

### Tokenek
```css
--a-bg:#ffffff; --a-text:#141414; --a-meta:#6f6f6f; --a-state:#9a9a9a; --a-line:#eeeeee;
--a-hit:#fbf3c6; --a-selected:#f4f4f4; --a-icon:#7f7f7f; --a-progress-track:#cccccc; --a-progress:#000000;
--a-hud:rgba(68,68,68,.92); --a-label-color:#808080; --a-dim:#8a8a8a;
--a-pop-shadow:0 4px 16px rgba(0,0,0,.08);
--a-font-ui:"Segoe UI",system-ui,sans-serif; --a-font-read:"Sitka Text",Charter,"Bitstream Charter",Georgia,serif;
--a-title:600 14px/1.3 var(--a-font-ui); --a-meta-font:400 12px/1.35 var(--a-font-ui);
--a-label:600 11px/1 var(--a-font-ui) /* nagybetű, 0.08em */; --a-read:400 15px/1.6 var(--a-font-read);
--a-radius-icon:6px; --a-row-pad:10px 14px;
/* jelvény az ikonon (a keret rajzolja): háttér #000000, szöveg #ffffff */
```

## B irány: Superhuman Mail (szétválogatás)
### Szerkezet
Felül a csoportok fülként egymás mellett, könnyű, nagyobb betűvel és darabszámmal (a Superhuman „split inbox”
fülei): „Mind 21 · Siteview 6 · Felirat 4 · Porszívó 4 · Csoport nélkül 7”; a kiválasztott sötét, a többi halvány, a
fül a csoport pöttyével; a fül a TS4 csoportszűrője. Jobbra három ikon: keresés (vagy `/`), Szűrő (a bekapcsolt
szűrők számával), Rendezés; a keresés a felső sor helyén nyílik. A lista egysoros: favicon, cím, ár, szürke domain,
állapotikonok, jobbra az utolsó használat nagybetűs kis szöveggel („14:05”, „TEGNAP”, „NOV. 4.”). A „Mind” fülön a
csoportok fejléce a Superhuman időelválasztóinak formájában, nyíllal összecsukható. Az aktív tab a kurzor alatti sor
formájában (halványkék háttér, a bal szélen levendula csík). Rámutatáskor az idő helyén a sor műveletei: altatás vagy
ébresztés, és „⋯” (helyi menü). Kijelöléskor a favicon helyén jelölőnégyzet, a sor halványkék (Notion Mail), a felső
sor helyén „N kijelölve · Rendezés · ×”. Az értesítések (a felirat állapota, „Claude írja…”, visszajelzés) a bal
alsó sarokban egysoros sávként, paranccsal (Superhuman „Split Inbox turned on … SPLIT INBOX SETTINGS”). Alul az alsó
sor: „Ez az ablak ▾”, a modulindítók apró ikonjai és a fogaskerék (a Superhuman jobb alsó ikonsora), minden nézetben.
Az összefoglaló és az átirat a teljes panelt kapja, „←” vagy Esc visz vissza. Spec-eltérés (javaslat): a gyorsgombsor
fent helyett alul; a keresőmező nem mindig látszik (ikon vagy `/`); a csoport fülként felül is választható; a HUD a
videó bal felső sarkában.

### Vonások forrásai (Kapuk 2.)
| Vonás | Érték | Forráskép és hely | Szerepe a forrásban | Eltérés és oka |
| --- | --- | --- | --- | --- |
| Alap | `#ffffff` | superhuman: lista háttere | lista | – |
| Fülek | 16 px, 300-as vastagság; aktív `#2f3033`, többi `#a9abaf`; darabszám 11 px; előtte a csoportszín 6 px-es pöttye | superhuman: „Important 405+ … Pitches 22” (mért `#7a7a7a` / `#b7b7b7` vékony betűn) | szétválogatott postafiókok | a fül a csoport, „Mind” az összes; az aktív sötétebb, mert a mért érték élsimítás miatt világos; 320 px-en vízszintesen görgethető, a jobb szélén halványul (kötöttség: a panel legkisebb szélessége) |
| Sor | egy sor, 34 px magas (kompakt 28 px), cím 13 px 500 `#3a3c40`, szürke rész 13 px `#9a9ca0` | superhuman: feladó, tárgy, részlet sorai (sorköz ~35 px) | levél | – |
| Ár | 13 px `#9a9ca0` a cím után, nem vágódik | superhuman: a szürke részlet színe | részlet | 320 px-en is látszik (TC4) |
| Idő | 11 px nagybetű, 0,04 em, `#a6a6a6`, jobbra: „14:05”, „TEGNAP”, „NOV. 4.”, „MOST” | superhuman: „AUG 25” | érkezés ideje | utolsó használat; kereséskor az ablak és az ok, felirat közben „FELIRAT 42%” |
| Csoportfejléc | 13 px `#b0b0b0`, fölötte 18 px hely; csoportszín pötty, darabszám, 12 px nyíl | superhuman: „August 22nd”, „Earlier this month” | csoportosítás idő szerint | itt a Chrome-csoport szerint (TS1), összecsukható; a nyíl saját döntés |
| Ablakcím (Minden ablak) | 13 px 500 `#2f3033`, mellette szürke darabszám | (saját döntés a fülek aktív színéből) | – | – |
| Aktív tab | háttér `#eef3f9`, bal szélen 3 px `#c4c8ea` | superhuman: első sor (mért `#f0f4f8`, csík `#ccd0e8`) | kurzor alatti sor | az aktív tab a kurzor; a menüben a rámutatás háttere is |
| Többes kijelölés | háttér `#dfeaf7`, a favicon helyén jelölőnégyzet; felül „4 kijelölve” | notion-mail-kijeloles: kijelölt sorok (mért `#e0ecf8`), jelölőnégyzetek, „2 selected” | kijelölt levelek | részlet a Notion Mailből |
| Soron belüli műveletek | 15 px vonalas ikonok `#9a9ca0` rámutatáskor, az idő helyén: hold (altatás) vagy nap (ébresztés), „⋯” (helyi menü) | superhuman: ✓, óra, archív ikon az első sorban | gyors döntés | altatás, ébresztés, helyi menü |
| Állapotikonok | 13 px vonalas ikonok `#a9abaf` az idő előtt (hang, altatva, ne altasd, rögzítve), súgóval | (saját döntés) | – | TS1 állapotikonok |
| Favicon | 14 px a sor elején | (saját döntés) | – | a Superhuman soraiban nincs kép; a tabot a böngészőben is a faviconról ismered fel |
| Találat a sorban | a szürke rész a talált szótól indul, a szó 600 `#2f3033`; jobbra az ok („cím”, „szöveg”, „URL”) | superhuman: a tárgy sötét, a részlet szürke | részlet | új kiemelőszín helyett a sötét szöveg; 340 px alatt az állapotikonok kimaradnak |
| Értesítés | fehér, 4 px bal csík `#7fb6d8`, 13 px `#7a7a7a`, parancs 12 px nagybetű `#4f97c4`, ×, enyhe árnyék | superhuman: „Split Inbox turned on: Pitches · SPLIT INBOX SETTINGS ×” | visszaigazolás művelettel | a felirat állapota (ÁTIRAT, MEGSZAKÍTÁS), „Claude írja… LEÁLLÍTÁS”, visszajelzés; keskeny panelen a parancsok második sorba törnek |
| Alsó sor | fölötte 1 px `#edeef0`; „Ez az ablak ▾” 12 px `#9a9ca0`, 15 px-es ikonok, fogaskerék | superhuman: jobb alsó ikonsor („Add to Team” és ikonok); a vonal a lista és a jobb panel közti elválasztó (mért `#edeef0`) | eszközök | modulindítók, sűrűség és beállítások, minden nézetben |
| Menü (Szűrő, Rendezés, helyi menü) | fehér, 6 px sarok, árnyék: 1 px gyűrű 6% + `0 6px 14px` 10%; fejléc 12 px `#9a9ca0`; tétel 28 px, pipa a bejelöltnél; rámutatáskor `#eef3f9` | notion-mail-kijeloles: a címkeválasztó („Search for an option… · Select a label · Customer feedback”) | címkeválasztás | rámutatás: a Notion Mail szürkéje helyett a kurzor színe, mert a B-ben az a kurzor alatti elem jele |
| Ár mező (Szűrő) | `#f8f8f6` háttér, 4 px sarok, keret nélkül | notion-mail-kijeloles: a lenyíló keresőmezője (mért `#f8f8f6`) | bevitel | – |
| Összefoglaló, átirat | cím 18 px 400 `#2f3033`, szöveg 13 px / 1,65; az átirat ideje a nagybetűs kis idő formájában | (saját döntés a sor betűiből) | – | a Superhuman levélnézetét nem néztem meg |
| Válaszmező | mentett promptok 12 px szürke szövegként, szegély nélküli mező, Enter | (saját döntés) | – | CS5 |
| Felületi betű | rendszerbetű (Windows: Segoe UI) | – | – | a Superhuman betűje a képről nem azonosítható |
| Jelvény az ikonon | `#7fb6d8` alap, `#2f3033` szöveg | superhuman: az értesítés csíkja | értesítés | SG6 (kötött) |
| HUD | értesítéssávok a videó bal felső sarkában: „Hangerő: 70%”, „12:09 / 41:10 · +5 mp · 1,5×”, „Felirat készül · Átírás 42% · MEGSZAKÍTÁS”, „Nincs felirat · FELIRAT” | superhuman: értesítés | visszaigazolás paranccsal | a bal alsó sarokban a felirattal ütközött, ezért felül |

### Reference lock
- Elsődleges: Superhuman Mail (split inbox lista).
- Megőrzendő: fülek felül a csoportokkal; egysoros, sűrű sorok halvány szürke részlettel; nagybetűs kis idő jobbra;
  csoportfejléc az időelválasztó formájában; rámutatásra megjelenő sorműveletek; egysoros értesítés paranccsal; apró
  ikonsor alul.
- Csak átvett: a Notion Mail kijelölt sorai, jelölőnégyzete és „kijelölve” sávja, és a címkeválasztó lenyíló formája.
- Szerepszabályok: a levendula csík csak az aktív tab; a halványkék `#dfeaf7` csak kijelölés; a kék parancsszín csak
  az értesítés parancsa; a csoportszín csak pötty (fül, fejléc); az értesítés kék csíkja és a jelvény csak értesítés.
- Elutasítva: olvasatlan pötty, időrendi lista, kártyák, gombcsempék, sötét alap.

### Tokenek
```css
--b-bg:#ffffff; --b-text:#3a3c40; --b-strong:#2f3033; --b-muted:#9a9ca0; --b-faint:#a9abaf; --b-time:#a6a6a6;
--b-sep:#b0b0b0; --b-line:#edeef0; --b-cursor-bg:#eef3f9; --b-cursor-bar:#c4c8ea; --b-selected:#dfeaf7;
--b-toast-bar:#7fb6d8; --b-toast-link:#4f97c4; --b-toast-text:#7a7a7a; --b-toast-shadow:0 2px 10px rgba(0,0,0,.12);
--b-pop-shadow:0 0 0 1px rgba(0,0,0,.06), 0 6px 14px rgba(0,0,0,.10); --b-pop-radius:6px; --b-input:#f8f8f6;
--b-font:"Segoe UI",system-ui,sans-serif; --b-split:300 16px/1 var(--b-font); --b-row:500 13px/34px var(--b-font);
--b-time-font:500 11px/1 var(--b-font) /* nagybetű, 0.04em */;
/* jelvény az ikonon (a keret rajzolja): háttér #7fb6d8, szöveg #2f3033 */
```

## C irány: Programa (összehasonlító lap)
### Szerkezet
Felül morzsamenü: „Ez az ablak ▾ / Minden csoport ▾” (a Programa „Projects / … / Untitled schedule ▾”), mindkét tag
lenyíló (ablak, csoport), jobbra „⋯” (sűrűség, beállítások). Alatta az eszközsor: balra a darabszám („21 tab”),
jobbra szöveges ikongombok: „Keresés”, „Szűrő”, „Rendezés” (a Programa „Search · Filter · Sort”); a keresés az
eszközsorban mezővé nyílik, a bekapcsolt szűrők alatta másodlagos gombként (×). A tabok szakaszokban (a
Chrome-csoportok), a szakaszcím előtt nyíl (a Programa oldalsáv „⌄ Mid-century modern bedr…”), keretes sorokban:
favicon, félkövér cím, jobbra „···” (helyi menü), alatta mezőértékek kis nagybetűs címkével („developer.chrome.com /
WEBHELY”, „54 990 Ft / ÁR”, „3 órája / UTOLJÁRA”) és állapotcímkék („● Aktív”, „Altatva”, „Ne altasd”). Kereséskor a
találatok az ok szerint csoportosítva: Cím, Szöveg, URL (Coda keresés). Kijelöléskor a favicon helyén jelölőnégyzet,
alul sáv: „N kijelölve · Mégse · Rendezés”, a Rendezés a lap egyetlen fekete gombja (a Programa „Share” szerepében).
A modulindítók az alsó eszközsorban, ikonnal és felirattal (a Programa oldalsáv „TOOLS” listája). Az összefoglaló és
az átirat lap: „← Tabok / Összefoglaló”, mezősor (Forrás, Oldal, Prompt) és állapotcímke; az átirat táblázat.
Spec-eltérés (javaslat): a gyorsgombsor fent helyett az alsó eszközsor; a keresőmező nem mindig látszik (gomb vagy
`/`); a csoport a morzsamenüben is választható; a HUD a videó bal felső sarkában.

### Vonások forrásai (Kapuk 2.)
| Vonás | Érték | Forráskép és hely | Szerepe a forrásban | Eltérés és oka |
| --- | --- | --- | --- | --- |
| Alap | `#ffffff`, az alsó eszközsor `#f8f8f8` | programa: tartalom és oldalsáv (mért `#ffffff`, `#f8f8f8`) | munkalap, eszközök | az oldalsáv színe az alsó eszközsoré |
| Sor | 1 px `#e8e8e8` keret, 4 px sarok, 8 px köz (kompakt 4 px) | programa: termék sorok kerete | egy tétel | – |
| Cím | 13 px 600 `#1a1a1a` | programa: „Latex Mattress” (mért `#505252` élsimítva) | tétel neve | – |
| Mezőérték | 13 px `#2b2b2b` | programa: „1500”, „natural” | érték | webhely, ár, utoljára; kereséskor az ablak is |
| Mezőcímke | 9 px nagybetű, 0,06 em, `#a8a8a8`, az érték alatt | programa: „WIDTH (MM)”, „BRAND” (mért `#c0c1c2` élsimítva) | mi az érték | sötétebb, olvashatóságért; kompakt sűrűségben elmarad |
| Sor végi „···” | 16 px `#6b6b6b`, mindig látszik | programa: „···” a termék sorok végén | sor műveletei | helyi menü (TS2, ATD2, ATD5) |
| Szakaszcím | 12 px 600, előtte 14 px nyíl `#8a8a8a`, csoportszín pötty, szürke darabszám | programa: oldalsáv „⌄ Mid-century modern bedr…”, „› Demo Project” | kinyitható projekt | Chrome-csoport (TS1), összecsukható |
| Morzsamenü | 13 px `#8a8a8a`, utolsó tag 600 `#1a1a1a`; mindkét tag ▾ lenyíló | programa: „Projects / … / Untitled schedule ▾” | hol vagy | ablak / csoport |
| Szöveges ikongombok | 12 px `#6b6b6b`, előtte 14 px vonalas ikon | programa: „Search · Filter · Sort” | lap műveletei | 360 px alatt felirat nélkül |
| Fő gomb | `#161616` háttér, fehér 12 px 600, 6 px sarok | programa: „Share” (mért `#181818`) | a lap fő művelete | nézetenként egy: kijelöléskor „Rendezés”, utókérdésnél „Küldés” |
| Másodlagos gomb | `#f2f2f2` háttér, `#2b2b2b` szöveg | programa: „Bulk Quotes”, „Details” | mellékművelet | Mégse, Leállítás, Megszakítás, Átirat, Mentés, mentett prompt; a bekapcsolt szűrő is (× kikapcsolja) |
| Állapotcímke | 11 px, kör vagy 12 px vonalas ikon + szöveg, 1 px keret, 4 px sarok; „● Aktív” | programa: „◯ Quoting ▾” | tétel állapota | ▾ nélkül, mert nem lenyíló; Altatva, Ne altasd, Hangot ad, Rögzítve |
| Folyamat az állapotcímkén | a kör kitöltése a százalék szerint | (saját döntés a Programa „◯ Quoting” körére) | állapot | felirat; a jelvény is ez a szín |
| Kijelölt tab | jelölőnégyzet a favicon helyén | programa: „Sort within sections” jelölőnégyzet | kapcsoló | – |
| Kijelölési sáv | felső vonallal: „4 kijelölve”, „Mégse” (másodlagos), „Rendezés” (fő) | (saját döntés a Programa gombjaiból) | – | TS5 |
| Visszajelzés | sáv a lista alján, felső vonallal, 12 px szürke szöveg, × | (saját döntés) | – | a Programa képén nincs értesítés |
| Altatott cím | 400, `#8a8a8a` | (saját döntés a morzsamenü szürkéjéből) | – | ATD7: az altatott halvány |
| Rámutatás | `#f8f8f8` háttér | programa: az oldalsáv alapszíne | másodlagos, semleges felület | a menü tétele és az átirat sora; saját döntés: a Programa képén nincs rámutatás |
| Felugró | fehér, 1 px `#e8e8e8` keret, 6 px sarok, enyhe árnyék; fejléc 12 px 600; jelölő tételnél négyzet, választónál pipa | programa: „Sort by · Price ▾ · Sort within sections” | rendezés | minden menü (Szűrő, Rendezés, ablak, csoport, helyi menü, ⋯) |
| Mező (Ár ≤, utókérdés, keresés) | 1 px `#e8e8e8` keret, 4 px sarok | programa: a „Price ▾” lenyíló doboza | választómező | – |
| Találat ok szerint | szakaszcím (Cím, Szöveg, URL) darabszámmal | coda-kereses: „Pages / Text / Docs” | találatok csoportja | részlet a Codából |
| Találat kiemelése | háttér `#f6e3d1` | coda-kereses: „Tasks” kiemelése a listában (mért `#f3e1d3`–`#f6e6d7`) | keresési találat | csak keresési találatra, a Coda-részlettel együtt |
| Modulindítók | 14 px vonalas ikon és rövid felirat, 12 px `#6b6b6b`, az alsó eszközsorban; futó feliratnál „42%” félkövéren | programa: oldalsáv „TOOLS” (Time Tracking, To-Do List…): ikon és felirat | eszközök | sorban, hogy a lista szélessége megmaradjon; 400 px-en felirat ikon nélkül, 320 px-en ikon felirat nélkül |
| Felületi betű | rendszerbetű (Windows: Segoe UI) | – | – | a Programa betűje a képről nem azonosítható |
| Jelvény az ikonon | `#2b2b2b` alap, fehér szöveg | programa: a mezőérték színe (a folyamatkör is ez) | érték | a százalék is érték; SG6 (kötött) |
| HUD | fehér sáv 1 px kerettel, 4 px sarok; csak a változott mező: „70% / HANGERŐ”; „12:09 / 41:10” „+5 MP” és „1,5× / SEBESSÉG”; fölötte állapotcímke körrel és „Megszakítás” | programa: mezősor | értékek | a videó bal felső sarkában (lent a felirat van) |

### Reference lock
- Elsődleges: Programa (termék-ütemterv).
- Megőrzendő: keretes, 4 px-es sorok; érték fölül, kis nagybetűs címke alatta; morzsamenü lenyílóval; szöveges
  ikongombok; nézetenként egyetlen fekete fő gomb; felugró jelölőnégyzettel; szakaszcím nyíllal.
- Csak átvett: a Coda ok szerint csoportosított találatai és kiemelése.
- Szerepszabályok: fekete csak a nézet fő művelete (kijelöléskor Rendezés, utókérdésnél Küldés); a `#f2f2f2` csak
  másodlagos gomb (a bekapcsolt szűrő is gombként kapcsol ki); a csoportszín csak a szakaszcím és a morzsamenü
  pöttye; a barackszín csak keresési találat; a sárga (Programa „Upgrade”) nem kerül be.
- Elutasítva: termékfotók (a taboknak nincs képe), kártyarács, sötét alap, táblázat nézet, szegmentált váltó.

### Tokenek
```css
--c-bg:#ffffff; --c-tools:#f8f8f8; --c-border:#e8e8e8; --c-text:#1a1a1a; --c-value:#2b2b2b; --c-label:#a8a8a8;
--c-crumb:#8a8a8a; --c-dim:#8a8a8a; --c-btn2:#f2f2f2; --c-primary:#161616; --c-icon:#6b6b6b;
--c-hit:#f6e3d1; --c-hover:#f8f8f8; --c-pop-shadow:0 6px 20px rgba(0,0,0,.08);
--c-font:"Segoe UI",system-ui,sans-serif; --c-title:600 13px/1.3 var(--c-font); --c-value-font:400 13px/1.2 var(--c-font);
--c-label-font:600 9px/1.2 var(--c-font) /* nagybetű, 0.06em */; --c-radius:4px; --c-radius-btn:6px;
/* jelvény az ikonon (a keret rajzolja): háttér #2b2b2b, szöveg #ffffff */
```

## Sötét mód (mindhárom irány)
A TS10 a rendszer szerinti sötét módot kéri. Egyik alap sötét képét sem néztem meg, ezért a prototípusok világosak;
a választott irány sötét tokenjei a döntés után, az alap sötét képeiből készülnek, az „elfogadva” előtt.

## Sablonellenőrzés
Az `anti-ai-slop.md` és a skill sorai szerint, a bejárás képein ellenőrizve, irányonként. Mindhárom: fehér alap, világos
mód (a TS10 sötét módja a döntés után), nincs indigó, színátmenet, üvegpanel, emoji (a megépült `TabList.tsx` 🔊 💤
jelei helyett szöveg vagy vonalas ikon), betűs ál-favicon, gyorsgomb-csempe. A szöveg mindhárom irányban ugyanaz, a
spec és a munkafolyamat szavaival (Altatva, Hangot ad, Ne altasd, Szűrők törlése, Rendezés, Leállítás, Felirat,
Átírás, Megszakítás, Átirat), mert a közös működésből jön.

### A · Olvasási sor
| Sor | Eredmény |
| --- | --- |
| Külső | van: talpas betű az összefoglaló és az átirat szövegén; indok: az alap képén (matter-atirat-kesz) az átirat talpas, ugyanabban a szerepben (hosszú olvasott szöveg); a háttér fehér, nem krém, a felület rendszerbetűs. A halványsárga csak keresési találat (matter-kereses). Színátmenet nincs: az indító alatti csík kemény határú kétszínű kitöltés. |
| Szerkezet | van: keskeny ikonoszlop + lista, ami az „oldalsáv + tartalom” héjra hasonlít; indok: az alap képe (matter-atirat-kesz bal oszlopa) és a 2. szempont (Karesz: „az extension felületen nem lehet őket fixen elrendezni”): az indítók fix helyen, húzással átrendezhetők, és nem vesznek el sort a taboktól. A meta sor vezérlői (ablak, Szűrő, Rendezés) szövegként, a meta hangján; a fő művelet a keresés, mindig nyitva, legfelül. |
| Tartalom és szöveg | nincs: Karesz világából vett, változó hosszúságú tabok (26, két ablakban); üres találatnál kimondja, hol keresett, és a következő lépést adja („Keresés törlése”, „Szűrők törlése”); más ablak találatainál „Mutasd”. |
| Mozgás | van: az összefoglaló futásakor a határozatlan csík csúszik; indok: állapotváltás jelzése, a Matter „Generating transcript…” csíkja mintájára. Más mozgás nincs. |
| Folyamat (csereteszt) | nincs: a vázat a Matter képei indokolják; a tabokra jellemző rész a csoportszakasz Chrome-színnel, az altatás és a hang állapota, az ablak, és a HUD a videón. |

### B · Szétválogatás
| Sor | Eredmény |
| --- | --- |
| Külső | van: levendula (lilás) csík `#c4c8ea` az aktív tab szélén; indok: az alap képén (superhuman-split-inbox) ugyanez jelöli a kurzor alatti, aktuális sort, halvány, nem kiemelőszín. Van: 4 px-es bal csík az értesítésen („kártya oldalcsíkkal”); indok: a Superhuman értesítése ugyanígy, értesítés szerepben. Van: a fülsor jobb szélén halványuló maszk; indok: kötöttség (a 320 px-es panelen a fülek nem férnek ki, a sor görgethető), nem díszítés. A csoportszín csak pötty (kötöttség). Egy szín egy szerepben: a futó felirat indítója már nem kapja meg a parancs kékjét (javítva). |
| Szerkezet | van: a fülek egyenrangúak; indok: az alap képe (split inbox) és a munka (a csoportváltás egy kattintás). A lista fölött három ikon (keresés, Szűrő, Rendezés); a fő művelet a sor kiválasztása, a sorműveletek rámutatásra. |
| Tartalom és szöveg | nincs: lásd A; az értesítések a műveletet és az állapotot nevezik meg („Felirat készül · Átírás 42%”, „ÁTIRAT”, „MEGSZAKÍTÁS”). |
| Mozgás | nincs: az értesítés átmenet nélkül tűnik el. |
| Folyamat (csereteszt) | nincs: a vázat a Superhuman képe indokolja; a tabokra jellemző rész a csoportfülek a Chrome csoportszínével, az altatás és ébresztés a soron, az ár, az ablakválasztó. |

### C · Összehasonlító lap
| Sor | Eredmény |
| --- | --- |
| Külső | van: minden tab keretes, 4 px-es sorban („kártya mindenhol”); indok: az alap képén (programa-rendezes-ar) a termékek így állnak, és a sor kattintható tétel mezőkkel és saját menüvel („···”). Fekete gomb nézetenként egy (kijelöléskor Rendezés, utókérdésnél Küldés), a Programa „Share” szerepében. Van: a `#f8f8f8` két helyen (az alsó eszközsor alapja és a rámutatás háttere); indok: a forrásban semleges másodlagos felület (oldalsáv), mindkét helyen ebben a szerepben. Színátmenet nincs: a folyamatkör kemény határú kitöltés. |
| Szerkezet | van: Keresés, Szűrő, Rendezés egyenrangú gombok; indok: az alap képe („Search · Filter · Sort”) ugyanígy; a fontossági sorrendet a kijelölés fekete fő gombja adja (TS5, Karesz: „ha a kijelölt tabokat ténylegesen is rendezni lehetne”). |
| Tartalom és szöveg | nincs: lásd A; a mezőcímkék a spec szavai (Webhely, Ár, Utoljára, Ablak); az ár a spec példája szerinti mező („Ár ≤”). |
| Mozgás | nincs. |
| Folyamat (csereteszt) | van, kérdésként: a videó HUD-ja (érték fölött kis nagybetűs címke) rokona az 1. kör elvetett „címke–érték” HUD-jának; különbség: egy-két mező, nagy szám, sáv és lépésjelző nélkül, a bal felső sarokban, a Programa mezősorának formájában. A döntésnél érdemes megnézni. |

## Bejárás
Playwright, Chromium, Linuxon: a képeken a Segoe UI helyett tartalék betű áll (Windows-on a Segoe UI jelenik meg, kicsit
keskenyebb). Két méret: asztali ablak 1440×900 (400 px-es oldalpanel) és a legkisebb támogatott 1024×720 (320 px-es
panel, a Chrome legkisebb oldalpanel-szélessége körül). Kilenc állapot, mindhárom irányban ugyanaz, mert a működés
közös: Lista; Keresés („légcsatorna”: egy találat a címben, egy a szövegben, és a 2. ablakban még kettő); Nincs
találat („dyson v15”); Szűrő („Ár ≤ 100 000 Ft”, a menü nyitva); Kijelölés (négy porszívó, a Rendezés menü nyitva);
Összefoglaló (a válasz még érkezik); Videó (görgetés a bal félen, hangerő 70%); Felirat (átírás 42%, közben ugrás
+5 mp a jobb félen); Átirat (készülés közben).

| Állapot | A (`prototipus/kor-2/a-olvasasi-sor/`) | B (`…/b-szetvalogatas/`) | C (`…/c-osszehasonlito/`) |
| --- | --- | --- | --- |
| Lista | `lista-1440.png`, `lista-1024.png` | `lista-1440.png`, `lista-1024.png` | `lista-1440.png`, `lista-1024.png` |
| Keresés | `kereses-1440.png`, `kereses-1024.png` | `kereses-1440.png`, `kereses-1024.png` | `kereses-1440.png`, `kereses-1024.png` |
| Nincs találat | `ures-1440.png`, `ures-1024.png` | `ures-1440.png`, `ures-1024.png` | `ures-1440.png`, `ures-1024.png` |
| Szűrő | `szuro-1440.png`, `szuro-1024.png` | `szuro-1440.png`, `szuro-1024.png` | `szuro-1440.png`, `szuro-1024.png` |
| Kijelölés és Rendezés | `kijeloles-1440.png`, `kijeloles-1024.png` | `kijeloles-1440.png`, `kijeloles-1024.png` | `kijeloles-1440.png`, `kijeloles-1024.png` |
| Összefoglaló | `osszefoglalo-1440.png`, `osszefoglalo-1024.png` | `osszefoglalo-1440.png`, `osszefoglalo-1024.png` | `osszefoglalo-1440.png`, `osszefoglalo-1024.png` |
| Videó (HUD) | `video-1440.png`, `video-1024.png` | `video-1440.png`, `video-1024.png` | `video-1440.png`, `video-1024.png` |
| Felirat | `felirat-1440.png`, `felirat-1024.png` | `felirat-1440.png`, `felirat-1024.png` | `felirat-1440.png`, `felirat-1024.png` |
| Átirat | `atirat-1440.png`, `atirat-1024.png` | `atirat-1440.png`, `atirat-1024.png` | `atirat-1440.png`, `atirat-1024.png` |

Interakciós teszt (Playwright, a `data-` horgokon át, nem a kinézeten): ugyanaz a 35 lépés mindhárom irányon, mindkét
méreten. Lista és csoport összecsukása; keresés „HEPA”, kiemelés, találatra kattintva aktív tab és jelölés az
oldalon, az altatott találat felébred; Szűrő „Ár ≤ 100000”, „Csak altatott”, „Szűrők törlése”; Ctrl-kijelölés, a
Rendezés menü fejléce, ár szerinti sorrend a böngészőben is, visszajelzés; a sor helyi menüje, altatás onnan,
„Altatás: minden inaktívat”; kompakt sűrűség; más ablak jelzése és „Mutasd”; nincs találat a következő lépéssel;
összefoglaló, Leállítás, utókérdés, mentett prompt, Esc; HUD hangerő, idő, lépés, hossz, sebesség, Felirat indítása;
az indítóból átirat nézet, a .srt mentés tiltva készülés közben, megszakítás, ugrás az átirat sorára; jelvény
százalékkal; URL ráhúzása új tabot nyit. Eredmény: 105/105 mindkét méreten, konzolhiba nincs. A látható szövegeket is
összevetettem állapotonként: ami eltér, az elrendezés vagy forma (például B: „14:05” az „2 órája” helyett, C:
mezőcímkék).

Ahol a három irány ugyanazt máshonnan éri el (elrendezés, nem funkció): az A keresőmezője mindig látszik, a B és a C
ikonnal, gombbal vagy `/`-rel nyitja; a B-ben a csoport fülként, a C-ben a morzsamenüben is választható (mindháromban a
Szűrőben is); a B-ben rámutatásra a soron is van altatás és ébresztés (mindháromban a helyi menüben is); kijelöléskor
az A és a B a lista fölötti sort cseréli, a C megtartja az eszközsort, és alul sávot nyit; a C az utókérdést gombbal
is küldi, az A és a B Enterrel.

Mit javítottam a visszanézés után:
- Mindhárom: a működés közös modulba került; a hiányzó spec-funkciók (felirat mentése .srt és .vtt fájlba, utókérdés,
  URL ráhúzása, „Átirat” a videós tab helyi menüjében) mindháromba bekerültek; a szövegek egységesek (keresőmező,
  kérdésmező, „Claude írja…”, „most”). Futás közben az állapotszöveg kétszer látszott (meta és csík vagy értesítés)
  → csak egyszer. A jelvény színe szerepet váltott (B: parancskék, C: fő gomb) → A: a folyamatcsík fekete, B: az
  értesítés csíkja, C: a folyamatkör színe.
- A: 320 px-en a találatszám a meta sorban levágódott → külön sorban; a meta sor 300 px alatt ikonok nélkül; a
  „Mentett prompt” sora levágódott → tördelődik; az olvasónézet címe keskeny panelen 19 px.
- B: a szöveges találat részlete nem mutatta a talált szót → a részlet a találattól indul; az ár levágódott → külön
  elem; az összefoglaló és az átirat nézetben nem voltak indítók → az alsó sor minden nézetben; 320 px-en a felirat
  értesítése levágta a százalékot → a parancsok második sorba törnek; a promptok levágódtak → tördelődnek; a futó
  felirat indítója a parancs kékjét kapta, az ár mező a kurzor színét → az indító szürke marad, az ár mező a Notion
  Mail keresőmezőjének színét kapta. 400 px-en az ár mellett a domain egy levágott betűre szűkült → legalább hat
  karakter látszik belőle („aruke…”).
- C: a nem használt `--c-seg` token kivéve; a kérdésmező gombja „Küldés” (a mező „Kérdezz az oldalról”).

## Prototípus
Mappák: `prototipus/kor-2/a-olvasasi-sor/`, `prototipus/kor-2/b-szetvalogatas/`, `prototipus/kor-2/c-osszehasonlito/`.
Közös: `keret.css` és `keret.js` (böngészőablak, oldal, videókép, a Chrome oldalpanel szürke fejléce, állapotváltó;
nem része az iránynak), `mukodes.js` (a közös működés: minden funkció, menütétel és szöveg), `adat.js`, `ikonok.js`
simple-icons márkajelekkel, `vonalas-ikonok.js` Lucide ikonokkal. Az irány `index.html`-je csak rajzol: a `draw`,
`menuHTML` és `hudHTML` függvénye a közös állapotból, a gombjai `data-op` attribútummal a közös modult hívják.
Helyben: a mappa `index.html`-je böngészőben, fent a „Prototípus” sorban az állapotok.
Közzétéve (áttekintő oldal, rajta a három prototípus): https://claude.ai/artifact/SXrwPU4XAdfMvBMW6us1qo

## Elvetett
Az 1. kör elvetett vonásai: `vizualis-irany-elvetve-1.md` „Elvetett” szakasza.
A 2. kör első változatából kivett vonások (a közös funkció miatt, nem a kinézet miatt): A: fülek az olvasónézetben
(„Átirat / Videó”) és az aktív fül vonala. B: olvasatlan pötty, csoportcímke a sorban, időelválasztók és időrendi
lista, NÉMÍTÁS és VISSZAVONÁS parancs. C: „Lista / Mezők” szegmentált váltó, a rendezés felugró lenyílóval,
irányváltóval és „Csoporton belül” kapcsolóval, „Sorrend a böngészőben is” fő gomb, ▾ az állapotcímkén.

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
- 2026-11-07: Karesz a bemutatás után („Egyik sem, vagy változtatással”): „most a kinézettel funkciót is választok”.
  A döntési kérdés lezárult; új szempont lett kötött: a funkció a specből, mindhárom irányban ugyanaz (közös
  működés: `mukodes.js`). A spec fölötti funkciók kikerültek, a hiányzók bekerültek (Közös funkciókészlet). Az alapok,
  a szerkezet elrendezése és a külső maradt; a változott vonások a táblákban és a tokenekben. Az állapot továbbra is
  javaslat, irány nincs kiválasztva.
- 2026-11-07: tömörítés után (ezen a javításon belül kétszer) újraolvastam a `dizajnkutatas` és a `refero-design`
  skillt, az `anti-ai-slop.md`-t, ennek a fájlnak a sablonellenőrzését és elvetett listáját, és újranyitottam a
  döntések képeit (matter-kereses, matter-atirat-kesz, matter-atirat-folyamatban, superhuman-split-inbox,
  notion-mail-kijeloles, programa-rendezes-ar, coda-kereses, prime-video-hangero). Függő választás a forrásfájlok
  szerint sincs: irány nincs kiválasztva, a téma világos (a sötét mód a döntés után), az elrendezés javaslat.
- 2026-11-07: bejárás két méreten, kilenc állapottal; interakciós teszt 105/105, konzolhiba nincs; a javítások a
  Bejárás alatt.

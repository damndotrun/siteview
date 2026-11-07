# Munkafolyamat: Siteview
Spec: specs/siteview/SPEC.md v1 · 2026-11-07 (a vizuális irány 2. körében írva, mert hiányzott)

## A felhasználó világa
- Saját termékek, amelyekből a Siteview készül („néhány általam is rég óta használt funkcióival”, Karesz, 2026-10-21):
  Video Dominator, Auto Tab Discard, Tab Shelf, Duplicate Tabs Preventor, ChatGPT Summarizer, Save Image As,
  GoFullPage. Ami zavarja őket: „az extension felületen nem lehet őket fixen elrendezni” (válogató, „fő nyereség”).
  Hogy a felületükből mi tetszik vagy mi nem: nincs megadva, kérdés kiment: 2026-11-07.
- AdGuard kézi elemkijelölése: a tartalom kijelölése „működhetne akár úgy is, mint az adguard esetében amikor
  hirdetést jelölünk ki manuálisan” (2026-10-21).
- Video DownloadHelper és a companion appja: „mint ahogyan a VDH működött a companion appjával együtt” (2026-10-21).
- Chrome (Edge, Brave másodlagos), Windows. A Chrome 2026 áprilisa óta saját függőleges tablistát is tud (spec).
- Visszajelzés hosszú munkáról: „jó lenne valamilyen visszajelző a video dominatoron vagy a rögzített extension
  ikonján” (SG6 megjegyzés).
- Összefoglalás: „általában az egész oldalt szoktam összefoglaltatni” (CS4 megjegyzés).
- Videó: „video element default, és ha van több is az oldalon, akkor azokat pedig az overlayjel lehetne indítani”
  (VD1 megjegyzés).
- Rendezés: „ha a sidebaron rendezi csak, akkor nem kell, de ha mondjuk a kijelölt tabokat ténylegesen is rendezni
  lehetne paraméterek alapján, akkor kell” (TS5 megjegyzés).
- Az 1. kör vizuális irányai: „nagyon nem sikerültek” (lásd `vizualis-irany-elvetve-1.md`).
- A terület (a munka szerint): a háttérben megnyitott oldalak gyűjteménye, amelyben Karesz később tartalom alapján
  visszatalál, összehasonlít (például árat) és rendet tart: egyszerre olvasási sor, összehasonlító gyűjtés és
  tabkezelő; mellette oldalon belüli videóvezérlés feliratozással. Termékei a 2. lépés referencianaplójában.

## Oldalpanel: visszatalálni egy háttérben nyitott tabhoz (TS1, TS4, TC3–TC4, ATD2)
1. Megnyitja a panelt munka közben, az oldal mellett (ikon vagy `Alt+Shift+S`): látni kell: az ablak tabjait és
   hogy melyik az aktuális; módosítja: semmit · Oldal: `entrypoints/sidepanel/App.tsx: App` (megépült, héj)
2. Átfutja a tabokat: látni kell: cím, domain, csoport (név, szín, darab), állapot (altatva, hangot ad, kivétel),
   akár 100–200 tab; módosítja: csoport összecsukása, ablakválasztás · `modules/oldalpanel/TabList.tsx: TabList`
   (megépült, TS1) · elrendezést feltételez: függőleges lista csoportfejlécekkel (spec)
3. Beír egy szót: látni kell: a találatokat azonnal, és hogy miért találat (cím, URL vagy tartalom, kiemelt
   szövegrészlettel), hány találat van; módosítja: a keresőszót · hiányzik (3. és 9. csomag)
4. Szűkít vagy rendez: látni kell: mely szűrő aktív, mezőfeltétel (például ár ≤ 20 000); módosítja: szűrők,
   rendezési kulcs · hiányzik · elrendezést feltételez: szűrő lenyíló a keresőmező mellett (spec)
5. A találatra kattint: látni kell: hogy az altatott tab felébred, és a talált szövegre görget; módosítja: az aktív
   tab · hiányzik (9. csomag)
6. Több tabot kijelöl és a böngészőben is átrendezi (cím, domain, utolsó használat vagy mező szerint, csoporton
   belül): látni kell: a kijelöltek számát és a kulcsot; módosítja: a tabok sorrendje · hiányzik (3. csomag)
Kezelési problémák: 2 (kulcslépés): sok tab átfutása keskeny szélességen, hosszú, vegyes nyelvű címekkel; 3
(kulcslépés): a találat oka (tartalom vagy cím) látszódjon, üres találatnál a következő lépés; 4: mezőfeltétel
megadása keskeny helyen; 5: az ébresztés visszajelzése; 6: többes kijelölés, és hogy a böngésző is átrendeződik.

## Oldalpanel: rend a tabok között (TS2, TS3, ATD2, ATD5, DT3)
1. Altat vagy ébreszt (ezt, az ablak többi tabját, minden inaktívat; következő, előző, összes): látni kell: mennyi
   altatott, melyik kivétel; módosítja: altatás, kivétel · `modules/altatas/panel.tsx` (megépült: menü, kivétel)
2. Csoportosítási szabályt ad meg (domain vagy URL minta → csoportnév és szín): hiányzik (3. csomag)
3. Munkamenetet ment, visszaállít, átnevez, töröl (megerősítéssel): hiányzik (3. csomag)
Kezelési problémák: 1: tömeges művelet visszavonhatósága; 2: szabály szerkesztése keskeny helyen; 3: törlés
megerősítése.

## Oldalpanel: oldal összefoglalása Claude-dal (CS2, CS4, CS5)
1. Jobb klikk → „Összefoglalás Claude-dal” (kijelölés nélkül a teljes oldal): látni kell: hogy elindult, mi a forrás
   (oldal címe vagy „Kijelölés”) · hiányzik (10. csomag)
2. Olvassa a folyamatosan érkező választ: látni kell: a szöveget olvasható szélességben, hogy még fut, „Leállítás”;
   módosítja: leállítás
3. Utókérdést ír vagy mentett promptot választ: látni kell: az előzményt és a mezőt
4. A companion app nem fut: magyarázó állapot a telepítés lépésével, és ha van kulcs, a tartalék út
Kezelési problémák: 2: hosszú válasz olvasása keskeny panelen; 4: hibaállapot a következő lépéssel.

## Oldalpanel: modulok és beállítások (Mag)
1. Modult be- vagy kikapcsol: látni kell: név, egysoros leírás, kapcsoló · `lib/panel/Settings.tsx: SettingsView`
   (megépült)
2. Modul beállításai (perc, kivétellista, fájlnév-sablon…) · `modules/altatas/panel.tsx` (megépült, Altatás)
3. A modulindítókat (képernyőkép, összefoglaló, elemkijelölő, felirat) a saját sorrendjében éri el: hiányzik
   (3. csomag) · elrendezést feltételez: „fent modul gyorsgombok sora” (spec)
Kezelési problémák: 3: az indítók fix helyen legyenek, de ne vegyenek el helyet a tabok elől.

## Oldalon belül: videó nézése kézben tartva (VD1–VD8, SG1–SG6)
1. Görget a videó bal vagy jobb felén: látni kell: hangerőt, időt, sebességet kb. 1 mp-ig, a képet minél kevésbé
   takarva; módosítja: hangerő, pozíció, sebesség · hiányzik (8. csomag)
2. Feliratot kér (HUD gomb, helyi menü, gyorsgomb): látni kell: van-e már felirat; Letöltés → Átírás → Kész,
   százalék, megszakítás, az ikon jelvényén is; módosítja: indít, megszakít · hiányzik (11. csomag)
3. Nézés közben megjelenik a felirat, darabonként: látni kell: a feliratsort a videón, teljes képernyőn is
4. Saját lejátszóban (VD8) teker: látni kell: előnézeti képet és időpontot · hiányzik (11. csomag)
Kezelési problémák: 1 (kulcslépés): visszajelzés, amely bármilyen oldal videóján olvasható, de nem takar; 2
(kulcslépés): hosszú munka állapota akkor is, ha nem a videót nézi; 4: előnézet hiánya.

## Oldalon belül: mező kijelölése a tartalomkereséshez (TC1)
1. Indítja (gyorsgomb, helyi menü): látni kell: hogy kijelölő mód van, és hogyan lép ki (`Esc`)
2. Rámutat: keret és címke (elem típusa, mérete); az oldal saját kattintása nem fut le
3. Kattint: rögzül; szülő/gyerek elemre lép; mezőnév és típus
4. Előnézet a kinyert értékkel, URL minta, mentés · hiányzik (7. csomag)
Kezelési problémák: 2–3: a keret bármilyen oldalon látszik; 4: rossz szabály javítása.

## Oldalon belül: már nyitott oldalra mutató link (DT, új)
1. Olvas egy oldalt: látni kell: mely link mutat már nyitott tabra, az oldal elrendezésének törése nélkül; súgóban
   „Már nyitva: <tab címe>”; kattintásra átvált · hiányzik (4. csomag)

## Eredményoldal: teljes oldalas képernyőkép (GF1–GF6)
1. Indítja (`Alt+Shift+P`, gyorsgomb, helyi menü): látni kell: hogy készül
2. Előnézet, több részre bontva; PNG, JPEG, PDF (papírméret, tájolás), vágólap · hiányzik (6. csomag)
3. Nem rögzíthető oldal: érthető hiba
Kezelési problémák: 2: hosszú kép áttekintése; 3: hiba a következő lépéssel.

## Képmentés (SI1, SI4)
Helyi menü és beállítás; saját felülete a hibaüzenet (a #4 PR-ban).

## Kulcskérdés és szempontok a vizuális irányhoz
Hogyan lehet sok háttérben nyitott oldal címe, helye és állapota egy pillantással átfutható, és szűkülhet azonnal a
beírt szóra a tartalom alapján is (látszó okkal), miközben a modulok indítói és a futó munkák (felirat, összefoglaló)
kéznél vannak, de háttérbe szorulhatnak?
1. Mennyire támogatja a munkát: a keresett tab egy gépeléssel és egy kattintással megvan, és látszik, miért az;
   sok tabnál is átfutható; a videón a visszajelzés olvasható, de nem takar.
2. Karesz saját elrendezése: amit gyakran használ, fix helyen van, és ő rendezi el.
3. Egyediség (csak döntetlennél).
Kötött: egy ikon és egy közös oldalpanel (Karesz döntése); állapot az ikon jelvényén is (SG6, Karesz kérése); a
Chrome oldalpanel (szélessége állítható, a legkisebb kb. 320 px); a Chrome tabcsoport-színei; oldalon belül Shadow
DOM; világos és sötét a rendszer szerint, választható kiemelőszín, két sűrűség (TS10); Windows rendszerbetű; magyar
felület. · Hipotézis: a spec „Oldalpanel felépítés” sora (fent gyorsgombok, alatta keresés és szűrő lenyíló, alatta
tablista csoportfejlécekkel); HUD a videó jobb felső sarkában (VD7); a megépült héj „Tabok / Beállítások” váltója.

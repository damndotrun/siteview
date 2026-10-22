# Oldalpanel

## Tablista csoportokkal
Út: építő · Platform: web, keskeny oldalpanel (kb. 320–480 px) · Termék: böngésző-kiegészítő, tabkezelő · Jelleg: egylépéses; asztali
Régió: `entrypoints/sidepanel/` (tervezett)

- Referenciák (Refero):
  - [Linear: issue lista státuszcsoportokkal](https://refero.design/pages/58ac6637-2009-4f3e-86c3-382b0dbfd942) (leírás alapján): összecsukható csoportfejlécek darabszámmal, sűrű sorok, színes címkék. Irány: a Chrome tabcsoportok összecsukható fejlécként, darabszámmal; a tabsor ikon, cím, domain, állapotikonok.
- Amit a spec kezeljen: üres ablak, sok (200+) tab görgetése, altatott tab halványítva, hangot játszó tab ikonnal.

## Keresés és szűrés
Út: építő · Platform: web, keskeny oldalpanel · Termék: tabkezelő · Jelleg: egylépéses; asztali

- Referenciák (Refero):
  - [Slite: keresés Filter lenyílóval](https://refero.design/pages/6024305e-6fb2-4e01-adc6-3d2bb8cf8e9e) (kép megnézve): a keresőmező mellett egy „Filter” gomb, a lenyílóban kapcsolók („Search in”) és „Clear filters”; a találat cím + kiemelt szövegrészlet. Irány: a tartalom szerinti szűrők (csak cím, tartalom, mezők) kapcsolóként, egy „Szűrők törlése” sorral; találatnál szövegrészlet a kiemelt szóval.
  - [Monday: Search Everything rendezéssel és típusszűrővel](https://refero.design/pages/64cc1868-d5e1-4f49-9e4d-28a2f2c7d760) (leírás alapján): hatókör-fülek, relevancia/idő rendezés. Irány: rendezés relevancia, utolsó használat, mező szerint.
- Hiány a specben: üres találat állapota, és a „szabály nem talál semmit” jelzés.

## Modulkapcsolók és beállítások
Út: építő · Platform: web, keskeny oldalpanel · Termék: böngésző-kiegészítő · Jelleg: egylépéses; asztali

- Referenciák (Refero):
  - [Jasper: Tools beállítás kapcsolókkal](https://refero.design/pages/4b045ef0-729f-4bb3-b335-2a0d0aecf910) (leírás alapján): soronként név, egysoros leírás, jobbra igazított kapcsoló. Irány: modulonként egy sor kapcsolóval, a sorra kattintva a modul saját beállításai.

## Claude összefoglaló nézet
Út: építő · Platform: web, keskeny oldalpanel · Termék: AI összefoglaló · Jelleg: többlépéses (kérés, várakozás, válasz, utókérdés); asztali

- Referenciák (Refero):
  - [Perplexity: „Working…” állapot és utókérdés mező](https://refero.design/pages/552acfca-d391-4de5-b403-0a39b5c03446) (leírás alapján): a kérdés fejlécként, alatta folyamatjelző, lent rögzített beviteli sáv leállítás gombbal. Irány: forrás (oldal címe vagy „kijelölés”) fejlécként, folyamatosan érkező válasz, leállítás, lent utókérdés mező, mentett promptok a mező fölött chipként.
- Flow: jobb klikk → panel megnyílik → válasz folyamatosan jön → utókérdés. Hiba: companion app nem fut → magyarázó üres állapot telepítési lépéssel.

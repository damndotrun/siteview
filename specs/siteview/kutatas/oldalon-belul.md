# Oldalon belüli felületek

## Elemkijelölő
Út: építő · Platform: web, bármely weboldal fölött · Termék: böngésző-kiegészítő · Jelleg: többlépéses (mutatás, kattintás, finomítás, mentés); asztali

- Referenciák (Refero):
  - [Editor X: kijelölt elem kerettel és helyi eszköztárral](https://refero.design/pages/7edd0607-ec96-4e8a-864b-79c9c94e916a) (kép megnézve): a kijelölt elem színes kerettel, alatta kis címke az elem nevével és egy kompakt eszköztár. Irány: rámutatáskor keret + címke (elem típusa, méret), kattintás után rögzített keret, mellette kis eszköztár: szülő/gyerek elemre lépés, mező neve, típusa, mentés, mégse.
- Amit a spec kezeljen: Esc kilép; a kijelölés nem kattint az oldalon (nem nyit linket); iframe-en belül nem működik (jelezni).

## Videó HUD és felirat-overlay
Út: építő · Platform: web, videó fölött · Termék: videóvezérlő · Jelleg: egylépéses; asztali

- Referenciák (Refero):
  - [HBO Max: lejátszó overlay](https://refero.design/pages/4a1618ad-c49d-4d2d-b06b-469e1184e5ba) (leírás alapján): átlátszó fekete sáv színátmenettel, fehér szöveg, a másodlagos szöveg 85% átlátszósággal. Irány: a HUD kis, lekerekített, félig átlátszó sötét doboz a videó sarkában; a felirat lent középen, félig átlátszó háttérrel.
  - [Headspace: beállítás menü feliratokkal, sebességgel, PiP-pel](https://refero.design/pages/c2b3c691-d887-45cb-9037-742174b34bcb) (leírás alapján): három sor ikonnal. Irány: a saját lejátszó (VD8) menüje ugyanígy: felirat, sebesség, kép a képben.
- Amit a spec kezeljen: teljes képernyőn is látszódjon; a felirat generálás állapota (letöltés, átírás %) a HUD-on és az ikon jelvényén.

## Linkjelölés
Út: építő · Platform: web · Termék: böngésző-kiegészítő · Jelleg: egylépéses; asztali

- Referencia nincs: Refero-ban nincs ilyen minta, és a második kör sem talált kész megoldást. Irány: visszafogott jelölés (pl. kis ikon a link után vagy pontozott aláhúzás), ami nem töri az oldal elrendezését; a vizuális irány dönti el.

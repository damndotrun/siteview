# Siteview

Saját Chrome-kiegészítő: egy ikon, egy közös oldalpanel, és benne a kiválasztott tab-, videó-, kép-, képernyőkép-,
keresés-, Claude- és felirat-funkciók. A terv: [specs/siteview/SPEC.md](specs/siteview/SPEC.md).

## Fejlesztés

```sh
npm install
npm run build      # .output/chrome-mv3 (kicsomagolt kiegészítőként betölthető)
npm test           # Vitest egységtesztek
npm run e2e        # Playwright: a megépített kiegészítő Chromiumban (előtte build kell)
npm run compile    # TypeScript típusellenőrzés
```

Betöltés: `chrome://extensions` → Fejlesztői mód → „Kicsomagolt bővítmény betöltése” → `.output/chrome-mv3`.
A manifest rögzített `key` mezője miatt az azonosító mindig `bpeghpddlcamabdbmkekdoccaogngenl`; a companion app
csak ennek válaszol.

## Felépítés

- `lib/core/`: a mag (modulregiszter, `runAction`, helyi menü keret, beállítások szinkronja).
- `modules/<név>/`: a modulok saját háttér-, tartalom- és panel-résszel (`module.ts` a közös leírás).
- `entrypoints/`: a WXT belépési pontjai (háttér, oldalpanel, tartalomszkriptek).
- `assets/tokens.css`: a semleges tokenek (a 2. munkacsomag cseréli le).
- `tests/unit/` (Vitest), `tests/e2e/` (Playwright), `tests/fixtures/` (helyi tesztoldalak), `tests/fake-host/`
  (hamis native messaging host).

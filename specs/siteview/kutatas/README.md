# Dizájnkutatás: Siteview
Spec: specs/siteview/SPEC.md v1 (jóváhagyva) · 2026-10-21

## Állapot
- Spec: nincs jóváhagyott; a KAPU 1 funkciólistája alapján (Karesz válogatása, 69 funkció) készült.
- Megépült felület: nincs, a repó üres. Minden képernyő építő úton készül.
- Vizuális irány: nincs. Az első felületi munkacsomag a vizuális irány (`refero-design`).
- Korábbi kutatás: nincs.
- Út: kutatás a funkciólistára → az eredmény a SPEC.md Kontextus és Döntések részébe → a felületi munkacsomagok a vizuális irány után.

## Funkciólista
| Funkció | Terület | Oldal a kódban | Állapot | Út |
| --- | --- | --- | --- | --- |
| Tablista csoportokkal, állapotjelzéssel | oldalpanel | `entrypoints/sidepanel/` (tervezett) | hiányzik | építő |
| Keresés és szűrés (cím, URL, tartalom, mezők) | oldalpanel | `entrypoints/sidepanel/` (tervezett) | hiányzik | építő |
| Modulkapcsolók és beállítások | oldalpanel | `entrypoints/sidepanel/` (tervezett) | hiányzik | építő |
| Claude összefoglaló nézet | oldalpanel | `entrypoints/sidepanel/` (tervezett) | hiányzik | építő |
| Elemkijelölő (szabály a tartalomkereséshez, videó kijelölése) | oldalon belül | `entrypoints/content/picker` (tervezett) | hiányzik | építő |
| Videó HUD és felirat-overlay | oldalon belül | `entrypoints/content/video` (tervezett) | hiányzik | építő |
| Linkjelölés (már nyitott tabra mutató link) | oldalon belül | `entrypoints/content/links` (tervezett) | hiányzik | építő |
| Képernyőkép eredményoldal (előnézet, export) | eredményoldal | `entrypoints/capture/` (tervezett) | hiányzik | építő |

## Spec-hiányok
| # | Hiány (terület: …) | Forrás (link) | Javasolt módosítás |
| --- | --- | --- | --- |
| 1 | oldalpanel: üres találat és „szabály nem talál semmit” állapot | [Slite keresés szűrővel](https://refero.design/pages/6024305e-6fb2-4e01-adc6-3d2bb8cf8e9e) | A specben a TC3 kapjon üres állapotot és „Szűrők törlése” műveletet; a TC2 szabály hibaállapotot. Beépítve a SPEC v1-be. |
| 2 | eredmények: hosszú művelet állapota (felirat, összefoglaló) | [Grok hírösszefoglaló lépésjelzővel](https://refero.design/pages/047ee35d-9a1c-4c90-b380-73455cf879e8), [Perplexity „Working…”](https://refero.design/pages/552acfca-d391-4de5-b403-0a39b5c03446) | Lépésenkénti állapot (letöltés, átírás, kész) és megszakítás gomb. Beépítve a SPEC v1-be (SG6, CS). |
| 3 | eredmények: képernyőkép exportnál vágólapra másolás egy kattintással az előnézet mellett | [Excalidraw Export image](https://refero.design/pages/4f3a60e5-0f88-4092-9735-3a10bee4cc7d) | Beépítve a SPEC v1-be (GF4–GF5). |

## Javasolt új munkacsomagok
A SPEC v1 munkacsomag-táblájában szerepelnek (2. vizuális irány, majd a felületi csomagok). Külön PR nem kell, mert a spec még tervezet.

## Következő lépés
A SPEC.md jóváhagyása (KAPU 2). Utána a 2. munkacsomag a `refero-design` skillel elkészíti a `kutatas/vizualis-irany.md`-t.

## Változásnapló
- 2026-10-21: első kutatás a KAPU 1 funkciólistájára.

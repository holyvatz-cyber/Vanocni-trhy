# 🎄 Vánoční trhy

Mapa vánočních trhů v Česku a sousedních zemích (Německo, Rakousko, Slovensko, Polsko). Obsahuje přes 320 trhů: v Česku krajská i okresní města a v sousedních zemích hlavně příhraniční regiony a velká města.

**Aplikace:** https://holyvatz-cyber.github.io/Vanocni-trhy/

## Funkce
- Výchozí bod je vaše poloha, trhy se řadí podle vzdálenosti
- Tlačítkem ✏️ **Oblast** nakreslete prstem na mapě libovolnou oblast a zobrazí se trhy v ní
- Detail trhu: termín, otevírací doba, vzdálenost, popis, navigace (Google Maps) a vyhledání dalších informací
- Stav trhu: probíhá / začíná za X dní / skončil
- Hledání města nebo trhu (i bez diakritiky)
- ♥ Oblíbené trhy (uloží se v zařízení), na mapě označené srdíčkem
- Filtr podle termínu: Otevřeno teď, Dnes, Tento víkend nebo libovolný den
- Filtr podle zemí
- Detail trhu s odpočtem („Začíná za 7 dní“, „Otevřeno · do 22:00“) a sdílením odkazu přímo na trh
- Úvodní průvodce, sváteční vzhled a padající sníh (lze vypnout)
- Funguje na mobilu i počítači, světlý i tmavý (noční) režim

## Technika
Jeden soubor `index.html`: čisté HTML, CSS a JavaScript, mapa [Leaflet](https://leafletjs.com/) s podklady © OpenStreetMap. Bez build procesu a backendu.

Data trhů jsou v souboru `markets.js`. Trhy s ověřeným termínem a popisem jsou v poli `MARKETS`:
```js
{n:"Název", c:"Město", cc:"CZ", lat:50.0, lng:14.0, f:"2026-11-28", t:"2026-12-23", h:"10:00–20:00", d:"Popis"},
```

Menší trhy jsou ve zkráceném seznamu na konci souboru: `["Město", "CZ", lat, lng, "Místo"]`. Termín se u nich doplní jako odhad podle země a aplikace je označí štítkem „odhad“.

## Nasazení (GitHub Pages)
**Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.** Určení polohy funguje jen přes HTTPS, tedy na adrese GitHub Pages, ne při otevření souboru z disku.

## Data
- **ověřeno 2026**: termín pochází ze zdrojů pro sezónu 2026/27 (weby měst, Visit Czechia, přehledy termínů). Zatím jde o 27 hlavních českých trhů. Pole `v:1` je v `markets.js`.
- **odhad**: obvyklý termín podle země. Ověřte ho u pořadatele.
- Ověřená data jsou v bloku *Verified 2026/27 data* na konci `markets.js`: termín, otevírací doba (`hv:1`), web pořadatele (`web`), vlastnosti (`tags`) a konkrétní dny (`days`).

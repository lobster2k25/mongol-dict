# ja-mn-dict — Японы ханз, үгийн нээлттэй монгол толь

An open Japanese → Mongolian (Cyrillic) dictionary of kanji and words, for learners and for any app
that wants Mongolian support.

## Why

Every major Japanese learning tool (Yomitan, Jisho, Language Reactor's lookups) runs on
[JMdict](https://www.edrdg.org/jmdict/j_jmdict.html) and [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project),
the volunteer dictionaries maintained by EDRDG since 1991. They carry glosses in English, German,
French, Russian, Hungarian, Swedish, Spanish, Dutch and Slovenian — **but not Mongolian**. The only
Japanese–Mongolian dictionaries are commercial and closed.

JMdict adds a language by aligning a separate dictionary project with its entries (German comes from
WaDoku this way). This repo aims to be that project for Mongolian.

## What's here

| Path | Contents |
|------|----------|
| `data/kanji.json` | Mongolian meanings, a short explanation and example words per kanji |
| `review/kanji.md` | Generated review sheet: our Mongolian next to KANJIDIC2's readings and English |
| `scripts/` | `fetch-sources.sh` downloads KANJIDIC2/KRADFILE; `build-review.js` builds the sheet |
| `sources/` | Downloaded EDRDG files (not committed) |

Readings, stroke counts and English meanings are **not** copied into `data/`; they come from
KANJIDIC2 at build time. `data/` holds only the Mongolian contribution.

## Entry format (`data/kanji.json`)

```json
{
  "kanji": "休",
  "meanings_mn": ["амрах"],
  "note_kind": "origin",
  "note_mn": "Хүн (亻) модны (木) сүүдэрт амарч байна.",
  "examples": [{ "word": "休む", "reading": "やすむ", "mn": "амрах" }],
  "status": "machine"
}
```

- `note_kind`: `origin` = the established explanation of the character; `mnemonic` = a memory aid
  that is **not** a claim about etymology; empty = no note yet.
- `status`: `machine` (generated, unchecked) → `reviewed` (checked by a Mongolian speaker).

## Status

| Set | Entries | Reviewed |
|-----|---------|----------|
| Kanji: grade 1 (80) + top-20 grade 2 | 100 | 0 |

The first 100 entries were drafted with AI (Claude) from KANJIDIC2's English meanings and are all
`machine` status until a native speaker checks them.

## Contributing

Open `review/kanji.md`, check each row, and either tick it or note the fix. Corrections go into
`data/kanji.json` (set `status` to `reviewed` once checked).

## Licence

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), matching EDRDG's licence so the data
can be merged back into JMdict/KANJIDIC. Uses KANJIDIC2 and KRADFILE from the
[Electronic Dictionary Research and Development Group](https://www.edrdg.org/), under their
[licence](https://www.edrdg.org/edrdg/licence.html).

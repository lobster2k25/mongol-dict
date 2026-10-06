# ja-mn-dict — Японы ханз, үгийн монгол толь

A Japanese → Mongolian (Cyrillic) dictionary of kanji and words, built for the jap_sub subtitle
learning extension. **Private for now**; whether to open it (and merge into JMdict) is decided later.

## Why

Every major Japanese learning tool runs on EDRDG's JMdict and KANJIDIC2, which carry glosses in
English and several European languages — **but not Mongolian**. The only Japanese–Mongolian
dictionaries are commercial and closed.

## Independence rule

The Mongolian content in `data/` is written independently: meanings, notes and examples are composed
directly, not translated sense-by-sense from JMdict/KANJIDIC2. Those EDRDG files (CC BY-SA) are used
only as a **private reference** — to pick which kanji come next and to show readings beside our
entries in the local review sheet. Nothing from them is stored in `data/`. This keeps the option to
license the data however we choose later.

## What's here

| Path | Contents | In git? |
|------|----------|---------|
| `data/kanji/<set>.json` | One file per set: `grade-1`…`grade-6`, `secondary-1`…`secondary-6` (≤ 202 entries each) | ✅ |
| `scripts/fetch-sources.sh` | Downloads KANJIDIC2/KRADFILE into `sources/` | ✅ |
| `scripts/build-review.js` | Validates all data and builds `review/<set>.md` (our entries + KANJIDIC2 readings) | ✅ |
| `scripts/next-batch.js` | `node scripts/next-batch.js grade-3 100` lists the next kanji to write | ✅ |
| `sources/`, `review/` | EDRDG files and the generated sheet that quotes them | ❌ local only |

## Entry format (`data/kanji/<set>.json`)

One entry per line, so diffs stay readable and files stay small.

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

- `note_kind`
  - `origin` — the established explanation of the character
  - `mnemonic` — a memory aid, **not** a claim about etymology
  - `compare` — a Japanese ↔ Mongolian contrast (e.g. 青 covers blue and green, like «хөх»)
  - `usage` — a usage tip (e.g. numbers grouped by 万)
  - empty — no note yet
- `status`: `machine` (drafted by AI, unchecked) → `reviewed` (checked by a Mongolian speaker).

## Status

| Set | Entries | Reviewed |
|-----|---------|----------|
| Grade 1 | 80 / 80 | 0 |
| Grade 2 | 160 / 160 | 0 |
| Grade 3 | 200 / 200 | 0 |
| Grade 4 | 202 / 202 | 0 |
| Grade 5 | 193 / 193 | 0 |
| Grade 6 | 191 / 191 | 0 |
| Secondary 1 | 200 / 200 | 0 |
| Secondary 2 | 200 / 200 | 0 |
| Secondary 3 | 200 / 200 | 0 |
| Secondary 4 | 200 / 200 | 0 |
| Secondary 5–6 | 0 / 310 | 0 |

## Workflow

1. `sh scripts/fetch-sources.sh` (once), then `node scripts/build-review.js`.
2. Open `review/<set>.md`, check rows, note fixes.
3. Fixes go into `data/kanji/<set>.json`; set `status` to `reviewed`.

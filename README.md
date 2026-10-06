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
license the data however we choose later. (The extension separately shows JMdict's English for words we don't
have yet; that layer is built in the extension and never enters `data/`.)

## What's here

| Path | Contents | In git? |
|------|----------|---------|
| `data/kanji/<set>.json` | One file per set: `grade-1`…`grade-6`, `secondary-1`…`secondary-6` (≤ 202 entries each) | ✅ |
| `scripts/fetch-sources.sh` | Downloads KANJIDIC2/KRADFILE into `sources/` | ✅ |
| `scripts/build-review.js` | Validates all data and builds `review/<set>.md` (our entries + KANJIDIC2 readings) | ✅ |
| `scripts/next-batch.js` | `node scripts/next-batch.js grade-3 100` lists the next kanji to write | ✅ |
| `data/words/0001-1000.json` | The 1,000 most frequent subtitle words, one entry per line | ✅ |
| `data/words/watched-NN.json` | Words missing from episodes the owner watched (exported by the extension), same format | ✅ |
| `scripts/build-freq.js` | Ranks dictionary forms in OpenSubtitles Japanese with kuromoji → `sources/word-freq.json` | ✅ |
| `scripts/next-words.js` | `node scripts/next-words.js 150` lists the next most frequent words not yet written | ✅ |
| `scripts/add-words.js` | Appends a drafted batch to a `data/words/` file | ✅ |
| `sources/`, `review/` | Reference files (EDRDG, subtitle corpus, frequency list) and generated review sheets | ❌ local only |

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
| Secondary 5 | 200 / 200 | 0 |
| Secondary 6 | 110 / 110 | 0 |
| Words 1–1000 | 1000 / 1000 | 0 |
| Words 1001–2000 | 1000 / 1000 | 0 |
| Words 2001–3000 | 482 (covers subtitle ranks up to 3000) | 0 |
| Watched (`watched-01`: Sins of Kujo S1E1) | 424 | 0 |

## Word entry format (`data/words/<range>.json`)

```json
{
  "word": "分かる", "reading": "わかる", "alt": ["わかる", "解る"], "pos": "verb",
  "meanings_mn": ["ойлгох, мэдэх"], "note_kind": "", "note_mn": "",
  "example": { "ja": "分かった。", "mn": "Ойлголоо." }, "status": "machine"
}
```

- `word` is the dictionary form as usually written; `alt` holds other spellings (kana, kanji variants) so a
  lookup of any of them lands here. `reading` is hiragana.
- `pos`: noun, pronoun, verb, adj-i, adj-na, adverb, particle, auxiliary, conjunction, interjection,
  prenoun, prefix, suffix, counter, expression. One entry per word + pos (の particle vs ない adjective etc.).
- `example` is written for this dictionary (not copied from subtitles); it must contain the word or its stem.
- Order follows subtitle frequency: `sources/opensubtitles-ja.txt` (OPUS OpenSubtitles v2018, ~3.2M lines),
  split with kuromoji. It leans toward dubbed Western films (銃, 捜査, ドル rank high). The list is a private
  reference for ordering only. The first 1,000 words cover ~84% of subtitle tokens (~73% of non-grammar words); with ranks up to 3,000 and
  the watched-episode words (2,906 entries, 2026-10-06) it is ~90% of tokens (~85% of non-grammar words).
  Since 2026-10-06 bulk entries are drafted by Sonnet 5.5 subagents (word list in, entries out; merged with
  spelling clashes folded into existing entries), checked by `build-review.js`.

## Workflow

1. `sh scripts/fetch-sources.sh` (once), `npm install`, `node scripts/build-freq.js`, then `node scripts/build-review.js`.
2. Open `review/<set>.md`, check rows, note fixes.
3. Fixes go into `data/kanji/<set>.json`; set `status` to `reviewed`.

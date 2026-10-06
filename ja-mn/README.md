# ja-mn — Япон → Монгол

## Агуулга

| Хэсэг | Бичлэг | Хянасан |
|-------|--------|---------|
| Өдөр тутмын хэрэглээний ханз (常用漢字), бүгд | 2,136 / 2,136 | 0 |
| Үг, хадмалын давтамжийн 1–3000 | 2,482 | 0 |
| Үг, үзсэн цувралаас (`watched-01`: Sins of Kujo S1E1) | 424 | 0 |

Эхний 1,000 үг кино, цувралын хадмалын үгсийн ~84%-ийг, одоогийн 2,906 үг ~90%-ийг хамардаг.

| Файл | Агуулга |
|------|---------|
| `kanji/grade-1.json` … `grade-6.json` | Японы бага сургуулийн 1–6-р ангид заадаг ханз (教育漢字) |
| `kanji/secondary-1.json` … `secondary-6.json` | Үлдсэн өдөр тутмын хэрэглээний ханз (дунд сургуулиас дээш) |
| `words/0001-1000.json` … | Үгс, хадмалд гарах давтамжаар эрэмбэлсэн |
| `words/watched-NN.json` | Үзсэн цувралаас олдсон, толь бичигт дутуу байсан үгс |

## Ханзны бичлэг

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

Жишээ үг бүр тухайн ханзыг агуулна. Үгийн бичлэгийн хэлбэр бүх хэлд ижил ([../README.md](../README.md)); япон
хэлэнд `reading` нь хирагана, `pos` нь `adj-i` (い-тэмдэг нэр), `adj-na` (な-тэмдэг нэр), `prenoun`, `counter`
зэрэг нэмэлт утгатай.

---

## English: Japanese tools

| Command | What it does |
|---------|--------------|
| `sh ja-mn/tools/fetch-sources.sh` | Downloads reference files into `ja-mn/sources/` (EDRDG KANJIDIC2/KRADFILE/JMdict, OPUS OpenSubtitles). Local only, never committed |
| `npm install` (repo root) | Installs kuromoji (Japanese tokenizer) |
| `node ja-mn/tools/build-freq.js` | Ranks dictionary forms in ~3.2M subtitle lines → `ja-mn/sources/word-freq.json` (~1 min) |
| `node ja-mn/tools/next-batch.js <set> [n]` | Lists kanji of a set not yet written |
| `node ja-mn/tools/next-words.js [n]` | Lists the next most frequent words not yet covered (by `word` or `alt`) |
| `node ja-mn/tools/add-words.js <batch> [range]` | Appends a drafted batch to a `ja-mn/words/` file |
| `node ja-mn/tools/build-review.js` | Japanese checks (kanji set membership, example contains the word or its stem, hiragana readings) and review sheets in `ja-mn/review/`. Needs the downloads |

Word order comes from OPUS OpenSubtitles v2018 Japanese, split with kuromoji; it leans toward dubbed Western
films (銃, 捜査, ドル rank high). The EDRDG files are a reference only: they decide which kanji come next and
show readings beside our entries in the local review sheets. Nothing from them is stored in our entries.

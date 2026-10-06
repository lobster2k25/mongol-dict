# mongol-dict — Нээлттэй монгол толь бичиг

Монгол хэлний нээлттэй, үнэгүй толь бичгийн өгөгдөл. Эхний хэл нь **япон**: бүх 2,136 жёёё ханз (常用漢字),
кино, цувралын хадмалд хамгийн их гардаг 2,906 үг, тус бүр жишээтэй. Цаашид бусад хэл нэмэгдэнэ.

> [!WARNING]
> Одоогоор бүх бичлэг **хиймэл оюуны (AI) ноорог** (`status: "machine"`) бөгөөд монгол хэлтэй хүн хараахан
> хянаагүй. Алдаа олбол засахад туслаарай: [CONTRIBUTING.md](CONTRIBUTING.md).

## Яагаад

Япон хэл сурах бараг бүх хэрэгсэл EDRDG-ийн JMdict, KANJIDIC2 дээр ажилладаг. Тэдгээрт англи болон Европын
хэдэн хэлний тайлбар бий, харин **монгол байхгүй**. Япон–монгол толь бичгүүд бүгд арилжааны, хаалттай.
Энэ төсөл хэн ч ашиглаж, засаж, нэмж болох монгол өгөгдлийг бүтээх зорилготой.

## Юу байгаа вэ

| Хавтас | Агуулга |
|--------|---------|
| `data/kanji/<set>.json` | Ханз, Японы сургуулийн ангиар: `grade-1`…`grade-6` (бага анги), `secondary-1`…`secondary-6` (дунд анги) |
| `data/words/0001-1000.json` … | Үгс, хадмалд гарах давтамжаар эрэмбэлсэн |
| `data/words/watched-NN.json` | Үзсэн цувралаас олдсон, толь бичигт дутуу байсан үгс |
| `scripts/` | Өгөгдлийг шалгах, дараагийн үгсийг сонгох скриптүүд |

Файл бүрт **нэг мөр = нэг бичлэг**, тиймээс засвар бүр GitHub дээр тод харагдана.

## Төлөв

| Хэсэг | Бичлэг | Хянасан |
|-------|--------|---------|
| Ханз (бүх 常用漢字) | 2,136 / 2,136 | 0 |
| Үг, давтамжийн 1–3000 | 2,482 | 0 |
| Үг, үзсэн цувралаас (`watched-01`: Sins of Kujo S1E1) | 424 | 0 |

Эхний 1,000 үг хадмалын үгсийн ~84%-ийг, одоогийн 2,906 үг ~90%-ийг хамардаг.

## Бичлэгийн хэлбэр

Ханз (`data/kanji/<set>.json`):

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

Үг (`data/words/*.json`):

```json
{
  "word": "分かる", "reading": "わかる", "alt": ["わかる", "解る"], "pos": "verb",
  "meanings_mn": ["ойлгох, мэдэх"], "note_kind": "", "note_mn": "",
  "example": { "ja": "分かった。", "mn": "Ойлголоо." }, "status": "machine"
}
```

| Талбар | Утга |
|--------|------|
| `word`, `alt` | Толь бичгийн хэлбэр, бусад бичлэг (кана, өөр ханз) |
| `reading` | Хираганаар унших нь |
| `pos` | Үгсийн аймаг: noun, verb, adj-i, adj-na, adverb, particle, expression гэх мэт |
| `note_kind` | `origin` (ханзны гарал), `mnemonic` (цээжлэх арга, гарал үүсэл **биш**), `compare` (япон–монгол харьцуулалт), `usage` (хэрэглээний зөвлөгөө), эсвэл хоосон |
| `status` | `machine` (AI ноорог, хянаагүй) → `reviewed` (монгол хэлтэй хүн хянасан) |

## Бие даасан байдлын дүрэм

Монгол агуулгыг шууд бичсэн: JMdict, KANJIDIC2-ыг утга бүрээр орчуулаагүй, бусад толь бичиг, апп, хадмалаас
хуулаагүй. Жишээ өгүүлбэрүүд энэ толь бичигт зориулж зохиогдсон. Оролцогчид мөн адил дүрэм баримтална.

## Лиценз

- **Өгөгдөл** (`data/`): [CC BY-SA 4.0](LICENSE). Хэн ч, арилжааны зорилгоор ч ашиглаж болно. Нөхцөл:
  эх сурвалжийг дурдах («mongol-dict, CC BY-SA 4.0» ба энэ хуудасны холбоос), өөрчилсөн хувилбараа ижил
  лицензээр түгээх.
- **Скриптүүд** (`scripts/`): [MIT](scripts/LICENSE).

---

## English

Open Mongolian dictionary data, starting with Japanese: all 2,136 jōyō kanji and the 2,906 most frequent
subtitle words, each with Mongolian (Cyrillic) meanings and an example. Every entry is currently an
**unreviewed AI draft** (`status: "machine"`); review and corrections from Mongolian speakers are the most
valuable contribution. See [CONTRIBUTING.md](CONTRIBUTING.md).

The Mongolian content is written independently, not translated from JMdict/KANJIDIC2 or copied from other
dictionaries. Data is licensed **CC BY-SA 4.0** ([LICENSE](LICENSE)); scripts are **MIT** ([scripts/LICENSE](scripts/LICENSE)).

### For maintainers

| Command | What it does |
|---------|--------------|
| `sh scripts/fetch-sources.sh` | Downloads reference files into `sources/` (EDRDG KANJIDIC2/KRADFILE/JMdict, OPUS OpenSubtitles). Local only, never committed |
| `npm install` | Installs kuromoji (Japanese tokenizer) |
| `node scripts/build-freq.js` | Ranks dictionary forms in ~3.2M subtitle lines → `sources/word-freq.json` (~1 min) |
| `node scripts/next-batch.js <set> [n]` | Lists kanji of a set not yet written |
| `node scripts/next-words.js [n]` | Lists the next most frequent words not yet covered (by `word` or `alt`) |
| `node scripts/add-words.js <batch> [range]` | Appends a drafted batch to a `data/words/` file |
| `node scripts/build-review.js` | Validates everything (duplicates, set membership, examples contain the headword, no Latin letters in Mongolian) and builds `review/*.md`. Must print 0 problems before a commit |

The EDRDG files are a reference only: they decide which kanji come next and show readings beside our entries
in the local review sheets. Nothing from them is stored in `data/`.

# mongol-dict — Нээлттэй монгол толь бичиг

Гадаад хэлнээс монгол руу орчуулсан нээлттэй, үнэгүй толь бичгийн өгөгдөл. Хэн ч ашиглаж, засаж, нэмж болно.
Эхний хэл нь япон; бусад хэлийг ижил бүтцээр нэмнэ ([NEW-LANGUAGE.md](NEW-LANGUAGE.md)).

> [!WARNING]
> Одоогоор бүх бичлэг **хиймэл оюуны (AI) ноорог** (`status: "machine"`) бөгөөд монгол хэлтэй хүн хараахан
> хянаагүй. Алдаа олбол засахад туслаарай: [CONTRIBUTING.md](CONTRIBUTING.md).

## Хэлнүүд

Хавтас бүр нэг чиглэлийн орчуулга: `<эх хэл>-mn`, хэлний кодыг [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)-ээр.

| Хавтас | Орчуулга | Агуулга | Хянасан |
|--------|----------|---------|---------|
| [`ja-mn/`](ja-mn/) | Япон → Монгол | Өдөр тутмын хэрэглээний 2,136 ханз (常用漢字), кино, цувралын хадмалд хамгийн их гардаг 2,906 үг | 0 |
| `ko-mn/`, `zh-mn/`, `en-mn/` … | Солонгос, хятад, англи … → Монгол | Хараахан эхлээгүй. [Эхлүүлэх үү?](NEW-LANGUAGE.md) | |

## Бүтэц

```text
mongol-dict/
├── ja-mn/                Япон → Монгол
│   ├── words/            үгс (бүх хэлд ижил хэлбэртэй)
│   ├── kanji/            ханз (зөвхөн япон хэлэнд)
│   ├── tools/            япон хэлний туслах скрипт (дараагийн үгсийг сонгох г.м.)
│   └── README.md         энэ хэлний дэлгэрэнгүй
├── tools/validate.js     бүх хэлний өгөгдлийг шалгана
├── NEW-LANGUAGE.md       шинэ хэл нэмэх заавар
└── CONTRIBUTING.md       хэрхэн оролцох
```

**Өгөгдөл** нь `words/`, `kanji/` доторх JSON файлууд; файл бүрт **нэг мөр = нэг бичлэг**, тиймээс засвар бүр
GitHub дээр тод харагдана. **Скриптүүд** өгөгдөл биш, ажлын хэрэгсэл: `tools/validate.js` алдаа шалгана,
`<хэл>-mn/tools/` нь тухайн хэлний дараагийн үгсийг давтамжаар сонгоход тусална. Толь бичгийг ашиглахад скрипт
шаардлагагүй.

## Үгийн бичлэг (бүх хэлд ижил)

```json
{ "word": "分かる", "reading": "わかる", "alt": ["わかる", "解る"], "pos": "verb",
  "meanings_mn": ["ойлгох, мэдэх"], "note_kind": "", "note_mn": "",
  "example": { "ja": "分かった。", "mn": "Ойлголоо." }, "status": "machine" }
```

| Талбар | Утга |
|--------|------|
| `word` | Эх хэл дээрх толь бичгийн хэлбэр |
| `reading` | Дуудлага, тухайн хэлний заншлаар (япон: хирагана, хятад: пиньинь); шаардлагагүй бол `""` |
| `alt` | Өөр бичлэгүүд (жишээ нь кана, өөр ханз); байхгүй бол `[]` |
| `pos` | Үгсийн аймаг: `noun`, `verb`, `adjective`, `adverb`, `particle`, `expression` … (бүтэн жагсаалт: [`tools/validate.js`](tools/validate.js)) |
| `meanings_mn` | Монгол утгууд, нэг утга = нэг мөр |
| `note_kind`, `note_mn` | Тэмдэглэл: `origin` (гарал), `mnemonic` (цээжлэх арга, гарал **биш**), `compare` (монгол хэлтэй харьцуулалт), `usage` (хэрэглээ), эсвэл хоосон |
| `example` | Жишээ өгүүлбэр: эх хэлний кодоор (`ja`, `ko` …) ба `mn` |
| `status` | `machine` (AI ноорог, хянаагүй) → `reviewed` (монгол хэлтэй хүн хянасан) |

## Бие даасан байдлын дүрэм

Монгол агуулгыг шууд бичнэ: бусад толь бичиг, апп, JMdict, кино хадмал, машин орчуулгаас хуулахгүй.
Жишээ өгүүлбэрүүд энэ толь бичигт зориулж зохиогдоно.

## Лиценз

- **Өгөгдөл** (`*/words/`, `*/kanji/`): [CC BY-SA 4.0](LICENSE). Хэн ч, арилжааны зорилгоор ч ашиглаж болно.
  Нөхцөл: эх сурвалжийг дурдах («mongol-dict, CC BY-SA 4.0» ба энэ хуудасны холбоос), өөрчилсөн хувилбараа
  ижил лицензээр түгээх.
- **Скриптүүд** (`tools/`, `*/tools/`): [MIT](LICENSE-CODE).

---

## English

Open dictionary data from other languages **into Mongolian** (Cyrillic). Each folder is one direction,
`<source>-mn/` with ISO 639-1 codes. The first is `ja-mn/` (Japanese → Mongolian): all 2,136 jōyō kanji and the
2,906 most frequent subtitle words. Every entry is currently an **unreviewed AI draft**.

- Word entries share one format across languages (table above); `example` is keyed by the source language code.
- `tools/validate.js` checks every language folder and needs no downloads. `<lang>-mn/tools/` holds that
  language's helpers (word frequency, next batch, review sheets).
- Adding a language: [NEW-LANGUAGE.md](NEW-LANGUAGE.md). Contributing: [CONTRIBUTING.md](CONTRIBUTING.md).
- Mongolian content is written independently, never copied from other dictionaries or translated from JMdict.
- Data: **CC BY-SA 4.0** ([LICENSE](LICENSE)). Code: **MIT** ([LICENSE-CODE](LICENSE-CODE)).

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
| [`ja-mn/`](ja-mn/) | Япон → Монгол | Өдөр тутмын хэрэглээний 2,136 ханз (常用漢字), кино, цувралын хадмалд хамгийн их гардаг 3,908 үг, хэллэг, 907 оноосон нэр (улс, газар, байгууллага, овог) | 0 |
| `ko-mn/`, `zh-mn/`, `en-mn/` … | Солонгос, хятад, англи … → Монгол | Хараахан эхлээгүй. [Эхлүүлэх үү?](NEW-LANGUAGE.md) | |

## Татах

[Releases](../../releases/latest) хуудаснаас:

| Файл | Юунд |
|------|------|
| `mongol-dict-ja-mn-yomitan.zip` | [Yomitan](https://yomitan.wiki/) хөтчийн өргөтгөлд: вэб хуудсан дээрх япон үгэн дээр хулганаа аваачихад монгол утга гарна. Yomitan → Settings → Dictionaries → Import. Шинэ хувилбар гарвал Yomitan-ы «Check for updates» товчоор шинэчилнэ |
| `mongol-dict-ja-mn.json` | Бүх үг, ханз нэг файлд; өөрийн апп, програмдаа ашиглах |

Өөрчлөлтүүд: [CHANGELOG.md](CHANGELOG.md).

## Бүтэц

```text
mongol-dict/
├── ja-mn/                Япон → Монгол
│   ├── words/            үгс (бүх хэлд ижил хэлбэртэй)
│   ├── names/            оноосон нэр: улс, газар, байгууллага, овог
│   ├── kanji/            ханз (зөвхөн япон хэлэнд)
│   ├── tools/            япон хэлний туслах скриптүүд
│   ├── ids.json          дараагийн чөлөөт дугаар
│   └── README.md         энэ хэлний дэлгэрэнгүй
├── tools/                бүх хэлд зориулсан скриптүүд
├── NEW-LANGUAGE.md       шинэ хэл нэмэх заавар
└── CONTRIBUTING.md       хэрхэн оролцох
```

**Өгөгдөл** нь `words/`, `names/`, `kanji/` доторх JSON файлууд; файл бүрт **нэг мөр = нэг бичлэг**, тиймээс
засвар бүр GitHub дээр тод харагдана. Толь бичгийг ашиглахад скрипт шаардлагагүй.

## Скриптүүд

Скриптүүд бол өгөгдөл биш, ажлын хэрэгсэл. Ажиллуулахын тулд [Node.js](https://nodejs.org/) (20 буюу түүнээс
дээш) суулгаад, repo-гийн хавтсанд терминал нээж тушаалыг бичнэ. Ихэнх оролцогчид зөвхөн эхний хоёрыг хэрэглэнэ.

| Тушаал | Юу хийдэг вэ | Хэзээ |
|--------|--------------|-------|
| `node tools/validate.js` | Бүх хэлний өгөгдлийг шалгана: хэлбэр, давхардал, монгол текстэд латин үсэг байгаа эсэх, дугаар. Юу ч татахгүй. `0 problems` гарвал зөв | Засвар бүрийн дараа |
| `node tools/assign-ids.js` | Дугааргүй шинэ бичлэгт байнгын `id` өгнө | Шинэ үг, нэр нэмсний дараа |
| `node tools/build-release.js` | Татах файлуудыг `dist/` хавтсанд бүтээнэ (JSON, Yomitan) | Ихэвчлэн GitHub өөрөө ажиллуулна |
| `<хэл>-mn/tools/…` | Тухайн хэлний туслах скриптүүд (дараагийн үгсийг давтамжаар сонгох г.м.). Тайлбар нь хэлний README-д | Засварлагчид |

Pull request бүрт GitHub `tools/validate.js`-г автоматаар ажиллуулдаг тул алдаа байвал PR дээр харагдана.

## Үгийн бичлэг (бүх хэлд ижил)

```json
{ "id": 62, "word": "分かる", "reading": "わかる", "alt": ["わかる", "解る"], "pos": "verb",
  "meanings_mn": ["ойлгох, мэдэх"], "note_kind": "", "note_mn": "",
  "example": { "ja": "分かった。", "mn": "Ойлголоо." }, "status": "machine" }
```

| Талбар | Утга |
|--------|------|
| `id` | Байнгын дугаар: хэзээ ч өөрчлөгдөхгүй, дахин ашиглагдахгүй. Гаднаас `ja-mn/62` гэж заана. Шинэ үгэнд `node tools/assign-ids.js` автоматаар өгнө; гараар бичихгүй |
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
3,908 most frequent subtitle words and set phrases, plus 907 proper nouns (countries, places, organisations, surnames). Every entry is currently an **unreviewed AI draft**.

- Word entries share one format across languages (table above); `example` is keyed by the source language code.
- **Permanent ids**: every word has an `id` that never changes and is never reused, so other projects can link to
  `ja-mn/62`. `node tools/assign-ids.js` gives new entries the next number from `<lang>/ids.json`. Kanji are
  identified by the character itself (`ja-mn/休`).
- Every pull request is checked automatically (GitHub Actions: `tools/validate.js --base`), including that no
  existing id was removed or reused.
- `tools/validate.js` checks every language folder and needs no downloads. `<lang>-mn/tools/` holds that
  language's helpers (word frequency, next batch, review sheets).
- **Downloads** ([latest release](../../releases/latest)): a Yomitan dictionary (`mongol-dict-ja-mn-yomitan.zip`, updatable
  via Yomitan's "Check for updates") and all entries in one JSON file. A tag `vX.Y.Z` with a matching CHANGELOG section publishes a release.
- Adding a language: [NEW-LANGUAGE.md](NEW-LANGUAGE.md). Contributing: [CONTRIBUTING.md](CONTRIBUTING.md).
- Mongolian content is written independently, never copied from other dictionaries or translated from JMdict.
- Data: **CC BY-SA 4.0** ([LICENSE](LICENSE)). Code: **MIT** ([LICENSE-CODE](LICENSE-CODE)).

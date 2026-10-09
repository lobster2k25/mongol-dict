# Шинэ хэл нэмэх

Жишээ болгож солонгос хэлийг (`ko`) авч үзье. Бусад хэлэнд кодоо солиход л болно.

## 1. Эхлээд issue нээ

[Шинэ issue](../../issues/new) нээж, гарчигт «Шинэ хэл: солонгос (ko-mn)» гэж бич. Дараахыг тохиролцоно:

- **Хэлний код**: [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)-ийн хоёр үсэг (`ko`, `zh`, `en`, `ru`, `de` …).
  Хавтасны нэр нь `<код>-mn`.
- **Үгсийн дараалал**: аль үгнээс эхлэх вэ. Ихэвчлэн давтамжийн жагсаалт (хадмал, мэдээ, сурах бичиг).
  Жагсаалтын лиценз үүнийг зөвшөөрөх ёстой; зөвхөн дарааллыг сонгоход ашиглаж, repo-д оруулахгүй.
- **`reading`**: дуудлагыг юугаар бичих (хятад: пиньинь; солонгос, англид ихэвчлэн `""`).
- **Нэмэлт `pos`** утга хэрэгтэй эсэх (жагсаалт: [`tools/validate.js`](tools/validate.js)-ийн `POS`).

## 2. Хавтас үүсгэ

```text
ko-mn/
├── README.md        хэлний товч: агуулга, төлөв, үгсийн дараалал хаанаас
└── words/
    └── 0001-1000.json
```

`kanji/` хавтас нь зөвхөн ханз хэрэглэдэг хэлэнд (япон, магадгүй хятад). `tools/` нь хэрэгтэй бол дараа нэмнэ.

## 3. Бичлэгээ бич

Файл бүр JSON жагсаалт, **нэг мөр = нэг бичлэг**:

```json
[
{"word":"사랑","reading":"","alt":[],"pos":"noun","meanings_mn":["хайр, хайр сэтгэл"],"note_kind":"","note_mn":"","examples":[{"ko":"사랑해요.","mn":"Би чамд хайртай."},{"ko":"사랑은 어려워요.","mn":"Хайр гэдэг хэцүү юм."}],"status":"machine"},
{"word":"먹다","reading":"","alt":[],"pos":"verb","meanings_mn":["идэх"],"note_kind":"","note_mn":"","examples":[{"ko":"밥을 먹었어요.","mn":"Хоол идлээ."},{"ko":"뭐 먹고 싶어요?","mn":"Юу идмээр байна?"}],"status":"machine"}
]
```

| Дүрэм | Тайлбар |
|-------|---------|
| `word` | Толь бичгийн хэлбэр (үйл үг бол үндсэн хэлбэр: 먹었어요 биш, 먹다) |
| `examples` | Хоёр өгүүлбэр, түлхүүр нь хэлний код: `[{"ko": "...", "mn": "..."}, {...}]`. Өгүүлбэрийг өөрөө зохио |
| Нэг үг, хоёр аймаг | Тусдаа бичлэг (`word` + `pos` давхардахгүй) |
| Монгол талбарууд | Латин үсэггүй, албан ёсны зөв бичгийн дүрмээр |
| `status` | AI-аар гаргасан бол `machine`; хүн бүрэн шалгасан бол `reviewed` |
| Хуулахгүй | Бусад толь бичиг, апп, хадмал, машин орчуулгаас хуулахгүй ([CONTRIBUTING.md](CONTRIBUTING.md)) |

## 4. Дугаар өг, шалга

Шинэ бичлэгт `id` бүү бич. Дараах тушаал дугаарыг автоматаар өгч, `ko-mn/ids.json` үүсгэнэ:

```sh
node tools/assign-ids.js
```

Дараа нь шалга:

```sh
node tools/validate.js
```

`0 problems` гарах ёстой. Татах зүйл шаардлагагүй; шинэ хавтсыг автоматаар олно.

## 5. Бүртгэ, илгээ

- Үндсэн [README.md](README.md)-ийн «Хэлнүүд» хүснэгтэд мөр нэм.
- Pull request илгээ. Эхний PR-ыг жижиг (жишээ нь 50–100 үг) байлгавал хэлбэрийг хурдан тохирно.

---

## English

1. **Open an issue** "New language: Korean (ko-mn)" to agree on the ISO 639-1 code, where the word order comes
   from (a frequency list whose license allows that use; used for ordering only, never committed), what
   `reading` holds for this language, and any extra `pos` values.
2. **Create `<code>-mn/`** with a short `README.md` and `words/0001-1000.json`. Add `kanji/` only for languages
   written with kanji, `tools/` only when needed.
3. **Write entries** in the shared word format, one per line. Two `examples`, each keyed by the language code
   (`[{"ko": "...", "mn": "..."}, {...}]`). Dictionary forms only; one entry per word + pos; no Latin letters in
   Mongolian fields; write everything yourself; AI drafts stay `"status": "machine"`.
4. **Run `node tools/assign-ids.js`** (gives new entries permanent ids; never write ids by hand), then **`node tools/validate.js`** until it prints `0 problems`. It finds new folders automatically.
5. **Add a row** to the languages table in the main README and open a pull request. Keep the first one small.

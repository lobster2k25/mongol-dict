# Өөрчлөлтийн түүх / Changelog

Хувилбарын дугаар: `0.x` — бичлэгүүд хянагдаж эхлэхээс өмнөх үе. Үгийн `id` хувилбар хооронд өөрчлөгдөхгүй.
Version numbers: `0.x` while entries are unreviewed drafts. Word ids never change between versions.

## Дараагийн хувилбар / Unreleased

- **Формат өөрчлөгдсөн**: үгийн `example` → `examples` (2 өгүүлбэрийн жагсаалт). Бүх 4,362 үг хоёр жишээтэй
  боллоо. / **Format change**: word `example` is now `examples`, a list of 2 sentences; all 4,362 words
  now have two examples.
- **Хэллэг** 158 нэмэгдэж 597 боллоо (`phrases-01`); 17 бичлэгт өөр бичлэг нэмэгдсэн. / **Phrases**: 158 more (597).
  17 existing entries gained alternate spellings.
- 71 бичлэгийн буруу, илүү утга, жишээг зассан (あらら, くそー, 墜落, 立ち上がる …). / 71 entries corrected: wrong or
  padded meanings and awkward example translations.

## 0.3.0 — 2026-10-08

- **Хэллэг, мэндчилгээ** (`ja-mn/words/phrases-01.json`, 439): кино, цувралын хадмалд хамгийн их гардаг олон үгтэй
  хэллэг: お願いします, 気をつける, よろしくお願いします, 嘘をつく, 手に負えない, この野郎. Хадмалаас 2–5 үгтэй
  дарааллаар тоолсон (`ja-mn/tools/build-phrases.js`). / **Set phrases** (439): the most frequent multi-word
  phrases in subtitles, counted 2-5 tokens at a time.
- Одоо байгаа 43 бичлэгт өөр бичлэг нэмэгдсэн (済みません → すみません, 馬鹿野郎 → バカ野郎); `id` өөрчлөгдөөгүй.
  / 43 existing entries gained alternate spellings; word ids unchanged.

## 0.2.0 — 2026-10-06

- **Оноосон нэр** (`ja-mn/names/`, 907): дэлхийн бүх улс, тив, бүс нутаг; Японы 47 муж, хотууд, дүүрэг,
  үзэсгэлэнт газар; гадаадын хот, далай; байгууллага, шашин; Японы түгээмэл 150 овог. Монголоор бичих дүрэм
  `ja-mn/README.md`-д. / **Proper nouns** (907): countries, regions, Japanese and world places, organisations,
  religions, common surnames, with a Mongolian transcription table.
- Хамрах хүрээг одооноос хадмалын **бүх** үгтэй харьцуулж тоолно: ~89% (өмнөх «92%» нь оноосон нэрийг тооцоогүй
  байсан). / Coverage is now measured against all subtitle tokens: ~89% (the earlier "92%" left proper nouns out).
- 0.1.0-ийн 3,765 үгийн 41 бичлэгт өөр бичлэг нэмэгдсэн; `id` өөрчлөгдөөгүй. / Word ids unchanged.

## 0.1.0 — 2026-10-06

Анхны хувилбар. / First release.

- **ja-mn** (Япон → Монгол): өдөр тутмын хэрэглээний бүх 2,136 ханз (常用漢字), кино, цувралын хадмалд хамгийн
  их гардаг 3,765 үг (хадмалын үгсийн ~92%). Бүгд хиймэл оюуны ноорог (`status: "machine"`).
  All 2,136 jōyō kanji and 3,765 frequent subtitle words (~92% of subtitle tokens); all unreviewed AI drafts.
- Үг бүр байнгын `id`-тай (1–3765). / Every word has a permanent `id` (1–3765).
- Татах файл: бүх өгөгдөл нэг JSON файлд, Yomitan толь бичиг. / Downloads: one JSON file, a Yomitan dictionary.

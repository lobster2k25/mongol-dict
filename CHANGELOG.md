# Өөрчлөлтийн түүх / Changelog

Хувилбарын дугаар: `0.x` — бичлэгүүд хянагдаж эхлэхээс өмнөх үе. Үгийн `id` хувилбар хооронд өөрчлөгдөхгүй.
Version numbers: `0.x` while entries are unreviewed drafts. Word ids never change between versions.

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

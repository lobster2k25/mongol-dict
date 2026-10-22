# Kindle толь бичиг (Япон → Монгол)

Kindle дээр япон ном уншиж байхдаа үгэн дээр удаан дарахад монгол утга нь гарна.
Үйл үг, тэмдэг нэрийн хувилсан хэлбэрийг (食べた, 行って, 高かった) мөн таньдаг.

**Туршилтын хувилбар.** Бодит Kindle дээр хараахан туршаагүй. Kindle-тэй бол туршаад
[Issues](https://github.com/lobster2k25/mongol-dict/issues) хэсэгт эсвэл Facebook-т хэлээрэй:
толь бичгийн жагсаалтад харагдаж байна уу, 食べた дээр дарахад 食べる-ийн утга гарч байна уу?

## Суулгах

1. [`mongol-dict-ja-mn-kindle.mobi`](https://github.com/lobster2k25/mongol-dict/releases/download/v0.5.9/mongol-dict-ja-mn-kindle.mobi) файлыг татна (10.8 MB).
2. Kindle-ээ компьютерт USB-ээр холбоод `.mobi` файлыг `documents/dictionaries` хавтас руу хуулна
   (`dictionaries` хавтас байхгүй бол `documents` руу хуулахад болно).
3. Kindle-ээ салгаад япон ном нээнэ. Үгэн дээр удаан дарж, гарч ирсэн цонхны толь бичгийн нэрэн дээр дарж
   **mongol-dict ja-mn** -ийг сонгоно. Эсвэл: Тохиргоо → Хэл ба толь бичиг → Толь бичиг → Япон.

«Send to Kindle»-ээр илгээсэн толь бичиг ихэнхдээ толь бичиг гэж танигдахгүй тул USB-ээр хуулахыг зөвлөж байна.
Kindle-ийн утасны апп болон компьютерийн апп өөрийн толь бичиг нэмэхийг дэмждэггүй.

Ихэнх бичлэг хиймэл оюуны ноорог бөгөөд хүн хянаагүй. Алдаа олвол [Issues](https://github.com/lobster2k25/mongol-dict/issues) хэсэгт бичээрэй.

---

## Kindle dictionary (Japanese → Mongolian), in English

Long-press a word in a Japanese book on a Kindle to see its Mongolian meaning. Conjugated verbs and adjectives
(食べた, 行って, 高かった) are found too.

**Test version**: not yet tried on a real Kindle. Kindle owners, please tell us in
[Issues](https://github.com/lobster2k25/mongol-dict/issues) or on Facebook whether it shows in the dictionary list
and whether long-pressing 食べた shows 食べる.

1. Download [`mongol-dict-ja-mn-kindle.mobi`](https://github.com/lobster2k25/mongol-dict/releases/download/v0.5.9/mongol-dict-ja-mn-kindle.mobi) (10.8 MB).
2. Connect the Kindle by USB and copy the file into `documents/dictionaries` (or `documents`).
3. Open a Japanese book, long-press a word, tap the dictionary name in the popup and pick **mongol-dict ja-mn**
   (or Settings → Language & Dictionaries → Dictionaries → Japanese).

Dictionaries sent with "Send to Kindle" are usually not recognised as dictionaries; copy by USB. The Kindle phone
and PC apps can't add your own dictionaries.

### Building it

```
node ja-mn/tools/build-kindle.js
kindlegen dist/kindle/mongol-dict-ja-mn.opf -c2 -dont_append_source
```

`kindlegen.exe` comes inside Amazon's Kindle Previewer (Windows/macOS). Kindle does not turn 食べた back into
食べる by itself, so the script lists the conjugated forms of every verb and adjective (verb classes from kuromoji).

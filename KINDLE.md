# Kindle толь бичиг (Япон → Монгол)

Kindle дээр япон ном уншиж байхдаа үгэн дээр удаан дарахад монгол утга нь гарна.
Үйл үг, тэмдэг нэрийн хувилсан хэлбэрийг (食べた, 行って, 高かった) мөн таньдаг.

## Суулгах

1. `mongol-dict-ja-mn.mobi` файлыг татна (дараагийн хувилбараас эхлэн [Releases](https://github.com/lobster2k25/mongol-dict/releases) хуудсанд байна).
2. Kindle-ээ компьютерт USB-ээр холбоод файлыг `documents/dictionaries` хавтас руу хуулна
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

1. Download `mongol-dict-ja-mn.mobi` (attached to releases from the next version on).
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

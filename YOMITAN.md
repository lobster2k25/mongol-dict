# Yomitan-д монгол толь суулгах

[Yomitan](https://yomitan.wiki/) бол үнэгүй хөтчийн өргөтгөл: вэб хуудсан дээрх япон үгэн дээр хулганаа
аваачихад утгыг нь жижиг цонхонд гаргана. Манай **mongol-dict** толийг Yomitan-д нэмбэл япон үгийн
**монгол утга**, жишээ өгүүлбэр, ханзны тайлбар гарна. Мэдээний сайт, блог, YouTube гээд ямар ч хуудсан дээр ажиллана.

> [!NOTE]
> Толийн бичлэгүүд одоогоор **хиймэл оюуны ноорог** бөгөөд хүн хараахан хянаагүй. Ийм бичлэг «ноорог»
> шошготой гарна. Алдаа олбол [энд](CONTRIBUTING.md) мэдэгдээрэй.

## 1. Yomitan суулгах

- **Chrome, Edge, Brave**: [Chrome Web Store → Yomitan](https://chrome.google.com/webstore/detail/yomitan/likgccmbimhjbgkjambclfkhldnlhbnn)
- **Firefox**: [addons.mozilla.org → Yomitan](https://addons.mozilla.org/firefox/addon/yomitan/)

Суулгасны дараа Yomitan-ы угтах хуудас нээгдэнэ. Түүнийг хааж болно.

## 2. Толийг татах

[**mongol-dict-ja-mn-yomitan.zip**](https://github.com/lobster2k25/mongol-dict/releases/latest/download/mongol-dict-ja-mn-yomitan.zip)
файлыг татна. **Задлахгүй**, zip хэвээр нь хадгална.

## 3. Yomitan-д оруулах

1. Хөтчийн дээд буланд байгаа Yomitan дүрс дээр дараад ⚙ (**Settings**) товчийг дарна.
2. **Dictionaries** хэсгийг олоод **Configure installed and enabled dictionaries** товчийг дарна.
3. **Import** → татсан zip файлаа сонгоно. Хэдэн секунд хүлээнэ.
4. Жагсаалтад **mongol-dict ja-mn** гарч ирээд асаалттай (✓) байвал болсон.

## 4. Хэрэглэх

Япон үгэн дээр хулганаа аваачаад **Shift** дарна. Жижиг цонхонд:

- үгийн монгол утга, үгсийн аймаг (үйл, нэр …), хоёр жишээ өгүүлбэр;
- үйл үг хувилсан байсан ч (分かった, 食べている) толь бичгийн хэлбэрээр нь (分かる, 食べる) олно;
- үгийн ханз дээр дарвал тухайн ханзны утга, бүтцийн тайлбар, жишээ үгс гарна.

Туршиж үзэх: 分かった、日本、休む

## 5. Англи утга нэмэх (хүсвэл)

Манай толинд хараахан ороогүй үгэнд англи утга харах бол англи толь нэмж болно:

1. Settings хуудсанд **Language** жагсаалтаас **Japanese**-ийг сонгоно.
2. **Get recommended dictionaries...** товчийг дараад англи толиудаас (**Jitendex** эсвэл **JMdict**) нэгийг суулгана.
3. Монгол утга эхэнд гарахын тулд **mongol-dict ja-mn**-ийг жагсаалтын хамгийн дээр гаргана.

## 6. Шинэчлэх

Толь шинэ үгээр байнга нэмэгддэг. Шинэчлэхдээ: Settings → Dictionaries → **Configure installed and enabled
dictionaries** → **Check for updates** → гарч ирсэн **Update** товч. Дахин татах шаардлагагүй.

## Netflix ба Language Reactor

- **Netflix дээр** манай [Uudam](https://github.com/lobster2k25/uudam) өргөтгөл энэ бүгдийг нэг дор хийдэг:
  фуригана, үгэн дээр дарахад монгол утга, ханзны тайлбар.
- **Language Reactor** өөрийн толь бичгээ ашигладаг бөгөөд гаднаас толь оруулах боломжгүй. Гэхдээ Language
  Reactor-ын хадмал хуудсан дээрх энгийн текст тул Yomitan түүн дээр ажиллана: Language Reactor-ыг асаагаад
  хадмал дээрх үгэн дээр хулганаа аваачаад Shift дарна.

---

## English

**mongol-dict in Yomitan** (Japanese → Mongolian pop-up dictionary on any web page):

1. Install [Yomitan](https://yomitan.wiki/) (Chrome Web Store or Firefox add-ons).
2. Download [`mongol-dict-ja-mn-yomitan.zip`](https://github.com/lobster2k25/mongol-dict/releases/latest/download/mongol-dict-ja-mn-yomitan.zip). Do not unzip it.
3. Yomitan → Settings → Dictionaries → *Configure installed and enabled dictionaries* → **Import** → pick the zip.
4. Hover over Japanese text and press **Shift**. Click a kanji in the pop-up for its entry.
5. Optional English backup: Settings → Language: Japanese → **Get recommended dictionaries...** → install Jitendex or JMdict, and keep mongol-dict at the top of the list.
6. Updates: same window → **Check for updates**.

Language Reactor cannot load outside dictionaries, but Yomitan works on its subtitles (hover and press Shift).
Entries are unreviewed AI drafts, tagged «ноорог». Data: CC BY-SA 4.0.

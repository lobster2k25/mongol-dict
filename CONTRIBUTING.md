# Хэрхэн оролцох

Ямар ч тусламж хэрэгтэй. Хамгийн чухал нь **одоо байгаа бичлэгийг хянах**: бүх бичлэг AI ноорог тул монгол
хэлтэй хүний нүдээр харах шаардлагатай.

## Git мэдэхгүй бол

[Issue нээгээд](../../issues/new) дараахыг бичээрэй:

- ямар үг эсвэл ханз (жишээ нь `分かる`, `休`)
- юу нь буруу
- зөв нь юу байх ёстой

Бид засаад таны нэрийг commit-д дурдана.

## Git мэддэг бол

1. Repo-г fork хийнэ.
2. `data/` доторх файлд засна. Нэг мөр = нэг бичлэг; мөрийн дарааллыг өөрчлөхгүй.
3. Бичлэгийг бүхэлд нь шалгаж зөв гэж үзвэл `"status": "reviewed"` болгоно.
4. Шалгалт ажиллуулна (0 problems гарах ёстой):
   ```sh
   sh scripts/fetch-sources.sh   # нэг удаа
   npm install                   # нэг удаа
   node scripts/build-review.js
   ```
5. Pull request илгээнэ.

## Дүрэм (заавал)

- **Өөрөө бич.** Болор толь, хэвлэмэл болон цахим япон–монгол толь бичиг, апп, JMdict, кино, цувралын хадмал,
  машин орчуулгаас **хуулахгүй**. Бусдын бүтээлийг хуулбал төслийг бүхэлд нь хууль зүйн эрсдэлд оруулна.
- **Жишээ өгүүлбэрийг өөрөө зохио.** Кино, номноос авахгүй.
- AI-аар ноорог гаргаж болно, гэхдээ `"status": "machine"` хэвээр үлдээ. `reviewed` гэж зөвхөн хүн шалгасны
  дараа тавина.
- Монгол хэсэгт **латин үсэг хэрэглэхгүй**.
- Монгол хэлний албан ёсны **зөв бичгийн дүрмийг** баримтал.
- `mnemonic` тэмдэглэл бол цээжлэх арга. Үүнийг ханзны жинхэнэ гарал үүсэл мэт бичихгүй.

## Лиценз

Хувь нэмэр оруулснаар та уг агуулгыг өөрөө бичсэн гэдгээ баталж, түүнийг өгөгдлийн хувьд
[CC BY-SA 4.0](LICENSE), скриптийн хувьд [MIT](scripts/LICENSE) лицензээр түгээхийг зөвшөөрнө.

---

## English

The most useful help is **reviewing existing entries**: all of them are AI drafts. Not using Git? Open an issue
with the word, what's wrong and what it should be. Using Git? Edit the line in `data/`, set
`"status": "reviewed"` only if you checked the whole entry, run `node scripts/build-review.js` (0 problems),
and open a pull request.

Rules: write everything yourself. Never copy from other dictionaries (Bolor Toli, printed or online
Japanese–Mongolian dictionaries, apps), JMdict, film or series subtitles, or machine translation. Compose
example sentences yourself. AI drafts must stay `"status": "machine"`. No Latin letters in Mongolian fields.
Follow standard Mongolian spelling. By contributing you confirm the content is your own and license it under
CC BY-SA 4.0 (data) and MIT (scripts).

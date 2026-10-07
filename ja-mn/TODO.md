# ja-mn — Хийх ажил / To do

Шинэчилсэн: 2026-10-06. Тусламж хэрэгтэй бол аль ч мөрийг сонгоод [issue нээгээрэй](../../../issues/new).

## Одоогийн байдал

| | |
|--|--|
| Хадмалын бүх үгийн хамрах хүрээ | ~89% |
| JMdict-ийн «түгээмэл» 22,645 бичлэгийн хамрах хүрээ | 17.8% (4,041) |
| Хянасан бичлэг | 0 — бүгд AI ноорог |

## Агуулга (дарааллаар)

- [ ] **Хэллэг, мэндчилгээ**: 439 бичигдсэн (`words/phrases-01.json`). Дараагийнх: `node ja-mn/tools/next-words.js 200 phrases`
      (`build-phrases.js` хадмал дахь 2–5 үгтэй хэллэгийг тоолно; 3,594 хэллэг 5-аас дээш удаа гардаг)
- [ ] **Дуу дуурайх, дүр дуурайх үг** (擬音語・擬態語, ~200): うろうろ, うっかり, おろおろ, カチカチ. Анимед маш их
- [ ] **Нэр мэт харагддаг энгийн үг**: 米 (будаа), 巨人 (аварга) г.м. Kuromoji оноосон нэр гэж ангилдаг тул алгассан
- [ ] **Тоо, тоолох нөхцөл**: 二人, 五つ, 冊, 皿, 枚 г.м. (~80)
- [ ] **Дөрвөн ханзтай хэлц** (四字熟語): 一生懸命, 一石二鳥, 喜怒哀楽 (~50)
- [ ] **Зүйр үг, хэлц**: 犬猿の仲, 後の祭り (~15)
- [ ] **Давтамжийн жагсаалтаар үргэлжлүүлэх**: 4,000-аас цааш (`node ja-mn/tools/next-words.js`)
- [ ] **Үзсэн цувралаас**: аниме, драмын үгс (өргөтгөлийн «дутуу үгс» жагсаалтаас)
- [ ] Хүний нэр, баатрын нэр: оруулахгүй (олон янзаар уншигддаг). Өргөтгөл цуврал тус бүрээр сурч болох

## Бичлэгийн хэлбэр

- [ ] **`register` талбар** үгэнд: хүндэтгэлийн (尊敬語), даруу (謙譲語), эелдэг, энгийн, бүдүүлэг, аялгуу (関西弁)
- [ ] **Ханзны он, кун уншлага** (2,136 ханз). Одоо уншлагагүй; өөрсдөө бичнэ (KANJIDIC-ээс хуулахгүй)
- [ ] **Утга бүрт тусдаа жишээ** (sense): `meanings_mn` мөр бүрийг жишээтэй объект болгох
- [ ] JLPT түвшин (нээлттэй лицензтэй жагсаалтаас)
- [ ] Холбоотой үг: эсрэг утга, «мөн үзэх»
- [ ] Ханзны зураасын тоо, түлхүүр

## Чанар

- [ ] **Хянах**: монгол хэлтэй хүн бичлэг бүрийг шалгаж `"status": "reviewed"` болгох. Эхлээд хамгийн их гардаг
      1,000 үг, дараа нь 47 муж, улсууд
- [ ] Хянагчийн нэр, огноог хадгалах (`reviewed_by`, `reviewed_on`)
- [ ] Монгол галиглалын хүснэгтийг монгол хэлтэй хүн батлах (`README.md`-ийн «Нэрийг монголоор бичих дүрэм»)

---

## English

Coverage: ~89% of all subtitle tokens, 17.8% of JMdict's 22,645 "common" entries; 0 entries reviewed.

**Content, in order:** set phrases and greetings (439 done in `phrases-01`; `build-phrases.js` counts 2-5 token
phrases, next ones via `next-words.js 200 phrases`), onomatopoeia (~200), common words the tokenizer labels as proper nouns (米, 巨人), numbers and
counters (~80), four-character idioms (~50), proverbs (~15), then continue down the frequency list and add words
from watched anime/drama. Given names and character names stay out.

**Format:** a `register` field (honorific, humble, polite, casual, rude, dialect); on/kun readings for the 2,136
kanji (written ourselves, not copied from KANJIDIC); per-sense examples; JLPT level; related words; stroke count
and radical.

**Quality:** human review (`status: "reviewed"`), starting with the 1,000 most frequent words, prefectures and
countries; record reviewer and date; have a Mongolian speaker confirm the name transcription table.

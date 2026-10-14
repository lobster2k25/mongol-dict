# Writing ja-mn word drafts (for AI agents and writers)

You write entries for an open Japanese → Mongolian learner dictionary used with TV, drama and anime subtitles
(shown in a browser add-on and in Yomitan). Readers are Mongolians learning Japanese.

Input: a TSV, one word per line: `word<TAB>reading (from a tokenizer, may be wrong)<TAB>tokenizer POS<TAB>count in subtitles`.
The list comes from subtitle word frequency, so some lines are tokenizer debris or names, not real dictionary words.

## Output
A JSON array (UTF-8), one object per line is fine, keys in exactly this order:
{"word":"ブス","reading":"ぶす","alt":["不細工"],"pos":"noun","meanings_mn":["муухай эмэгтэй"],"note_kind":"usage","note_mn":"Хүнд хэлбэл маш доромжилсон үг. Хүнийг ингэж дуудаж болохгүй.","examples":[{"ja":"ブスなんて言うな、失礼だぞ。","mn":"Муухай гэж битгий хэл, бүдүүлэг хэрэг шүү."},{"ja":"あいつにブスと呼ばれて泣いた。","mn":"Тэр намайг муухай гэж дуудаад би уйлсан."}]}

- word: exactly as in the input.
- reading: correct reading in hiragana only (fix the tokenizer's reading if wrong, e.g. 出ろ → でろ).
- alt: other common spellings ([] if none). Never one-character abbreviations.
- pos: one of noun, pronoun, verb, adj-i, adj-na, adverb, particle, auxiliary, conjunction, interjection, prenoun, prefix, suffix, counter, expression.
- meanings_mn: 1-3 short senses, most common first; prefer the sense used in subtitles.
- note_kind + note_mn: an optional short learning tip in Mongolian: "usage" (how/when it is used, register: rude, polite, slang, dialect), "compare" (a look-alike or same-sound word), "mnemonic". Both "" if no useful tip. Never one without the other.
- examples: exactly 2 short, natural, subtitle-style Japanese sentences that contain the word (a conjugated form is fine), each with a natural Mongolian translation. The two must differ.

## Mongolian
Natural Mongolian Cyrillic as a native speaker writes it. Use real Mongolian words, not Russian loans where Mongolian has a word.
NO Latin letters anywhere in Mongolian text: no romaji, no English. If you mention a Japanese word in a note, write it in Japanese script (写真), not "shashin".
Names in Mongolian follow established forms (Токио, Америк) else this table: か ка, し ши, つ цү, ち чи, ふ фү, じ жи, ゆ ю, よ ё; long vowels not doubled.

## Skip, don't write
- Tokenizer debris and fragments that are not something a learner would look up (e.g. る, そ, ちょ, き, っす, half of a split word).
- Personal given names and character names (ベン, アナ as a name, マックス, レン). Surnames and place names are also skipped here (they live in a separate names file).
- Words whose only use is as a fragment of a longer word.
Real words that happen to be katakana loans (ワン = one / woof, ブラ = bra) ARE written if they are real words people say.
Put every skipped word in the skip file: `word<TAB>reason` (one line each).

## Check
Run `node ja-mn/tools/check-draft.js <in.tsv> <out.json> <skip.tsv>` (from the repo root) and fix every problem until it prints OK. Every input word must end up either in the JSON or in the skip file.

## After writing
Merge the checked JSON files into one array, add `"status": "machine"` to every entry, drop any `alt` that is the
word itself or already a headword in `ja-mn/words/`, then
`node ja-mn/tools/add-words.js <merged.json> <next file name>` and `node tools/validate.js` (must print 0 problems).
Add the skipped words to `ja-mn/tools/skip-words.tsv` so `next-words.js` does not list them again.

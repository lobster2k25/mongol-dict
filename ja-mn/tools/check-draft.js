// Checks a batch of drafted word entries against its input list before add-words.js.
// Usage: node ja-mn/tools/check-draft.js <in.tsv> <out.json> [skip.tsv]
// in.tsv: one word per line ("word<TAB>..."), out.json: the drafted entries (DRAFT-RULES.md), skip.tsv: "word<TAB>reason".
// Prints every problem, then "OK" when every input word is either drafted cleanly or skipped.
const fs = require('fs');

const POS = ['noun', 'pronoun', 'verb', 'adj-i', 'adj-na', 'adverb', 'particle', 'auxiliary', 'conjunction', 'interjection',
  'prenoun', 'prefix', 'suffix', 'counter', 'expression'];
const KEYS = ['word', 'reading', 'alt', 'pos', 'meanings_mn', 'note_kind', 'note_mn', 'examples'];
const [input, output, skipFile] = process.argv.slice(2);
const lines = (f) => fs.readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l.trim());
const want = lines(input).map((l) => l.split('\t')[0]);
const entries = JSON.parse(fs.readFileSync(output, 'utf8'));
const skip = new Set(skipFile && fs.existsSync(skipFile) ? lines(skipFile).map((l) => l.split('\t')[0]) : []);

const bad = [];
const seen = new Set();
const stem = (s) => ([...s].length > 1 ? s.slice(0, -1) : s);
for (const e of entries) {
  const p = (m) => bad.push(`${e.word}: ${m}`);
  if (!want.includes(e.word)) { p('not in the input list'); continue; }
  if (seen.has(e.word)) p('duplicate');
  seen.add(e.word);
  if (Object.keys(e).filter((k) => k !== 'status').join() !== KEYS.join()) p(`keys must be exactly ${KEYS.join(', ')} in that order`);
  if (!/^[ぁ-ゟー]+$/.test(e.reading || '')) p(`reading not hiragana: ${e.reading}`);
  if (!Array.isArray(e.alt)) p('alt must be a list');
  if (!POS.includes(e.pos)) p(`bad pos ${e.pos}`);
  const m = Array.isArray(e.meanings_mn) ? e.meanings_mn : [];
  if (!m.length || m.some((x) => typeof x !== 'string' || !x.trim())) p('meanings_mn empty');
  if (!['', 'usage', 'compare', 'mnemonic'].includes(e.note_kind)) p('bad note_kind');
  if (e.note_mn && !e.note_kind) p('note_mn without note_kind');
  if (!e.note_mn && e.note_kind) p('note_kind without note_mn');
  const ex = Array.isArray(e.examples) ? e.examples : [];
  if (ex.length !== 2 || ex.some((x) => Object.keys(x).sort().join() !== 'ja,mn') || (ex.length === 2 && ex[0].ja === ex[1].ja)) p('needs exactly 2 different examples {ja, mn}');
  const forms = [e.word, e.reading, stem(e.word), stem(e.reading || ''), ...(e.alt || [])].filter(Boolean);
  for (const x of ex) if (!forms.some((f) => (x.ja || '').includes(f))) p(`example does not use the word: ${x.ja}`);
  // Mongolian text: Cyrillic, digits, punctuation, and Japanese quoted in notes. Anything else (Latin, romaji) is a slip.
  const mn = [...m, e.note_mn || '', ...ex.map((x) => x.mn || '')].join(' ');
  const odd = mn.replace(/[Ѐ-ӿ\s\d.,!?…«»()\-–—:;'"/%~+=　-ヿ一-鿿！-～]/g, '');
  if (odd) p(`non-Cyrillic letters in Mongolian text: ${odd.slice(0, 30)}`);
}
const missing = want.filter((w) => !seen.has(w) && !skip.has(w));
if (missing.length) bad.push(`MISSING (${missing.length}): ${missing.join(' ')}`);
for (const b of bad) console.log(b);
console.log(`${bad.length ? `${bad.length} problems` : 'OK'} | ${entries.length} entries, ${skip.size} skipped, ${want.length} words`);
process.exitCode = bad.length ? 1 : 0;

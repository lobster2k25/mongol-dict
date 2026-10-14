// Drafts word entries with the Gemini API (free tier), 50 words per request, for add-words.js.
// Input: a word list, one word per line: "word<TAB>reading", or next-words.js output ("rank<TAB>word<TAB>reading<TAB>pos<TAB>count").
// Output: a JSON array of entries with "status": "machine". Each batch is saved as it arrives, and words already in the
// output are skipped, so the script can be stopped and run again. Entries that fail the checks are left out (and retried
// on the next run).
// The API key is read from GEMINI_API_KEY, or from the file given by --key (default: gemini_key.txt next to the repo
// folder). Never put the key in this repo.
// Usage: node ja-mn/tools/next-words.js 200 > ja-mn/sources/todo.txt
//        node ja-mn/tools/gemini-draft.js ja-mn/sources/todo.txt [ja-mn/sources/draft.json] [--model m] [--batch n] [--key file]
//        node ja-mn/tools/add-words.js ja-mn/sources/draft.json 6001-7000
const fs = require('fs');
const path = require('path');
const { root } = require('./lib-sources');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args.splice(i, 2)[1] : def; };
const model = opt('model', 'gemini-3-flash-preview');
const batchSize = +opt('batch', 50);
const keyFile = opt('key', path.join(root, '../../gemini_key.txt'));
const [input, output = path.join(root, 'sources/draft.json')] = args;
if (!input) { console.log('Usage: node ja-mn/tools/gemini-draft.js <words.txt> [draft.json] [--model m] [--batch n] [--key file]'); process.exit(1); }
const key = (process.env.GEMINI_API_KEY || (fs.existsSync(keyFile) ? fs.readFileSync(keyFile, 'utf8') : '')).trim();
if (!key) { console.log(`No API key: set GEMINI_API_KEY or put it in ${keyFile}`); process.exit(1); }

const POS = ['noun', 'pronoun', 'verb', 'adj-i', 'adj-na', 'adverb', 'particle', 'auxiliary', 'conjunction', 'interjection',
  'prenoun', 'prefix', 'suffix', 'counter', 'expression'];
const words = fs.readFileSync(input, 'utf8').split(/\r?\n/).map((l) => l.split('\t'))
  .filter((c) => c[0] && !/ forms covered/.test(c[0]))
  .map((c) => (/^\d+$/.test(c[0]) ? { word: c[1], reading: c[2] || '' } : { word: c[0], reading: c[1] || '' }));
const done = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, 'utf8')) : [];
const have = new Set(done.map((e) => e.word));
const todo = words.filter((w) => !have.has(w.word));
console.log(`${words.length} words, ${have.size} already drafted, ${todo.length} to go (${model}, ${batchSize} per request)`);

const example = {
  word: 'ブス', reading: 'ぶす', alt: ['不細工'], pos: 'noun', meanings_mn: ['муухай эмэгтэй'], note_kind: 'usage',
  note_mn: 'Хүнд хэлбэл маш доромжилсон үг.', examples: [{ ja: 'ブスなんて言うな、失礼だぞ。', mn: 'Муухай гэж битгий хэл, бүдүүлэг хэрэг шүү.' },
    { ja: 'あいつにブスと呼ばれて泣いた。', mn: 'Тэр намайг муухай гэж дуудаад би уйлсан.' }],
};
const prompt = (batch) => `You write entries for a Japanese to Mongolian learner dictionary used with TV and anime subtitles.
For EACH word below write one entry in natural, correct Mongolian Cyrillic, as a native Mongolian speaker writes it.
Fields:
- word: exactly as given. reading: the reading in hiragana only.
- alt: other common spellings ([] if none).
- pos: one of ${POS.join(', ')}.
- meanings_mn: 1-3 short senses, most common first; give the sense used in subtitles.
- note_kind: "usage", "compare", "mnemonic" or "". note_mn: a short helpful tip, or "".
- examples: exactly 2 short, natural, subtitle-style Japanese sentences that contain the word, each with a Mongolian translation.
Never use Latin letters (no romaji, no English) in Mongolian text; write Japanese words in Japanese script.
Example entry: ${JSON.stringify(example)}
Return a JSON array, one entry per word, in the same order.
Words (word, reading):
${batch.map((w) => `${w.word}\t${w.reading}`).join('\n')}`;

const S = { type: 'STRING' };
const schema = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      word: S, reading: S, alt: { type: 'ARRAY', items: S }, pos: { type: 'STRING', enum: POS }, meanings_mn: { type: 'ARRAY', items: S },
      note_kind: S, note_mn: S,
      examples: { type: 'ARRAY', items: { type: 'OBJECT', properties: { ja: S, mn: S }, required: ['ja', 'mn'] } },
    },
    required: ['word', 'reading', 'alt', 'pos', 'meanings_mn', 'note_kind', 'note_mn', 'examples'],
    propertyOrdering: ['word', 'reading', 'alt', 'pos', 'meanings_mn', 'note_kind', 'note_mn', 'examples'],
  },
};

// Returns a reason the entry can't be used, or ''.
function problem(e, want) {
  if (e.word !== want.word) return `came back as ${e.word}`;
  if (!/^[ぁ-ゟー]+$/.test(e.reading)) return `reading is not hiragana: ${e.reading}`;
  if (!e.meanings_mn.length || e.meanings_mn.some((m) => !m.trim())) return 'no meanings';
  if (!['', 'usage', 'compare', 'mnemonic'].includes(e.note_kind)) return `bad note_kind ${e.note_kind}`;
  if (e.note_mn && !e.note_kind) e.note_kind = 'usage'; // the model often leaves the kind empty; most tips are usage notes
  if (e.examples.length !== 2 || e.examples[0].ja === e.examples[1].ja) return 'needs 2 different examples';
  const stem = (w) => ([...w].length > 1 ? w.slice(0, -1) : w);
  if (e.examples.some((x) => ![e.word, e.reading, stem(e.word), stem(e.reading), ...e.alt].some((f) => f && x.ja.includes(f)))) return 'an example does not use the word';
  // Mongolian text: Cyrillic, digits, punctuation, and Japanese quoted in notes. Anything else (Latin, Hebrew...) is a slip.
  const mn = [...e.meanings_mn, e.note_mn, ...e.examples.map((x) => x.mn)].join(' ');
  const odd = mn.replace(/[Ѐ-ӿ\s\d.,!?…«»()\-–—:;'"/%~+=　-ヿ一-鿿！-～]/g, '');
  if (odd) return `odd letters in Mongolian: ${odd.slice(0, 20)}`;
  return '';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function request(batch) {
  const body = { contents: [{ parts: [{ text: prompt(batch) }] }], generationConfig: { responseMimeType: 'application/json', responseSchema: schema } };
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      const parts = data.candidates?.[0]?.content?.parts || [];
      return JSON.parse(parts.map((p) => p.text || '').join(''));
    }
    const msg = data.error?.message || res.statusText;
    if (res.status === 429) {
      // Free tier: a per-minute limit waits; a per-day limit (resets at midnight Pacific time) stops the run.
      const quota = (data.error?.details || []).flatMap((d) => d.violations || []).map((v) => v.quotaId).join(' ');
      if (/PerDay/i.test(quota) || /limit: 0\b/.test(msg)) throw new Error(`free daily limit reached, run again tomorrow (${quota || msg.split('\n')[0]})`);
      const wait = +((msg.match(/retry in ([\d.]+)s/) || [])[1] || 60);
      console.log(`  per-minute limit, waiting ${Math.ceil(wait)} s`);
      await sleep(wait * 1000 + 1000);
    } else if ((res.status === 503 || res.status === 500) && attempt < 6) {
      console.log(`  ${res.status} (busy), trying again in ${30 * attempt} s`);
      await sleep(30000 * attempt);
    } else {
      throw new Error(`${res.status}: ${msg.split('\n')[0]}`);
    }
  }
}

(async () => {
  let added = 0;
  const skipped = [];
  for (let i = 0; i < todo.length; i += batchSize) {
    const batch = todo.slice(i, i + batchSize);
    const started = Date.now();
    let got;
    try {
      got = await request(batch);
    } catch (err) {
      console.log(`Stopped: ${err.message}`);
      break;
    }
    const byWord = new Map(got.map((e) => [e.word, e]));
    for (const want of batch) {
      const e = byWord.get(want.word);
      const why = e ? problem(e, want) : 'missing from the answer';
      if (why) { skipped.push(`${want.word}: ${why}`); continue; }
      done.push({ ...e, status: 'machine' });
      added++;
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `[\n${done.map((e) => JSON.stringify(e)).join(',\n')}\n]\n`);
    console.log(`${Math.min(i + batchSize, todo.length)}/${todo.length}: ${done.length} in ${path.relative(process.cwd(), output)} (${Math.round((Date.now() - started) / 1000)} s)`);
    await sleep(Math.max(0, 4500 - (Date.now() - started))); // stay under 15 requests a minute
  }
  console.log(`${added} new drafts, ${skipped.length} left out (they are tried again next run)`);
  for (const s of skipped) console.log(`  ${s}`);
})();

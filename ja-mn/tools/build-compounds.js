// Builds sources/compound-freq.json: compound words (取り戻す, 一生懸命, 誕生日) and onomatopoeia (ドキドキ,
// うろうろ, ぺこぺこ) ranked by how often they occur in subtitles. build-freq.js counts single tokens, so words
// kuromoji splits into parts never reach next-words.js, and onomatopoeia sit far down its list. Candidates are
// JMdict headwords (only the Japanese form is used, to choose what to write next; nothing else from JMdict):
// - "onomatopoeia": entries JMdict marks as on-mim, counted as one token or as 2–5 joined tokens;
// - "compound": other entries (not expressions or interjections, which build-phrases.js counts) whose written
//   form has a kanji and that kuromoji splits into 2–5 tokens. Spans with a particle or verb ending (彼の, 時に,
//   信じられない) are grammar, and a plural suffix (私たち, お前ら) adds nothing to its parts: neither counts.
// Single-token onomatopoeia need 3+ characters: two-kana ones (ほう, くい) are mostly other words.
// Spans are joined the way the extension joins them (extension/src/lookup.js), so every counted word is one the
// popup can find once we write it. Longest match first, as the extension does.
// Usage: node ja-mn/tools/build-compounds.js [maxLines]  →  next ones: node ja-mn/tools/next-words.js 200 compounds|onomatopoeia
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const kuromoji = require('kuromoji');
const { root } = require('./lib-sources');

const hira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const maxLines = +(process.argv[2] || Infinity);
const MAX_SPAN = 5;
const KANJI = /[一-龯々]/;

const candidates = new Map(); // form → { reading, kind }
const xml = fs.readFileSync(path.join(root, 'sources/JMdict_e'), 'utf8');
for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
  const e = m[1];
  const mim = /&on-mim;/.test(e);
  if (!mim && /<pos>&(exp|int);<\/pos>/.test(e)) continue;
  if (!mim && !/<pos>&(n|n-adv|n-t|vs|v1|v5[a-z]*|vk|adj-[a-z]+|adv|adv-to|pn);<\/pos>/.test(e)) continue;
  const kebs = [...e.matchAll(/<keb>(.*?)<\/keb>/g)].map((x) => x[1]);
  const rebs = [...e.matchAll(/<reb>(.*?)<\/reb>/g)].map((x) => x[1]);
  const forms = mim ? [...kebs, ...rebs] : kebs.filter((k) => KANJI.test(k));
  for (const f of forms) {
    if (f.length < 2 || candidates.has(f)) continue;
    candidates.set(f, { reading: hira(rebs[0] || ''), kind: mim ? 'onomatopoeia' : 'compound' });
  }
}

kuromoji.builder({ dicPath: path.join(path.dirname(require.resolve('kuromoji/package.json')), 'dict') }).build(async (err, tk) => {
  if (err) throw err;
  const base = (t) => (t.basic_form && t.basic_form !== '*' ? t.basic_form : t.surface_form);
  // Particles, auxiliaries and dependent verbs (られ, いる in 〜ている) make a span grammar, not a compound.
  const grammar = (t) => ['助詞', '助動詞'].includes(t.pos) || (t.pos === '動詞' && ['非自立', '接尾'].includes(t.pos_detail_1));
  const PLURAL = /^(たち|達|ら|ども|共)$/;
  const counts = new Map();
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(root, 'sources/opensubtitles-ja.txt')) });
  let n = 0;
  for await (const line of rl) {
    if (++n > maxLines) break;
    const toks = tk.tokenize(line);
    for (let i = 0; i < toks.length; i++) {
      for (let len = Math.min(MAX_SPAN, toks.length - i); len >= 1; len--) {
        const span = toks.slice(i, i + len);
        const surface = span.map((t) => t.surface_form).join('');
        const dictForm = span.slice(0, -1).map((t) => t.surface_form).join('') + base(span[len - 1]);
        // One token only counts for onomatopoeia; a single-token compound is already in word-freq.json.
        const hit = [dictForm, surface].find((f) => {
          const c = candidates.get(f);
          if (!c) return false;
          if (c.kind === 'onomatopoeia') return len > 1 || f.length >= 3;
          return len > 1 && !span.some(grammar) && !PLURAL.test(span[len - 1].surface_form);
        });
        if (hit) { counts.set(hit, (counts.get(hit) || 0) + 1); i += len - 1; break; }
      }
    }
  }
  const out = [...counts].filter(([, c]) => c >= 5).sort((a, b) => b[1] - a[1])
    .map(([word, count], i) => JSON.stringify({ rank: i + 1, word, reading: candidates.get(word).reading, kind: candidates.get(word).kind, count }));
  fs.writeFileSync(path.join(root, 'sources/compound-freq.json'), `[\n${out.join(',\n')}\n]\n`);
  const kinds = out.map((l) => JSON.parse(l).kind);
  console.log(`${Math.min(n, maxLines)} lines, ${candidates.size} candidate forms, seen 5+ times: `
    + `${kinds.filter((k) => k === 'compound').length} compounds, ${kinds.filter((k) => k === 'onomatopoeia').length} onomatopoeia`);
});

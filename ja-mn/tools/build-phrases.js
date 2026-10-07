// Builds sources/phrase-freq.json: set phrases (お願いします, お疲れ様, 気をつけて) ranked by how often they occur
// in subtitles. build-freq.js counts one token at a time, so phrases kuromoji splits into several tokens never
// reach next-words.js. Candidates are JMdict headwords marked as expressions or interjections (only the Japanese
// form is used, to choose what to write next; nothing else from JMdict). A phrase is counted wherever 2-5
// consecutive tokens spell it, joined the way the extension joins them (extension/src/lookup.js), so every
// counted phrase is one the popup can find once we write it. Spans with fewer than two content words are grammar
// (には, それは, んだ) or a verb with its ending (知らない), which the popup already shows as one word; they count
// only when JMdict calls the phrase an interjection (すみません, いらっしゃいませ).
// Usage: node ja-mn/tools/build-phrases.js [maxLines]
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const kuromoji = require('kuromoji');
const { root } = require('./lib-sources');

const hira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const maxLines = +(process.argv[2] || Infinity);
const MAX_SPAN = 5;

const candidates = new Map(); // form → reading
const interjections = new Set();
const xml = fs.readFileSync(path.join(root, 'sources/JMdict_e'), 'utf8');
for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
  const e = m[1];
  if (!/<pos>&(exp|int);<\/pos>/.test(e)) continue;
  const kebs = [...e.matchAll(/<keb>(.*?)<\/keb>/g)].map((x) => x[1]);
  const rebs = [...e.matchAll(/<reb>(.*?)<\/reb>/g)].map((x) => x[1]);
  const forms = [...kebs, ...(!kebs.length || /&uk;/.test(e) ? rebs : [])];
  for (const f of forms) {
    if (f.length < 2) continue;
    if (!candidates.has(f)) candidates.set(f, hira(rebs[0] || ''));
    if (/<pos>&int;<\/pos>/.test(e)) interjections.add(f);
  }
}

kuromoji.builder({ dicPath: path.join(path.dirname(require.resolve('kuromoji/package.json')), 'dict') }).build(async (err, tk) => {
  if (err) throw err;
  const base = (t) => (t.basic_form && t.basic_form !== '*' ? t.basic_form : t.surface_form);
  const content = (t) => (['動詞', '形容詞', '副詞', '感動詞', '連体詞', '接頭詞'].includes(t.pos) && t.pos_detail_1 !== '非自立')
    || (t.pos === '名詞' && !['代名詞', '非自立', '接尾'].includes(t.pos_detail_1));
  const counts = new Map();
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(root, 'sources/opensubtitles-ja.txt')) });
  let n = 0;
  for await (const line of rl) {
    if (++n > maxLines) break;
    const toks = tk.tokenize(line);
    for (let i = 0; i < toks.length; i++) {
      // Longest match only, as the extension does: お願いします should not also count お願い.
      for (let len = Math.min(MAX_SPAN, toks.length - i); len >= 2; len--) {
        const span = toks.slice(i, i + len);
        const surface = span.map((t) => t.surface_form).join('');
        const dictForm = span.slice(0, -1).map((t) => t.surface_form).join('') + base(span[len - 1]);
        const hit = [dictForm, surface].find((f) => candidates.has(f) && (interjections.has(f) || span.filter(content).length >= 2));
        if (hit) { counts.set(hit, (counts.get(hit) || 0) + 1); i += len - 1; break; }
      }
    }
  }
  const out = [...counts].filter(([, c]) => c >= 5).sort((a, b) => b[1] - a[1])
    .map(([word, count], i) => JSON.stringify({ rank: i + 1, word, reading: candidates.get(word), count }));
  fs.writeFileSync(path.join(root, 'sources/phrase-freq.json'), `[\n${out.join(',\n')}\n]\n`);
  console.log(`${Math.min(n, maxLines)} lines, ${candidates.size} candidate forms, ${out.length} phrases seen 5+ times`);
});

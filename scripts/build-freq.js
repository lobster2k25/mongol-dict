// Builds sources/word-freq.json: subtitle word frequency by dictionary form, used only to choose which
// words to write next. Input: sources/opensubtitles-ja.txt (OPUS OpenSubtitles v2018 Japanese, ~3.2M lines;
// reference only, like KANJIDIC). Each line is split with kuromoji and counts go to the dictionary form,
// so 言って, 言った, 言わない all count as 言う.
// Usage: node scripts/build-freq.js [maxLines]
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const kuromoji = require('kuromoji');
const { root } = require('./lib-sources');

const hira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const japanese = /[぀-ヿ一-鿿]/;
const maxLines = +(process.argv[2] || Infinity);

kuromoji.builder({ dicPath: path.join(root, 'node_modules/kuromoji/dict') }).build(async (err, tk) => {
  if (err) throw err;
  const freq = new Map();
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(root, 'sources/opensubtitles-ja.txt')) });
  let n = 0;
  for await (const line of rl) {
    if (++n > maxLines) break;
    for (const t of tk.tokenize(line)) {
      if (t.pos === '記号' || t.pos_detail_1 === '固有名詞' || t.pos_detail_1 === '数' || t.word_type !== 'KNOWN') continue;
      const base = t.basic_form;
      if (!japanese.test(base)) continue;
      const key = `${base}\t${t.pos}`;
      let e = freq.get(key);
      if (!e) freq.set(key, (e = { word: base, pos: t.pos, sub: t.pos_detail_1, count: 0, reading: '' }));
      e.count++;
      if (base === t.surface_form) e.reading = hira(t.reading || '');
    }
  }
  const out = [...freq.values()].filter((e) => e.count >= 5).sort((a, b) => b.count - a.count);
  out.forEach((e, i) => {
    e.rank = i + 1;
    if (!e.reading) e.reading = hira(tk.tokenize(e.word).map((t) => t.reading || t.surface_form).join(''));
  });
  const rows = out.map(({ rank, word, reading, pos, sub, count }) => JSON.stringify({ rank, word, reading, pos, sub, count }));
  fs.writeFileSync(path.join(root, 'sources/word-freq.json'), `[\n${rows.join(',\n')}\n]\n`);
  console.log(`${Math.min(n, maxLines)} lines, ${out.length} dictionary forms`);
});

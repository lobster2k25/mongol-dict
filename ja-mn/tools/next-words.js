// Lists the most frequent subtitle words not yet in ja-mn/words/, from sources/word-freq.json,
// or with "phrases" the most frequent set phrases from sources/phrase-freq.json (build-phrases.js).
// Usage: node ja-mn/tools/next-words.js [count] [phrases]
const fs = require('fs');
const path = require('path');
const { root } = require('./lib-sources');

// Tokenizer debris and fragments that are not words a learner would look up.
const SKIP = new Set(['ン', 'う', 'こ', 'え', 'く', 'ら', 'お', 'ご', 'し', 'さ', 'ば', 'や', 'ど', 'ぬ', 'つ', 'ぁ', 'ぇ', 'ぃ', 'ま', 'そっ', 'だい', 'くい',
  // Names and loanwords the tokenizer can't tell apart (Jack, Mike/microphone, lock/rock).
  'ジャック', 'マイク', 'ロック', 'サラ', 'レッド', 'マン', 'ろ', 'り', 'ガン',
  'レ', 'ジャー', 'イカ', '山里', 'ジム', 'マーク']);

const [count = 100, mode] = process.argv.slice(2);
const freq = JSON.parse(fs.readFileSync(path.join(root, `sources/${mode === 'phrases' ? 'phrase' : 'word'}-freq.json`), 'utf8'));
const dir = path.join(root, 'words');
const done = new Set();
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    for (const e of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) [e.word, ...(e.alt || [])].forEach((w) => done.add(w));
  }
}
const todo = freq.filter((e) => !done.has(e.word) && !SKIP.has(e.word) && !/^[０-９0-9]/.test(e.word));
console.log(`${done.size} forms covered; next ${count}:`);
for (const e of todo.slice(0, +count)) console.log(`${e.rank}\t${e.word}\t${e.reading}\t${e.pos}/${e.sub}\t${e.count}`);

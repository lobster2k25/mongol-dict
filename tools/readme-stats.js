// Writes the current counts (words, kanji, names, human-reviewed) and version into README.md, between the
// <!-- stats:... --> markers. add-words.js runs it after every batch; run it by hand after other changes:
// node tools/readme-stats.js
const fs = require('fs');
const path = require('path');

const repo = path.join(__dirname, '..');
const entries = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

function stats(lang = 'ja-mn') {
  const [words, kanji, names] = ['words', 'kanji', 'names'].map((d) => entries(path.join(repo, lang, d)));
  const reviewed = [...words, ...kanji, ...names].filter((e) => e.status === 'reviewed').length;
  return { words: words.length, kanji: kanji.length, names: names.length, reviewed };
}

function update() {
  const s = stats();
  const n = (x) => x.toLocaleString('en-US');
  const { version } = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
  const parts = {
    version,
    words: n(s.words), kanji: n(s.kanji), names: n(s.names), reviewed: n(s.reviewed),
  };
  const file = path.join(repo, 'README.md');
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [key, value] of Object.entries(parts)) {
    after = after.replace(new RegExp(`(<!-- stats:${key} -->)[\\s\\S]*?(<!-- /stats -->)`, 'g'), `$1${value}$2`);
  }
  if (after !== before) fs.writeFileSync(file, after);
  return s;
}

module.exports = { stats, update };
if (require.main === module) {
  const s = update();
  console.log(`README: ${s.words} words, ${s.kanji} kanji, ${s.names} names, ${s.reviewed} reviewed`);
}

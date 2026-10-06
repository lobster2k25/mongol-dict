// Builds the release files into dist/ for every <code>-mn/ folder:
//   mongol-dict-<lang>.json          all entries of that language in one file
//   mongol-dict-<lang>-yomitan.zip   a Yomitan dictionary (Japanese only: needs kuromoji for verb classes)
//   mongol-dict-<lang>-yomitan-index.json   the zip's index.json, so Yomitan can check for updates
// Usage: node tools/build-release.js [version]   (default: version in package.json)
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = (process.argv[2] || pkg.version).replace(/^v/, '');
const repo = 'https://github.com/lobster2k25/mongol-dict';
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

const readDir = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [])
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

// Minimal zip writer (deflate), so the build needs no zip tool.
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function zip(files) {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const [name, text] of files) {
    const data = Buffer.from(text, 'utf8');
    const packed = zlib.deflateRawSync(data, { level: 9 });
    const fname = Buffer.from(name, 'utf8');
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6); head.writeUInt16LE(8, 8);
    head.writeUInt32LE(0, 10); head.writeUInt32LE(crc32(data), 14); head.writeUInt32LE(packed.length, 18);
    head.writeUInt32LE(data.length, 22); head.writeUInt16LE(fname.length, 26); head.writeUInt16LE(0, 28);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(8, 10); cen.writeUInt32LE(0, 12); cen.writeUInt32LE(crc32(data), 16); cen.writeUInt32LE(packed.length, 20);
    cen.writeUInt32LE(data.length, 24); cen.writeUInt16LE(fname.length, 28); cen.writeUInt32LE(offset, 42);
    parts.push(head, fname, packed);
    central.push(cen, fname);
    offset += 30 + fname.length + packed.length;
  }
  const cenBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cenBuf.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cenBuf, end]);
}

// Yomitan tags: part of speech and review status, shown beside each entry.
const POS_TAGS = {
  noun: ['нэр', 'нэр үг'], pronoun: ['төлөөн', 'төлөөний үг'], verb: ['үйл', 'үйл үг'],
  'adj-i': ['тэмд-い', 'い-тэмдэг нэр'], 'adj-na': ['тэмд-な', 'な-тэмдэг нэр'], adjective: ['тэмд', 'тэмдэг нэр'],
  adverb: ['дайвар', 'дайвар үг'], numeral: ['тоо', 'тооны нэр'], particle: ['сул', 'сул үг (助詞)'],
  postposition: ['дагавар үг', 'дагавар үг'], preposition: ['угтвар үг', 'угтвар үг'],
  auxiliary: ['туслах', 'туслах үйл үг (助動詞)'], conjunction: ['холбоос', 'холбоос үг'],
  interjection: ['аялга', 'аялга үг'], prenoun: ['тодот', 'тодотгол (連体詞)'], prefix: ['угтвар', 'угтвар'],
  suffix: ['дагавар', 'дагавар'], counter: ['тоолуур', 'тоолох нөхцөл (助数詞)'], expression: ['хэллэг', 'хэллэг'],
};
const NAME_TAGS = {
  country: ['улс', 'улсын нэр'], region: ['бүс', 'бүс нутаг, тив'], place: ['газар', 'газрын нэр'],
  landmark: ['газар', 'газрын нэр'], org: ['байгууллага', 'байгууллагын нэр'], group: ['бүлэг', 'бүлэг, шашин, ард түмэн'],
  surname: ['овог', 'Японы овог'], other: ['оноосон', 'оноосон нэр'],
};
const STATUS_TAGS = { machine: ['ноорог', 'Хиймэл оюуны ноорог, хүн хянаагүй'], reviewed: ['хянасан', 'Монгол хэлтэй хүн хянасан'] };

// Yomitan deinflection rules (v1, v5, vs, vk, adj-i), from kuromoji's conjugation type of the dictionary form.
function verbRules(tokenizer, e) {
  if (e.pos === 'adj-i') return 'adj-i';
  if (e.pos !== 'verb') return '';
  const w = e.word;
  if (w === 'する' || w.endsWith('する')) return 'vs';
  if (w === '来る' || w === 'くる') return 'vk';
  const t = tokenizer.tokenize(w);
  const type = t.length === 1 ? t[0].conjugated_type : '';
  if (type.startsWith('一段')) return 'v1';
  if (type.startsWith('五段')) return 'v5';
  if (type.startsWith('サ変')) return 'vs';
  if (type.startsWith('カ変')) return 'vk';
  return /る$/.test(w) ? 'v1 v5' : 'v5';
}

const kana = /^[぀-ヿ]+$/;

function yomitan(lang, words, names, kanji, tokenizer) {
  const terms = [];
  for (const e of names) {
    const gloss = e.desc_mn ? [e.mn, e.desc_mn] : [e.mn];
    const forms = [[e.word, kana.test(e.word) ? '' : e.reading], ...e.alt.map((a) => [a, kana.test(a) ? '' : e.reading])];
    for (const [expr, reading] of forms) terms.push([expr, reading, NAME_TAGS[e.kind][0], '', 0, gloss, e.id, STATUS_TAGS[e.status][0]]);
  }
  for (const e of words) {
    const gloss = [...e.meanings_mn];
    if (e.note_mn) gloss.push(`※ ${e.note_mn}`);
    gloss.push(`Жишээ: ${e.example.ja} — ${e.example.mn}`);
    const tags = (POS_TAGS[e.pos] || [e.pos])[0];
    const status = STATUS_TAGS[e.status][0];
    const rules = verbRules(tokenizer, e);
    const score = Math.max(0, 10000 - e.id);
    const forms = [[e.word, kana.test(e.word) ? '' : e.reading], ...e.alt.map((a) => [a, kana.test(a) ? '' : e.reading])];
    for (const [expr, reading] of forms) terms.push([expr, reading, tags, rules, score, gloss, e.id, status]);
  }
  const kanjiRows = kanji.map((k) => [k.kanji, '', '', STATUS_TAGS[k.status][0],
    [...k.meanings_mn, ...(k.note_mn ? [`※ ${k.note_mn}`] : []), ...k.examples.map((x) => `${x.word}（${x.reading}）— ${x.mn}`)], {}]);
  const tagBank = [
    ...Object.values(POS_TAGS).map(([name, notes]) => [name, 'partOfSpeech', 0, notes, 0]),
    ...[...new Map(Object.values(NAME_TAGS).map((t) => [t[0], t])).values()].map(([name, notes]) => [name, 'name', 0, notes, 0]),
    ...Object.values(STATUS_TAGS).map(([name, notes]) => [name, 'status', 1, notes, 0]),
  ];
  const latest = `${repo}/releases/latest/download`;
  const index = {
    title: `mongol-dict ${lang}`,
    format: 3,
    revision: version,
    sequenced: true,
    author: 'mongol-dict contributors',
    url: repo,
    description: 'Япон → Монгол нээлттэй толь бичиг: үг, ханз, жишээ. Ихэнх бичлэг хиймэл оюуны ноорог (ноорог шошготой). / Open Japanese → Mongolian dictionary; most entries are unreviewed AI drafts.',
    attribution: `mongol-dict (${repo}), CC BY-SA 4.0`,
    sourceLanguage: 'ja',
    targetLanguage: 'mn',
    isUpdatable: true,
    indexUrl: `${latest}/mongol-dict-${lang}-yomitan-index.json`,
    downloadUrl: `${latest}/mongol-dict-${lang}-yomitan.zip`,
  };
  const chunk = (rows, n) => Array.from({ length: Math.ceil(rows.length / n) }, (_, i) => rows.slice(i * n, i * n + n));
  const files = [['index.json', JSON.stringify(index)], ['tag_bank_1.json', JSON.stringify(tagBank)]];
  chunk(terms, 10000).forEach((rows, i) => files.push([`term_bank_${i + 1}.json`, JSON.stringify(rows)]));
  chunk(kanjiRows, 10000).forEach((rows, i) => files.push([`kanji_bank_${i + 1}.json`, JSON.stringify(rows)]));
  fs.writeFileSync(path.join(dist, `mongol-dict-${lang}-yomitan.zip`), zip(files));
  fs.writeFileSync(path.join(dist, `mongol-dict-${lang}-yomitan-index.json`), `${JSON.stringify(index, null, 2)}\n`);
  return terms.length;
}

async function main() {
  const langs = fs.readdirSync(root).filter((d) => /^[a-z]{2,3}-mn$/.test(d) && fs.statSync(path.join(root, d)).isDirectory()).sort();
  for (const lang of langs) {
    const words = readDir(path.join(root, lang, 'words')).sort((a, b) => a.id - b.id);
    const kanji = readDir(path.join(root, lang, 'kanji'));
    const names = readDir(path.join(root, lang, 'names')).sort((a, b) => a.id - b.id);
    const all = { name: 'mongol-dict', language: lang, version, license: 'CC BY-SA 4.0', url: repo, kanji, words, names };
    fs.writeFileSync(path.join(dist, `mongol-dict-${lang}.json`), JSON.stringify(all));
    let note = '';
    if (lang === 'ja-mn') {
      const kuromoji = require('kuromoji');
      const dicPath = path.join(path.dirname(require.resolve('kuromoji/package.json')), 'dict');
      const tokenizer = await new Promise((ok, fail) => kuromoji.builder({ dicPath }).build((err, t) => (err ? fail(err) : ok(t))));
      note = `, Yomitan: ${yomitan(lang, words, names, kanji, tokenizer)} term rows`;
    }
    console.log(`${lang} ${version}: ${words.length} words, ${names.length} names, ${kanji.length} kanji${note}`);
  }
}
main();

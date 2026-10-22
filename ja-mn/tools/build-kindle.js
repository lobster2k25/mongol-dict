// Builds a Kindle dictionary (Japanese → Mongolian) source into dist/kindle/: an OPF file plus XHTML pages with
// Amazon's idx: markup. Then kindlegen (inside Kindle Previewer 3) turns it into a .mobi:
//   kindlegen dist/kindle/mongol-dict-ja-mn.opf -c2 -verbose -dont_append_source
// Kindle does not turn 食べた back into 食べる by itself, so every verb and adjective lists its conjugated forms
// (idx:iform), for the written word, its kana reading and its other spellings. Verb classes come from kuromoji,
// like the Yomitan file in tools/build-release.js.
// Usage: node ja-mn/tools/build-kindle.js [version]   (default: version in package.json)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const lang = path.join(root, 'ja-mn');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = (process.argv[2] || pkg.version).replace(/^v/, '');
const repo = 'https://github.com/lobster2k25/mongol-dict';
const out = path.join(root, 'dist', 'kindle');
const NAME = 'mongol-dict-ja-mn';
const PER_PAGE = 2000; // entries per XHTML file (kindlegen copes better with many small files)

const readDir = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const POS_MN = {
  noun: 'нэр үг', pronoun: 'төлөөний үг', verb: 'үйл үг', 'adj-i': 'тэмдэг нэр (い)', 'adj-na': 'тэмдэг нэр (な)',
  adverb: 'дайвар үг', particle: 'нөхцөл', auxiliary: 'туслах үг', conjunction: 'холбоос үг',
  interjection: 'аялга үг', prenoun: 'тодотгол', prefix: 'угтвар', suffix: 'дагавар',
  counter: 'тоо ширхэг', expression: 'хэллэг',
};
const NAME_MN = {
  country: 'улс', region: 'бүс нутаг', place: 'газрын нэр', landmark: 'газрын нэр',
  org: 'байгууллага', group: 'бүлэг, шашин', surname: 'овог', other: 'оноосон нэр',
};

// ---------- conjugated forms ----------

// Godan endings: [i-row, a-row, e-row, o-row, te, ta].
const GODAN = {
  く: ['き', 'か', 'け', 'こ', 'いて', 'いた'], ぐ: ['ぎ', 'が', 'げ', 'ご', 'いで', 'いだ'],
  す: ['し', 'さ', 'せ', 'そ', 'して', 'した'], つ: ['ち', 'た', 'て', 'と', 'って', 'った'],
  ぬ: ['に', 'な', 'ね', 'の', 'んで', 'んだ'], ぶ: ['び', 'ば', 'べ', 'ぼ', 'んで', 'んだ'],
  む: ['み', 'ま', 'め', 'も', 'んで', 'んだ'], る: ['り', 'ら', 'れ', 'ろ', 'って', 'った'],
  う: ['い', 'わ', 'え', 'お', 'って', 'った'],
};
// Forms built on the te-form and the ta-form.
const fromTe = (te) => [te, `${te}いる`, `${te}る`, `${te}いた`, `${te}た`, `${te}います`, `${te}いない`, `${te}しまう`,
  `${te}しまった`, `${te}ください`, te.endsWith('で') ? `${te.slice(0, -1)}じゃう` : `${te.slice(0, -1)}ちゃう`,
  te.endsWith('で') ? `${te.slice(0, -1)}じゃった` : `${te.slice(0, -1)}ちゃった`];
const fromTa = (ta) => [ta, `${ta}ら`, `${ta}り`];
const masu = (i) => [`${i}ます`, `${i}ました`, `${i}ません`, `${i}ませんでした`, `${i}ましょう`, `${i}たい`, `${i}たくない`, `${i}たかった`, `${i}ながら`];
const nai = (a) => [`${a}ない`, `${a}なかった`, `${a}なくて`, `${a}なければ`, `${a}ないで`, `${a}ず`];

function godan(w) {
  const row = GODAN[w.slice(-1)];
  if (!row) return [];
  const s = w.slice(0, -1);
  let [i, a, e, o, te, ta] = row;
  if (/(行く|^いく|[てで]いく)$/.test(w)) { te = 'って'; ta = 'った'; } // 行って, not 行いて
  return [...masu(s + i), ...(s.length + i.length >= 2 ? [s + i] : []), ...nai(s + a), `${s}${a}れる`, `${s}${a}せる`,
    `${s}${e}ば`, s + e, `${s}${e}る`, `${s}${o}う`, ...fromTe(s + te), ...fromTa(s + ta)];
}
function ichidan(w) {
  const s = w.slice(0, -1);
  return [...masu(s), ...(s.length >= 2 ? [s] : []), ...nai(s), `${s}られる`, `${s}させる`, `${s}れば`, `${s}ろ`, `${s}よ`,
    `${s}よう`, `${s}れる`, ...fromTe(`${s}て`), ...fromTa(`${s}た`)];
}
function suru(w) {
  const s = w.slice(0, -2);
  return [...masu(`${s}し`), ...nai(`${s}し`), `${s}せず`, `${s}される`, `${s}させる`, `${s}すれば`, `${s}しろ`, `${s}せよ`,
    `${s}しよう`, `${s}できる`, ...fromTe(`${s}して`), ...fromTa(`${s}した`)];
}
function kuru(w) {
  // 来る / くる, alone or at the end of a compound (持って来る): kanji keeps 来, kana changes く→き/こ.
  const kanji = w.endsWith('来る');
  const s = w.slice(0, -2);
  const [ki, ko, ku] = kanji ? ['来', '来', '来'] : ['き', 'こ', 'く'];
  return [...masu(s + ki), ...nai(s + ko), `${s}${ko}られる`, `${s}${ko}させる`, `${s}${ku}れば`, `${s}${ko}い`, `${s}${ko}よう`,
    ...fromTe(`${s}${ki}て`), ...fromTa(`${s}${ki}た`)];
}
function adjI(w) {
  // いい conjugates from よい.
  const base = w.endsWith('いい') ? `${w.slice(0, -2)}よい` : w;
  const s = base.slice(0, -1);
  const sou = /(よ|な)い$/.test(base) ? `${s}さそう` : `${s}そう`; // よさそう, なさそう
  return [`${s}く`, `${s}くて`, `${s}かった`, `${s}くない`, `${s}くなかった`, `${s}ければ`, `${s}かったら`, `${s}さ`, sou,
    `${s}すぎる`, `${s}くなる`, `${s}くなった`, `${s}いです`, ...(base !== w ? [base] : [])];
}
const adjNa = (w) => [`${w}な`, `${w}に`, `${w}だ`, `${w}で`, `${w}だった`, `${w}です`, `${w}じゃない`, `${w}ではない`];

// Verb class of the dictionary form: 'v1', 'v5', 'vs', 'vk', or both 'v1 v5' when kuromoji can't tell.
function verbClass(tokenizer, w) {
  if (w === 'する' || w.endsWith('する')) return 'vs';
  if (/(来る|くる)$/.test(w) && (w.length <= 2 || w.endsWith('来る'))) return 'vk';
  const t = tokenizer.tokenize(w);
  const type = t.length ? t[t.length - 1].conjugated_type : '';
  if (type.startsWith('一段')) return 'v1';
  if (type.startsWith('五段')) return 'v5';
  if (type.startsWith('サ変')) return 'vs';
  if (type.startsWith('カ変')) return 'vk';
  return /[えけげせぜてでねべぺめれ]る$|[いきぎしじちぢにびぴみり]る$/.test(w) ? 'v1 v5' : 'v5';
}
function conjugate(cls, pos, w) {
  if (pos === 'adj-i') return w.endsWith('い') ? adjI(w) : [];
  if (pos === 'adj-na') return adjNa(w);
  if (pos !== 'verb') return [];
  return cls.split(' ').flatMap((c) => ({ v1: ichidan, v5: godan, vs: suru, vk: kuru }[c](w)));
}

// ---------- entries ----------

function wordBody(e, kanjiBy) {
  const parts = [`<b>${esc(e.word)}</b>`];
  if (e.reading && e.reading !== e.word) parts.push(` 【${esc(e.reading)}】`);
  if (POS_MN[e.pos]) parts.push(` <i>${esc(POS_MN[e.pos])}</i>`);
  const m = e.meanings_mn;
  let html = `<p>${parts.join('')}</p>`;
  html += m.length > 1 ? `<ol>${m.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : `<p>${esc(m[0])}</p>`;
  if (e.note_mn) html += `<p>※ ${esc(e.note_mn)}</p>`;
  const ex = e.examples && e.examples[0];
  if (ex) html += `<p>${esc(ex.ja)} — ${esc(ex.mn)}</p>`;
  const ks = [...new Set([...e.word].filter((c) => kanjiBy.has(c)))];
  if (ks.length) html += `<p><small>${ks.map((c) => `${esc(c)} ${esc(kanjiBy.get(c).meanings_mn.join(', '))}`).join(' · ')}</small></p>`;
  return html;
}
function nameBody(e) {
  let html = `<p><b>${esc(e.word)}</b>${e.reading && e.reading !== e.word ? ` 【${esc(e.reading)}】` : ''} <i>${esc(NAME_MN[e.kind] || NAME_MN.other)}</i></p>`;
  html += `<p>${esc(e.mn)}${e.desc_mn ? ` — ${esc(e.desc_mn)}` : ''}</p>`;
  return html;
}
function kanjiBody(k) {
  let html = `<p><b>${esc(k.kanji)}</b> <i>ханз</i></p><p>${esc(k.meanings_mn.join(', '))}</p>`;
  if (k.origin_mn) html += `<p>${esc(k.origin_mn)}</p>`;
  if (k.examples.length) html += `<p>${k.examples.map((x) => `${esc(x.word)}（${esc(x.reading)}）— ${esc(x.mn)}`).join('<br/>')}</p>`;
  return html;
}

const HEAD = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns:math="http://exslt.org/math" xmlns:svg="http://www.w3.org/2000/svg" xmlns:tl="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:saxon="http://saxon.sf.net/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:cx="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:mbp="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:mmc="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:idx="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/></head>
<body>
<mbp:frameset>
`;
const FOOT = '</mbp:frameset>\n</body>\n</html>\n';

async function main() {
  const words = readDir(path.join(lang, 'words')).sort((a, b) => a.id - b.id);
  const names = readDir(path.join(lang, 'names')).sort((a, b) => a.id - b.id);
  const kanji = readDir(path.join(lang, 'kanji'));
  const kanjiBy = new Map(kanji.map((k) => [k.kanji, k]));

  const kuromoji = require('kuromoji');
  const dicPath = path.join(path.dirname(require.resolve('kuromoji/package.json')), 'dict');
  const tokenizer = await new Promise((ok, fail) => kuromoji.builder({ dicPath }).build((err, t) => (err ? fail(err) : ok(t))));

  // One Kindle entry per headword: words with the same spelling, a name, and the kanji itself share it.
  const byHead = new Map();
  const entry = (head) => {
    if (!byHead.has(head)) byHead.set(head, { head, bodies: [], forms: new Set() });
    return byHead.get(head);
  };
  let formCount = 0;
  for (const e of words) {
    const x = entry(e.word);
    x.bodies.push(wordBody(e, kanjiBy));
    const spellings = [e.word, ...(e.alt || []), ...(e.reading ? [e.reading] : [])];
    const cls = e.pos === 'verb' ? verbClass(tokenizer, e.word) : '';
    for (const s of spellings) {
      x.forms.add(s);
      for (const f of conjugate(cls, e.pos, s)) x.forms.add(f);
    }
  }
  for (const e of names) {
    const x = entry(e.word);
    x.bodies.push(nameBody(e));
    for (const s of [e.word, ...(e.alt || []), ...(e.reading ? [e.reading] : [])]) x.forms.add(s);
  }
  for (const k of kanji) entry(k.kanji).bodies.push(kanjiBody(k));

  const entries = [...byHead.values()];
  fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(out)) fs.rmSync(path.join(out, f), { recursive: true, force: true });

  const pages = [];
  for (let p = 0; p * PER_PAGE < entries.length; p++) {
    let html = HEAD;
    for (const x of entries.slice(p * PER_PAGE, (p + 1) * PER_PAGE)) {
      x.forms.delete(x.head);
      formCount += x.forms.size;
      const infl = x.forms.size ? `<idx:infl>${[...x.forms].map((f) => `<idx:iform value="${esc(f)}" exact="yes"/>`).join('')}</idx:infl>` : '';
      html += `<idx:entry name="japanese" scriptable="yes" spell="yes"><idx:orth value="${esc(x.head)}">${infl}</idx:orth>${x.bodies.join('<hr/>')}</idx:entry>\n<hr/>\n`;
    }
    const file = `entries-${String(p + 1).padStart(2, '0')}.html`;
    fs.writeFileSync(path.join(out, file), html + FOOT);
    pages.push(file);
  }

  const title = `mongol-dict ja-mn (Япон → Монгол) ${version}`;
  fs.writeFileSync(path.join(out, 'front.html'), `<?xml version="1.0" encoding="utf-8"?>
<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><title>${esc(title)}</title></head>
<body>
<h1>mongol-dict ja-mn</h1>
<p>Япон → Монгол нээлттэй толь бичиг, хувилбар ${esc(version)}: ${words.length} үг, ${names.length} оноосон нэр, ${kanji.length} ханз.</p>
<p>Ихэнх бичлэг хиймэл оюуны ноорог бөгөөд хүн хянаагүй.</p>
<p>Open Japanese → Mongolian dictionary, version ${esc(version)}. Most entries are unreviewed AI drafts.</p>
<p>© mongol-dict contributors, CC BY-SA 4.0. ${repo}</p>
</body></html>
`);

  const items = ['front.html', ...pages];
  fs.writeFileSync(path.join(out, `${NAME}.opf`), `<?xml version="1.0" encoding="utf-8"?>
<package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid">
<metadata>
<dc-metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:Identifier id="uid">${NAME}-${esc(version)}</dc:Identifier>
<dc:Title>${esc(title)}</dc:Title>
<dc:Language>ja</dc:Language>
<dc:Creator>mongol-dict contributors</dc:Creator>
<dc:Rights>CC BY-SA 4.0</dc:Rights>
<dc:Description>${repo}</dc:Description>
</dc-metadata>
<x-metadata>
<DictionaryInLanguage>ja</DictionaryInLanguage>
<DictionaryOutLanguage>mn</DictionaryOutLanguage>
<DefaultLookupIndex>japanese</DefaultLookupIndex>
</x-metadata>
</metadata>
<manifest>
${items.map((f, i) => `<item id="i${i}" href="${f}" media-type="application/xhtml+xml"/>`).join('\n')}
</manifest>
<spine>
${items.map((_, i) => `<itemref idref="i${i}"/>`).join('\n')}
</spine>
</package>
`);
  console.log(`${title}: ${entries.length} entries in ${pages.length} pages, ${formCount} extra lookup forms → ${path.relative(root, out)}`);
}
main();

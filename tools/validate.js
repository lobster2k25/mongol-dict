// Checks every language folder (<code>-mn/, e.g. ja-mn/) against the shared entry format.
// Needs no downloads: node tools/validate.js   (prints the problems, exits 1 if there are any)
// node tools/validate.js --base origin/main  also checks that no word id that exists there was removed or reused.
// Language-specific checks (e.g. kanji set membership for Japanese) live in <code>-mn/tools/.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const POS = ['noun', 'pronoun', 'verb', 'adjective', 'adj-i', 'adj-na', 'adverb', 'numeral', 'particle',
  'postposition', 'preposition', 'auxiliary', 'conjunction', 'interjection', 'prenoun', 'prefix', 'suffix',
  'counter', 'expression'];
const KINDS = ['', 'origin', 'mnemonic', 'compare', 'usage'];
const STATUS = ['machine', 'reviewed'];
const latin = /[A-Za-zÀ-ɏ]/;

const baseArg = process.argv.indexOf('--base');
const base = baseArg > 0 ? process.argv[baseArg + 1] : null;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });

let problems = 0;
const report = [];

// Reads a data file and checks it keeps one entry per line: "[", one object per line, "]".
function readEntries(file, warn) {
  const text = fs.readFileSync(file, 'utf8');
  let entries;
  try { entries = JSON.parse(text); } catch (e) { warn(`not valid JSON: ${e.message}`); return []; }
  if (!Array.isArray(entries)) { warn('must be a JSON array'); return []; }
  const lines = text.trimEnd().split('\n');
  if (lines.length !== entries.length + 2) warn('must keep one entry per line');
  return entries;
}

function checkMongolian(e, texts, warn) {
  const mn = texts.filter(Boolean).join(' ');
  if (latin.test(mn)) warn(`Latin letter in Mongolian text: ${mn.match(/\S*[A-Za-zÀ-ɏ]\S*/)[0]}`);
}

function checkCommon(e, warn) {
  if (!STATUS.includes(e.status)) warn(`status must be ${STATUS.join(' or ')}`);
  if (!Array.isArray(e.meanings_mn) || !e.meanings_mn.length || e.meanings_mn.some((m) => typeof m !== 'string' || !m.trim())) {
    warn('meanings_mn must be a non-empty list of text');
  }
  if (!KINDS.includes(e.note_kind)) warn(`note_kind must be one of: ${KINDS.map((k) => k || '""').join(', ')}`);
  if (typeof e.note_mn !== 'string') warn('note_mn must be text ("" if none)');
  else if (e.note_mn && !e.note_kind) warn('note_mn without note_kind');
}

const langs = fs.readdirSync(root).filter((d) => /^[a-z]{2,3}-mn$/.test(d) && fs.statSync(path.join(root, d)).isDirectory()).sort();
for (const lang of langs) {
  const src = lang.split('-')[0];
  let count = 0;

  const wdir = path.join(root, lang, 'words');
  const seen = new Set();
  const ids = new Map(); // id -> word
  for (const file of fs.existsSync(wdir) ? fs.readdirSync(wdir).filter((f) => f.endsWith('.json')).sort() : []) {
    const where = `${lang}/words/${file}`;
    const entries = readEntries(path.join(wdir, file), (msg) => { problems++; report.push(`${where}: ${msg}`); });
    for (const e of entries) {
      const warn = (msg) => { problems++; report.push(`${where} ${e.word}: ${msg}`); };
      if (typeof e.word !== 'string' || !e.word.trim()) { warn('word is missing'); continue; }
      if (!Number.isInteger(e.id) || e.id < 1) warn('id must be a positive whole number (run node tools/assign-ids.js)');
      else if (ids.has(e.id)) warn(`id ${e.id} is also used by ${ids.get(e.id)}`);
      else ids.set(e.id, e.word);
      if (typeof e.reading !== 'string') warn('reading must be text ("" if the language needs none)');
      if (!Array.isArray(e.alt)) warn('alt must be a list ([] if none)');
      if (!POS.includes(e.pos)) warn(`unknown pos "${e.pos}"`);
      const key = `${e.word}|${e.pos}`;
      if (seen.has(key)) warn('duplicate (same word and pos)');
      seen.add(key);
      checkCommon(e, warn);
      const ex = e.example || {};
      if (typeof ex[src] !== 'string' || !ex[src].trim()) warn(`example.${src} is missing`);
      if (typeof ex.mn !== 'string' || !ex.mn.trim()) warn('example.mn is missing');
      checkMongolian(e, [...(e.meanings_mn || []), e.note_mn, ex.mn], warn);
      count++;
    }
  }

  if (ids.size) {
    const idsFile = path.join(root, lang, 'ids.json');
    const next = fs.existsSync(idsFile) ? JSON.parse(fs.readFileSync(idsFile, 'utf8')).next_word_id : 0;
    if (!(next > Math.max(...ids.keys()))) { problems++; report.push(`${lang}/ids.json: next_word_id must be above the highest id (${Math.max(...ids.keys())})`); }
    if (base) {
      // Ids are permanent: every id on the base branch must still exist, and the counter never goes back.
      let baseFiles = [];
      try { baseFiles = git('ls-tree', '--name-only', `${base}:${lang}/words`).split('\n').filter((f) => f.endsWith('.json')); } catch { /* new language */ }
      for (const f of baseFiles) {
        for (const e of JSON.parse(git('show', `${base}:${lang}/words/${f}`))) {
          if (Number.isInteger(e.id) && !ids.has(e.id)) { problems++; report.push(`${lang}: id ${e.id} (${e.word}) exists on ${base} but was removed; ids are permanent`); }
        }
      }
      let baseNext = 0;
      try { baseNext = JSON.parse(git('show', `${base}:${lang}/ids.json`)).next_word_id; } catch { /* no ids yet on base */ }
      if (next < baseNext) { problems++; report.push(`${lang}/ids.json: next_word_id went back from ${baseNext} to ${next}`); }
    }
  }

  const kdir = path.join(root, lang, 'kanji');
  const kseen = new Set();
  for (const file of fs.existsSync(kdir) ? fs.readdirSync(kdir).filter((f) => f.endsWith('.json')).sort() : []) {
    const where = `${lang}/kanji/${file}`;
    const entries = readEntries(path.join(kdir, file), (msg) => { problems++; report.push(`${where}: ${msg}`); });
    for (const e of entries) {
      const warn = (msg) => { problems++; report.push(`${where} ${e.kanji}: ${msg}`); };
      if (typeof e.kanji !== 'string' || [...e.kanji].length !== 1) { warn('kanji must be one character'); continue; }
      if (kseen.has(e.kanji)) warn('duplicate');
      kseen.add(e.kanji);
      checkCommon(e, warn);
      const examples = Array.isArray(e.examples) ? e.examples : [];
      if (!examples.length) warn('examples must be a non-empty list');
      for (const x of examples) {
        if (!x.word || !x.word.includes(e.kanji)) warn(`example word must contain the kanji: ${x.word}`);
        if (!x.mn) warn(`example ${x.word} has no mn`);
      }
      checkMongolian(e, [...(e.meanings_mn || []), e.note_mn, ...examples.map((x) => x.mn)], warn);
      count++;
    }
  }

  console.log(`${lang}: ${count} entries`);
}

for (const line of report.slice(0, 200)) console.log(line);
if (report.length > 200) console.log(`… and ${report.length - 200} more`);
console.log(`${problems} problems`);
process.exitCode = problems ? 1 : 0;

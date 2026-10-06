// Gives every word entry without an "id" the next free number, then saves <lang>/ids.json.
// Ids are permanent: never changed, never reused (ids.json only counts up, even after a deletion).
// Usage: node tools/assign-ids.js   (all <code>-mn/ folders)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const langs = () => fs.readdirSync(root).filter((d) => /^[a-z]{2,3}-mn$/.test(d) && fs.statSync(path.join(root, d)).isDirectory()).sort();

// One entry per line, with "id" as the first field.
function writeEntries(file, entries) {
  const line = (e) => JSON.stringify('id' in e ? { id: e.id, ...e } : e);
  fs.writeFileSync(file, `[\n${entries.map(line).join(',\n')}\n]\n`);
}

function assign(lang) {
  const wdir = path.join(root, lang, 'words');
  if (!fs.existsSync(wdir)) return 0;
  const idsFile = path.join(root, lang, 'ids.json');
  const ids = fs.existsSync(idsFile) ? JSON.parse(fs.readFileSync(idsFile, 'utf8')) : { next_word_id: 1 };
  const files = fs.readdirSync(wdir).filter((f) => f.endsWith('.json')).sort()
    .map((f) => ({ file: path.join(wdir, f), entries: JSON.parse(fs.readFileSync(path.join(wdir, f), 'utf8')) }));
  // First find the highest id in use anywhere, so new ids can't collide with a later file's.
  for (const { entries } of files) {
    for (const e of entries) if (Number.isInteger(e.id)) ids.next_word_id = Math.max(ids.next_word_id, e.id + 1);
  }
  let given = 0;
  for (const { file, entries } of files) {
    if (!entries.some((e) => !Number.isInteger(e.id))) continue;
    for (const e of entries) if (!Number.isInteger(e.id)) { e.id = ids.next_word_id++; given++; }
    writeEntries(file, entries);
  }
  fs.writeFileSync(idsFile, `${JSON.stringify(ids, null, 2)}\n`);
  return given;
}

module.exports = { assign, writeEntries, langs };

if (require.main === module) {
  for (const lang of langs()) console.log(`${lang}: ${assign(lang)} new ids`);
}

// Reads the local EDRDG reference files (sources/). Reference only: nothing from here is written to data/.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function kanjidic() {
  const xml = fs.readFileSync(path.join(root, 'sources/kanjidic2.xml'), 'utf8');
  const ref = {};
  for (const m of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)) {
    const c = m[1];
    const all = (re) => [...c.matchAll(re)].map((x) => x[1]);
    const k = c.match(/<literal>(.*?)<\/literal>/)[1];
    ref[k] = {
      grade: +((c.match(/<grade>(\d+)<\/grade>/) || [])[1] || 0),
      freq: +((c.match(/<freq>(\d+)/) || [])[1] || 9999),
      strokes: +c.match(/<stroke_count>(\d+)/)[1],
      on: all(/<reading r_type="ja_on">(.*?)<\/reading>/g),
      kun: all(/<reading r_type="ja_kun">(.*?)<\/reading>/g),
      en: all(/<meaning>(.*?)<\/meaning>/g),
    };
  }
  return ref;
}

function kradfile() {
  const krad = new TextDecoder('euc-jp').decode(fs.readFileSync(path.join(root, 'sources/kradfile')));
  const parts = {};
  for (const l of krad.split('\n')) {
    if (!l || l[0] === '#') continue;
    const [k, r] = l.split(' : ');
    if (r) parts[k.trim()] = r.trim().split(' ');
  }
  return parts;
}

// Jōyō kanji grouped into data files: grade-1..6 (elementary), secondary-1..6 (200 each by frequency).
function fileSets(ref) {
  const by = (g) => Object.keys(ref).filter((k) => ref[k].grade === g).sort((a, b) => ref[a].freq - ref[b].freq);
  const sets = {};
  for (let g = 1; g <= 6; g++) sets[`grade-${g}`] = by(g);
  const sec = by(8);
  for (let i = 0; i * 200 < sec.length; i++) sets[`secondary-${i + 1}`] = sec.slice(i * 200, i * 200 + 200);
  return sets;
}

module.exports = { root, kanjidic, kradfile, fileSets };

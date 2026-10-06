// Appends a batch of drafted word entries to a ja-mn/words file, keeping one entry per line,
// then gives the new entries permanent ids (tools/assign-ids.js).
// Usage: node ja-mn/tools/add-words.js <batch.json> [0001-1000]
const fs = require('fs');
const path = require('path');
const { root } = require('./lib-sources');
const { assign, writeEntries } = require('../../tools/assign-ids');

const [batch, name = '0001-1000'] = process.argv.slice(2);
const file = path.join(root, `words/${name}.json`);
const have = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
const all = [...have, ...JSON.parse(fs.readFileSync(batch, 'utf8')).map(({ id, ...e }) => e)];
fs.mkdirSync(path.dirname(file), { recursive: true });
writeEntries(file, all);
const given = assign('ja-mn');
console.log(`${name}: ${have.length} → ${all.length} entries, ${given} new ids`);

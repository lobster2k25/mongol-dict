// Appends a batch of drafted word entries to a data/words file, keeping one entry per line.
// Usage: node scripts/add-words.js <batch.json> [0001-1000]
const fs = require('fs');
const path = require('path');
const { root } = require('./lib-sources');

const [batch, name = '0001-1000'] = process.argv.slice(2);
const file = path.join(root, `data/words/${name}.json`);
const have = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
const all = [...have, ...JSON.parse(fs.readFileSync(batch, 'utf8'))];
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, `[\n${all.map((e) => JSON.stringify(e)).join(',\n')}\n]\n`);
console.log(`${name}: ${have.length} → ${all.length} entries`);

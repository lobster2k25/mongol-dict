// Lists the kanji still missing from a set, with readings for reference.
// Usage: node ja-mn/tools/next-batch.js grade-3 [count]
const fs = require('fs');
const path = require('path');
const { root, kanjidic, fileSets } = require('./lib-sources');

const [set, count = 999] = process.argv.slice(2);
const ref = kanjidic();
const sets = fileSets(ref);
if (!sets[set]) throw new Error(`unknown set ${set}; one of ${Object.keys(sets).join(', ')}`);
const file = path.join(root, `kanji/${set}.json`);
const done = new Set(fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')).map((e) => e.kanji) : []);
const todo = sets[set].filter((k) => !done.has(k)).slice(0, +count);
console.log(`${set}: ${done.size} done, ${sets[set].length - done.size} to go`);
for (const k of todo) console.log(`${k}  ${ref[k].on.slice(0, 2).join('、')} / ${ref[k].kun.slice(0, 2).join('、')}`);

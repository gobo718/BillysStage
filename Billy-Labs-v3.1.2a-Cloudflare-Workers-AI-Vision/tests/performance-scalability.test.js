const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window:{}, Math, Set, Map, WeakMap, URLSearchParams };
context.window.window = context.window;
vm.createContext(context);
for (const file of ['mashup-core.js','mashup-search.js','mashup-discovery.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'), context);
}
const mashups = context.window.BillyMashups;
const search = context.window.BillySearch;
const discovery = context.window.BillyDiscovery;
assert.equal(mashups.version, 4);
assert.equal(search.version, 2);
assert.equal(discovery.version, 2);
const rows = [
  ['😀','🔥','face fire','20260101','u1'],
  ['🐸','🌙','frog moon','20260201','u2'],
  ['😀','😀','face face','20260201','u3'],
  null
];
assert.deepEqual(Array.from(search.rowsContaining(rows,'😀')), [rows[0],rows[2]]);
assert.notStrictEqual(search.rowsContaining(rows,'😀'), search.rowsContaining(rows,'😀'));
assert.deepEqual(Array.from(discovery.newestRows(rows)), [rows[1],rows[2]]);
assert.notStrictEqual(discovery.newestRows(rows), discovery.newestRows(rows));
assert.equal(discovery.selectRandom(rows,{excludeIds:[mashups.id('😀','🔥')],idOf:r=>mashups.id(r[0],r[1]),random:()=>0}), rows[1]);
assert.equal(discovery.selectRandom(rows,{preferUnseen:true,seenIds:new Set([mashups.id('😀','🔥')]),idOf:r=>mashups.id(r[0],r[1]),random:()=>0}), rows[1]);
for (const file of ['index.html','explorer.html','mashup.html']) {
  const source=fs.readFileSync(path.join(root,file),'utf8');
  assert(source.includes('mashup-discovery.js'), `${file} missing discovery engine`);
}
assert(fs.readFileSync(path.join(root,'emoji.html'),'utf8').includes('BillySearch.rowsContaining'));
console.log('performance-scalability.test.js passed');

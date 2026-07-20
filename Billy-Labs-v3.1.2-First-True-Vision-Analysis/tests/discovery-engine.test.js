const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require('node:path').join(__dirname, '..', 'mashup-discovery.js'), 'utf8');
const context = { window:{}, Math, Set };
context.window.BillyMashups = { id:(a,b)=>[a,b].sort().join('|') };
vm.runInNewContext(code, context);
const discovery = context.window.BillyDiscovery;
const rows = [
  ['😀','🔥','A','2026-01-01','u1'],
  ['🐸','🌙','B','2026-02-01','u2'],
  ['😀','😀','C','2026-02-01','u3']
];
assert.equal(discovery.version, 2);
assert.equal(discovery.choose(rows, () => 0), rows[0]);
assert.equal(discovery.choose(rows, () => 0.999), rows[2]);
assert.equal(discovery.selectRandom(rows, {excludeIds:['😀|🔥'], idOf:r=>r[0]+'|'+r[1], random:()=>0}), rows[1]);
assert.equal(discovery.selectRandom(rows, {preferUnseen:true, seenIds:new Set(['😀|🔥']), idOf:r=>r[0]+'|'+r[1], random:()=>0}), rows[1]);
assert.equal(discovery.selectRandom(rows, {preferUnseen:true, seenIds:new Set(rows.map(r=>r[0]+'|'+r[1])), idOf:r=>r[0]+'|'+r[1], random:()=>0}), rows[0]);
assert.equal(discovery.newestDate(rows), '2026-02-01');
assert.deepEqual(Array.from(discovery.newestRows(rows)), [rows[1],rows[2]]);
assert.equal(discovery.selectNewest(rows,{random:()=>0.9}).row, rows[2]);
assert.equal(discovery.createSeed(()=>0), 0);
assert.ok(discovery.createSeed(()=>0.999) < discovery.maxSeed);
console.log('discovery-engine.test.js passed');

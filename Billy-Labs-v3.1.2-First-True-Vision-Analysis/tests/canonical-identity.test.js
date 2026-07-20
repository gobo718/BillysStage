const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const ctx = {window:{}, URLSearchParams, console};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../mashup-core.js', 'utf8'), ctx);
const B = ctx.BillyMashups;

assert.strictEqual(B.version, 4);
assert.strictEqual(B.id('🐷', '🥓'), B.id('🥓', '🐷'));
assert.deepStrictEqual(Array.from(B.canonicalPair('😀', '😀')), ['😀', '😀']);
assert.strictEqual(B.id('😀', '😀'), '😀|😀');
assert.deepStrictEqual(Array.from(B.parseId('🥓|🐷')), Array.from(B.canonicalPair('🥓', '🐷')));
assert.strictEqual(B.parseId('not-a-pair'), null);
assert.strictEqual(B.buildUrl(['🐷', '🥓']), 'mashup.html?left=%F0%9F%90%B7&right=%F0%9F%A5%93');
assert.deepStrictEqual(Array.from(B.pairFromSearch('?left=🐷&right=🥓')), ['🐷', '🥓']);
assert.deepStrictEqual(Array.from(B.pairFromSearch('?emoji1=🐷&emoji2=🥓')), ['🐷', '🥓']);
assert.deepStrictEqual(Array.from(B.pairFromSearch('?left=🐷&right=🐷')), ['🐷', '🐷']);

console.log('Canonical identity tests passed.');

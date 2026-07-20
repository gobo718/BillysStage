const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const context = { window: {}, URLSearchParams, console };
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'mashup-core.js'), 'utf8'), context);
const B = context.BillyMashups;

const duplicate = ['😀', '😀', 'duplicate', '20240101', 'duplicate.png'];
const ordered = ['🐷', '🥓', 'pig bacon', '20240102', 'pig.png'];
const other = ['🐸', '🌙', 'frog moon', '20240103', 'frog.png'];
const rows = [duplicate, ordered, other];

assert.strictEqual(B.version, 4);
assert.strictEqual(B.resolve(rows, '🐷', '🥓'), ordered);
assert.strictEqual(B.resolve(rows, '🥓', '🐷'), ordered);
assert.strictEqual(B.resolve(rows, '😀', '😀'), duplicate);
assert.strictEqual(B.resolveId(rows, B.id('🥓', '🐷')), ordered);
assert.strictEqual(B.has(rows, '🌙', '🐸'), true);
assert.strictEqual(B.has(rows, '🌙', '🔥'), false);
assert.strictEqual(B.resolve(rows, '', '🐷'), null);
assert.strictEqual(B.resolveId(rows, 'not-a-pair'), null);

const index = B.buildResolutionIndex(rows);
assert.strictEqual(index.size, 3);
assert.strictEqual(index.get(B.id('🐷', '🥓')), ordered);

const mashupPage = fs.readFileSync(path.join(root, 'mashup.html'), 'utf8');
const homePage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const profile = fs.readFileSync(path.join(root, 'profile.js'), 'utf8');
assert(mashupPage.includes('BillyMashups.resolve(all, left, right)'));
assert(homePage.includes('BillyMashups.resolve(all, pair[0], pair[1])'));
assert(profile.includes('BillyMashups.resolve(rows,pair[0],pair[1])'));
const blurblets = fs.readFileSync(path.join(root, 'blurblets.html'), 'utf8');
assert(blurblets.includes('BillyMashups.resolve(rows,p[0],p[1])'));
assert(!mashupPage.includes('(row[0] === left && row[1] === right)'));

console.log('Mashup resolution tests passed.');

const dataContext = { window: {} };
dataContext.window = dataContext;
vm.createContext(dataContext);
vm.runInContext(fs.readFileSync(path.join(root, 'emoji-data.js'), 'utf8'), dataContext);
vm.runInContext(fs.readFileSync(path.join(root, 'mashup-core.js'), 'utf8'), dataContext);
const fullRows = dataContext.EMOJI_KITCHEN_DATA;
const fullResolver = dataContext.BillyMashups;
const fullIndex = fullResolver.buildResolutionIndex(fullRows);
assert.strictEqual(fullRows.length, 147000);
assert.strictEqual(fullIndex.size, fullRows.length);
for (const row of fullRows) {
  assert.strictEqual(fullResolver.resolve(fullRows, row[0], row[1]), row);
  assert.strictEqual(fullResolver.resolve(fullRows, row[1], row[0]), row);
}
console.log('Full inventory resolution contract passed.');

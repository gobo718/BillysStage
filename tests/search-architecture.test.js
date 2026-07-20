const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'mashup-search.js'), 'utf8'), context);
const search = context.window.BillySearch;

assert.equal(search.version, 2);
assert.equal(search.normalizeQuery('  FrOg  '), 'frog');
assert.equal(search.matches('Blue Frog', ' FROG '), true);
assert.equal(search.matches('Blue Frog', 'toad'), false);

const rows = [
  ['🐸', '🌙', 'frog_moon', '20240103', 'three'],
  ['🐸', '🔥', 'frog_fire', '20230102', 'two'],
  ['🐸', '🐸', 'frog_frog', '20220101', 'one']
];
assert.deepEqual(Array.from(search.searchRows(rows, 'FIRE')), [rows[1]]);
assert.deepEqual(Array.from(search.searchRows(rows, '2024')), [rows[0]]);
assert.deepEqual(Array.from(search.searchRows(rows, 'frog')), rows);
assert.notStrictEqual(search.searchRows(rows, ''), rows);

assert.deepEqual(Array.from(search.sortRows(rows, 'oldest')), [rows[2], rows[1], rows[0]]);
assert.deepEqual(Array.from(search.sortRows(rows, 'newest')), [rows[0], rows[1], rows[2]]);
assert.deepEqual(Array.from(search.sortRows(rows, 'name')), [rows[1], rows[2], rows[0]]);
assert.deepEqual(Array.from(search.sortRows(rows, 'unseen', { isSeen: row => row === rows[0] })), [rows[1], rows[2], rows[0]]);
assert.deepEqual(Array.from(search.rowsContaining(rows, '🐸')), rows);
assert.deepEqual(Array.from(search.rowsContaining(rows, '🔥')), [rows[1]]);
assert.deepEqual(Array.from(search.buildIngredientIndex(rows).get('🔥')), [rows[1]]);

const items = [
  { emoji: '🐸', meta: { name: 'frog', subgroup: 'animal-amphibian' } },
  { emoji: '🔥', meta: { name: 'fire', subgroup: 'sky-weather' } }
];
assert.deepEqual(
  Array.from(search.searchItems(items, 'WEATHER', item => `${item.emoji} ${item.meta.name} ${item.meta.subgroup}`)),
  [items[1]]
);

const explorer = fs.readFileSync(path.join(root, 'explorer.html'), 'utf8');
const emoji = fs.readFileSync(path.join(root, 'emoji.html'), 'utf8');
const collection = fs.readFileSync(path.join(root, 'collection-book.html'), 'utf8');
const curatedCollection = fs.readFileSync(path.join(root, 'collection.html'), 'utf8');
const curator = fs.readFileSync(path.join(root, 'curator', 'index.html'), 'utf8');
for (const [name, source] of Object.entries({ explorer, emoji, collection, curatedCollection, curator })) {
  assert(source.includes('mashup-search.js'), `${name} does not load shared search architecture`);
  assert(source.includes('BillySearch.'), `${name} does not consume shared search architecture`);
}
assert(!explorer.includes('.toLowerCase().includes(query)'), 'Explorer still owns its own text matcher');
assert(!emoji.includes('.toLowerCase().includes(q)'), 'Emoji page still owns its own text matcher');

console.log('search architecture tests passed');

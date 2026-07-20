const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

function context(seed = {}) {
  const values = new Map(Object.entries(seed).map(([k,v]) => [k, JSON.stringify(v)]));
  const localStorage = {
    getItem: k => values.has(k) ? values.get(k) : null,
    setItem: (k,v) => values.set(k, String(v)),
    removeItem: k => values.delete(k)
  };
  const ctx = {window:{}, localStorage, console, Date, Set, Map, JSON};
  ctx.window = ctx;
  vm.createContext(ctx);
  return {ctx, values};
}
function load(ctx, file) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, {filename:file});
}
const root = __dirname + '/..';

{
  const {ctx} = context();
  load(ctx, root + '/mashup-core.js');
  assert.strictEqual(ctx.BillyMashups.id('🐷','🥓'), ctx.BillyMashups.id('🥓','🐷'));
  assert.strictEqual(ctx.BillyMashups.id('🐷','🐷').split('|').length, 2);
}

{
  const {ctx} = context({'ek-seen':['🐷|🥓'], 'ek-favorites':['🥓|🐷']});
  load(ctx, root + '/mashup-core.js');
  load(ctx, root + '/engine/platform/storage/storage.js');
  load(ctx, root + '/progress-engine.js');
  assert(ctx.BillyProgress.hasSeen('🐷','🥓'));
  assert(ctx.BillyProgress.isFavorite('🐷','🥓'));
  ctx.BillyProgress.toggleFavorite('🐷','🥓');
  assert(!ctx.BillyProgress.isFavorite('🥓','🐷'));
  ctx.BillyProgress.replaceSeen(['😀|😀']);
  assert(ctx.BillyProgress.hasSeen('😀','😀'));
}

{
  const {ctx} = context();
  load(ctx, root + '/mashup-core.js');
  load(ctx, root + '/engine/platform/storage/storage.js');
  load(ctx, root + '/curator-data.js');
  load(ctx, root + '/collections-data.js');
  const rows = ctx.BillyCollections.list();
  assert(rows.length >= 4);
  const item = {left:'😀', right:'😎', blurblet:'Test'};
  ctx.BillyCuratorData.save('😀|😎', item);
  assert.strictEqual(ctx.BillyCuratorData.get('😀|😎').blurblet, 'Test');
  const blank = ctx.BillyCollections.blank('Test Collection','🧪');
  ctx.BillyCollections.save([blank]);
  assert.strictEqual(ctx.BillyCollections.list()[0].name, 'Test Collection');
}

console.log('Storage foundation tests passed.');

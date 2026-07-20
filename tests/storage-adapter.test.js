const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const nativeStore = new Map();
const localStorage = {
  setItem:(k,v)=>nativeStore.set(k,String(v)),
  getItem:k=>nativeStore.has(k)?nativeStore.get(k):null,
  removeItem:k=>nativeStore.delete(k)
};
const ctx = {window:{}, localStorage, console, JSON, Map, Set, Date};
ctx.window.window=ctx.window;
vm.createContext(ctx);
for (const file of ['engine/platform/storage/storage.js','engine/platform/storage/adapters.js','engine/service/repositories/billy-repositories.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
}
const {BillyStorage, BillyStorageAdapters, BillyRepositories} = ctx.window;
if (BillyStorage.version !== 2) throw new Error('Storage gateway v2 failed to initialize');
if (BillyStorageAdapters.current().name !== 'local-storage') throw new Error('Local adapter was not selected');
BillyRepositories.settings.set('adapterTest','local');
if (BillyRepositories.settings.get('adapterTest') !== 'local') throw new Error('Repository did not persist through local adapter');
const memory = BillyStorageAdapters.createMemoryAdapter();
BillyStorageAdapters.use(memory);
if (BillyRepositories.settings.get('adapterTest',null) !== null) throw new Error('Adapter isolation failed');
BillyRepositories.settings.set('adapterTest','memory');
if (BillyRepositories.settings.get('adapterTest') !== 'memory') throw new Error('Memory adapter failed');
BillyStorageAdapters.use(BillyStorageAdapters.createLocalStorageAdapter());
if (BillyRepositories.settings.get('adapterTest') !== 'local') throw new Error('Switching adapters lost local data');
console.log('storage adapter tests passed');

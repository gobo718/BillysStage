const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function loadManager({storedQueue = [], addEventListener = () => {}} = {}) {
  const store = new Map([['billy.sync.queue.v1', storedQueue]]);
  const context = {
    window: {
      BillyStorage: {
        get: (key, fallback) => store.has(key) ? store.get(key) : fallback,
        set: (key, value) => (store.set(key, value), value)
      },
      addEventListener
    },
    console,
    Map,
    Date,
    Set
  };
  context.window.window = context.window;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'engine/platform/sync/sync-manager.js'), 'utf8'), context);
  return {manager: context.window.BillySyncManager, store};
}

test('registers repositories and tracks sync state', async () => {
  let remote = [];
  const {manager} = loadManager();
  manager.register('favorites', {
    pull: async () => remote,
    push: async () => {
      remote = ['a+b'];
      return remote;
    }
  });

  assert.equal(manager.version, 3);
  assert.equal(manager.queueKey, 'billy.sync.queue.v1');
  assert.equal(manager.getStatus('favorites').state, 'local');
  manager.markPending('favorites');
  assert.equal(manager.getStatus('favorites').state, 'pending');
  manager.configure({enabled:true, userId:'device-1'});
  await manager.push('favorites');
  assert.equal(manager.getStatus('favorites').state, 'synced');
});

test('batches queue entries by repository and flushes latest payload', async () => {
  let pushed = null;
  const {manager} = loadManager();
  manager.register('progress', {
    pull: async () => ({}),
    push: async (_userId, payload) => {
      pushed = payload;
      return payload;
    }
  });

  manager.enqueue('progress', {seen:['a']});
  manager.enqueue('progress', {seen:['a', 'b']});
  assert.equal(manager.getQueueLength(), 1);
  manager.configure({enabled:true, userId:'device-1'});
  const result = await manager.flush();
  assert.equal(result.flushed, 1);
  assert.equal(result.remaining, 0);
  assert.equal(result.disabled, false);
  assert.deepEqual(Array.from(pushed.seen), ['a', 'b']);
});

test('disabled flush preserves the queue', async () => {
  const {manager} = loadManager();
  manager.register('progress', {pull:async () => ({}), push:async () => ({})});
  manager.enqueue('progress', {seen:['a']});
  const result = await manager.flush();
  assert.equal(result.flushed, 0);
  assert.equal(result.remaining, 1);
  assert.equal(result.disabled, true);
  assert.equal(manager.getQueueLength(), 1);
});

test('failed flush retains item and increments attempts', async () => {
  const {manager} = loadManager();
  manager.register('progress', {
    pull:async () => ({}),
    push:async () => { throw new Error('offline'); }
  });
  manager.enqueue('progress', {seen:['a']});
  manager.configure({enabled:true, userId:'device-1'});
  const result = await manager.flush();
  assert.equal(result.flushed, 0);
  assert.equal(result.remaining, 1);
  assert.equal(result.disabled, false);
  const [queued] = manager.getQueue();
  assert.equal(queued.attempts, 1);
  assert.equal(queued.error, 'offline');
  assert.equal(manager.getStatus('progress').state, 'error');
});

test('rejects unknown repositories and incomplete adapters', () => {
  const {manager} = loadManager();
  assert.throws(() => manager.register('', {}), /requires name, pull, and push/);
  assert.throws(() => manager.enqueue('missing'), /Unknown sync repository/);
});

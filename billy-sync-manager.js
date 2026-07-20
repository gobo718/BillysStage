/* Billy Labs sync manager — v3
   Local-first orchestration with a persistent, repository-batched queue.
   Cloud sync remains disabled until explicitly configured. */
(() => {
  const API_VERSION = 3;
  const QUEUE_KEY = 'billy.sync.queue.v1';
  const DEFAULT_STATUS = Object.freeze({state:'local', lastSyncedAt:null, error:null});
  const DEFAULT_CONFIG = Object.freeze({enabled:false, userId:'', autoFlush:true});
  const STATES = Object.freeze({
    LOCAL:'local',
    PENDING:'pending',
    SYNCING:'syncing',
    SYNCED:'synced',
    CONFLICT:'conflict',
    ERROR:'error'
  });

  const registry = new Map();
  const statuses = new Map();
  const storage = window.BillyStorage || null;
  let config = {...DEFAULT_CONFIG};
  let memoryQueue = [];
  let flushing = null;

  const readQueue = () => storage?.get?.(QUEUE_KEY, memoryQueue) || memoryQueue;

  const writeQueue = rows => {
    memoryQueue = rows;
    storage?.set?.(QUEUE_KEY, rows);
    return rows;
  };

  const snapshot = name => ({
    name,
    ...(statuses.get(name) || DEFAULT_STATUS)
  });

  const setStatus = (name, patch) => {
    statuses.set(name, {...snapshot(name), ...patch, name});
    return snapshot(name);
  };

  const getRegisteredAdapter = name => {
    const adapter = registry.get(name);
    if (!adapter) throw new Error(`Unknown sync repository: ${name}`);
    return adapter;
  };

  const requireReady = name => {
    const adapter = getRegisteredAdapter(name);
    if (!config.enabled) throw new Error('Billy Labs cloud sync is disabled');
    if (!config.userId) throw new Error('Billy Labs cloud sync has no user ID');
    return adapter;
  };

  const configure = next => {
    config = {
      ...config,
      ...(next || {}),
      enabled: !!next?.enabled,
      userId: String(next?.userId ?? config.userId ?? ''),
      autoFlush: next?.autoFlush ?? config.autoFlush
    };
    return {...config};
  };

  const register = (name, adapter) => {
    if (!name || !adapter?.pull || !adapter?.push) {
      throw new Error('Sync adapter requires name, pull, and push');
    }
    registry.set(name, adapter);
    if (!statuses.has(name)) statuses.set(name, {...DEFAULT_STATUS});
    return snapshot(name);
  };

  const enqueue = (name, payload = null) => {
    getRegisteredAdapter(name);
    const queue = readQueue().filter(item => item.name !== name);
    queue.push({
      name,
      payload,
      queuedAt:new Date().toISOString(),
      attempts:0
    });
    writeQueue(queue);
    setStatus(name, {state:STATES.PENDING, error:null});
    return queue.length;
  };

  const sync = async (name, direction = 'both', payload = null) => {
    const adapter = requireReady(name);
    setStatus(name, {state:STATES.SYNCING, error:null});

    try {
      let result = null;
      if (direction === 'pull' || direction === 'both') {
        result = await adapter.pull(config.userId);
      }
      if (direction === 'push' || direction === 'both') {
        result = await adapter.push(config.userId, payload);
      }
      setStatus(name, {
        state:STATES.SYNCED,
        lastSyncedAt:new Date().toISOString(),
        error:null
      });
      return result;
    } catch (error) {
      setStatus(name, {
        state:STATES.ERROR,
        error:error?.message || String(error)
      });
      throw error;
    }
  };

  const performFlush = async () => {
    if (!config.enabled || !config.userId) {
      return {flushed:0, remaining:readQueue().length, disabled:true};
    }

    const queued = [...readQueue()];
    const remaining = [];
    let flushed = 0;

    for (const item of queued) {
      try {
        await sync(item.name, 'push', item.payload);
        flushed += 1;
      } catch (error) {
        remaining.push({
          ...item,
          attempts:(item.attempts || 0) + 1,
          error:error?.message || String(error)
        });
      }
    }

    writeQueue(remaining);
    return {flushed, remaining:remaining.length, disabled:false};
  };

  const flush = async () => {
    if (flushing) return flushing;
    flushing = performFlush().finally(() => {
      flushing = null;
    });
    return flushing;
  };

  if (typeof window.addEventListener === 'function') {
    window.addEventListener('online', () => {
      if (config.autoFlush) flush().catch(() => {});
    });
  }

  window.BillySyncManager = Object.freeze({
    version:API_VERSION,
    queueKey:QUEUE_KEY,
    states:STATES,
    configure,
    getConfig:() => ({...config}),
    register,
    list:() => [...registry.keys()].map(snapshot),
    getStatus:snapshot,
    getQueue:() => [...readQueue()],
    getQueueLength:() => readQueue().length,
    enqueue,
    flush,
    clearQueue:() => writeQueue([]),
    markPending:name => setStatus(name, {state:STATES.PENDING, error:null}),
    markConflict:(name, message = 'Sync conflict') => setStatus(name, {state:STATES.CONFLICT, error:message}),
    sync,
    pull:name => sync(name, 'pull'),
    push:name => sync(name, 'push')
  });
})();

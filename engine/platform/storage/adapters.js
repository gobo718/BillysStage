/* Billy Labs storage adapters — v1
   The local adapter is active by default. Future cloud and test adapters can
   be selected without changing repositories or page controllers. */
(() => {
  if (!window.BillyStorage) throw new Error('billy-storage-adapters.js requires billy-storage.js');

  const createMemoryAdapter = (seed = {}) => {
    const data = new Map(Object.entries(seed).map(([key, value]) => [key, String(value)]));
    return Object.freeze({
      name: 'memory',
      getItem: key => data.has(key) ? data.get(key) : null,
      setItem: (key, value) => { data.set(key, String(value)); return true; },
      removeItem: key => { data.delete(key); return true; },
      hasItem: key => data.has(key),
      clear: () => data.clear()
    });
  };

  const createLocalStorageAdapter = () => {
    try {
      const testKey = '__billy_adapter_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return Object.freeze({
        name: 'local-storage',
        getItem: key => localStorage.getItem(key),
        setItem: (key, value) => { localStorage.setItem(key, String(value)); return true; },
        removeItem: key => { localStorage.removeItem(key); return true; },
        hasItem: key => localStorage.getItem(key) !== null
      });
    } catch {
      return createMemoryAdapter();
    }
  };

  const adapters = Object.freeze({
    version: 1,
    createMemoryAdapter,
    createLocalStorageAdapter,
    use(adapter) { return window.BillyStorage.useAdapter(adapter); },
    current() { return window.BillyStorage.getAdapter(); }
  });

  window.BillyStorageAdapters = adapters;
  adapters.use(createLocalStorageAdapter());
})();

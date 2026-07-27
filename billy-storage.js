/* Billy Labs shared storage gateway — v2
   Domain code talks to BillyStorage; BillyStorage delegates raw persistence
   to a swappable adapter. */
(() => {
  const fallbackMemory = new Map();
  const fallbackAdapter = {
    name: 'memory-fallback',
    getItem: key => fallbackMemory.has(key) ? fallbackMemory.get(key) : null,
    setItem: (key, value) => { fallbackMemory.set(key, String(value)); return true; },
    removeItem: key => { fallbackMemory.delete(key); return true; },
    hasItem: key => fallbackMemory.has(key)
  };

  const detectDefaultAdapter = () => {
    try {
      const testKey = '__billy_storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return {
        name: 'local-storage-compat',
        getItem: key => localStorage.getItem(key),
        setItem: (key, value) => { localStorage.setItem(key, String(value)); return true; },
        removeItem: key => { localStorage.removeItem(key); return true; },
        hasItem: key => localStorage.getItem(key) !== null
      };
    } catch {
      return fallbackAdapter;
    }
  };

  let adapter = detectDefaultAdapter();
  const isAdapter = value => value &&
    typeof value.getItem === 'function' &&
    typeof value.setItem === 'function' &&
    typeof value.removeItem === 'function';

  const api = {
    version: 2,
    useAdapter(nextAdapter) {
      if (!isAdapter(nextAdapter)) throw new TypeError('BillyStorage adapter must implement getItem, setItem, and removeItem.');
      adapter = nextAdapter;
      return adapter;
    },
    getAdapter() { return adapter; },
    get(key, fallback = null) {
      try {
        const value = adapter.getItem(key);
        return value === null || value === undefined ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        adapter.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`BillyStorage could not save ${key}.`, error);
        return false;
      }
    },
    remove(key) {
      try {
        adapter.removeItem(key);
        return true;
      } catch (error) {
        console.warn(`BillyStorage could not remove ${key}.`, error);
        return false;
      }
    },
    has(key) {
      try {
        return typeof adapter.hasItem === 'function'
          ? !!adapter.hasItem(key)
          : adapter.getItem(key) !== null;
      } catch {
        return false;
      }
    }
  };

  window.BillyStorage = Object.freeze(api);
})();

/* Billy Labs device identity — v2
   Creates and persists a local anonymous device identity. Registration is
   opt-in and occurs only when the cloud API has been explicitly configured. */
(() => {
  if (!window.BillyStorage) {
    throw new Error('billy-device-identity.js requires billy-storage.js');
  }

  const API_VERSION = 2;
  const STORAGE_KEY = 'billy.device.identity.v1';
  const DEVICE_PREFIX = 'dev_';
  const storage = window.BillyStorage;

  const now = () => new Date().toISOString();

  const randomId = () => {
    if (globalThis.crypto?.randomUUID) {
      return `${DEVICE_PREFIX}${globalThis.crypto.randomUUID()}`;
    }

    const bytes = new Uint8Array(16);
    globalThis.crypto?.getRandomValues?.(bytes);
    const token = bytes.some(Boolean)
      ? [...bytes].map(value => value.toString(16).padStart(2, '0')).join('')
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    return `${DEVICE_PREFIX}${token}`;
  };

  const normalize = value => (
    value && typeof value === 'object' && typeof value.id === 'string'
      ? value
      : null
  );

  const get = () => normalize(storage.get(STORAGE_KEY, null));

  const save = identity => {
    storage.set(STORAGE_KEY, identity);
    return identity;
  };

  const ensure = () => {
    const existing = get();
    if (existing) return existing;

    return save({
      id:randomId(),
      createdAt:now(),
      registeredAt:null,
      lastRegistrationAt:null
    });
  };

  const mask = id => {
    const text = String(id || '');
    return text.length <= 14 ? text : `${text.slice(0, 8)}…${text.slice(-6)}`;
  };

  const register = async () => {
    const identity = ensure();
    if (!window.BillyCloudApi?.isConfigured?.()) {
      throw new Error('Billy Labs cloud API is not configured');
    }

    const result = await window.BillyCloudApi.registerDevice(identity.id, {
      createdAt:identity.createdAt
    });
    const updated = {
      ...identity,
      registeredAt:identity.registeredAt || now(),
      lastRegistrationAt:now()
    };
    save(updated);
    return {...result, identity:updated};
  };

  window.BillyDeviceIdentity = Object.freeze({
    version:API_VERSION,
    key:STORAGE_KEY,
    get,
    ensure,
    getId:() => ensure().id,
    getMaskedId:() => mask(ensure().id),
    register
  });
})();

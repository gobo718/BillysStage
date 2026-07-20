const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

const loadClient = ({configuredBase = 'https://api.example.test/', storedBase = '', fetchImpl} = {}) => {
  const calls = [];
  const localStorage = {
    getItem: key => key === 'billy-cloud-api-base' ? storedBase : null
  };
  const fetch = fetchImpl || (async (url, init = {}) => {
    calls.push({url, init});
    return {
      ok: true,
      status: 200,
      json: async () => ({ok: true, favorites: ['a+b']})
    };
  });
  const ctx = {
    window: {BILLY_CLOUD_API_BASE: configuredBase},
    localStorage,
    fetch,
    console,
    Set
  };
  ctx.window.window = ctx.window;
  ctx.window.localStorage = localStorage;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'billy-cloud-api.js'), 'utf8'), ctx);
  return {api: ctx.window.BillyCloudApi, calls, ctx};
};

(async () => {
  const {api, calls, ctx} = loadClient();

  if (api.version !== 6) throw Error('Unexpected API client version');
  if (api.storageKey !== 'billy-cloud-api-base') throw Error('Storage key was not exposed');
  if (!api.isConfigured()) throw Error('API should be configured');
  if (api.getBaseUrl() !== 'https://api.example.test') throw Error('Base URL was not normalized');

  await api.putFavorites('device-1', ['a+b', 'a+b']);
  if (calls[0].url !== 'https://api.example.test/api/users/device-1/favorites') {
    throw Error('Wrong endpoint');
  }
  const favoritesBody = JSON.parse(calls[0].init.body);
  if (favoritesBody.favorites.length !== 1) throw Error('Favorites were not deduplicated');
  if (calls[0].init.headers['content-type'] !== 'application/json') {
    throw Error('JSON content type was not applied');
  }

  await api.publishBlurblet('😀|🥳', 'Live!', 'secret');
  if (calls[1].init.headers['x-curator-key'] !== 'secret') {
    throw Error('Curator header was not preserved');
  }

  const configured = api.configure(' https://other.example.test/// ');
  if (configured !== 'https://other.example.test') throw Error('Configure did not normalize the URL');
  if (ctx.window.BILLY_CLOUD_API_BASE !== configured) throw Error('Window configuration was not updated');

  const stored = loadClient({storedBase: 'https://stored.example.test/'}).api;
  if (stored.getBaseUrl() !== 'https://stored.example.test') {
    throw Error('Stored browser override should take precedence');
  }

  const unconfigured = loadClient({configuredBase: ''}).api;
  if (unconfigured.isConfigured()) throw Error('Blank client should be unconfigured');
  await unconfigured.health().then(
    () => { throw Error('Unconfigured request should fail'); },
    error => {
      if (error.message !== 'Billy Labs cloud API is not configured') {
        throw error;
      }
    }
  );

  const failed = loadClient({
    fetchImpl: async () => ({
      ok: false,
      status: 403,
      json: async () => ({error: 'Denied'})
    })
  }).api;
  await failed.health().then(
    () => { throw Error('Failed request should reject'); },
    error => {
      if (error.message !== 'Denied') throw error;
    }
  );

  console.log('cloud API client tests passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});

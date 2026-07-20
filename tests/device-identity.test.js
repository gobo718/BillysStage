const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function loadIdentity({cloudApi, cryptoOverride} = {}) {
  const data = {};
  const crypto = cryptoOverride || {randomUUID:() => '12345678-1234-1234-1234-123456789abc'};
  const context = {
    window: {
      BillyStorage: {
        get:(key, fallback) => key in data ? data[key] : fallback,
        set:(key, value) => (data[key] = value)
      },
      BillyCloudApi:cloudApi
    },
    crypto,
    Uint8Array,
    Date,
    Math
  };
  context.window.crypto = crypto;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'billy-device-identity.js'), 'utf8'), context);
  return {identity:context.window.BillyDeviceIdentity, data};
}

test('device identity is stable and anonymous', () => {
  const {identity} = loadIdentity();
  const first = identity.ensure();
  const second = identity.ensure();
  assert.equal(identity.version, 2);
  assert.equal(identity.key, 'billy.device.identity.v1');
  assert.equal(first.id, second.id);
  assert.match(first.id, /^dev_/);
  assert.equal(identity.getMaskedId().includes('…'), true);
});

test('invalid stored values are replaced with a valid identity', () => {
  const {identity, data} = loadIdentity();
  data[identity.key] = {id:42};
  const created = identity.ensure();
  assert.equal(typeof created.id, 'string');
  assert.match(created.id, /^dev_/);
});

test('registration requires configured cloud API', async () => {
  const {identity} = loadIdentity({cloudApi:{isConfigured:() => false}});
  await assert.rejects(identity.register(), /cloud API is not configured/);
});

test('registration persists timestamps and returns cloud result', async () => {
  let request = null;
  const cloudApi = {
    isConfigured:() => true,
    registerDevice:async (id, payload) => {
      request = {id, payload};
      return {ok:true};
    }
  };
  const {identity} = loadIdentity({cloudApi});
  const result = await identity.register();
  assert.equal(request.id, result.identity.id);
  assert.equal(request.payload.createdAt, result.identity.createdAt);
  assert.equal(result.ok, true);
  assert.ok(result.identity.registeredAt);
  assert.ok(result.identity.lastRegistrationAt);
  assert.equal(identity.get().id, result.identity.id);
});

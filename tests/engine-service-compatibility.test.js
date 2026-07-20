const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const mappings = {
  'billy-storage.js':'engine/platform/storage/storage.js',
  'billy-storage-adapters.js':'engine/platform/storage/adapters.js',
  'billy-device-identity.js':'engine/platform/identity/device-identity.js',
  'billy-sync-manager.js':'engine/platform/sync/sync-manager.js',
  'billy-cloud-api.js':'engine/service/cloud/cloud-api.js',
  'billy-repositories.js':'engine/service/repositories/billy-repositories.js'
};
for (const [legacy, canonical] of Object.entries(mappings)) {
  if (!fs.existsSync(path.join(root, canonical))) throw new Error(`Missing canonical service ${canonical}`);
  const writes=[];
  const context={document:{currentScript:{src:`https://example.test/${legacy}`},write:s=>writes.push(s)},URL};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,legacy),'utf8'),context,{filename:legacy});
  if (writes.length !== 1 || !writes[0].includes(canonical)) throw new Error(`${legacy} did not delegate to ${canonical}`);
}
const workerWrapper=fs.readFileSync(path.join(root,'worker/src/index.js'),'utf8');
if (!workerWrapper.includes("../../engine/service/worker/src/index.js")) throw new Error('Worker wrapper does not delegate to canonical Engine Worker');
console.log('engine service compatibility tests passed');

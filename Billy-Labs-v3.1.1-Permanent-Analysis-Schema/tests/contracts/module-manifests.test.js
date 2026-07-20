const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

test('all module manifests validate and occupy their declared roots', () => {
  const result = spawnSync(process.execPath, ['tools/architecture/validate-manifests.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Validated 4 module manifests/);
});

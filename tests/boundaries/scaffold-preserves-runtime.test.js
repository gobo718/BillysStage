const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const expected = ['index.html','explorer.html','mashup.html','curator/index.html','worker/package.json'];

test('legacy runtime entry points remain present during Stage 3A', () => {
  for (const rel of expected) assert.equal(fs.existsSync(path.join(root, rel)), true, `missing legacy runtime entry point ${rel}`);
});

test('boundary scaffolds and governance files exist', () => {
  const required = ['engine/MODULE.json','games/billyslab/museum/MODULE.json','games/billyslab/curator/MODULE.json','games/billyslab/content/MODULE.json','docs/architecture/PROJECT_CONTRACT.md','contracts/boundary-policy.json'];
  for (const rel of required) assert.equal(fs.existsSync(path.join(root, rel)), true, `missing scaffold file ${rel}`);
});

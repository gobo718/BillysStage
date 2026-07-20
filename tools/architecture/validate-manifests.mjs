import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const policy = JSON.parse(fs.readFileSync(path.join(root, 'contracts/boundary-policy.json'), 'utf8'));
const schema = JSON.parse(fs.readFileSync(path.join(root, policy.schema), 'utf8'));

function fail(message) { throw new Error(message); }
function typeOk(v, t) {
  if (t === 'array') return Array.isArray(v);
  if (t === 'object') return v && typeof v === 'object' && !Array.isArray(v);
  return typeof v === t;
}
function validate(data, manifestPath) {
  for (const req of schema.required || []) if (!(req in data)) fail(`${manifestPath}: missing required property ${req}`);
  for (const [key, rule] of Object.entries(schema.properties || {})) {
    if (!(key in data)) continue;
    if (rule.type && !typeOk(data[key], rule.type)) fail(`${manifestPath}: ${key} must be ${rule.type}`);
    if (rule.minItems && data[key].length < rule.minItems) fail(`${manifestPath}: ${key} requires at least ${rule.minItems} item(s)`);
    if (rule.pattern && !new RegExp(rule.pattern).test(data[key])) fail(`${manifestPath}: ${key} does not match ${rule.pattern}`);
    if (rule.enum && !rule.enum.includes(data[key])) fail(`${manifestPath}: ${key} is not an allowed value`);
  }
}
const ids = new Set();
for (const rel of policy.manifests) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail(`Missing manifest: ${rel}`);
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  validate(data, rel);
  if (ids.has(data.id)) fail(`Duplicate module id: ${data.id}`);
  ids.add(data.id);
  const moduleRoot = policy.moduleRoots[data.id];
  if (!moduleRoot || path.dirname(rel) !== moduleRoot) fail(`${rel}: manifest is not at declared module root`);
}
console.log(`Validated ${policy.manifests.length} module manifests: ${[...ids].join(', ')}`);

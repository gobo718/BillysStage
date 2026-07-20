import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const policy = JSON.parse(fs.readFileSync(path.join(root, 'contracts/boundary-policy.json'), 'utf8'));
const extensions = new Set(['.js','.mjs','.cjs','.html','.css']);
const forbidden = [
  { owner:'engine', token:/games\/billyslab|museum\.private|curator\.(?:private|drafts)|billyslab-content/i },
  { owner:'museum', token:/curator\.(?:private|drafts)|games\/billyslab\/curator/i },
  { owner:'curator', token:/museum\.private|games\/billyslab\/museum\/(?:pages|scripts|styles)/i },
  { owner:'billyslab-content', token:/museum\.private|curator\.private|engine\.private/i },
];
function walk(dir) {
  const out=[];
  for (const ent of fs.readdirSync(dir,{withFileTypes:true})) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const p=path.join(dir,ent.name);
    if (ent.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
const violations=[];
for (const [owner, relRoot] of Object.entries(policy.moduleRoots)) {
  const moduleRoot=path.join(root,relRoot);
  for (const file of walk(moduleRoot)) {
    if (!extensions.has(path.extname(file)) || file.endsWith('MODULE.json')) continue;
    const text=fs.readFileSync(file,'utf8');
    for (const rule of forbidden.filter(x=>x.owner===owner)) {
      if (rule.token.test(text)) violations.push(`${path.relative(root,file)} violates ${owner} boundary: ${rule.token}`);
    }
  }
}
if (violations.length) {
  console.error(violations.join('\n'));
  process.exit(1);
}
const ledger=fs.readFileSync(path.join(root,'docs/architecture/BOUNDARY_EXCEPTIONS.md'),'utf8');
for (const id of policy.allowedLegacyExceptions) {
  if (!ledger.includes(id)) { console.error(`Boundary exception ${id} is missing from ledger`); process.exit(1); }
}
console.log('Boundary scan passed. New module scaffolds contain no forbidden references; legacy exceptions are explicitly ledgered.');

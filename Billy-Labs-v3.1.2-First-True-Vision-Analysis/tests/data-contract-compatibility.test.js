const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
for(const [legacy,expected] of Object.entries({
  'collections-data.js':['engine/game/collections/collection-service.js','games/billyslab/content/collection-definitions.js','games/billyslab/content/collections-repository.js'],
  'curator-data.js':['engine/game/publishing/curator-records.js','games/billyslab/content/curator-repository.js']
})){
  const writes=[];const context={document:{currentScript:{src:`https://example.test/${legacy}`},write:s=>writes.push(s)},URL};vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,legacy),'utf8'),context,{filename:legacy});
  for(const target of expected)if(!writes.some(x=>x.includes(target)))throw new Error(`${legacy} does not load ${target}`);
}
console.log('Data contract compatibility tests passed.');

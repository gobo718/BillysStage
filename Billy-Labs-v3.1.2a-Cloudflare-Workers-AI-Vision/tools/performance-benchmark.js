#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const context = { window:{}, Math, Set, Map, WeakMap, URLSearchParams };
context.window.window=context.window;
vm.createContext(context);
for(const file of ['emoji-data.js','mashup-core.js','mashup-search.js','mashup-discovery.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const rows=context.window.EMOJI_KITCHEN_DATA;
const {BillyMashups:m,BillySearch:s,BillyDiscovery:d}=context.window;
const sampleEmoji=rows[Math.floor(rows.length/2)][0];
const seen=new Set(rows.slice(0,Math.floor(rows.length/2)).map(r=>m.id(r[0],r[1])));
const measure=(name,fn,iterations=5)=>{
  const times=[]; let result;
  for(let i=0;i<iterations;i++){const start=performance.now();result=fn();times.push(performance.now()-start);}
  times.sort((a,b)=>a-b);
  return {name,medianMs:Number(times[Math.floor(times.length/2)].toFixed(3)),resultSize:Array.isArray(result)?result.length:(result?1:0)};
};
const results=[
  measure('resolution index cold',()=>m.buildResolutionIndex(rows),3),
  measure('resolution cached lookup x1000',()=>{let r;for(let i=0;i<1000;i++)r=m.resolve(rows,rows[i][0],rows[i][1]);return r;}),
  measure('ingredient index cold',()=>s.buildIngredientIndex(rows),3),
  measure('ingredient lookup cached',()=>s.rowsContaining(rows,sampleEmoji)),
  measure('search full inventory',()=>s.searchRows(rows,'frog')),
  measure('unseen-preferred discovery',()=>d.selectRandom(rows,{preferUnseen:true,seenIds:seen,idOf:r=>m.id(r[0],r[1]),random:()=>0.5})),
  measure('newest group cached',()=>d.newestRows(rows))
];
const report={version:'2.5.6',rowCount:rows.length,sampleEmoji,generatedAt:new Date().toISOString(),results};
const output=path.join(root,'PERFORMANCE_BENCHMARK.json');
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

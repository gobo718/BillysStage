import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import worker from '../src/index.js';
const makeDb=(seed=[])=>{let rows=seed.map(x=>({...x}));return{prepare(sql){return{bind(...args){return{sql,args,async all(){return{results:rows.map(x=>({...x}))}},async run(){return{success:true}}}}}},async batch(statements){const inserted=statements.filter(s=>/INSERT INTO mashup_progress/.test(s.sql));rows=inserted.map(s=>({mashup_id:s.args[1],seen:s.args[2],favorite:s.args[3]}));return statements.map(()=>({success:true}))},snapshot:()=>rows.map(x=>({...x}))}};
test('health reports v3.1.2a',async()=>{const r=await worker.fetch(new Request('https://x/api/health'));assert.equal(r.status,200);assert.equal((await r.json()).version,'3.1.2a')});
test('progress can be read',async()=>{const db=makeDb([{mashup_id:'a',seen:1,favorite:0},{mashup_id:'b',seen:1,favorite:1}]);const r=await worker.fetch(new Request('https://x/api/users/u1/progress'),{DB:db});assert.deepEqual(await r.json(),{ok:true,userId:'u1',seen:['a','b'],favorites:['b']})});
test('progress can be replaced in one batch',async()=>{const db=makeDb([]);const r=await worker.fetch(new Request('https://x/api/users/u1/progress',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({seen:['a','b'],favorites:['b','c']})}),{DB:db});assert.equal(r.status,200);assert.deepEqual((await r.json()).favorites,['b','c']);assert.equal(db.snapshot().length,3)});
test('favorites compatibility endpoint remains available',async()=>{const db=makeDb([{mashup_id:'seen-only',seen:1,favorite:0}]);const r=await worker.fetch(new Request('https://x/api/users/u1/favorites',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({favorites:['fav']})}),{DB:db});assert.equal(r.status,200);assert.deepEqual((await r.json()).favorites,['fav'])});
test('invalid progress is rejected',async()=>{const r=await worker.fetch(new Request('https://x/api/users/u1/progress',{method:'PUT',headers:{'content-type':'application/json'},body:'{}'}),{DB:makeDb()});assert.equal(r.status,400)});
test('migration domains remain defined',()=>{const sql=fs.readFileSync(path.resolve('migrations/0001_initial.sql'),'utf8');for(const table of ['users','user_settings','mashup_progress','blurblet_votes','collections','collection_items','curator_blurblets'])assert.match(sql,new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`))});

test('published blurblet can be read publicly',async()=>{
  const db={prepare(sql){return{bind(id){return{async first(){return{mashup_id:id,published_text:'Tiny museum menace.',published_at:'2026-07-18T00:00:00Z',updated_at:'2026-07-18T00:00:00Z'}}}}}}};
  const r=await worker.fetch(new Request('https://x/api/blurblets/%F0%9F%98%80%7C%F0%9F%A7%AA'),{DB:db});
  assert.equal(r.status,200);assert.equal((await r.json()).text,'Tiny museum menace.');
});

test('curator blurblet publish requires the configured key',async()=>{
  const db={prepare(){return{bind(){return{async run(){return{success:true}}}}}}};
  const unauthorized=await worker.fetch(new Request('https://x/api/curator/blurblets/a%7Cb',{method:'PUT',headers:{'content-type':'application/json','x-curator-key':'wrong'},body:JSON.stringify({text:'Hello'})}),{DB:db,CURATOR_PUBLISH_KEY:'right'});
  assert.equal(unauthorized.status,401);
  const ok=await worker.fetch(new Request('https://x/api/curator/blurblets/a%7Cb',{method:'PUT',headers:{'content-type':'application/json','x-curator-key':'right'},body:JSON.stringify({text:'Hello'})}),{DB:db,CURATOR_PUBLISH_KEY:'right'});
  assert.equal(ok.status,200);assert.equal((await ok.json()).published,true);
});


test('vision analysis requires curator authorization',async()=>{
  const body=JSON.stringify({mashupId:'a|b',imageUrl:'https://example.test/mashup.png'});
  const r=await worker.fetch(new Request('https://x/api/curator/analyze',{method:'POST',headers:{'content-type':'application/json','x-curator-key':'wrong'},body}),{CURATOR_PUBLISH_KEY:'right',AI:{run:async()=>({response:'{}'})}});
  assert.equal(r.status,401);
});

test('vision analysis converts structured Workers AI output into curator report',async()=>{
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>new Response(new Uint8Array([137,80,78,71]),{status:200,headers:{'content-type':'image/png'}});
  const modelResult={visualAnalysis:'A pink rounded animal figure.',fields:[{fieldId:'field_color_dominant_general',candidates:[{value:'Pink',optionId:'color_pink',confidence:98,reason:'Pink occupies most visible area.'},{value:'Red',optionId:'color_red',confidence:31,reason:'Some deeper pink areas appear reddish.'}]},{fieldId:'field_color_dominant_brightness',candidates:[{value:'Medium',optionId:'color_brightness_medium',confidence:85,reason:'Neither especially pale nor dark.'}]},{fieldId:'field_primary_subject',candidates:[{value:'Pig-like animal',optionId:null,confidence:96,reason:'Visible snout and ears.'}]}],additionalObservations:[{text:'The figure appears cheerful.',confidence:71,reason:'Upturned mouth and lively pose.'}],reviewFlags:[]};
  let received;
  const AI={async run(model,input){received={model,input};return{response:JSON.stringify(modelResult)}}};
  try{
    const body=JSON.stringify({mashupId:'a|b',imageUrl:'https://example.test/mashup.png'});
    const r=await worker.fetch(new Request('https://x/api/curator/analyze',{method:'POST',headers:{'content-type':'application/json','x-curator-key':'right'},body}),{CURATOR_PUBLISH_KEY:'right',AI});
    assert.equal(r.status,200);
    const payload=await r.json();
    assert.equal(payload.report.provider.model,'@cf/meta/llama-3.2-11b-vision-instruct');
    assert.equal(payload.report.provider.id,'provider_cloudflare_workers_ai_vision');
    assert.equal(payload.report.detectedCharacteristics[0].candidates.length,2);
    assert.equal(payload.report.detectedCharacteristics[0].confidence,.98);
    assert.equal(received.input.image.length,4);
  } finally { globalThis.fetch=originalFetch; }
});

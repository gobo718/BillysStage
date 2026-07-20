const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const store=new Map();
const ctx={window:{BillyStorage:{get:(k,f)=>store.has(k)?store.get(k):f,set:(k,v)=>(store.set(k,v),v)},addEventListener:()=>{}},console,Map,Date,Set};ctx.window.window=ctx.window;
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'engine/platform/sync/sync-manager.js'),'utf8'),ctx);
let pushed=null;const m=ctx.window.BillySyncManager;m.register('progress',{pull:async()=>({seen:[],favorites:[]}),push:async(_u,p)=>{pushed=p;return p}});
m.enqueue('progress',{seen:['a'],favorites:['b']});m.enqueue('progress',{seen:['a','c'],favorites:['b']});
if(m.getQueueLength()!==1)throw Error('Progress queue did not batch by repository');
m.configure({enabled:true,userId:'device-1'});m.flush().then(result=>{if(result.flushed!==1||m.getQueueLength()!==0)throw Error('Queue did not flush');if(pushed.seen.length!==2)throw Error('Latest snapshot was not pushed');console.log('progress cloud sync tests passed')}).catch(e=>{console.error(e);process.exit(1)});

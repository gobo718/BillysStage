/* Billy Labs curated collection schema + storage — v2 */
(() => {
  if (!window.BillyStorage) throw new Error('collections-data.js requires billy-storage.js');
  const KEY='billy-collections-v1';
  const LEGACY_EXHIBITS='billy-curator-exhibits-v1';
  const defaults=[
    ['mutations','🧬','Mutations'],['forbidden-foods','🍽️','Forbidden Foods'],
    ['extra-eyes','👁️','Extra Eyes'],['unexpected-royalty','👑','Unexpected Royalty']
  ];
  const now=()=>new Date().toISOString();
  const slug=s=>String(s||'collection').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'collection';
  const blank=(name='Untitled Collection',icon='🗂️')=>({id:`${slug(name)}-${Date.now().toString(36)}`,name,icon,description:'',banner:'',tier:'standard',points:100,sortOrder:0,secret:false,notes:'',status:'draft',publishedVersion:0,published:null,draft:{members:[]},createdAt:now(),updatedAt:now()});
  function migrate(){
    let rows=BillyStorage.get(KEY,[]);
    if(rows.length)return rows;
    const entries=window.BillyCuratorData?.list?.()||{};
    const legacy=BillyStorage.get(LEGACY_EXHIBITS,[]);
    const names=[...defaults.map(x=>`${x[1]} ${x[2]}`),...legacy];
    rows=names.map((label,i)=>{
      const match=defaults.find(x=>label.includes(x[2]));
      const icon=(label.match(/^\p{Extended_Pictographic}/u)||[])[0]||match?.[1]||'🗂️';
      const name=label.replace(/^\p{Extended_Pictographic}\s*/u,'').trim();
      const c=blank(name,icon);c.id=match?.[0]||`${slug(name)}-${i+1}`;c.sortOrder=i;
      c.draft.members=Object.entries(entries).filter(([,e])=>(e.exhibits||[]).includes(label)).map(([id])=>id);
      return c;
    });
    BillyStorage.set(KEY,rows);return rows;
  }
  const save=rows=>BillyStorage.set(KEY,rows);
  window.BillyCollections={version:2,key:KEY,blank,list:migrate,save,find:id=>migrate().find(x=>x.id===id),slug};
})();

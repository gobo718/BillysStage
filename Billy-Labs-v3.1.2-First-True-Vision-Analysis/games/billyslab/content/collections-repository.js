/* BillysLab collection storage/configuration adapter — v1 */
(() => {
  if(!window.BillyStorage)throw new Error('collections repository requires BillyStorage');
  if(!window.BillyCollectionService)throw new Error('collections repository requires BillyCollectionService');
  const KEY='billy-collections-v1', LEGACY_EXHIBITS='billy-curator-exhibits-v1';
  const definitions=()=>window.BILLY_COLLECTION_DEFINITIONS||[];
  function migrate(){
    let rows=BillyStorage.get(KEY,[]);
    if(rows.length)return rows.map(BillyCollectionService.normalize);
    const entries=window.BillyCuratorData?.listPublished?.()||{};
    const legacy=BillyStorage.get(LEGACY_EXHIBITS,[]);
    const names=[...definitions().map(x=>`${x.icon} ${x.name}`),...legacy];
    rows=names.map((label,i)=>{
      const match=definitions().find(x=>label.includes(x.name));
      const icon=(label.match(/^\p{Extended_Pictographic}/u)||[])[0]||match?.icon||'🗂️';
      const name=label.replace(/^\p{Extended_Pictographic}\s*/u,'').trim();
      const c=BillyCollectionService.blank(name,icon);c.id=match?.id||`${BillyCollectionService.slug(name)}-${i+1}`;c.sortOrder=i;
      c.draft.members=Object.entries(entries).filter(([,e])=>(e.exhibits||[]).includes(label)).map(([id])=>id);
      return c;
    });
    BillyStorage.set(KEY,rows);return rows;
  }
  const save=rows=>BillyStorage.set(KEY,(rows||[]).map(BillyCollectionService.normalize));
  window.BillyCollections={version:3,key:KEY,blank:BillyCollectionService.blank,list:migrate,save,find:id=>migrate().find(x=>x.id===id),slug:BillyCollectionService.slug,publicProjection:BillyCollectionService.publicProjection};
})();

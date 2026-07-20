/* BillysLab Curator draft repository and public projection adapter — v3 */
(() => {
  if(!window.BillyStorage)throw new Error('curator repository requires BillyStorage');
  if(!window.BillyCuratorRecordContracts)throw new Error('curator repository requires record contracts');
  const DRAFT_KEY='billy-curator-entries-v1',PUBLISHED_KEY='billy-published-curator-entries-v1';
  const staticPublished=()=>BillyCuratorRecordContracts.project(window.BILLY_PUBLISHED_CURATOR_DATA||{});
  const draftList=()=>BillyStorage.get(DRAFT_KEY,{});
  const localPublished=()=>BillyCuratorRecordContracts.project(BillyStorage.get(PUBLISHED_KEY,{}));
  const listPublished=()=>({...staticPublished(),...localPublished()});
  const list=listPublished;
  const getDraft=id=>draftList()[id]||null;
  const get=id=>getDraft(id)||listPublished()[id]||null;
  const saveAll=entries=>BillyStorage.set(DRAFT_KEY,entries||{});
  const save=(id,entry)=>{const entries=draftList();entries[id]=BillyCuratorRecordContracts.draft(id,entry);saveAll(entries);return entries[id];};
  const remove=id=>{const entries=draftList();delete entries[id];saveAll(entries);};
  const publishBlurblet=id=>{const source=getDraft(id);if(!source)return null;const rows=localPublished(), projected=BillyCuratorRecordContracts.published(id,source);if(projected.blurblet)rows[id]=projected;else delete rows[id];BillyStorage.set(PUBLISHED_KEY,rows);return rows[id]||null;};
  const exportPublishedScript=()=>`/* Billy Labs public curator content — generated ${new Date().toISOString()} */\nwindow.BILLY_PUBLISHED_CURATOR_DATA = ${JSON.stringify(listPublished(),null,2)};\n`;
  const downloadPublishedScript=()=>{const blob=new Blob([exportPublishedScript()],{type:'application/javascript'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='published-curator-data.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);};
  window.BillyCuratorData={version:3,key:DRAFT_KEY,publishedKey:PUBLISHED_KEY,list,listPublished,draftList,get,getDraft,save,saveAll,remove,publishBlurblet,exportPublishedScript,downloadPublishedScript};
})();

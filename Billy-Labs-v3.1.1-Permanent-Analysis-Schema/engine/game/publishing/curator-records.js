/* Billy Engine Curator draft/published record contracts — v1 */
(() => {
  const VERSION=1;
  const text=value=>String(value||'');
  const draft=(id,value={})=>({schemaVersion:1,recordType:'curator-draft',id:text(id),left:text(value.left),right:text(value.right),blurblet:text(value.blurblet),notes:text(value.notes),exhibits:Array.isArray(value.exhibits)?[...value.exhibits]:[],updatedAt:value.updatedAt||new Date().toISOString()});
  const published=(id,value={})=>Object.freeze({schemaVersion:1,recordType:'published-curator-record',id:text(id),left:text(value.left),right:text(value.right),blurblet:text(value.blurblet).trim(),publishedAt:value.publishedAt||new Date().toISOString()});
  const project=value=>{
    const out={};for(const [id,row] of Object.entries(value||{})){const p=published(id,row);if(p.blurblet)out[id]=p;}return out;
  };
  window.BillyCuratorRecordContracts=Object.freeze({version:VERSION,draft,published,project});
})();

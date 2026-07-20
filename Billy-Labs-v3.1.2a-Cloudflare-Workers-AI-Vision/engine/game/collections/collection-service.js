/* Billy Engine collection mechanics — v1 */
(() => {
  const VERSION=1;
  const now=()=>new Date().toISOString();
  const slug=s=>String(s||'collection').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'collection';
  const normalizeMembers=members=>[...new Set((members||[]).map(String).filter(Boolean))];
  const normalize=row=>{
    const value={...(row||{})};
    value.id=String(value.id||`${slug(value.name)}-${Date.now().toString(36)}`);
    value.name=String(value.name||'Untitled Collection');
    value.icon=String(value.icon||'🗂️');
    value.description=String(value.description||'');
    value.banner=String(value.banner||'');
    value.tier=String(value.tier||'standard');
    value.points=Number(value.points)||0;
    value.sortOrder=Number(value.sortOrder)||0;
    value.secret=!!value.secret;
    value.notes=String(value.notes||'');
    value.status=value.status==='published'?'published':'draft';
    value.publishedVersion=Number(value.publishedVersion)||0;
    value.published=value.published||null;
    value.draft={...(value.draft||{}),members:normalizeMembers(value.draft?.members)};
    value.createdAt=value.createdAt||now();
    value.updatedAt=value.updatedAt||now();
    return value;
  };
  const blank=(name='Untitled Collection',icon='🗂️')=>normalize({name,icon,points:100});
  const publicProjection=row=>{
    const c=normalize(row), source=c.published||c;
    return Object.freeze({schemaVersion:1,id:c.id,name:String(source.name??c.name),icon:String(source.icon??c.icon),description:String(source.description??c.description),banner:String(source.banner??c.banner),tier:String(source.tier??c.tier),points:Number(source.points??c.points)||0,sortOrder:Number(source.sortOrder??c.sortOrder)||0,secret:!!(source.secret??c.secret),members:normalizeMembers(source.members??c.draft.members),publishedVersion:c.publishedVersion});
  };
  window.BillyCollectionService=Object.freeze({version:VERSION,slug,blank,normalize,normalizeMembers,publicProjection});
})();

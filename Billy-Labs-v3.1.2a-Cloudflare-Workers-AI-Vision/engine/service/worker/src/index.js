const API_VERSION = '3.1.2a';
const SCHEMA_VERSION = 4;
const corsHeaders = {'access-control-allow-origin':'*','access-control-allow-methods':'GET, PUT, POST, OPTIONS','access-control-allow-headers':'content-type, x-curator-key'};
const json=(body,init={})=>new Response(JSON.stringify(body),{...init,headers:{...corsHeaders,'content-type':'application/json; charset=utf-8',...(init.headers||{})}});
const requireDb=env=>{if(!env.DB)throw new Error('D1 database is not bound');return env.DB};
const validId=value=>typeof value==='string'&&/^[A-Za-z0-9_|+\-]{1,256}$/.test(value);
const validIds=values=>Array.isArray(values)&&values.every(validId);
const validMashupId=value=>typeof value==='string'&&value.length>0&&value.length<=256&&!/[\u0000-\u001f]/.test(value);
const userRoute=path=>{const m=path.match(/^\/api\/users\/([^/]+)\/(favorites|progress)$/);return m?{userId:decodeURIComponent(m[1]),resource:m[2]}:null};
const deviceRoute=path=>{const m=path.match(/^\/api\/devices\/([^/]+)$/);return m?decodeURIComponent(m[1]):null};
const blurbletRoute=path=>{let m=path.match(/^\/api\/blurblets\/([^/]+)$/);if(m)return{mashupId:decodeURIComponent(m[1]),curator:false};m=path.match(/^\/api\/curator\/blurblets\/([^/]+)$/);return m?{mashupId:decodeURIComponent(m[1]),curator:true}:null};
const getProgress=async(env,userId)=>{const result=await requireDb(env).prepare('SELECT mashup_id, seen, favorite FROM mashup_progress WHERE user_id = ?1 AND (seen = 1 OR favorite = 1) ORDER BY mashup_id').bind(userId).all();const seen=[],favorites=[];for(const row of result.results||[]){if(row.seen)seen.push(row.mashup_id);if(row.favorite)favorites.push(row.mashup_id)}return{seen,favorites}};
const putProgress=async(env,userId,progress)=>{const db=requireDb(env),seen=[...new Set(progress.seen)],favorites=[...new Set(progress.favorites)],ids=[...new Set([...seen,...favorites])],seenSet=new Set(seen),favoriteSet=new Set(favorites);const statements=[db.prepare("INSERT INTO users (id, display_name) VALUES (?1, '') ON CONFLICT(id) DO UPDATE SET updated_at=CURRENT_TIMESTAMP").bind(userId),db.prepare('UPDATE mashup_progress SET seen=0, favorite=0, updated_at=CURRENT_TIMESTAMP WHERE user_id=?1').bind(userId),...ids.map(id=>db.prepare('INSERT INTO mashup_progress (user_id,mashup_id,seen,favorite,first_seen_at,updated_at) VALUES (?1,?2,?3,?4,CASE WHEN ?3=1 THEN CURRENT_TIMESTAMP ELSE NULL END,CURRENT_TIMESTAMP) ON CONFLICT(user_id,mashup_id) DO UPDATE SET seen=?3,favorite=?4,first_seen_at=CASE WHEN ?3=1 THEN COALESCE(mashup_progress.first_seen_at,CURRENT_TIMESTAMP) ELSE mashup_progress.first_seen_at END,updated_at=CURRENT_TIMESTAMP').bind(userId,id,seenSet.has(id)?1:0,favoriteSet.has(id)?1:0))];await db.batch(statements);return{seen:seen.sort(),favorites:favorites.sort()}};
const registerDevice=async(env,deviceId,metadata={})=>{const db=requireDb(env);await db.batch([db.prepare("INSERT INTO users (id, provider, display_name) VALUES (?1, 'anonymous-device', '') ON CONFLICT(id) DO UPDATE SET updated_at=CURRENT_TIMESTAMP").bind(deviceId),db.prepare('INSERT INTO devices (id,user_id,metadata_json,last_seen_at) VALUES (?1,?1,?2,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET metadata_json=?2,last_seen_at=CURRENT_TIMESTAMP').bind(deviceId,JSON.stringify(metadata||{}))]);return{deviceId,userId:deviceId,status:'registered'}};
const getDevice=async(env,deviceId)=>await requireDb(env).prepare('SELECT id,user_id,created_at,last_seen_at FROM devices WHERE id=?1').bind(deviceId).first()||null;
const getBlurblet=async(env,mashupId)=>await requireDb(env).prepare('SELECT mashup_id,published_text,published_at,updated_at FROM curator_blurblets WHERE mashup_id=?1').bind(mashupId).first()||null;
const publishBlurblet=async(env,mashupId,text)=>{const clean=String(text||'').trim();await requireDb(env).prepare("INSERT INTO curator_blurblets (mashup_id,published_text,published_at,updated_at) VALUES (?1,?2,CASE WHEN ?2='' THEN NULL ELSE CURRENT_TIMESTAMP END,CURRENT_TIMESTAMP) ON CONFLICT(mashup_id) DO UPDATE SET published_text=?2,published_at=CASE WHEN ?2='' THEN NULL ELSE CURRENT_TIMESTAMP END,updated_at=CURRENT_TIMESTAMP").bind(mashupId,clean).run();return{mashupId,text:clean,published:!!clean}};

const confidence=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)))/100;
const COLOR_IDS=['color_red','color_orange','color_yellow','color_green','color_blue','color_purple','color_cyan','color_pink','color_gray','color_black','color_white','color_brown','color_teal','color_magenta','color_beige_tan','color_multicolor'];
const BRIGHTNESS_IDS=['color_brightness_light','color_brightness_medium','color_brightness_dark','color_brightness_mixed'];
const fieldNames={field_color_dominant_general:'Dominant Color',field_color_dominant_brightness:'Dominant Color Brightness',field_primary_subject:'Primary Subject'};
const DEFAULT_VISION_MODEL='@cf/meta/llama-3.2-11b-vision-instruct';
const stripCodeFence=text=>String(text||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
const parseJsonObject=text=>{const clean=stripCodeFence(text);try{return JSON.parse(clean)}catch{const first=clean.indexOf('{'),last=clean.lastIndexOf('}');if(first>=0&&last>first){try{return JSON.parse(clean.slice(first,last+1))}catch{}}throw new Error('Vision provider returned invalid JSON')}};
const cloudflareResponseText=payload=>typeof payload==='string'?payload:(payload?.response||payload?.result?.response||payload?.output_text||'');
const fetchImageBytes=async imageUrl=>{
  if(!/^https:\/\//i.test(imageUrl)||imageUrl.length>2000)throw new Error('imageUrl must be a valid HTTPS URL');
  const response=await fetch(imageUrl,{headers:{accept:'image/png,image/webp,image/jpeg,image/*'}});
  if(!response.ok)throw new Error(`Could not retrieve specimen image (${response.status})`);
  const type=(response.headers.get('content-type')||'').toLowerCase();
  if(type&&!type.startsWith('image/'))throw new Error('Specimen URL did not return an image');
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(!bytes.length)throw new Error('Specimen image was empty');
  if(bytes.length>4_000_000)throw new Error('Specimen image is too large for visual analysis');
  return Array.from(bytes);
};
const normalizeFields=result=>Array.isArray(result?.fields)?result.fields:[];
const analyzeImage=async(env,{mashupId,imageUrl})=>{
  if(!env.AI||typeof env.AI.run!=='function')throw new Error('Vision analysis is not configured: Workers AI binding AI is missing');
  const prompt=`You are the Billy Labs museum curator's visual-analysis assistant. Analyze ONLY the rendered image. You are not given ingredient names, emoji names, labels, filenames, or outside context. Report visible evidence, not assumed backstory. Never silently write metadata.

Return ONLY one valid JSON object with this exact top-level shape:
{"visualAnalysis":"string","fields":[{"fieldId":"string","candidates":[{"value":"string","optionId":"string or null","confidence":0,"reason":"string"}]}],"additionalObservations":[{"text":"string","confidence":0,"reason":"string"}],"reviewFlags":[{"text":"string","confidence":0,"reason":"string"}]}

Return findings for exactly these permanent fields:
- field_color_dominant_general: optionId must be one of ${COLOR_IDS.join(', ')}. Use color_multicolor only when no single color dominates. Gold maps to color_yellow; silver maps to color_gray; chromatic colors win ties over neutrals.
- field_color_dominant_brightness: optionId must be one of ${BRIGHTNESS_IDS.join(', ')}.
- field_primary_subject: optionId must be null and value should be a concise visible subject description.

For each field, return the best candidate and up to two genuinely useful alternatives. Confidence is an independent integer from 0 through 100; candidate percentages do not need to total 100. Do not manufacture alternatives merely to fill three slots. Low-confidence guesses are allowed when clearly scored low. The visualAnalysis paragraph may use specific shade language even when structured color stays general. Keep the response concise. Do not wrap the JSON in Markdown.`;
  const image=await fetchImageBytes(imageUrl);
  const model=env.WORKERS_AI_VISION_MODEL||DEFAULT_VISION_MODEL;
  let payload;
  try{
    payload=await env.AI.run(model,{prompt,image,max_tokens:1200,temperature:0.15});
  }catch(error){
    const message=String(error?.message||error||'Workers AI failed');
    if(/agree|license|acceptable use/i.test(message))throw new Error('Workers AI model license must be accepted once before analysis can run');
    throw new Error(`Workers AI vision failed: ${message}`);
  }
  const raw=cloudflareResponseText(payload);if(!raw)throw new Error('Workers AI returned no analysis text');
  const result=parseJsonObject(raw);
  const validOption=(fieldId,id)=>fieldId==='field_color_dominant_general'?COLOR_IDS.includes(id):fieldId==='field_color_dominant_brightness'?BRIGHTNESS_IDS.includes(id):id===null;
  const allowedFields=new Set(['field_color_dominant_general','field_color_dominant_brightness','field_primary_subject']);
  const detectedCharacteristics=normalizeFields(result).filter(field=>allowedFields.has(field?.fieldId)).map(field=>{const candidates=(Array.isArray(field.candidates)?field.candidates:[]).filter(c=>c&&typeof c.value==='string'&&validOption(field.fieldId,c.optionId??null)).slice(0,3).map(c=>({id:`candidate_${crypto.randomUUID()}`,label:c.value,value:c.value,optionId:c.optionId??null,confidence:confidence(c.confidence),reason:String(c.reason||'')}));const top=candidates[0];return top?{id:`suggestion_field_${crypto.randomUUID()}`,kind:'field',fieldId:field.fieldId,label:top.label,value:top.value,optionId:top.optionId,confidence:top.confidence,reason:top.reason,candidates,status:'pending'}:null}).filter(Boolean);
  const makeObservation=(item,kind)=>({id:`suggestion_${kind}_${crypto.randomUUID()}`,kind,label:String(item.text||''),text:String(item.text||''),confidence:confidence(item.confidence),reason:String(item.reason||''),status:'pending',candidates:[]});
  const returned=new Set(detectedCharacteristics.map(x=>x.fieldId));
  return {id:`analysis_report_${crypto.randomUUID()}`,schemaVersion:2,mashupId,analyzedAt:new Date().toISOString(),provider:{id:'provider_cloudflare_workers_ai_vision',displayName:'Billy Labs Vision · Cloudflare Workers AI',model},detectedCharacteristics,visualAnalysis:String(result.visualAnalysis||''),additionalObservations:(Array.isArray(result.additionalObservations)?result.additionalObservations:[]).slice(0,8).filter(x=>x&&x.text).map(x=>makeObservation(x,'observation')),issues:(Array.isArray(result.reviewFlags)?result.reviewFlags:[]).slice(0,8).filter(x=>x&&x.text).map(x=>makeObservation(x,'issue')),contradictions:[],remainingCategories:['field_color_dominant_general','field_color_dominant_brightness','field_primary_subject'].filter(id=>!returned.has(id)).map(fieldId=>({fieldId,displayName:fieldNames[fieldId]}))};
};

export default{async fetch(request,env={}){const url=new URL(request.url);if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...corsHeaders,'access-control-max-age':'86400'}});if(request.method==='GET'&&url.pathname==='/api/health')return json({ok:true,service:'Billy Labs API',version:API_VERSION,schemaVersion:SCHEMA_VERSION,storage:env.DB?'d1-bound':'d1-not-bound',vision:env.AI?'configured':'not-configured',visionProvider:'cloudflare-workers-ai'});try{if(request.method==='POST'&&url.pathname==='/api/curator/analyze'){if(!env.CURATOR_PUBLISH_KEY)return json({ok:false,error:'Curator access is not configured'},{status:503});if(request.headers.get('x-curator-key')!==env.CURATOR_PUBLISH_KEY)return json({ok:false,error:'Unauthorized'},{status:401});const body=await request.json().catch(()=>null);if(!body||!validMashupId(body.mashupId)||typeof body.imageUrl!=='string')return json({ok:false,error:'mashupId and imageUrl are required'},{status:400});return json({ok:true,report:await analyzeImage(env,body)});}
const br=blurbletRoute(url.pathname);if(br){if(!validMashupId(br.mashupId))return json({ok:false,error:'Invalid mashup ID'},{status:400});if(!br.curator&&request.method==='GET'){const row=await getBlurblet(env,br.mashupId);return json({ok:true,mashupId:br.mashupId,text:row?.published_text||'',publishedAt:row?.published_at||null});}if(br.curator&&request.method==='PUT'){if(!env.CURATOR_PUBLISH_KEY)return json({ok:false,error:'Curator publishing is not configured'},{status:503});if(request.headers.get('x-curator-key')!==env.CURATOR_PUBLISH_KEY)return json({ok:false,error:'Unauthorized'},{status:401});const body=await request.json().catch(()=>null);if(!body||typeof body.text!=='string'||body.text.length>1000)return json({ok:false,error:'text must be a string up to 1000 characters'},{status:400});return json({ok:true,...await publishBlurblet(env,br.mashupId,body.text)});}return json({ok:false,error:'Method not allowed'},{status:405});}
if(request.method==='POST'&&url.pathname==='/api/devices/register'){const body=await request.json().catch(()=>null);if(!body||!validId(body.deviceId))return json({ok:false,error:'Invalid device ID'},{status:400});return json({ok:true,...await registerDevice(env,body.deviceId,body.metadata)});}const deviceId=deviceRoute(url.pathname);if(deviceId&&request.method==='GET'){if(!validId(deviceId))return json({ok:false,error:'Invalid device ID'},{status:400});const device=await getDevice(env,deviceId);return device?json({ok:true,device}):json({ok:false,error:'Device not found'},{status:404});}const matched=userRoute(url.pathname);if(matched){const{userId,resource}=matched;if(!validId(userId))return json({ok:false,error:'Invalid user ID'},{status:400});if(request.method==='GET'){const progress=await getProgress(env,userId);return resource==='favorites'?json({ok:true,userId,favorites:progress.favorites}):json({ok:true,userId,...progress});}if(request.method==='PUT'){const body=await request.json().catch(()=>null);if(resource==='favorites'){if(!body||!validIds(body.favorites))return json({ok:false,error:'favorites must be an array of mashup IDs'},{status:400});const current=await getProgress(env,userId),progress=await putProgress(env,userId,{seen:current.seen,favorites:body.favorites});return json({ok:true,userId,favorites:progress.favorites});}if(!body||!validIds(body.seen)||!validIds(body.favorites))return json({ok:false,error:'seen and favorites must be arrays of mashup IDs'},{status:400});return json({ok:true,userId,...await putProgress(env,userId,body)});}return json({ok:false,error:'Method not allowed'},{status:405});}}catch(error){return json({ok:false,error:error.message},{status:error.message==='D1 database is not bound'?503:500});}return json({ok:false,error:'Not found',path:url.pathname},{status:404});}};

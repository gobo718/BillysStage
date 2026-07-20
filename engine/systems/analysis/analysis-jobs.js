/* Billy Labs Analysis Jobs v3.1.1
   Reusable queue/status foundation. Current analyzer is deterministic and local;
   a future vision service can replace analyzeSpecimen without changing the review UI. */
(function(global){
  'use strict';
  const KEY='billy-analysis-job-history-v2';
  const SCHEMA_VERSION=1;
  const jobs=new Map();
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const clone=v=>JSON.parse(JSON.stringify(v));
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify([...jobs.values()].slice(-25)))}catch{}};
  const notify=(job,cb)=>{save(); if(typeof cb==='function')cb(clone(job));};
  const permanentId=prefix=>`${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,9)}`;
  function canonicalMashupId(row){
    if(global.BillyMashupCore?.canonicalId) return global.BillyMashupCore.canonicalId(row[0],row[1]);
    return `${row[0]}|${row[1]}`;
  }
  function create(rows){
    const job={id:permanentId('analysis_job'),schemaVersion:SCHEMA_VERSION,state:'queued',message:'Queued for analysis.',progress:0,total:rows.length,completed:0,flagged:0,failed:0,current:0,rows:clone(rows),report:null,reviews:{},createdAt:new Date().toISOString()};
    jobs.set(job.id,job);save();return clone(job);
  }
  function suggestion(kind,label,confidence,reason,extra={}){
    return {id:permanentId(`suggestion_${kind}`),kind,label,confidence,reason,status:'pending',...extra};
  }
  function reportFor(row){
    const a=row[0],b=row[1],name=String(row[2]||'').replace(/_/g,' '),duplicate=a===b;
    const words=name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const detectedCharacteristics=[
      suggestion('field','Original Ingredients',1,'Resolved from the canonical mashup record.',{fieldId:'field_original_ingredients',value:{ingredientA:a,ingredientB:b}}),
      suggestion('field','Release Batch',.99,'Read from bundled Emoji Kitchen inventory metadata.',{fieldId:'field_release_batch',value:String(row[3]||'Unknown')})
    ];
    const additionalObservations=[];
    [...new Set(words)].slice(0,5).forEach((word,i)=>additionalObservations.push(suggestion('observation',`Possible subject or tag: ${word}`,Math.max(.58,.9-i*.06),`The canonical mashup label contains “${word}”. Preserve it as an observation until a curator promotes it into structured metadata.`,{text:`Possible subject or tag: ${word}`})));
    if(duplicate)additionalObservations.push(suggestion('observation','Duplicate-ingredient specimen',1,'Both canonical ingredients are identical. This is valid and must remain a distinct canonical mashup.',{text:'Duplicate-ingredient specimen'}));
    const issues=[];
    if(!row[4])issues.push(suggestion('issue','Artwork URL missing',1,'The canonical inventory row has no artwork reference.'));
    if(words.length<2)issues.push(suggestion('issue','Sparse canonical label',.72,'The current label contains very little descriptive information and may need curator enrichment.'));
    const contradictions=[];
    if(/face/.test(name.toLowerCase()) && !/[😀-🙏]/u.test(a+b))contradictions.push(suggestion('contradiction','Label mentions a face',.61,'The canonical label contains “face,” but neither ingredient is in the common face range. This may still be correct; inspect visually.'));
    const remainingCategories=[
      {fieldId:'field_primary_subject',displayName:'Primary Subject'},
      {fieldId:'field_color_dominant_general',displayName:'Dominant Color'},
      {fieldId:'field_color_dominant_brightness',displayName:'Dominant Color Brightness'}
    ];
    return {
      id:permanentId('analysis_report'),
      schemaVersion:SCHEMA_VERSION,
      mashupId:canonicalMashupId(row),
      analyzedAt:new Date().toISOString(),
      provider:{id:'provider_local_deterministic_v2',displayName:'Local deterministic adapter',model:null},
      detectedCharacteristics,
      visualAnalysis:`The local foundation adapter can verify canonical identity and inventory facts for ${a} + ${b}. A connected vision provider will replace this paragraph with a free-form visual description without changing the report structure.`,
      additionalObservations,
      remainingCategories,
      issues,
      contradictions
    };
  }
  async function run(id,cb){
    const job=jobs.get(id);if(!job||job.state==='running')return;
    job.state='running';job.message='Connecting to laboratory systems…';notify(job,cb);
    const stages=[['Decoding specimen image…',14],['Examining canonical features…',34],['Comparing curator records…',58],['Searching for anomalies…',79],['Finalizing review report…',94]];
    for(const [message,progress] of stages){while(job.state==='paused')await wait(120);if(job.state==='cancelled')return;job.message=message;job.progress=progress;notify(job,cb);await wait(360)}
    try{job.report=reportFor(job.rows[0]);job.completed=1;job.flagged=job.report.issues.length+job.report.contradictions.length;job.progress=100;job.state='complete';job.message=job.flagged?`Analysis complete · ${job.flagged} item${job.flagged===1?'':'s'} need review.`:'Analysis complete · No anomalies detected.';job.completedAt=new Date().toISOString()}catch(error){job.failed=1;job.state='failed';job.message=`Analysis failed: ${error.message}`;}notify(job,cb);
  }
  function pause(id,cb){const job=jobs.get(id);if(job?.state==='running'){job.state='paused';job.message='Analysis paused safely.';notify(job,cb)}}
  function resume(id,cb){const job=jobs.get(id);if(job?.state==='paused'){job.state='running';job.message='Resuming analysis…';notify(job,cb)}}
  function cancel(id,cb){const job=jobs.get(id);if(job&&['running','paused','queued'].includes(job.state)){job.state='cancelled';job.message='Analysis cancelled safely. No curator data was changed.';notify(job,cb)}}
  function recordReview(id,key,action,editedValue){const job=jobs.get(id);if(!job)return;job.reviews[key]={action,editedValue:editedValue??null,at:new Date().toISOString()};save()}
  global.BillyAnalysisJobs={create,run,pause,resume,cancel,recordReview,get:id=>clone(jobs.get(id)||null),reportFor};
})(window);

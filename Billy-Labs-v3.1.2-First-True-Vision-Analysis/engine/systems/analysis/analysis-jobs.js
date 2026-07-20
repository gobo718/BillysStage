/* Billy Labs Analysis Jobs v3.1.2
   Real vision reports arrive through the secured Billy Labs Worker. AI output is
   always review-only and never writes verified curator metadata automatically. */
(function(global){
  'use strict';
  const KEY='billy-analysis-job-history-v3',SCHEMA_VERSION=2,jobs=new Map();
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const clone=v=>JSON.parse(JSON.stringify(v));
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify([...jobs.values()].slice(-25)))}catch{}};
  const notify=(job,cb)=>{save();if(typeof cb==='function')cb(clone(job));};
  const permanentId=prefix=>`${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,9)}`;
  const canonicalMashupId=row=>global.BillyMashupCore?.canonicalId?global.BillyMashupCore.canonicalId(row[0],row[1]):`${row[0]}|${row[1]}`;
  function create(rows){const job={id:permanentId('analysis_job'),schemaVersion:SCHEMA_VERSION,state:'queued',message:'Queued for vision analysis.',progress:0,total:rows.length,completed:0,flagged:0,failed:0,current:0,rows:clone(rows),report:null,reviews:{},createdAt:new Date().toISOString()};jobs.set(job.id,job);save();return clone(job)}
  function normalizeReport(payload,row){
    const report=payload?.report||payload;if(!report||typeof report!=='object')throw new Error('Vision provider returned no report');
    const normalizeCandidate=c=>({...c,id:c.id||permanentId('candidate'),confidence:Math.max(0,Math.min(1,Number(c.confidence)||0))});
    const normalizeSuggestion=s=>({...s,id:s.id||permanentId(`suggestion_${s.kind||'field'}`),status:'pending',confidence:Math.max(0,Math.min(1,Number(s.confidence)||0)),candidates:Array.isArray(s.candidates)?s.candidates.map(normalizeCandidate):[]});
    return {...report,id:report.id||permanentId('analysis_report'),schemaVersion:report.schemaVersion||SCHEMA_VERSION,mashupId:report.mashupId||canonicalMashupId(row),analyzedAt:report.analyzedAt||new Date().toISOString(),detectedCharacteristics:(report.detectedCharacteristics||[]).map(normalizeSuggestion),additionalObservations:(report.additionalObservations||[]).map(normalizeSuggestion),issues:(report.issues||[]).map(normalizeSuggestion),contradictions:(report.contradictions||[]).map(normalizeSuggestion),remainingCategories:report.remainingCategories||[]};
  }
  async function run(id,cb){
    const job=jobs.get(id);if(!job||job.state==='running')return;
    job.state='running';job.message='Connecting to Billy Labs vision systems…';notify(job,cb);
    const stages=[['Preparing specimen image…',12],['Sending image to vision model…',28],['Examining visible characteristics…',48]];
    for(const [message,progress] of stages){while(job.state==='paused')await wait(120);if(job.state==='cancelled')return;job.message=message;job.progress=progress;notify(job,cb);await wait(180)}
    try{
      const row=job.rows[0],key=localStorage.getItem('billy-curator-publish-key')||'';
      if(!global.BillyCloudApi?.analyzeMashup)throw new Error('Cloud analysis client is unavailable');
      const request=global.BillyCloudApi.analyzeMashup({mashupId:canonicalMashupId(row),imageUrl:row[4]},key);
      job.message='Waiting for visual findings…';job.progress=68;notify(job,cb);
      const payload=await request;if(job.state==='cancelled')return;
      job.message='Organizing ranked suggestions…';job.progress=91;notify(job,cb);
      job.report=normalizeReport(payload,row);job.completed=1;job.flagged=(job.report.issues?.length||0)+(job.report.contradictions?.length||0);job.progress=100;job.state='complete';job.message=job.flagged?`Vision analysis complete · ${job.flagged} item${job.flagged===1?'':'s'} need review.`:'Vision analysis complete · Ready for curator review.';job.completedAt=new Date().toISOString();
    }catch(error){job.failed=1;job.progress=100;job.state='failed';job.message=`Analysis failed: ${error.message}`;}
    notify(job,cb);
  }
  function pause(id,cb){const job=jobs.get(id);if(job?.state==='running'){job.state='paused';job.message='Analysis paused safely.';notify(job,cb)}}
  function resume(id,cb){const job=jobs.get(id);if(job?.state==='paused'){job.state='running';job.message='Resuming analysis…';notify(job,cb)}}
  function cancel(id,cb){const job=jobs.get(id);if(job&&['running','paused','queued'].includes(job.state)){job.state='cancelled';job.message='Analysis cancelled safely. No curator data was changed.';notify(job,cb)}}
  function recordReview(id,key,action,editedValue){const job=jobs.get(id);if(!job)return;job.reviews[key]={action,editedValue:editedValue??null,at:new Date().toISOString()};save()}
  global.BillyAnalysisJobs={create,run,pause,resume,cancel,recordReview,get:id=>clone(jobs.get(id)||null),normalizeReport};
})(window);

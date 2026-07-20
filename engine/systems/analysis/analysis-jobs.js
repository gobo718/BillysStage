/* Billy Labs Analysis Jobs v3.1.0
   Reusable queue/status foundation. Current analyzer is deterministic and local;
   a future vision service can replace analyzeSpecimen without changing the review UI. */
(function(global){
  'use strict';
  const KEY='billy-analysis-job-history-v1';
  const jobs=new Map();
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const clone=v=>JSON.parse(JSON.stringify(v));
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify([...jobs.values()].slice(-25)))}catch{}};
  const notify=(job,cb)=>{save(); if(typeof cb==='function')cb(clone(job));};
  function create(rows){const job={id:`analysis-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,state:'queued',message:'Queued for analysis.',progress:0,total:rows.length,completed:0,flagged:0,failed:0,current:0,rows:clone(rows),report:null,reviews:{},createdAt:new Date().toISOString()};jobs.set(job.id,job);save();return clone(job)}
  function reportFor(row){
    const a=row[0],b=row[1],name=String(row[2]||'').replace(/_/g,' '),duplicate=a===b;
    const words=name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const additions=[];
    [...new Set(words)].slice(0,5).forEach((word,i)=>additions.push({label:`Tag: ${word}`,confidence:Math.max(.58,.9-i*.06),reason:`The canonical mashup label contains “${word}”. Review before adding it as controlled metadata.`}));
    const observations=[{label:`Ingredients: ${a} + ${b}`,confidence:1,reason:'Resolved from the canonical mashup record.'},{label:`Release batch: ${row[3]||'Unknown'}`,confidence:.99,reason:'Read from bundled Emoji Kitchen inventory metadata.'}];
    if(duplicate)observations.push({label:'Duplicate-ingredient specimen',confidence:1,reason:'Both canonical ingredients are identical; this is valid and must remain distinct.'});
    const issues=[];
    if(!row[4])issues.push({label:'Artwork URL missing',confidence:1,reason:'The canonical inventory row has no artwork reference.'});
    if(words.length<2)issues.push({label:'Sparse canonical label',confidence:.72,reason:'The current label contains very little descriptive information and may need curator enrichment.'});
    const contradictions=[];
    if(/face/.test(name.toLowerCase()) && !/[😀-🙏]/u.test(a+b))contradictions.push({label:'Label mentions a face',confidence:.61,reason:'The canonical label contains “face,” but neither ingredient is in the common face range. This may still be correct; inspect visually.'});
    return {additions,issues,contradictions,observations};
  }
  async function run(id,cb){const job=jobs.get(id);if(!job||job.state==='running')return;job.state='running';job.message='Connecting to laboratory systems…';notify(job,cb);const stages=[['Decoding specimen image…',14],['Examining canonical features…',34],['Comparing curator records…',58],['Searching for anomalies…',79],['Finalizing review report…',94]];for(const [message,progress] of stages){while(job.state==='paused')await wait(120);if(job.state==='cancelled')return;job.message=message;job.progress=progress;notify(job,cb);await wait(360)}try{job.report=reportFor(job.rows[0]);job.completed=1;job.flagged=job.report.issues.length+job.report.contradictions.length;job.progress=100;job.state='complete';job.message=job.flagged?`Analysis complete · ${job.flagged} item${job.flagged===1?'':'s'} need review.`:'Analysis complete · No anomalies detected.';job.completedAt=new Date().toISOString()}catch(error){job.failed=1;job.state='failed';job.message=`Analysis failed: ${error.message}`;}notify(job,cb)}
  function pause(id,cb){const job=jobs.get(id);if(job?.state==='running'){job.state='paused';job.message='Analysis paused safely.';notify(job,cb)}}
  function resume(id,cb){const job=jobs.get(id);if(job?.state==='paused'){job.state='running';job.message='Resuming analysis…';notify(job,cb)}}
  function cancel(id,cb){const job=jobs.get(id);if(job&&['running','paused','queued'].includes(job.state)){job.state='cancelled';job.message='Analysis cancelled safely. No curator data was changed.';notify(job,cb)}}
  function recordReview(id,key,action){const job=jobs.get(id);if(!job)return;job.reviews[key]={action,at:new Date().toISOString()};save()}
  global.BillyAnalysisJobs={create,run,pause,resume,cancel,recordReview,get:id=>clone(jobs.get(id)||null),reportFor};
})(window);

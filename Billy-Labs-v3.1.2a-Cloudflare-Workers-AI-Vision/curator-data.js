/* Compatibility entry point. Canonical Curator record contracts and BillysLab adapter are separated. */
(() => {
  if(typeof document==='undefined'||!document.currentScript)throw new Error('curator-data.js is a browser compatibility loader.');
  const base=document.currentScript.src;
  const load=path=>document.write(`<script src="${new URL(path,base).href}"><\/script>`);
  load('engine/game/publishing/curator-records.js');
  load('games/billyslab/content/curator-repository.js');
})();

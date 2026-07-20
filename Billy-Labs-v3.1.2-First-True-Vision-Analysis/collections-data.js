/* Compatibility entry point. Canonical collection mechanics and BillysLab definitions are split across Engine and game content. */
(() => {
  if(typeof document==='undefined'||!document.currentScript)throw new Error('collections-data.js is a browser compatibility loader.');
  const base=document.currentScript.src;
  const load=path=>document.write(`<script src="${new URL(path,base).href}"><\/script>`);
  load('engine/game/collections/collection-service.js');
  load('games/billyslab/content/collection-definitions.js');
  load('games/billyslab/content/collections-repository.js');
})();

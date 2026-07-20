/* Compatibility entry point. Canonical implementation: engine/service/repositories/billy-repositories.js. */
(() => {
  if (typeof document === 'undefined' || !document.currentScript) {
    throw new Error('billy-repositories.js is a browser compatibility loader; load engine/service/repositories/billy-repositories.js directly in non-browser tests.');
  }
  const source = new URL('engine/service/repositories/billy-repositories.js', document.currentScript.src).href;
  document.write(`<script src="${source}"><\/script>`);
})();

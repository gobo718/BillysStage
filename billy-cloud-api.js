/* Compatibility entry point. Canonical implementation: engine/service/cloud/cloud-api.js. */
(() => {
  if (typeof document === 'undefined' || !document.currentScript) {
    throw new Error('billy-cloud-api.js is a browser compatibility loader; load engine/service/cloud/cloud-api.js directly in non-browser tests.');
  }
  const source = new URL('engine/service/cloud/cloud-api.js', document.currentScript.src).href;
  document.write(`<script src="${source}"><\/script>`);
})();

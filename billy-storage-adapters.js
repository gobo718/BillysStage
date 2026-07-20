/* Compatibility entry point. Canonical implementation: engine/platform/storage/adapters.js. */
(() => {
  if (typeof document === 'undefined' || !document.currentScript) {
    throw new Error('billy-storage-adapters.js is a browser compatibility loader; load engine/platform/storage/adapters.js directly in non-browser tests.');
  }
  const source = new URL('engine/platform/storage/adapters.js', document.currentScript.src).href;
  document.write(`<script src="${source}"><\/script>`);
})();

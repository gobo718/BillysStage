/* Compatibility entry point. Canonical implementation: engine/platform/storage/storage.js. */
(() => {
  if (typeof document === 'undefined' || !document.currentScript) {
    throw new Error('billy-storage.js is a browser compatibility loader; load engine/platform/storage/storage.js directly in non-browser tests.');
  }
  const source = new URL('engine/platform/storage/storage.js', document.currentScript.src).href;
  document.write(`<script src="${source}"><\/script>`);
})();

/* Compatibility entry point. Canonical implementation: engine/platform/sync/sync-manager.js. */
(() => {
  if (typeof document === 'undefined' || !document.currentScript) {
    throw new Error('billy-sync-manager.js is a browser compatibility loader; load engine/platform/sync/sync-manager.js directly in non-browser tests.');
  }
  const source = new URL('engine/platform/sync/sync-manager.js', document.currentScript.src).href;
  document.write(`<script src="${source}"><\/script>`);
})();

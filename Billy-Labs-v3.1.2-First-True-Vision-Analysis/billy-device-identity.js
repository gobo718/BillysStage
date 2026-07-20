/* Compatibility entry point. Canonical implementation: engine/platform/identity/device-identity.js. */
(() => {
  if (typeof document === 'undefined' || !document.currentScript) {
    throw new Error('billy-device-identity.js is a browser compatibility loader; load engine/platform/identity/device-identity.js directly in non-browser tests.');
  }
  const source = new URL('engine/platform/identity/device-identity.js', document.currentScript.src).href;
  document.write(`<script src="${source}"><\/script>`);
})();

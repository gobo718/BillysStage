/* Billy Labs curator entry repository — v2
   Draft entries stay private in browser storage. Public entries are kept
   separately and can be exported as published-curator-data.js. */
(() => {
  if (!window.BillyStorage) throw new Error('curator-data.js requires billy-storage.js');
  const DRAFT_KEY = 'billy-curator-entries-v1';
  const PUBLISHED_KEY = 'billy-published-curator-entries-v1';
  const staticPublished = () => window.BILLY_PUBLISHED_CURATOR_DATA || {};
  const draftList = () => BillyStorage.get(DRAFT_KEY, {});
  const localPublished = () => BillyStorage.get(PUBLISHED_KEY, {});
  const listPublished = () => ({...staticPublished(), ...localPublished()});
  const list = listPublished;
  const getDraft = id => draftList()[id] || null;
  const get = id => getDraft(id) || listPublished()[id] || null;
  const saveAll = entries => BillyStorage.set(DRAFT_KEY, entries || {});
  const save = (id, entry) => {
    const entries = draftList();
    entries[id] = entry;
    saveAll(entries);
    return entry;
  };
  const remove = id => {
    const entries = draftList();
    delete entries[id];
    saveAll(entries);
  };
  const publishBlurblet = id => {
    const draft = getDraft(id);
    if (!draft) return null;
    const published = localPublished();
    const text = String(draft.blurblet || '').trim();
    if (text) {
      published[id] = {
        left: draft.left || '',
        right: draft.right || '',
        blurblet: text,
        publishedAt: new Date().toISOString()
      };
    } else {
      delete published[id];
    }
    BillyStorage.set(PUBLISHED_KEY, published);
    return published[id] || null;
  };
  const exportPublishedScript = () => {
    const payload = JSON.stringify(listPublished(), null, 2);
    return `/* Billy Labs public curator content — generated ${new Date().toISOString()} */\nwindow.BILLY_PUBLISHED_CURATOR_DATA = ${payload};\n`;
  };
  const downloadPublishedScript = () => {
    const blob = new Blob([exportPublishedScript()], {type:'application/javascript'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'published-curator-data.js';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };
  window.BillyCuratorData = {
    version:2, key:DRAFT_KEY, publishedKey:PUBLISHED_KEY,
    list, listPublished, draftList, get, getDraft, save, saveAll, remove,
    publishBlurblet, exportPublishedScript, downloadPublishedScript
  };
})();

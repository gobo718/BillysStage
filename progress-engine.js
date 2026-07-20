/* Billy Labs shared local progress engine — v2 */
(() => {
  if (!window.BillyStorage) throw new Error('progress-engine.js requires billy-storage.js');
  if (!window.BillyMashups) throw new Error('progress-engine.js requires mashup-core.js');
  const KEYS={seen:'billy-progress-seen-v1',favorites:'billy-progress-favorites-v1'};
  const legacy={seen:'ek-seen',favorites:'ek-favorites'};
  const canonicalizeLegacy = value => {
    const parts=String(value).split('|');
    return parts.length>=2 ? BillyMashups.id(parts[0],parts[1]) : value;
  };
  function migrate(kind){
    const current=new Set(BillyStorage.get(KEYS[kind],[]));
    BillyStorage.get(legacy[kind],[]).forEach(x=>current.add(canonicalizeLegacy(x)));
    BillyStorage.set(KEYS[kind],[...current]);
    return current;
  }
  const seen=migrate('seen'), favorites=migrate('favorites');
  const api={
    version:2,
    markSeen:(l,r)=>{seen.add(BillyMashups.id(l,r));BillyStorage.set(KEYS.seen,[...seen]);},
    hasSeen:(l,r)=>seen.has(BillyMashups.id(l,r)),
    toggleFavorite:(l,r)=>{const k=BillyMashups.id(l,r);favorites.has(k)?favorites.delete(k):favorites.add(k);BillyStorage.set(KEYS.favorites,[...favorites]);return favorites.has(k)},
    isFavorite:(l,r)=>favorites.has(BillyMashups.id(l,r)),
    getSeen:()=>seen,
    getFavorites:()=>favorites,
    getMashupId:(l,r)=>BillyMashups.id(l,r),
    replaceSeen:values=>{seen.clear();for(const v of values)seen.add(canonicalizeLegacy(v));BillyStorage.set(KEYS.seen,[...seen]);},
    replaceFavorites:values=>{favorites.clear();for(const v of values)favorites.add(canonicalizeLegacy(v));BillyStorage.set(KEYS.favorites,[...favorites]);},
    snapshot:()=>({seen:[...seen],favorites:[...favorites]})
  };
  window.BillyProgress=api;
})();

/* Billy Labs repository layer — v5
   Page controllers use these domain repositories instead of storage keys.
   Storage implementation remains local-first behind BillyStorage.

   Extension rule: new domains (such as future curator metadata) should be
   exposed as repositories here rather than reading or writing storage keys
   directly from page controllers. */
(() => {
  if (!window.BillyStorage) throw new Error('billy-repositories.js requires billy-storage.js');

  const storage = window.BillyStorage;
  const keys = Object.freeze({
    settings: Object.freeze({
      collectionHideEmptySlots: 'billy.collection.hideEmptySlots'
    }),
    explorer: Object.freeze({
      state: 'ek-explorer-state',
      lastPage: 'ek-last-page'
    }),
    profile: Object.freeze({
      votes: 'billy.profile.votes'
    })
  });

  const emptyProgress = () => ({seen: [], favorites: []});
  const progressSnapshot = () => window.BillyProgress?.snapshot?.() || emptyProgress();
  const resolveSettingKey = key => keys.settings[key] || `billy.setting.${key}`;

  const settings = {
    keys: keys.settings,
    get: (key, fallback = null) => storage.get(resolveSettingKey(key), fallback),
    set: (key, value) => storage.set(resolveSettingKey(key), value),
    remove: key => storage.remove(resolveSettingKey(key))
  };

  const explorer = {
    stateKey: keys.explorer.state,
    pageKey: keys.explorer.lastPage,
    getState: (fallback = null) => storage.get(keys.explorer.state, fallback),
    saveState: state => storage.set(keys.explorer.state, state),
    getLastPage: (fallback = 0) => storage.get(keys.explorer.lastPage, fallback),
    setLastPage: page => storage.set(keys.explorer.lastPage, page)
  };

  const profile = {
    votesKey: keys.profile.votes,
    getVotes: () => storage.get(keys.profile.votes, {}),
    saveVotes: votes => storage.set(keys.profile.votes, votes || {})
  };

  const cloud = window.BillyCloudApi || null;
  const sync = window.BillySyncManager || null;

  const requireCloud = () => {
    if (!cloud) throw new Error('Billy Labs cloud API is unavailable');
    return cloud;
  };

  const queueProgress = () => {
    if (!sync) return;
    sync.enqueue('progress', progressSnapshot());
  };

  const mergeProgress = remote => {
    const local = progressSnapshot();
    const merged = {
      seen: [...new Set([...(local.seen || []), ...(remote?.seen || [])])],
      favorites: [...new Set([...(local.favorites || []), ...(remote?.favorites || [])])]
    };
    window.BillyProgress?.replaceSeen?.(merged.seen);
    window.BillyProgress?.replaceFavorites?.(merged.favorites);
    return merged;
  };

  const progress = {
    markSeen: (left, right) => {
      const result = window.BillyProgress?.markSeen(left, right);
      queueProgress();
      return result;
    },
    hasSeen: (left, right) => !!window.BillyProgress?.hasSeen(left, right),
    toggleFavorite: (left, right) => {
      const result = window.BillyProgress?.toggleFavorite(left, right);
      queueProgress();
      return result;
    },
    isFavorite: (left, right) => !!window.BillyProgress?.isFavorite(left, right),
    getSeen: () => window.BillyProgress?.getSeen() || new Set(),
    getFavorites: () => window.BillyProgress?.getFavorites() || new Set(),
    snapshot: progressSnapshot,
    cloud: Object.freeze({
      isConfigured: () => !!cloud?.isConfigured?.(),
      fetchFavorites: userId => cloud?.getFavorites(userId),
      pushFavorites: userId => cloud?.putFavorites(userId, [...(window.BillyProgress?.getFavorites() || [])]),
      pullFavorites: async userId => {
        const result = await requireCloud().getFavorites(userId);
        window.BillyProgress?.replaceFavorites?.(result.favorites || []);
        return result;
      },
      fetchProgress: userId => cloud?.getProgress(userId),
      pushProgress: (userId, payload) => requireCloud().putProgress(userId, payload || progressSnapshot()),
      pullProgress: async userId => {
        const result = await requireCloud().getProgress(userId);
        return {...result, ...mergeProgress(result)};
      }
    })
  };

  const collections = {
    list: () => window.BillyCollections?.list() || [],
    find: id => window.BillyCollections?.find(id) || null,
    save: rows => window.BillyCollections?.save(rows) ?? false,
    blank: (...args) => window.BillyCollections?.blank(...args) || null
  };

  const curator = {
    list: () => window.BillyCuratorData?.list() || {},
    listPublished: () => window.BillyCuratorData?.listPublished() || {},
    get: id => window.BillyCuratorData?.get(id) || null,
    getDraft: id => window.BillyCuratorData?.getDraft(id) || null,
    save: (id, entry) => window.BillyCuratorData?.save(id, entry),
    remove: id => window.BillyCuratorData?.remove(id),
    publishBlurblet: id => window.BillyCuratorData?.publishBlurblet(id),
    downloadPublishedScript: () => window.BillyCuratorData?.downloadPublishedScript()
  };

  if (sync) {
    sync.register('favorites', {pull: progress.cloud.pullFavorites, push: progress.cloud.pushFavorites});
    sync.register('progress', {pull: progress.cloud.pullProgress, push: progress.cloud.pushProgress});
  }

  window.BillyRepositories = Object.freeze({
    version: 5,
    keys,
    settings: Object.freeze(settings),
    explorer: Object.freeze(explorer),
    profile: Object.freeze(profile),
    progress: Object.freeze(progress),
    collections: Object.freeze(collections),
    curator: Object.freeze(curator)
  });
})();

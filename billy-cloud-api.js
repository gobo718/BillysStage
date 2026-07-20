/* Billy Labs cloud API client — v6 */
(() => {
  'use strict';

  const API_VERSION = 6;
  const API_BASE_STORAGE_KEY = 'billy-cloud-api-base';
  const JSON_HEADERS = Object.freeze({'content-type': 'application/json'});

  const normalizeBase = value => String(value || '').trim().replace(/\/+$/, '');

  const readStoredBase = () => {
    try {
      return localStorage.getItem(API_BASE_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  };

  const buildUrl = (base, path) => `${base}${path}`;
  const userPath = (userId, resource) =>
    `/api/users/${encodeURIComponent(userId)}/${resource}`;

  const unique = values => [
    ...new Set((values || []).filter(value => typeof value === 'string' && value))
  ];

  let apiBase = normalizeBase(readStoredBase() || window.BILLY_CLOUD_API_BASE || '');

  const request = async (path, init = {}) => {
    if (!apiBase) {
      throw new Error('Billy Labs cloud API is not configured');
    }

    const response = await fetch(buildUrl(apiBase, path), {
      ...init,
      headers: {
        ...JSON_HEADERS,
        ...(init.headers || {})
      }
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `Cloud request failed (${response.status})`);
    }

    return payload;
  };

  const configure = value => {
    apiBase = normalizeBase(value);
    window.BILLY_CLOUD_API_BASE = apiBase;
    return apiBase;
  };

  window.BillyCloudApi = Object.freeze({
    version: API_VERSION,
    storageKey: API_BASE_STORAGE_KEY,

    isConfigured: () => Boolean(apiBase),
    getBaseUrl: () => apiBase,
    configure,

    health: () => request('/api/health', {method: 'GET'}),

    registerDevice: (deviceId, metadata = {}) =>
      request('/api/devices/register', {
        method: 'POST',
        body: JSON.stringify({deviceId, metadata})
      }),

    getDevice: deviceId =>
      request(`/api/devices/${encodeURIComponent(deviceId)}`, {method: 'GET'}),

    getFavorites: userId =>
      request(userPath(userId, 'favorites'), {method: 'GET'}),

    putFavorites: (userId, favorites) =>
      request(userPath(userId, 'favorites'), {
        method: 'PUT',
        body: JSON.stringify({favorites: unique(favorites)})
      }),

    getProgress: userId =>
      request(userPath(userId, 'progress'), {method: 'GET'}),

    putProgress: (userId, progress) =>
      request(userPath(userId, 'progress'), {
        method: 'PUT',
        body: JSON.stringify({
          seen: unique(progress?.seen),
          favorites: unique(progress?.favorites)
        })
      }),

    getPublishedBlurblet: mashupId =>
      request(`/api/blurblets/${encodeURIComponent(mashupId)}`, {method: 'GET'}),

    publishBlurblet: (mashupId, text, publishKey) =>
      request(`/api/curator/blurblets/${encodeURIComponent(mashupId)}`, {
        method: 'PUT',
        headers: {'x-curator-key': String(publishKey || '')},
        body: JSON.stringify({text: String(text || '')})
      })
  });
})();

/* Billy Labs canonical mashup identity and resolution — v4 */
(() => {
  const VERSION = 4;
  const SEPARATOR = '|';
  const resolutionIndexes = new WeakMap();
  const rowIds = new WeakMap();
  const codePointKeys = new Map();

  const normalizeEmoji = value => String(value || '').normalize('NFC');
  const codePointKey = value => {
    const normalized = normalizeEmoji(value);
    let key = codePointKeys.get(normalized);
    if (key === undefined) {
      key = Array.from(normalized).map(char => char.codePointAt(0)).join('-');
      codePointKeys.set(normalized, key);
    }
    return key;
  };
  const compare = (left, right) => codePointKey(left).localeCompare(codePointKey(right));

  const canonicalPair = (left, right) => {
    const a = normalizeEmoji(left);
    const b = normalizeEmoji(right);
    return compare(a, b) <= 0 ? [a, b] : [b, a];
  };

  const id = (left, right) => canonicalPair(left, right).join(SEPARATOR);
  const rowId = row => {
    if (!Array.isArray(row)) return id(row?.left, row?.right);
    let key = rowIds.get(row);
    if (key === undefined) { key = id(row[0], row[1]); rowIds.set(row, key); }
    return key;
  };

  const parseId = value => {
    const parts = String(value || '').split(SEPARATOR);
    if (parts.length !== 2) return null;
    return canonicalPair(parts[0], parts[1]);
  };

  const pairFrom = mashup => {
    if (Array.isArray(mashup)) return [mashup[0], mashup[1]];
    return [mashup?.left, mashup?.right];
  };

  const buildUrl = (mashup, base = 'mashup.html') => {
    const [left, right] = pairFrom(mashup);
    return `${base}?left=${encodeURIComponent(normalizeEmoji(left))}&right=${encodeURIComponent(normalizeEmoji(right))}`;
  };

  const pairFromSearch = search => {
    const params = search instanceof URLSearchParams
      ? search
      : new URLSearchParams(String(search || '').replace(/^\?/, ''));
    return [
      params.get('left') ?? params.get('emoji1') ?? '',
      params.get('right') ?? params.get('emoji2') ?? ''
    ];
  };

  const buildResolutionIndex = rows => {
    const index = new Map();
    for (const row of rows || []) {
      if (!Array.isArray(row) || row.length < 2) continue;
      const key = rowId(row);
      if (!index.has(key)) index.set(key, row);
    }
    return index;
  };

  const indexFor = rows => {
    if (!rows || (typeof rows !== 'object' && typeof rows !== 'function')) return new Map();
    let index = resolutionIndexes.get(rows);
    if (!index) {
      index = buildResolutionIndex(rows);
      resolutionIndexes.set(rows, index);
    }
    return index;
  };

  const resolve = (rows, left, right) => {
    const a = normalizeEmoji(left);
    const b = normalizeEmoji(right);
    if (!a || !b) return null;
    return indexFor(rows).get(id(a, b)) || null;
  };

  const resolveId = (rows, canonicalId) => {
    const pair = parseId(canonicalId);
    return pair ? resolve(rows, pair[0], pair[1]) : null;
  };

  const has = (rows, left, right) => resolve(rows, left, right) !== null;
  const open = mashup => { window.location.href = buildUrl(mashup); };

  window.BillyMashups = Object.freeze({
    version: VERSION,
    separator: SEPARATOR,
    normalizeEmoji,
    canonicalPair,
    id,
    rowId,
    parseId,
    buildUrl,
    pairFromSearch,
    buildResolutionIndex,
    resolve,
    resolveId,
    has,
    open
  });
})();

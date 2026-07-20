/* Billy Labs shared search architecture — v2 */
(() => {
  'use strict';

  const VERSION = 2;
  const ingredientIndexes = new WeakMap();
  const rowTextIndexes = new WeakMap();

  const normalizeQuery = value => String(value || '').trim().toLowerCase();
  const includesNormalized = (value, normalizedQuery) => !normalizedQuery || String(value || '').toLowerCase().includes(normalizedQuery);

  const defaultRowText = row => [row?.[0], row?.[1], row?.[2], row?.[3]]
    .map(value => String(value || ''))
    .join(' ');

  const matches = (value, query) => includesNormalized(value, normalizeQuery(query));

  const searchRows = (rows, query, options = {}) => {
    const source = Array.from(rows || []);
    const normalized = normalizeQuery(query);
    if (!normalized) return source;
    const textForRow = typeof options.textForRow === 'function' ? options.textForRow : defaultRowText;
    if (!rows || (typeof rows !== 'object' && typeof rows !== 'function')) return source.filter(row => includesNormalized(textForRow(row), normalized));
    let byAccessor = rowTextIndexes.get(rows);
    if (!byAccessor) { byAccessor = new Map(); rowTextIndexes.set(rows, byAccessor); }
    let texts = byAccessor.get(textForRow);
    if (!texts) { texts = source.map(row => String(textForRow(row) || '').toLowerCase()); byAccessor.set(textForRow, texts); }
    const output = [];
    for (let index = 0; index < source.length; index += 1) if (texts[index].includes(normalized)) output.push(source[index]);
    return output;
  };

  const searchItems = (items, query, textForItem) => {
    const source = Array.from(items || []);
    const normalized = normalizeQuery(query);
    if (!normalized) return source;
    const accessor = typeof textForItem === 'function' ? textForItem : value => value;
    return source.filter(item => includesNormalized(accessor(item), normalized));
  };

  const sortRows = (rows, mode, options = {}) => {
    const output = Array.from(rows || []);
    if (mode === 'oldest') return output.sort((a, b) => String(a?.[3] || '').localeCompare(String(b?.[3] || '')));
    if (mode === 'name') return output.sort((a, b) => String(a?.[2] || '').localeCompare(String(b?.[2] || '')));
    if (mode === 'unseen') {
      const isSeen = typeof options.isSeen === 'function' ? options.isSeen : () => false;
      return output.sort((a, b) => Number(isSeen(a)) - Number(isSeen(b)) || String(b?.[3] || '').localeCompare(String(a?.[3] || '')));
    }
    if (mode === 'newest') return output.sort((a, b) => String(b?.[3] || '').localeCompare(String(a?.[3] || '')));
    return output;
  };

  const buildIngredientIndex = rows => {
    const index = new Map();
    for (const row of rows || []) {
      if (!Array.isArray(row) || row.length < 2) continue;
      const ingredients = row[0] === row[1] ? [row[0]] : [row[0], row[1]];
      for (const emoji of ingredients) {
        let matches = index.get(emoji);
        if (!matches) index.set(emoji, matches = []);
        matches.push(row);
      }
    }
    return index;
  };

  const ingredientIndexFor = rows => {
    if (!rows || (typeof rows !== 'object' && typeof rows !== 'function')) return new Map();
    let index = ingredientIndexes.get(rows);
    if (!index) {
      index = buildIngredientIndex(rows);
      ingredientIndexes.set(rows, index);
    }
    return index;
  };

  const rowsContaining = (rows, emoji) => Array.from(ingredientIndexFor(rows).get(emoji) || []);

  window.BillySearch = Object.freeze({
    version: VERSION,
    normalizeQuery,
    matches,
    searchRows,
    searchItems,
    sortRows,
    buildIngredientIndex,
    rowsContaining
  });
})();

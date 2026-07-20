/* Billy Labs shared mashup discovery engine — v2 */
(() => {
  const VERSION = 2;
  const MAX_SEED = 2147483647;
  const newestIndexes = new WeakMap();

  const rowsOf = rows => Array.isArray(rows) ? rows : [];
  const randomIndex = (length, random = Math.random) => {
    if (!length) return -1;
    const value = Number(random());
    const normalized = Number.isFinite(value) ? Math.min(Math.max(value, 0), 0.9999999999999999) : 0;
    return Math.floor(normalized * length);
  };
  const choose = (rows, random = Math.random) => {
    const source = rowsOf(rows);
    const index = randomIndex(source.length, random);
    return index < 0 ? null : source[index];
  };
  const exclude = (rows, excludedIds, idOf = row => window.BillyMashups.id(row[0], row[1])) => {
    const blocked = excludedIds instanceof Set ? excludedIds : new Set(excludedIds || []);
    const output = [];
    for (const row of rowsOf(rows)) if (Array.isArray(row) && !blocked.has(idOf(row))) output.push(row);
    return output;
  };
  const unseen = (rows, seenIds, idOf = row => window.BillyMashups.id(row[0], row[1])) => {
    const seen = seenIds instanceof Set ? seenIds : new Set(seenIds || []);
    const output = [];
    for (const row of rowsOf(rows)) if (Array.isArray(row) && !seen.has(idOf(row))) output.push(row);
    return output;
  };
  const selectRandom = (rows, options = {}) => {
    const idOf = options.idOf || (row => window.BillyMashups.id(row[0], row[1]));
    const blocked = options.excludeIds instanceof Set ? options.excludeIds : new Set(options.excludeIds || []);
    const seen = options.seenIds instanceof Set ? options.seenIds : new Set(options.seenIds || []);
    const available = [];
    const unseenRows = options.preferUnseen ? [] : null;
    for (const row of rowsOf(rows)) {
      if (!Array.isArray(row)) continue;
      const key = idOf(row);
      if (blocked.has(key)) continue;
      available.push(row);
      if (unseenRows && !seen.has(key)) unseenRows.push(row);
    }
    if (!available.length) return null;
    return choose(unseenRows?.length ? unseenRows : available, options.random);
  };

  const analyzeNewest = rows => {
    if (!rows || (typeof rows !== 'object' && typeof rows !== 'function')) return { date: '', rows: [] };
    let analysis = newestIndexes.get(rows);
    if (analysis) return analysis;
    let date = '';
    let newest = [];
    for (const row of rowsOf(rows)) {
      if (!Array.isArray(row)) continue;
      const rowDate = String(row[3] || '');
      if (rowDate > date) {
        date = rowDate;
        newest = [row];
      } else if (rowDate === date) {
        newest.push(row);
      }
    }
    analysis = { date, rows: newest };
    newestIndexes.set(rows, analysis);
    return analysis;
  };

  const newestDate = rows => analyzeNewest(rows).date;
  const newestRows = (rows, date = newestDate(rows)) => {
    const analysis = analyzeNewest(rows);
    if (String(date || '') === analysis.date) return Array.from(analysis.rows);
    return rowsOf(rows).filter(row => Array.isArray(row) && String(row[3] || '') === String(date || ''));
  };
  const selectNewest = (rows, options = {}) => {
    const date = options.date || newestDate(rows);
    return { date, row: choose(newestRows(rows, date), options.random) };
  };
  const createSeed = (random = Math.random) => Math.floor(Math.min(Math.max(Number(random()) || 0, 0), 0.9999999999999999) * MAX_SEED);

  window.BillyDiscovery = Object.freeze({
    version: VERSION,
    maxSeed: MAX_SEED,
    choose,
    exclude,
    unseen,
    selectRandom,
    newestDate,
    newestRows,
    selectNewest,
    createSeed
  });
})();

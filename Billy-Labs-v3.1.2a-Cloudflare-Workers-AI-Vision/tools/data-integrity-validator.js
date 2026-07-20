#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const REQUIRED_METADATA_FIELDS = [
  'name', 'codepoint', 'unicodeVersion', 'unicodeRelease',
  'emojiVersion', 'category', 'subgroup'
];

function loadBrowserData(files) {
  const context = {window: {}, URL, URLSearchParams, console};
  context.window = context;
  vm.createContext(context);
  for (const file of files) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    vm.runInContext(source, context, {filename: file});
  }
  return context;
}

function imageSlug(emoji) {
  return Array.from(emoji)
    .map(char => `u${char.codePointAt(0).toString(16)}`)
    .join('-');
}

function validCalendarDate(value) {
  if (!/^\d{8}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

function collectPairReferences(value, canonicalId, pathParts = [], output = []) {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(item => typeof item === 'string') &&
    value.some(item => /\p{Extended_Pictographic}/u.test(item))
  ) {
    output.push({
      path: pathParts.join('.'),
      pair: [value[0], value[1]],
      id: canonicalId(value[0], value[1])
    });
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectPairReferences(item, canonicalId, pathParts.concat(index), output));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      collectPairReferences(item, canonicalId, pathParts.concat(key), output);
    });
  }
  return output;
}

function validate() {
  const context = loadBrowserData([
    'mashup-core.js',
    'emoji-data.js',
    'emoji-metadata.js',
    'profile-data.js',
    'published-curator-data.js'
  ]);

  const rows = context.EMOJI_KITCHEN_DATA;
  const metadata = context.EMOJI_PROFILE_METADATA;
  const mashups = context.BillyMashups;
  const errors = [];
  const warnings = [];
  const canonicalIds = new Map();
  const exactRows = new Map();
  const ingredients = new Set();
  const releaseCounts = new Map();
  let duplicateIngredientRows = 0;

  if (!Array.isArray(rows)) {
    errors.push({code: 'DATASET_NOT_ARRAY'});
    return {ok: false, errors, warnings};
  }
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    errors.push({code: 'METADATA_NOT_OBJECT'});
    return {ok: false, errors, warnings};
  }

  rows.forEach((row, index) => {
    if (!Array.isArray(row) || row.length !== 5) {
      errors.push({code: 'INVALID_ROW_SHAPE', index});
      return;
    }

    const [left, right, label, releaseDate, imageUrl] = row;
    const values = {left, right, label, releaseDate, imageUrl};
    for (const [field, value] of Object.entries(values)) {
      if (typeof value !== 'string' || value.length === 0) {
        errors.push({code: 'EMPTY_OR_NONSTRING_FIELD', index, field});
      }
    }
    if (Object.values(values).some(value => typeof value !== 'string' || value.length === 0)) return;

    if (left !== left.normalize('NFC') || right !== right.normalize('NFC')) {
      errors.push({code: 'NON_NFC_INGREDIENT', index, left, right});
    }
    if (!validCalendarDate(releaseDate)) {
      errors.push({code: 'INVALID_RELEASE_DATE', index, releaseDate});
    }
    if (label.split(' + ').length !== 2) {
      errors.push({code: 'INVALID_LABEL_FORMAT', index, label});
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      errors.push({code: 'INVALID_IMAGE_URL', index, imageUrl});
    }
    if (parsedUrl) {
      if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'www.gstatic.com') {
        errors.push({code: 'UNEXPECTED_IMAGE_ORIGIN', index, imageUrl});
      }
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      const kitchenIndex = pathParts.indexOf('emojikitchen');
      if (kitchenIndex < 0 || pathParts[kitchenIndex + 1] !== releaseDate) {
        errors.push({code: 'IMAGE_DATE_MISMATCH', index, releaseDate, imageUrl});
      }
      const leftSlug = imageSlug(left);
      const rightSlug = imageSlug(right);
      if (!parsedUrl.pathname.includes(leftSlug) || !parsedUrl.pathname.includes(rightSlug)) {
        errors.push({code: 'IMAGE_INGREDIENT_MISMATCH', index, left, right, imageUrl});
      }
    }

    ingredients.add(left);
    ingredients.add(right);
    releaseCounts.set(releaseDate, (releaseCounts.get(releaseDate) || 0) + 1);
    if (left === right) duplicateIngredientRows += 1;

    const canonicalId = mashups.id(left, right);
    if (canonicalIds.has(canonicalId)) {
      errors.push({
        code: 'DUPLICATE_CANONICAL_ID',
        id: canonicalId,
        firstIndex: canonicalIds.get(canonicalId),
        index
      });
    } else {
      canonicalIds.set(canonicalId, index);
    }

    const serialized = JSON.stringify(row);
    if (exactRows.has(serialized)) {
      errors.push({
        code: 'DUPLICATE_EXACT_ROW',
        firstIndex: exactRows.get(serialized),
        index
      });
    } else {
      exactRows.set(serialized, index);
    }
  });

  for (const ingredient of ingredients) {
    if (!metadata[ingredient]) {
      errors.push({code: 'MISSING_INGREDIENT_METADATA', ingredient});
    }
  }

  for (const [ingredient, entry] of Object.entries(metadata)) {
    if (!ingredients.has(ingredient)) {
      warnings.push({code: 'UNUSED_INGREDIENT_METADATA', ingredient});
    }
    for (const field of REQUIRED_METADATA_FIELDS) {
      if (typeof entry?.[field] !== 'string' || entry[field].length === 0) {
        errors.push({code: 'INCOMPLETE_INGREDIENT_METADATA', ingredient, field});
      }
    }
  }

  const authoredReferences = collectPairReferences(
    context.BILLY_PROFILE_DATA,
    mashups.id
  );
  const unresolvedReferences = authoredReferences.filter(reference => !canonicalIds.has(reference.id));
  for (const reference of unresolvedReferences) {
    warnings.push({code: 'UNRESOLVED_AUTHORED_PAIR', ...reference});
  }

  const publishedEntries = context.BILLY_PUBLISHED_CURATOR_DATA || {};
  for (const [id, entry] of Object.entries(publishedEntries)) {
    if (!canonicalIds.has(id)) {
      errors.push({code: 'ORPHANED_PUBLISHED_CURATOR_ID', id});
    }
    if (!entry || typeof entry.blurblet !== 'string' || entry.blurblet.trim() === '') {
      errors.push({code: 'INVALID_PUBLISHED_CURATOR_ENTRY', id});
    }
  }

  const unresolvedUniqueIds = [...new Set(unresolvedReferences.map(reference => reference.id))];
  return {
    ok: errors.length === 0,
    summary: {
      rows: rows.length,
      canonicalIds: canonicalIds.size,
      uniqueIngredients: ingredients.size,
      metadataEntries: Object.keys(metadata).length,
      duplicateIngredientRows,
      releaseDates: releaseCounts.size,
      publishedCuratorEntries: Object.keys(publishedEntries).length,
      authoredPairReferences: authoredReferences.length,
      unresolvedAuthoredPairReferences: unresolvedReferences.length,
      unresolvedAuthoredPairIds: unresolvedUniqueIds.length
    },
    releaseCounts: Object.fromEntries([...releaseCounts.entries()].sort((a, b) => b[0].localeCompare(a[0]))),
    errors,
    warnings
  };
}

if (require.main === module) {
  const report = validate();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = report.ok ? 0 : 1;
}

module.exports = {validate, validCalendarDate, imageSlug};

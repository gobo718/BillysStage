const assert = require('assert');
const {validate, validCalendarDate, imageSlug} = require('../tools/data-integrity-validator.js');

assert.strictEqual(validCalendarDate('20260202'), true);
assert.strictEqual(validCalendarDate('20260230'), false);
assert.strictEqual(validCalendarDate('not-a-date'), false);
assert.strictEqual(imageSlug('🌬️'), 'u1f32c-ufe0f');

const report = validate();
assert.strictEqual(report.ok, true, JSON.stringify(report.errors, null, 2));
assert.strictEqual(report.errors.length, 0);
assert.strictEqual(report.summary.rows, 147000);
assert.strictEqual(report.summary.canonicalIds, 147000);
assert.strictEqual(report.summary.uniqueIngredients, 619);
assert.strictEqual(report.summary.metadataEntries, 619);
assert.strictEqual(report.summary.duplicateIngredientRows, 413);
assert.strictEqual(report.summary.authoredPairReferences, 16);
assert.strictEqual(report.summary.unresolvedAuthoredPairReferences, 8);
assert.strictEqual(report.summary.unresolvedAuthoredPairIds, 5);
assert.ok(report.warnings.every(item => item.code === 'UNRESOLVED_AUTHORED_PAIR'));

console.log('Data integrity tests passed.');

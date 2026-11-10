import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicationDate } from '../app/lib/dates.ts';
test('dates preserve the saved day across offsets and reject invalid dates', () => {
  for (const suffix of ['+01:00', '+14:00', '-12:00']) assert.deepEqual(publicationDate(`2026-11-10T00:00:00.000${suffix}`), { day: '2026-11-10', label: '10 Nov 2026' });
  for (const value of ['', undefined, 'garbage', '2026-02-30', '2026-13-01', '2026-11-10Tbad']) assert.equal(publicationDate(value), undefined);
});

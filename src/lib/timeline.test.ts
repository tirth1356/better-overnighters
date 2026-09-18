import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildTimeline, groupByMonth } from './timeline.ts';
import type { TimelineSource } from './timeline.ts';

const src = {
  records: [
    { id: 'r1', familyMemberId: 'm1', title: 'HbA1c', type: 'Lab Report', date: '2026-09-10' },
    { id: 'r2', familyMemberId: 'm2', title: 'Other member', type: 'Lab Report', date: '2026-09-11' },
    { id: 'r3', familyMemberId: 'm1', title: 'Repeat script', type: 'Prescription', date: '2026-08-02' },
  ],
  medicines: [
    { id: 'md1', familyMemberId: 'm1', name: 'Metformin', dosage: '500mg', startDate: '2026-09-01' },
  ],
  vaccinations: [
    { id: 'v1', familyMemberId: 'm1', name: 'Flu', dateAdministered: '2026-07-15' },
    { id: 'v2', familyMemberId: 'm1', name: 'Booster only scheduled', nextDueDate: '2027-01-01' },
  ],
  appointments: [],
} as unknown as TimelineSource;

test('a timeline only contains the chosen member, newest first', () => {
  const events = buildTimeline(src, 'm1');
  assert.deepEqual(events.map((e) => e.date), ['2026-09-10', '2026-09-01', '2026-08-02', '2026-07-15']);
  assert.ok(!events.some((e) => e.title === 'Other member'));
});

test('records are classified from the shared type field', () => {
  const kinds = Object.fromEntries(buildTimeline(src, 'm1').map((e) => [e.title, e.kind]));
  assert.equal(kinds['HbA1c'], 'report');
  assert.equal(kinds['Repeat script'], 'prescription');
  assert.equal(kinds['Started Metformin 500mg'], 'medicine');
});

test('a vaccination that was never given is not history', () => {
  assert.ok(!buildTimeline(src, 'm1').some((e) => e.title.includes('scheduled')));
});

test('events group under month headings in timeline order', () => {
  const groups = groupByMonth(buildTimeline(src, 'm1'));
  assert.deepEqual(groups.map((g) => g.events.length), [2, 1, 1]);
});

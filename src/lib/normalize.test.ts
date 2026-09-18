import assert from 'node:assert/strict';
import { test } from 'node:test';
import { doseTimes, mealRelation, repeatsOnDate } from './normalize.ts';
import type { Medicine } from '../types/index.ts';

const med = (over: Partial<Medicine>): Medicine => ({
  id: 'm', familyMemberId: 'f', name: 'X', dosage: '1', frequency: 'Once daily',
  timing: 'After meal', startDate: '2026-09-01', isActive: true, ...over,
});

test('explicit times win over the frequency label', () => {
  assert.deepEqual(doseTimes(med({ times: ['07:30'], frequency: 'Twice daily' })), ['07:30']);
});

test('frequency labels expand to sensible dose times', () => {
  assert.equal(doseTimes(med({ frequency: 'Twice daily' })).length, 2);
  assert.equal(doseTimes(med({ frequency: 'Three times daily' })).length, 3);
  assert.equal(doseTimes(med({ frequency: 2 })).length, 2);
});

test('"as needed" medicines have no schedule, so they can never be missed', () => {
  assert.deepEqual(doseTimes(med({ frequency: 'As needed' })), []);
});

test('weekly medicines are due only on their start weekday', () => {
  const weekly = med({ frequency: 'Weekly', startDate: '2026-09-01' }); // a Tuesday
  assert.equal(repeatsOnDate(weekly, '2026-09-08'), true);
  assert.equal(repeatsOnDate(weekly, '2026-09-09'), false);
  assert.equal(repeatsOnDate(med({ frequency: 'Once daily' }), '2026-09-09'), true);
});

test('meal timing maps between both field spellings', () => {
  assert.equal(mealRelation(med({ timing: 'Before meal' })), 'before_food');
  assert.equal(mealRelation(med({ timing: 'After meal', beforeAfterFood: 'any' })), 'any');
});

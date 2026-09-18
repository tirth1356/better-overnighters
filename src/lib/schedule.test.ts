import assert from 'node:assert/strict';
import { test } from 'node:test';
import { adherence, calendarGrid, scheduleFor, toISODate } from './schedule.ts';
import type { DoseLog, Medicine } from '../types';

const med = (over: Partial<Medicine> = {}): Medicine => ({
  id: 'm1',
  familyMemberId: 'f1',
  name: 'Metformin',
  dosage: '500mg',
  frequency: 2,
  times: ['08:00', '20:00'],
  startDate: '2026-09-01',
  endDate: '2026-09-30',
  beforeAfterFood: 'after_food',
  ...over,
});

test('slots appear only inside the course window', () => {
  const m = med();
  assert.equal(scheduleFor([m], [], '2026-08-31', '2026-09-15').length, 0);
  assert.equal(scheduleFor([m], [], '2026-09-15', '2026-09-15').length, 2);
  assert.equal(scheduleFor([m], [], '2026-10-01', '2026-09-15').length, 0);
});

test('unlogged past doses count as missed, future ones as pending', () => {
  const m = med();
  assert.equal(scheduleFor([m], [], '2026-09-14', '2026-09-15')[0].status, 'missed');
  assert.equal(scheduleFor([m], [], '2026-09-16', '2026-09-15')[0].status, 'pending');
});

test('adherence excludes skipped doses from the denominator', () => {
  const m = med();
  const doses: DoseLog[] = [
    { id: 'd1', medicineId: 'm1', date: '2026-09-15', time: '08:00', status: 'taken', recordedAt: '' },
    { id: 'd2', medicineId: 'm1', date: '2026-09-15', time: '20:00', status: 'skipped', recordedAt: '' },
  ];
  const a = adherence(scheduleFor([m], doses, '2026-09-15', '2026-09-15'));
  assert.deepEqual([a.taken, a.skipped, a.percent], [1, 1, 100]);
});

test('calendar grid is Monday-first and week-aligned', () => {
  const grid = calendarGrid(2026, 8); // September 2026 starts on a Tuesday
  assert.equal(grid.length % 7, 0);
  assert.equal(grid[0], null);
  assert.equal(grid[1], '2026-09-01');
});

test('toISODate uses local time, not UTC', () => {
  assert.equal(toISODate(new Date(2026, 8, 1, 23, 30)), '2026-09-01');
});

test('vaccination status keys off the next due date', async () => {
  const { vaccinationStatus } = await import('./vaccination.ts');
  const base = { id: 'v', familyMemberId: 'f', vaccine: 'DTP', dose: '1' };
  assert.equal(vaccinationStatus({ ...base, nextDueDate: '2026-09-01' }, '2026-09-15'), 'overdue');
  assert.equal(vaccinationStatus({ ...base, nextDueDate: '2026-09-30' }, '2026-09-15'), 'upcoming');
  assert.equal(vaccinationStatus({ ...base, date: '2026-01-02' }, '2026-09-15'), 'completed');
  assert.equal(vaccinationStatus(base, '2026-09-15'), 'upcoming');
});

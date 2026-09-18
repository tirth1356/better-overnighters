import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseVoiceCommand } from './voice.ts';
import type { DoseSlot } from './schedule.ts';

const slot = (name: string, time: string): DoseSlot => ({
  medicine: {
    id: name, familyMemberId: 'm1', name, dosage: '500mg',
    frequency: 'Twice daily', timing: 'After meal', startDate: '2026-01-01', isActive: true,
  },
  time,
  status: 'pending',
});

const morning = slot('Metformin', '08:00');
const evening = slot('Metformin', '20:00');
const vitamin = slot('Vitamin D3', '13:00');

test('English, Hindi and Gujarati all log a dose as taken', () => {
  for (const phrase of ['I took my medicine', 'मैंने दवा ले ली', 'મેં દવા લીધી', 'dawa kha liya']) {
    assert.equal(parseVoiceCommand(phrase, [morning]).action, 'taken', phrase);
  }
});

test('a negative phrase is a skip, not a take', () => {
  // "not taken" contains "taken" — the classic trap.
  for (const phrase of ['I did not take it', 'नहीं लिया', 'મેં નથી લીધી', 'skip it']) {
    assert.equal(parseVoiceCommand(phrase, [morning]).action, 'skipped', phrase);
  }
});

test('naming the medicine picks that dose', () => {
  const intent = parseVoiceCommand('took my vitamin d3', [morning, vitamin]);
  assert.equal(intent.slot?.medicine.name, 'Vitamin D3');
});

test('time-of-day words separate the morning and evening dose of one medicine', () => {
  assert.equal(parseVoiceCommand('morning tablet taken', [morning, evening]).slot?.time, '08:00');
  assert.equal(parseVoiceCommand('રાતની દવા લીધી', [morning, evening]).slot?.time, '20:00');
});

test('a single open dose needs no qualifier', () => {
  assert.equal(parseVoiceCommand('done', [evening]).slot?.time, '20:00');
});

test('an unclear phrase asks rather than guessing', () => {
  const intent = parseVoiceCommand('taken', [morning, vitamin]);
  assert.equal(intent.ambiguous, true);
  assert.equal(intent.slot, undefined);
});

test('speech with no dose words does nothing at all', () => {
  assert.equal(parseVoiceCommand('what is the weather', [morning]).action, null);
  assert.equal(parseVoiceCommand('', [morning]).action, null);
});

test('an ambiguous phrase offers only the doses it narrowed to', () => {
  const late = slot('Aspirin', '21:00');
  const intent = parseVoiceCommand('evening medicine taken', [morning, evening, late]);
  assert.equal(intent.ambiguous, true);
  assert.deepEqual(intent.candidates?.map((s) => s.time), ['20:00', '21:00']);
});

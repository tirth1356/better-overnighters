import assert from 'node:assert/strict';
import { test } from 'node:test';
import { InvalidModelOutput, asExplainReport, asPrescription, parseJson } from './validate.ts';

test('parseJson tolerates a fenced code block', () => {
  assert.deepEqual(parseJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.throws(() => parseJson('sorry, I cannot'), InvalidModelOutput);
});

test('explanation without a summary is rejected', () => {
  assert.throws(() => asExplainReport({ terms: [] }), InvalidModelOutput);
});

test('explanation coerces unknown flags and drops nameless entries', () => {
  const out = asExplainReport({
    summary: 'ok',
    parameters: [
      { name: 'HbA1c', value: '7.4%', flag: 'high' },
      { value: '120', flag: 'normal' },
    ],
    questionsForDoctor: ['Why?', 42],
  });
  assert.equal(out.parameters.length, 1);
  assert.equal(out.parameters[0].flag, 'unclear');
  assert.deepEqual(out.questionsForDoctor, ['Why?']);
  assert.ok(out.disclaimer.length > 0);
});

test('prescription drops invented times and falls back to counting doses', () => {
  const out = asPrescription({
    doctorName: 'Dr. Shah',
    medicines: [
      { medicineName: 'Metformin', dosage: '500mg', times: ['08:00', 'morning', '25:00'], beforeAfterFood: 'nope' },
      { dosage: '10mg' },
    ],
  });
  assert.equal(out.medicines.length, 1);
  assert.deepEqual(out.medicines[0].times, ['08:00']);
  assert.equal(out.medicines[0].frequency, 1);
  assert.equal(out.medicines[0].beforeAfterFood, 'any');
});

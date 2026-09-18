import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  saveReport,
  getAllReports,
  getReportById,
  deleteReport,
  dbStatus,
  type MedicalRecordDTO,
} from './db.ts';

test('dbStatus returns configuration and provider info', () => {
  const status = dbStatus();
  assert.equal(typeof status.configured, 'boolean');
  assert.ok(status.provider === 'neon' || status.provider === 'memory');
});

test('saveReport persists and retrieves medical report with metadata', async () => {
  const uniqueId = `rec-test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const mockReport: MedicalRecordDTO = {
    id: uniqueId,
    familyMemberId: 'member-001',
    title: 'Lipid Profile & Liver Function',
    type: 'Lab Report',
    kind: 'report',
    date: '2026-09-18',
    doctorName: 'Dr. Sunil Mehta',
    hospital: 'Apollo Hospital',
    summary: 'Total cholesterol 185 mg/dL. Triglycerides 140 mg/dL. All parameters normal.',
    tags: ['Lipid', 'Liver', 'Routine'],
    notes: 'Follow up in 6 months.',
  };

  const saved = await saveReport(mockReport);
  assert.equal(saved.id, uniqueId);
  assert.equal(saved.title, 'Lipid Profile & Liver Function');

  const retrieved = await getReportById(uniqueId);
  assert.ok(retrieved !== null, 'Report should be retrievable by id');
  assert.equal(retrieved.id, uniqueId);
  assert.equal(retrieved.familyMemberId, 'member-001');
  assert.equal(retrieved.title, 'Lipid Profile & Liver Function');
  assert.equal(retrieved.doctorName, 'Dr. Sunil Mehta');
  assert.deepEqual(retrieved.tags, ['Lipid', 'Liver', 'Routine']);

  const all = await getAllReports();
  const existsInList = all.some(r => r.id === uniqueId);
  assert.ok(existsInList, 'Report should be present in getAllReports list');

  const deleted = await deleteReport(uniqueId);
  assert.equal(deleted, true);

  const afterDelete = await getReportById(uniqueId);
  assert.equal(afterDelete, null, 'Report should be deleted');
});

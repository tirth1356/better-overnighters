import { Router } from 'express';
import {
  getAllReports,
  getReportById,
  saveReport,
  deleteReport,
  dbStatus,
  type MedicalRecordDTO,
} from '../services/db.ts';

export const recordsRouter = Router();

// GET /api/records — list all uploaded reports
recordsRouter.get('/', async (_req, res, next) => {
  try {
    const records = await getAllReports();
    const status = dbStatus();
    res.json({
      ok: true,
      records,
      configured: status.configured,
      provider: status.provider,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/records/status — check Neon database status
recordsRouter.get('/status', (_req, res) => {
  res.json({
    ok: true,
    db: dbStatus(),
  });
});

// GET /api/records/:id — fetch single report
recordsRouter.get('/:id', async (req, res, next) => {
  try {
    const record = await getReportById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ ok: true, record });
  } catch (err) {
    next(err);
  }
});

// POST /api/records — store uploaded report with clinical metadata
recordsRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body as Partial<MedicalRecordDTO>;

    if (!body.title || !body.title.trim()) {
      return res.status(400).json({ error: 'Record title is required' });
    }
    if (!body.familyMemberId) {
      return res.status(400).json({ error: 'Family member ID is required' });
    }

    const record: MedicalRecordDTO = {
      id: body.id || `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      familyMemberId: body.familyMemberId,
      title: body.title.trim(),
      type: body.type || 'Lab Report',
      kind: body.kind || 'report',
      date: body.date || new Date().toISOString().split('T')[0],
      doctorId: body.doctorId || undefined,
      doctorName: body.doctorName || undefined,
      hospital: body.hospital || undefined,
      fileUrl: body.fileUrl || undefined,
      summary: body.summary || undefined,
      tags: Array.isArray(body.tags) ? body.tags : [],
      notes: body.notes || undefined,
    };

    const saved = await saveReport(record);
    const status = dbStatus();

    res.status(201).json({
      ok: true,
      record: saved,
      provider: status.provider,
      savedToNeon: status.configured,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/records/:id — remove report
recordsRouter.delete('/:id', async (req, res, next) => {
  try {
    await deleteReport(req.params.id);
    res.json({ ok: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
});

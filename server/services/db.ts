import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export interface MedicalRecordDTO {
  id: string;
  familyMemberId: string;
  title: string;
  type: string;
  kind?: 'report' | 'prescription';
  date: string;
  doctorId?: string;
  doctorName?: string;
  hospital?: string;
  fileUrl?: string;
  summary?: string;
  tags?: string[];
  notes?: string;
  createdAt?: string;
}

// In-memory fallback if Neon DATABASE_URL is not set yet
const memoryStore = new Map<string, MedicalRecordDTO>();

let sqlClient: NeonQueryFunction<false, false> | null = null;
let initialized = false;
let initPromise: Promise<void> | null = null;

export function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
  return url && url.trim().length > 0 ? url.trim() : undefined;
}

export function isDbConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

function getSql(): NeonQueryFunction<false, false> | null {
  const url = getDatabaseUrl();
  if (!url) return null;
  if (!sqlClient) {
    sqlClient = neon(url);
  }
  return sqlClient;
}

function parseTags(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    if (val.startsWith('{') && val.endsWith('}')) {
      return val
        .slice(1, -1)
        .split(',')
        .map(s => s.replace(/^"|"$/g, '').trim())
        .filter(Boolean);
    }
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function rowToRecord(row: Record<string, unknown>): MedicalRecordDTO {
  return {
    id: String(row.id),
    familyMemberId: String(row.family_member_id),
    title: String(row.title),
    type: String(row.type),
    kind: row.kind ? (String(row.kind) as 'report' | 'prescription') : undefined,
    date: String(row.date),
    doctorId: row.doctor_id ? String(row.doctor_id) : undefined,
    doctorName: row.doctor_name ? String(row.doctor_name) : undefined,
    hospital: row.hospital ? String(row.hospital) : undefined,
    fileUrl: row.file_url ? String(row.file_url) : undefined,
    summary: row.summary ? String(row.summary) : undefined,
    tags: parseTags(row.tags),
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: row.created_at ? new Date(String(row.created_at)).toISOString() : undefined,
  };
}

export async function initDb(): Promise<void> {
  const sql = getSql();
  if (!sql) return;

  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS medical_reports (
          id VARCHAR(255) PRIMARY KEY,
          family_member_id VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          type VARCHAR(100) NOT NULL,
          kind VARCHAR(50),
          date VARCHAR(50) NOT NULL,
          doctor_id VARCHAR(255),
          doctor_name VARCHAR(255),
          hospital VARCHAR(255),
          file_url TEXT,
          summary TEXT,
          tags TEXT[] DEFAULT '{}',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      initialized = true;
      console.log('[db] Neon SQL connected and medical_reports table ready');
    } catch (err) {
      console.error('[db] Error connecting to Neon SQL:', (err as Error).message);
      throw err;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export async function getAllReports(): Promise<MedicalRecordDTO[]> {
  const sql = getSql();
  if (!sql) {
    return Array.from(memoryStore.values()).sort((a, b) => b.date.localeCompare(a.date));
  }

  await initDb();
  const rows = await sql`
    SELECT
      id,
      family_member_id,
      title,
      type,
      kind,
      date,
      doctor_id,
      doctor_name,
      hospital,
      file_url,
      summary,
      tags,
      notes,
      created_at
    FROM medical_reports
    ORDER BY date DESC, created_at DESC;
  `;

  return rows.map(r => rowToRecord(r as Record<string, unknown>));
}

export async function getReportById(id: string): Promise<MedicalRecordDTO | null> {
  const sql = getSql();
  if (!sql) {
    return memoryStore.get(id) || null;
  }

  await initDb();
  const rows = await sql`
    SELECT
      id,
      family_member_id,
      title,
      type,
      kind,
      date,
      doctor_id,
      doctor_name,
      hospital,
      file_url,
      summary,
      tags,
      notes,
      created_at
    FROM medical_reports
    WHERE id = ${id}
    LIMIT 1;
  `;

  if (rows.length === 0) return null;
  return rowToRecord(rows[0] as Record<string, unknown>);
}

export async function saveReport(report: MedicalRecordDTO): Promise<MedicalRecordDTO> {
  // Always update memory store as fallback cache
  memoryStore.set(report.id, report);

  const sql = getSql();
  if (!sql) {
    return report;
  }

  await initDb();

  const tags = Array.isArray(report.tags) ? report.tags : [];

  await sql`
    INSERT INTO medical_reports (
      id,
      family_member_id,
      title,
      type,
      kind,
      date,
      doctor_id,
      doctor_name,
      hospital,
      file_url,
      summary,
      tags,
      notes
    ) VALUES (
      ${report.id},
      ${report.familyMemberId},
      ${report.title},
      ${report.type},
      ${report.kind || null},
      ${report.date},
      ${report.doctorId || null},
      ${report.doctorName || null},
      ${report.hospital || null},
      ${report.fileUrl || null},
      ${report.summary || null},
      ${tags},
      ${report.notes || null}
    )
    ON CONFLICT (id) DO UPDATE SET
      family_member_id = EXCLUDED.family_member_id,
      title = EXCLUDED.title,
      type = EXCLUDED.type,
      kind = EXCLUDED.kind,
      date = EXCLUDED.date,
      doctor_id = EXCLUDED.doctor_id,
      doctor_name = EXCLUDED.doctor_name,
      hospital = EXCLUDED.hospital,
      file_url = EXCLUDED.file_url,
      summary = EXCLUDED.summary,
      tags = EXCLUDED.tags,
      notes = EXCLUDED.notes;
  `;

  return report;
}

export async function deleteReport(id: string): Promise<boolean> {
  memoryStore.delete(id);

  const sql = getSql();
  if (!sql) {
    return true;
  }

  await initDb();
  await sql`
    DELETE FROM medical_reports
    WHERE id = ${id};
  `;
  return true;
}

export function dbStatus(): { configured: boolean; provider: 'neon' | 'memory'; tableReady: boolean } {
  return {
    configured: isDbConfigured(),
    provider: isDbConfigured() ? 'neon' : 'memory',
    tableReady: initialized,
  };
}

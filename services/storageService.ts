/**
 * Storage Service Abstraction
 * ===========================
 * Defines a clean interface for file storage operations.
 * Currently uses in-memory/local mock storage.
 * Swap storageService implementation later for:
 *   - Firebase Storage
 *   - AWS S3
 *   - Cloudinary
 *   - Any other provider
 */

import type { UploadedFile } from '@/types'

// ── Interface ──────────────────────────────────────────────

export interface StorageService {
  uploadFile(file: File): Promise<UploadedFile>
  deleteFile(fileId: string): Promise<void>
  getFileUrl(fileId: string): Promise<string>
}

// ── In-Memory Mock ─────────────────────────────────────────

const uploadedFiles: Map<string, UploadedFile> = new Map()

async function mockUploadFile(file: File): Promise<UploadedFile> {
  // Simulate upload delay
  await new Promise(r => setTimeout(r, 800))

  const id = `file-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const fileUrl = URL.createObjectURL(file)

  const uploaded: UploadedFile = {
    id,
    fileUrl,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
  }

  uploadedFiles.set(id, uploaded)
  return uploaded
}

async function mockDeleteFile(fileId: string): Promise<void> {
  await new Promise(r => setTimeout(r, 200))
  uploadedFiles.delete(fileId)
}

async function mockGetFileUrl(fileId: string): Promise<string> {
  const file = uploadedFiles.get(fileId)
  if (!file) throw new Error(`File ${fileId} not found`)
  return file.fileUrl
}

// ── Exported Service ───────────────────────────────────────

export const storageService: StorageService = {
  uploadFile: mockUploadFile,
  deleteFile: mockDeleteFile,
  getFileUrl: mockGetFileUrl,
}

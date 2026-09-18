import { useState, useCallback, useRef } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { cn, fileSize } from '@/lib/utils';

interface UploadDropzoneProps {
  onFileAccepted: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function UploadDropzone({
  onFileAccepted,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 20,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndAccept = useCallback(
    (file: File) => {
      setError(null);
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }
      const allowed = accept.split(',').map(a => a.trim().replace('.', ''));
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const mimeOk = file.type.includes('pdf') || file.type.includes('image');
      if (!mimeOk && !allowed.includes(ext)) {
        setError(`File type not supported. Please upload ${accept}.`);
        return;
      }
      setUploadedFile(file);
      onFileAccepted(file);
    },
    [accept, maxSizeMB, onFileAccepted]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndAccept(file);
    },
    [validateAndAccept]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndAccept(file);
    },
    [validateAndAccept]
  );

  const clearFile = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (uploadedFile) {
    return (
      <div className="border-2 border-sage-400 bg-[#F0F8EC] rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#D8EFCC] rounded-xl flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-[#3D6B2A]" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-espresso text-sm truncate">{uploadedFile.name}</p>
          <p className="text-xs text-warm-muted mt-0.5">
            {fileSize(uploadedFile.size)} · {uploadedFile.type || 'Document'}
          </p>
        </div>
        <button
          type="button"
          onClick={clearFile}
          className="text-brown-400 hover:text-brown-700 transition-colors p-1 bg-transparent border-0 cursor-pointer"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer group',
          isDragging
            ? 'border-terra bg-[#FAEAE3]'
            : 'border-[#E8DDD0] bg-[#FAF7F2] hover:border-[#B86F52] hover:bg-[#FDF5EF]'
        )}
        role="button"
        tabIndex={0}
        aria-label="Upload file — drag and drop or click to browse"
        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="sr-only"
          aria-label="File picker"
        />

        <div className="flex flex-col items-center gap-2.5">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200',
              isDragging
                ? 'bg-terra-light'
                : 'bg-white border border-[#E8DDD0] group-hover:border-terra'
            )}
          >
            <Upload
              className={cn(
                'w-5 h-5 transition-colors duration-200',
                isDragging ? 'text-terra' : 'text-brown-400 group-hover:text-terra'
              )}
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="font-semibold text-espresso text-sm">
              {isDragging ? 'Drop to upload' : 'Drag & drop your medical document'}
            </p>
            <p className="text-xs text-warm-muted mt-1">
              PDF, JPG, or PNG · Max {maxSizeMB}MB
            </p>
          </div>

          <span className="text-xs font-semibold text-terra underline underline-offset-2">
            or browse files
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export default UploadDropzone;

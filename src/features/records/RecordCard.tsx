import { Link } from 'react-router-dom';
import { Calendar, Bot, ChevronRight, User } from 'lucide-react';
import type { MedicalRecord, FamilyMember, Doctor } from '@/types';
import { DocumentIcon } from '@/components/ui/DocumentIcon';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants';

interface RecordCardProps {
  record: MedicalRecord;
  member?: FamilyMember;
  doctor?: Doctor;
}

export function RecordCard({ record, member, doctor }: RecordCardProps) {
  const docType = (record as any).documentType || record.type || 'other';
  const recDate = (record as any).medicalDate || record.date;

  return (
    <Link
      to={`/records/${record.id}`}
      className="block group"
      style={{ textDecoration: 'none', color: 'inherit' }}
      aria-label={`Open ${record.title}`}
    >
      <article className="card card-hover p-4 flex gap-4 items-start cursor-pointer transition-all duration-200">
        {/* Document Icon */}
        <DocumentIcon type={docType} size="md" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-espresso text-sm leading-snug truncate group-hover:text-terracotta-600 transition-colors">
                {record.title}
              </h3>
              <p className="text-xs text-warm-muted mt-0.5">
                {DOCUMENT_TYPE_LABELS[docType] ?? docType}
              </p>
            </div>

            <ChevronRight
              className="w-4 h-4 text-brown-400 flex-shrink-0 mt-0.5 group-hover:text-terracotta-500 transition-colors"
              aria-hidden="true"
            />
          </div>

          {/* Meta row */}
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-warm-muted">
            {/* Date */}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              {formatDate(recDate)}
            </span>

            {/* Member */}
            {member && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                {member.name.split(' ')[0]}
              </span>
            )}

            {/* Doctor */}
            {(doctor || record.doctorName) && (
              <span className="truncate max-w-[140px]">
                {doctor?.name || record.doctorName}
              </span>
            )}
          </div>

          {/* Badges / AI indicator */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {record.tags?.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="text-[11px] bg-beige-100 text-brown-600 px-2 py-0.5 rounded-md font-medium"
              >
                #{tag}
              </span>
            ))}
            {(record as any).hasAIExplanation && (
              <Badge variant="sage">
                <Bot className="w-2.5 h-2.5 mr-0.5" />
                AI Explained
              </Badge>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default RecordCard;

import {
  FileText, Pill, Stethoscope, Microscope, FileHeart,
  Syringe, FlaskConical, ScanLine, File
} from 'lucide-react'
import type { DocumentType } from '@/types'
import { DOCUMENT_TYPE_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<DocumentType, React.ElementType> = {
  blood_report:       FlaskConical,
  prescription:       Pill,
  xray:               ScanLine,
  ct_mri:             Stethoscope,
  discharge_summary:  FileHeart,
  lab_report:         Microscope,
  vaccination_record: Syringe,
  other:              File,
}

interface DocumentIconProps {
  type: DocumentType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { wrapper: 'w-8 h-8', icon: 14 },
  md: { wrapper: 'w-11 h-11', icon: 18 },
  lg: { wrapper: 'w-16 h-16', icon: 26 },
}

export function DocumentIcon({ type, size = 'md', className }: DocumentIconProps) {
  const Icon = TYPE_ICONS[type] ?? FileText
  const colors = DOCUMENT_TYPE_COLORS[type]
  const dims = sizeMap[size]

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl flex-shrink-0',
        dims.wrapper,
        className
      )}
      style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
      aria-hidden="true"
    >
      <Icon size={dims.icon} color={colors.text} strokeWidth={1.8} />
    </span>
  )
}

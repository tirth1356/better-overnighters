import React from 'react';
import {
  FileText, Pill, Stethoscope, Microscope, FileHeart,
  Syringe, FlaskConical, ScanLine, File
} from 'lucide-react';
import { DOCUMENT_TYPE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const TYPE_ICONS: Record<string, React.ElementType> = {
  blood_report:       FlaskConical,
  prescription:       Pill,
  xray:               ScanLine,
  ct_mri:             Stethoscope,
  discharge_summary:  FileHeart,
  lab_report:         Microscope,
  vaccination_record: Syringe,
  other:              File,
  'Lab Report':       Microscope,
  'Prescription':     Pill,
  'Imaging':          ScanLine,
  'Discharge Summary':FileHeart,
  'Vaccination':      Syringe,
  'Consultation':     Stethoscope,
  'Other':            File,
};

interface DocumentIconProps {
  type?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { wrapper: 'w-8 h-8', icon: 14 },
  md: { wrapper: 'w-10 h-10', icon: 18 },
  lg: { wrapper: 'w-14 h-14', icon: 24 },
};

export function DocumentIcon({ type = 'other', size = 'md', className }: DocumentIconProps) {
  const Icon = TYPE_ICONS[type] ?? FileText;
  const colors = DOCUMENT_TYPE_COLORS[type] ?? DOCUMENT_TYPE_COLORS.other;
  const dims = sizeMap[size];

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
  );
}

export default DocumentIcon;

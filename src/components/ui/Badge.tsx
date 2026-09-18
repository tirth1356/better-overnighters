import { clsx } from 'clsx';

type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

function bloodClass(bg: string): string {
  const letter = bg.replace('+', '').replace('-', '').toLowerCase();
  if (letter === 'a')  return 'badge-blood badge-blood-a';
  if (letter === 'b')  return 'badge-blood badge-blood-b';
  if (letter === 'ab') return 'badge-blood badge-blood-ab';
  if (letter === 'o')  return 'badge-blood badge-blood-o';
  return 'badge-blood badge-muted';
}

// ─── Blood Group Badge ────────────────────────────────────────────
interface BloodBadgeProps { value: BloodGroup; }
export function BloodBadge({ value }: BloodBadgeProps) {
  return <span className={bloodClass(value)}>{value}</span>;
}

// ─── Generic Badge ─────────────────────────────────────────────────
type BadgeVariant = 'brown' | 'sage' | 'terra' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'muted', className, icon }: BadgeProps) {
  return (
    <span className={clsx('badge', `badge-${variant}`, className)}>
      {icon}
      {children}
    </span>
  );
}

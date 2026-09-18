import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  initials?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const sizeMap = {
  xs: { dim: 24, font: '0.6rem' },
  sm: { dim: 32, font: '0.75rem' },
  md: { dim: 40, font: '0.875rem' },
  lg: { dim: 52, font: '1rem' },
  xl: { dim: 72, font: '1.375rem' },
};

export default function Avatar({
  src,
  initials,
  name,
  size = 'md',
  color = '#F0E6D3',
  className,
}: AvatarProps) {
  const { dim, font } = sizeMap[size];

  const displayInitials = initials
    ?? name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    ?? '?';

  return (
    <span
      className={clsx('avatar', className)}
      style={{ width: dim, height: dim, fontSize: font, background: color }}
      title={name}
      aria-label={name ? `Avatar for ${name}` : 'Avatar'}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? 'Avatar'}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        displayInitials
      )}
    </span>
  );
}

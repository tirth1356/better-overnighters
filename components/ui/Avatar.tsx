import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  imageUrl?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const AVATAR_COLORS = [
  { bg: '#FAEAE3', text: '#B05A3A' },
  { bg: '#EEF4EA', text: '#3D6B2A' },
  { bg: '#EEF4FA', text: '#2D5E82' },
  { bg: '#F4EEF4', text: '#6B2D82' },
  { bg: '#FAFAEA', text: '#6B6B2D' },
]

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

const sizeStyles = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

export function Avatar({ name, imageUrl, size = 'md', className }: AvatarProps) {
  const colors = getAvatarColor(name)

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={cn('rounded-full object-cover flex-shrink-0', sizeStyles[size], className)}
      />
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0',
        sizeStyles[size],
        className
      )}
      style={{ backgroundColor: colors.bg, color: colors.text }}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  )
}

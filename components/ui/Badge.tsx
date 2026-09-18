import { cn } from '@/lib/utils'

type BadgeVariant = 'terracotta' | 'sage' | 'warm' | 'info' | 'danger' | 'warning'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  terracotta: 'bg-[#FAEAE3] text-terracotta-700 border border-[#F0CCBA]',
  sage:       'bg-[#EEF4EA] text-[#4A6B38] border border-[#C8DAB8]',
  warm:       'bg-beige-100 text-brown-700 border border-beige-200',
  info:       'bg-[#EEF4FA] text-[#2D5E82] border border-[#B8D0E8]',
  danger:     'bg-[#FAEAEA] text-[#8B2020] border border-[#F5BFBF]',
  warning:    'bg-[#FFF3E0] text-[#7A4F10] border border-[#F5D4A0]',
}

const dotColors: Record<BadgeVariant, string> = {
  terracotta: 'bg-terracotta-500',
  sage:       'bg-sage-500',
  warm:       'bg-brown-400',
  info:       'bg-[#4A7A9B]',
  danger:     'bg-[#B54040]',
  warning:    'bg-[#C48B2F]',
}

export function Badge({ variant = 'warm', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('inline-block w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}

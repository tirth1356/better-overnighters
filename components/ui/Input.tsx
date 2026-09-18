import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { Search } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  label?: string
  error?: string
  isSearch?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, label, error, isSearch, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-brown-700">
            {label}
          </label>
        )}
        <div className="relative">
          {(icon || isSearch) && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none">
              {isSearch ? <Search className="w-4 h-4" /> : icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-white border border-beige-200 rounded-xl text-sm text-espresso placeholder:text-brown-400',
              'px-3 py-2.5 transition-all duration-150',
              'hover:border-beige-300 focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/20',
              (icon || isSearch) && 'pl-9',
              error && 'border-red-300 focus:border-red-400 focus:ring-red-400/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-brown-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full bg-white border border-beige-200 rounded-xl text-sm text-espresso',
            'px-3 py-2.5 appearance-none transition-all duration-150 cursor-pointer',
            'hover:border-beige-300 focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/20',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-400/20',
            className
          )}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

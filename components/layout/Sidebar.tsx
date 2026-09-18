'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  Clock,
  Pill,
  Scale,
  Users,
  LayoutDashboard,
  Bot,
  HeartPulse,
  Syringe,
  AlertCircle,
  Stethoscope,
  UploadCloud,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: 'terracotta' | 'sage' | 'warm'
  isExternalRole?: boolean
  roleNote?: string
}

const PRIMARY_NAV: NavItem[] = [
  {
    label: 'Medical Vault',
    href: '/records',
    icon: FileText,
  },
  {
    label: 'Medical Timeline',
    href: '/timeline',
    icon: Clock,
  },
  {
    label: 'Prescription Upload',
    href: '/records/prescription-upload',
    icon: Pill,
    badge: 'AI OCR',
    badgeVariant: 'terracotta',
  },
  {
    label: 'Compare Reports',
    href: '/records/compare',
    icon: Scale,
    badge: 'Trends',
    badgeVariant: 'sage',
  },
  {
    label: 'Upload Record',
    href: '/records/upload',
    icon: UploadCloud,
  },
]

const ECOSYSTEM_NAV: NavItem[] = [
  {
    label: 'Family Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    isExternalRole: true,
    roleNote: 'Person 1',
  },
  {
    label: 'Family Tree',
    href: '/family',
    icon: Users,
    isExternalRole: true,
    roleNote: 'Person 1',
  },
  {
    label: 'Doctors',
    href: '/doctors',
    icon: Stethoscope,
    isExternalRole: true,
    roleNote: 'Person 1',
  },
  {
    label: 'Vaccinations',
    href: '/vaccinations',
    icon: Syringe,
    isExternalRole: true,
    roleNote: 'Person 1',
  },
  {
    label: 'Emergency Health Card',
    href: '/emergency',
    icon: AlertCircle,
    isExternalRole: true,
    roleNote: 'Person 1',
  },
  {
    label: 'Family Health Copilot',
    href: '/copilot',
    icon: Bot,
    isExternalRole: true,
    roleNote: 'Person 4 (RAG)',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 flex-shrink-0 bg-[#F5EFE6] border-r border-[#E8DDD0] flex flex-col justify-between min-h-screen sticky top-0"
      aria-label="Main Navigation"
    >
      <div className="p-5">
        {/* Brand Header */}
        <Link href="/records" className="flex items-center gap-3 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-terracotta-500 flex items-center justify-center text-white shadow-warm-sm group-hover:bg-terracotta-600 transition-colors">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-espresso leading-tight">
              Aarogya Parivar
            </h1>
            <p className="text-[11px] font-medium text-brown-500 uppercase tracking-wider">
              Family Health Archive
            </p>
          </div>
        </Link>

        {/* Primary Records Navigation (Person 2) */}
        <div className="space-y-1 mb-6">
          <p className="section-label px-3 pb-2 text-[10px] text-brown-500 font-semibold tracking-wider uppercase">
            Medical Records & AI
          </p>
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/records'
                ? pathname === '/records'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-terracotta-500 text-white shadow-warm-sm'
                    : 'text-brown-700 hover:bg-[#EDE3D5] hover:text-espresso'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      isActive ? 'text-white' : 'text-brown-600'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.badgeVariant === 'terracotta'
                        ? 'bg-[#FAEAE3] text-terracotta-700 border border-[#F0CCBA]'
                        : 'bg-[#EEF4EA] text-[#4A6B38] border border-[#C8DAB8]'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Other Sections (Person 1 & Person 4 stubs) */}
        <div className="space-y-1">
          <p className="section-label px-3 pb-2 text-[10px] text-brown-500 font-semibold tracking-wider uppercase">
            Family Ecosystem
          </p>
          {ECOSYSTEM_NAV.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <div
                key={item.href}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-brown-500 hover:bg-[#EDE3D5]/50 transition-colors"
                title={`Reserved for ${item.roleNote}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-brown-400" />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-beige-200 text-brown-600 font-medium">
                  {item.roleNote}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Profile / Family Switcher Info */}
      <div className="p-4 border-t border-[#E8DDD0] bg-[#FAF7F2]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAEAE3] text-terracotta-700 font-bold text-xs flex items-center justify-center border border-[#F0CCBA]">
              RM
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-espresso">Mehta Family</p>
              <p className="text-[10px] text-brown-500">5 Members Active</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-sage-500 ring-2 ring-[#EEF4EA]" title="Sync active" />
        </div>
      </div>
    </aside>
  )
}

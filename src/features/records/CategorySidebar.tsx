import { useMedical } from '@/context/MedicalContext';
import { DocumentIcon } from '@/components/ui/DocumentIcon';
import { DOCUMENT_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { RecordFilters } from '@/types';

export function CategorySidebar() {
  const { records, filters, setFilters } = useMedical();

  const countByType = (type: string) => {
    if (type === 'all') return records.length;
    return records.filter(r => {
      const t = (r as any).documentType || r.type;
      return t === type || String(t).toLowerCase() === type.toLowerCase();
    }).length;
  };

  return (
    <nav
      className="bg-white/80 border border-[#E8DDD0] rounded-2xl p-3 space-y-1"
      aria-label="Document categories"
    >
      <p className="text-xs font-bold text-brown-600 tracking-wider uppercase px-2 pb-2">Categories</p>
      {DOCUMENT_CATEGORIES.map(({ type, label }) => {
        const isActive = filters.documentType === type;
        const count = countByType(type);

        return (
          <button
            key={type}
            onClick={() =>
              setFilters((prev: RecordFilters) => ({
                ...prev,
                documentType: type,
              }))
            }
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 text-left border border-transparent',
              isActive
                ? 'bg-[#B86F52] text-white shadow-sm font-semibold'
                : 'text-brown-800 hover:bg-[#F5EFE6] hover:text-espresso'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {type !== 'all' ? (
              <DocumentIcon
                type={type}
                size="sm"
                className={isActive ? 'opacity-90' : ''}
              />
            ) : (
              <span
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0',
                  isActive ? 'bg-white/20 text-white' : 'bg-beige-100 text-brown-700'
                )}
              >
                All
              </span>
            )}

            <span className="flex-1 font-medium leading-none text-xs">{label}</span>

            {count > 0 && (
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full min-w-[1.25rem] text-center',
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-beige-100 text-brown-600'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default CategorySidebar;

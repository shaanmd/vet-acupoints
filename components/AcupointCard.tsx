'use client'
import { Acupoint, Species, PointCategory } from '@/lib/types'
import FavouriteButton from './FavouriteButton'

interface AcupointCardProps {
  point: Acupoint
  speciesMode: Species
  isFavourited: boolean
  onToggleFavourite: (id: string) => Promise<boolean>
  onAuthRequired: () => void
  onClick: (point: Acupoint) => void
}

const CATEGORY_STYLES: Record<PointCategory, { border: string; badge: string }> = {
  'Master Points':          { border: 'border-l-indigo-500', badge: 'bg-indigo-100 text-indigo-800' },
  'Influential/Bone/Marrow': { border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-800' },
  'Back-Shu & Front-Mu':    { border: 'border-l-rose-500',  badge: 'bg-rose-100 text-rose-800' },
  'Five Shu Points':         { border: 'border-l-cyan-500',  badge: 'bg-cyan-100 text-cyan-800' },
  'Empirical & Distal':      { border: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-800' },
}

export default function AcupointCard({
  point,
  speciesMode,
  isFavourited,
  onToggleFavourite,
  onAuthRequired,
  onClick,
}: AcupointCardProps) {
  const styles = CATEGORY_STYLES[point.category] ?? {
    border: 'border-l-gray-400',
    badge: 'bg-gray-100 text-gray-700',
  }

  const locationPreview = (() => {
    const loc =
      speciesMode === 'canine'
        ? point.location_canine
        : speciesMode === 'feline'
        ? point.location_feline
        : point.location_equine
    return loc?.length > 90 ? loc.substring(0, 90) + '...' : loc
  })()

  return (
    <div
      onClick={() => onClick(point)}
      className={`group relative flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 border-l-4 ${styles.border} min-h-[110px] p-4 sm:p-5`}
    >
      {/* Top row: point ID + favourite */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-lg font-bold text-tcvm-700 leading-tight">{point.id}</p>
          {point.alias && (
            <p className="text-xs text-gray-400 italic truncate">{point.alias}</p>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${styles.badge}`}>
            {point.category}
          </span>
          <FavouriteButton
            acupointId={point.id}
            isFavourited={isFavourited}
            onToggle={onToggleFavourite}
            onAuthRequired={onAuthRequired}
            size="sm"
          />
        </div>
      </div>

      {/* Point full name */}
      <p className="mb-2 text-sm font-semibold text-gray-800 leading-snug">{point.name}</p>

      {/* Western indication preview */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {point.western_indication}
      </p>

      {/* Location preview — subtle, smaller */}
      {locationPreview && (
        <p className="mt-2 text-[11px] text-gray-400 leading-relaxed line-clamp-1">
          📍 {locationPreview}
        </p>
      )}
    </div>
  )
}

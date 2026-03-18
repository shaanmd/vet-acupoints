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

// Category accent colours — left border strip + badge
// Keep distinct colours per category for quick visual scanning, using vetai-compatible palette
const CATEGORY_STYLES: Record<PointCategory, { border: string; badge: string }> = {
  'Master Points':           { border: 'border-l-vetai-primary',   badge: 'bg-vetai-primary/10 text-vetai-primary' },
  'Influential/Bone/Marrow': { border: 'border-l-amber-500',       badge: 'bg-amber-50 text-amber-800' },
  'Back-Shu & Front-Mu':    { border: 'border-l-vetai-accent',     badge: 'bg-vetai-accent/10 text-vetai-accent' },
  'Five Shu Points':         { border: 'border-l-vetai-secondary', badge: 'bg-vetai-secondary/15 text-vetai-primary' },
  'Empirical & Distal':      { border: 'border-l-emerald-500',     badge: 'bg-emerald-50 text-emerald-800' },
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
      className={`group relative flex cursor-pointer flex-col rounded-card border border-vetai-border bg-vetai-surface shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 border-l-4 ${styles.border} min-h-[110px] p-4 sm:p-5`}
    >
      {/* Top row: point ID + favourite */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-lg font-semibold text-vetai-primary leading-tight">{point.id}</p>
          {point.alias && (
            <p className="text-xs text-vetai-muted italic truncate">{point.alias}</p>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <span className={`inline-flex items-center rounded-tag px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${styles.badge}`}>
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
      <p className="mb-2 text-sm font-medium text-vetai-text leading-snug">{point.name}</p>

      {/* Western indication preview */}
      <p className="text-xs text-vetai-muted leading-relaxed line-clamp-2">
        {point.western_indication}
      </p>

      {/* Location preview — subtle, smaller */}
      {locationPreview && (
        <p className="mt-2 text-[11px] text-vetai-muted/70 leading-relaxed line-clamp-1">
          📍 {locationPreview}
        </p>
      )}
    </div>
  )
}

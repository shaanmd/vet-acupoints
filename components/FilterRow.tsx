'use client'
import { Species, PointCategory } from '@/lib/types'

const SPECIES: { value: Species; label: string; emoji: string }[] = [
  { value: 'canine', label: 'Canine', emoji: '🐕' },
  { value: 'feline', label: 'Feline', emoji: '🐈' },
  { value: 'equine', label: 'Equine', emoji: '🐴' },
]

const CATEGORIES: { value: PointCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Points' },
  { value: 'Master Points', label: 'Master' },
  { value: 'Influential/Bone/Marrow', label: 'Influential' },
  { value: 'Back-Shu & Front-Mu', label: 'Shu-Mu' },
  { value: 'Five Shu Points', label: 'Five Shu' },
  { value: 'Empirical & Distal', label: 'Empirical' },
]

interface FilterRowProps {
  selectedSpecies: Species
  onSpeciesChange: (s: Species) => void
  selectedCategory: PointCategory | 'all'
  onCategoryChange: (c: PointCategory | 'all') => void
}

export default function FilterRow({
  selectedSpecies,
  onSpeciesChange,
  selectedCategory,
  onCategoryChange,
}: FilterRowProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Species row */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {SPECIES.map(s => (
          <button
            key={s.value}
            onClick={() => onSpeciesChange(s.value)}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-tag px-4 py-2 text-sm font-medium transition-all ${
              selectedSpecies === s.value
                ? 'bg-vetai-primary text-white shadow-sm'
                : 'border border-vetai-border bg-vetai-surface text-vetai-muted hover:border-vetai-secondary hover:text-vetai-primary'
            }`}
          >
            <span>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
            className={`flex-shrink-0 rounded-tag px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === c.value
                ? 'bg-vetai-secondary text-vetai-primary font-semibold shadow-sm'
                : 'border border-vetai-border bg-vetai-surface text-vetai-muted hover:border-vetai-secondary hover:text-vetai-primary'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}

'use client'
import { Species, PointCategory } from '@/lib/types'

const SPECIES: { value: Species; label: string; emoji: string }[] = [
  { value: 'canine', label: 'Canine', emoji: '🐕' },
  { value: 'feline', label: 'Feline', emoji: '🐈' },
  { value: 'equine', label: 'Equine', emoji: '🐴' },
]

const CATEGORIES: { value: PointCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
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
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              selectedSpecies === s.value
                ? 'bg-tcvm-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-tcvm-300 hover:text-tcvm-700'
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
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === c.value
                ? 'bg-tcvm-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-500 hover:border-tcvm-300 hover:text-tcvm-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}

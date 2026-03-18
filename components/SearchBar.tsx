'use client'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search points, conditions, locations...',
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-vetai-muted pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        inputMode="search"
        className="w-full rounded-btn border border-vetai-border bg-vetai-surface py-3 pl-11 pr-10 text-sm text-vetai-text placeholder-vetai-muted outline-none transition focus:border-vetai-secondary focus:ring-2 focus:ring-vetai-secondary/20 font-sans"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-vetai-muted hover:text-vetai-text transition"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

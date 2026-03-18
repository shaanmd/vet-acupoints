'use client'
import { useState, useMemo, useCallback } from 'react'
import { Acupoint, Species, PointCategory } from '@/lib/types'
import { useFavourites } from '@/hooks/useFavourites'
import AcupointCard from './AcupointCard'
import AcupointBottomSheet from './AcupointBottomSheet'
import SearchBar from './SearchBar'
import FilterRow from './FilterRow'
import { useRouter } from 'next/navigation'

interface AcupointBrowserProps {
  acupoints: Acupoint[]
  userId: string | null
}

export default function AcupointBrowser({ acupoints, userId }: AcupointBrowserProps) {
  const [search, setSearch] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState<Species>('canine')
  const [selectedCategory, setSelectedCategory] = useState<PointCategory | 'all'>('all')
  const [selectedPoint, setSelectedPoint] = useState<Acupoint | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const { favourites, toggle } = useFavourites(userId)
  const router = useRouter()

  function handleAuthRequired() {
    router.push('/account')
  }

  function handleCardClick(point: Acupoint) {
    setSelectedPoint(point)
    setSheetOpen(true)
  }

  function handleClose() {
    setSheetOpen(false)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return acupoints.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false
      if (!q) return true
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.alias?.toLowerCase().includes(q) ?? false) ||
        p.western_indication.toLowerCase().includes(q) ||
        p.tcm_indication.toLowerCase().includes(q) ||
        p.location_canine?.toLowerCase().includes(q) ||
        p.location_feline?.toLowerCase().includes(q) ||
        p.location_equine?.toLowerCase().includes(q) ||
        p.grouping?.toLowerCase().includes(q)
      )
    })
  }, [acupoints, search, selectedCategory])

  return (
    <>
      {/* Sticky search + filters */}
      <div className="sticky top-[57px] md:top-[61px] z-10 bg-vetai-bg px-4 pt-3 pb-3 border-b border-vetai-border space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <FilterRow
          selectedSpecies={selectedSpecies}
          onSpeciesChange={setSelectedSpecies}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Results count */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-vetai-muted/70 font-medium">
          {filtered.length} point{filtered.length !== 1 ? 's' : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
          {acupoints.length === 0 && !search ? (
            // No data at all — Supabase not yet configured
            <>
              <span className="text-4xl">🌿</span>
              <p className="text-sm font-medium text-vetai-muted">No acupoints loaded yet.</p>
              <p className="text-xs text-vetai-muted/70 max-w-xs">Add your Supabase credentials to <code className="bg-vetai-border/50 px-1 rounded">.env.local</code> and run <code className="bg-vetai-border/50 px-1 rounded">npm run seed</code> to populate the database.</p>
            </>
          ) : (
            // Search/filter returned nothing
            <>
              <span className="text-4xl">🔍</span>
              <p className="text-sm font-medium text-vetai-muted">No points found for &ldquo;{search}&rdquo;</p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all') }}
                className="text-sm text-vetai-secondary underline underline-offset-2"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(point => (
            <AcupointCard
              key={point.id}
              point={point}
              speciesMode={selectedSpecies}
              isFavourited={favourites.includes(point.id)}
              onToggleFavourite={toggle}
              onAuthRequired={handleAuthRequired}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Bottom sheet */}
      <AcupointBottomSheet
        point={selectedPoint}
        isOpen={sheetOpen}
        onClose={handleClose}
        initialSpecies={selectedSpecies}
        isFavourited={selectedPoint ? favourites.includes(selectedPoint.id) : false}
        onToggleFavourite={toggle}
        onAuthRequired={handleAuthRequired}
      />
    </>
  )
}

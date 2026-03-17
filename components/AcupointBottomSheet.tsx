'use client'
import { useEffect, useRef, useState } from 'react'
import { X, MapPin, Activity, Stethoscope } from 'lucide-react'
import { Acupoint, Species } from '@/lib/types'
import FavouriteButton from './FavouriteButton'

interface AcupointBottomSheetProps {
  point: Acupoint | null
  isOpen: boolean
  onClose: () => void
  initialSpecies: Species
  isFavourited: boolean
  onToggleFavourite: (id: string) => Promise<boolean>
  onAuthRequired: () => void
}

const SPECIES_LABELS: { value: Species; label: string; emoji: string }[] = [
  { value: 'canine', label: 'Canine', emoji: '🐕' },
  { value: 'feline', label: 'Feline', emoji: '🐈' },
  { value: 'equine', label: 'Equine', emoji: '🐴' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Master Points':           'from-indigo-500 to-purple-600',
  'Influential/Bone/Marrow': 'from-amber-400 to-orange-600',
  'Back-Shu & Front-Mu':    'from-rose-400 to-pink-600',
  'Five Shu Points':         'from-cyan-400 to-blue-600',
  'Empirical & Distal':      'from-emerald-400 to-teal-600',
}

export default function AcupointBottomSheet({
  point,
  isOpen,
  onClose,
  initialSpecies,
  isFavourited,
  onToggleFavourite,
  onAuthRequired,
}: AcupointBottomSheetProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<Species>(initialSpecies)
  const sheetRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number | null>(null)

  // Sync species with the initially selected one when a new point opens
  useEffect(() => {
    if (isOpen) setSelectedSpecies(initialSpecies)
  }, [isOpen, initialSpecies, point?.id])

  // Trap body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return
    const delta = e.changedTouches[0].clientY - touchStartY.current
    if (delta > 60) onClose() // swipe down > 60px to dismiss
    touchStartY.current = null
  }

  if (!point) return null

  const locationText =
    selectedSpecies === 'canine'
      ? point.location_canine
      : selectedSpecies === 'feline'
      ? point.location_feline
      : point.location_equine

  const gradient = CATEGORY_COLORS[point.category] ?? 'from-gray-400 to-slate-600'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet / Modal */}
      <div
        ref={sheetRef}
        className={`fixed z-50 bg-white shadow-2xl transition-all duration-300 ease-out
          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 max-h-[88vh] rounded-t-2xl overflow-hidden flex flex-col
          /* Desktop: centred modal */
          md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:max-w-2xl md:w-full md:max-h-[90vh]
          ${isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none md:translate-y-[-45%]'
          }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Header band */}
        <div className={`relative flex-shrink-0 bg-gradient-to-r ${gradient} px-5 py-5`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-3xl font-bold text-white leading-tight">{point.id}</p>
              <p className="text-sm font-medium text-white/80 mt-0.5">{point.name}</p>
              {point.alias && (
                <p className="text-xs italic text-white/60 mt-0.5">{point.alias}</p>
              )}
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <FavouriteButton
                acupointId={point.id}
                isFavourited={isFavourited}
                onToggle={onToggleFavourite}
                onAuthRequired={onAuthRequired}
                size="md"
              />
              <button
                onClick={onClose}
                className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Species toggle */}
          <div className="mt-4 flex rounded-lg bg-black/20 p-1 w-fit">
            {SPECIES_LABELS.map(s => (
              <button
                key={s.value}
                onClick={() => setSelectedSpecies(s.value)}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedSpecies === s.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Grouping */}
          {point.grouping && (
            <p className="text-xs font-medium text-gray-500 italic">{point.grouping}</p>
          )}

          {/* Anatomical Location */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-tcvm-600 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Anatomical Location
              </h3>
            </div>
            <div className="rounded-xl border border-tcvm-100 bg-tcvm-50 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{locationText}</p>
            </div>
          </div>

          {/* TCM Functions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                TCM Functions
              </h3>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{point.tcm_indication}</p>
            </div>
          </div>

          {/* Western Applications */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Western Applications
              </h3>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{point.western_indication}</p>
            </div>
          </div>

          {/* Bottom padding for nav bar clearance on mobile */}
          <div className="h-6" />
        </div>
      </div>
    </>
  )
}

'use client'
import { Star } from 'lucide-react'

interface FavouriteButtonProps {
  acupointId: string
  isFavourited: boolean
  onToggle: (id: string) => Promise<boolean>
  onAuthRequired: () => void
  size?: 'sm' | 'md'
}

export default function FavouriteButton({
  acupointId,
  isFavourited,
  onToggle,
  onAuthRequired,
  size = 'md',
}: FavouriteButtonProps) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2'

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation() // don't trigger card click
    const success = await onToggle(acupointId)
    if (!success) {
      onAuthRequired()
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
      className={`${buttonSize} rounded-full transition-colors ${
        isFavourited
          ? 'text-amber-500 hover:text-amber-600'
          : 'text-gray-300 hover:text-amber-400'
      }`}
    >
      <Star
        className={iconSize}
        fill={isFavourited ? 'currentColor' : 'none'}
        strokeWidth={isFavourited ? 0 : 1.5}
      />
    </button>
  )
}

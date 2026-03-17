'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Star, User, Wand2 } from 'lucide-react'

interface BottomNavProps {
  favouriteCount?: number
  isLoggedIn?: boolean
}

const NAV_ITEMS = [
  { href: '/', label: 'Browse', icon: LayoutGrid },
  { href: '/favourites', label: 'Favourites', icon: Star },
  { href: '/protocol', label: 'Protocol', icon: Wand2 },
  { href: '/account', label: 'Account', icon: User },
]

export default function BottomNav({ favouriteCount = 0, isLoggedIn = false }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 backdrop-blur-md md:hidden">
      <div className="flex items-stretch">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const isFavs = item.href === '/favourites'
          const isProtocol = item.href === '/protocol'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-tcvm-600' : 'text-gray-400 hover:text-tcvm-500'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {/* Dot badge for favourites */}
                {isFavs && favouriteCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-amber-400" />
                )}
                {/* Lock icon for protocol when not logged in */}
                {isProtocol && !isLoggedIn && (
                  <span className="absolute -right-1.5 -top-1 text-[8px]">🔒</span>
                )}
              </div>
              {item.label}
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-tcvm-600" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

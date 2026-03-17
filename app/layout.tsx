import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/BottomNav'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VetAcuPoints',
  description: 'TCVM Acupuncture Point Reference for Veterinary Professionals',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get favourite count for nav badge
  let favouriteCount = 0
  if (user) {
    const { count } = await supabase
      .from('favourites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
    favouriteCount = count ?? 0
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-full bg-gray-50">
        {/* Desktop header */}
        <header className="hidden md:flex sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="text-lg font-bold text-tcvm-700">VetAcuPoints</span>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="/" className="hover:text-tcvm-700 transition-colors">Browse</a>
              <a href="/favourites" className="hover:text-tcvm-700 transition-colors">Favourites</a>
              <a href="/protocol" className="hover:text-tcvm-700 transition-colors">AI Protocol</a>
              <a href="/account" className="hover:text-tcvm-700 transition-colors">
                {user ? user.email : 'Sign in'}
              </a>
            </nav>
          </div>
        </header>

        {/* Mobile top bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 md:hidden sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="text-base font-bold text-tcvm-700">VetAcuPoints</span>
          </div>
          {user && (
            <span className="text-xs text-gray-400 truncate max-w-[120px]">{user.email}</span>
          )}
        </header>

        {/* Main content with bottom padding for mobile nav */}
        <main className="pb-20 md:pb-6">
          {children}
        </main>

        <BottomNav
          favouriteCount={favouriteCount}
          isLoggedIn={!!user}
        />
      </body>
    </html>
  )
}

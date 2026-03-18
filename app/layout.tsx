import type { Metadata, Viewport } from 'next'
import { DM_Sans, Lora, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/BottomNav'

// SDVetStudio VetAI Overlap fonts
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-mono',
  display: 'swap',
  weight: ['400', '600'],
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
    <html lang="en" className={`${dmSans.variable} ${lora.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-full font-sans">

        {/* Desktop header */}
        <header className="hidden md:flex sticky top-0 z-20 border-b border-vetai-border bg-vetai-surface/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🐾</span>
              <span className="font-serif text-lg font-semibold text-vetai-primary">VetAcuPoints</span>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium text-vetai-muted">
              <a href="/" className="hover:text-vetai-primary transition-colors">Browse</a>
              <a href="/favourites" className="hover:text-vetai-primary transition-colors">Favourites</a>
              <a href="/protocol" className="hover:text-vetai-primary transition-colors">✦ AI Protocol</a>
              <a
                href="/account"
                className="rounded-btn bg-vetai-primary px-4 py-1.5 text-white text-xs font-medium hover:opacity-90 transition"
              >
                {user ? user.email : 'Sign in'}
              </a>
            </nav>
          </div>
        </header>

        {/* Mobile top bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-vetai-surface border-b border-vetai-border md:hidden sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-serif text-base font-semibold text-vetai-primary">VetAcuPoints</span>
          </div>
          {user && (
            <span className="text-xs text-vetai-muted truncate max-w-[120px]">{user.email}</span>
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

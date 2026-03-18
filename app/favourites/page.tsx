import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AcupointBrowser from '@/components/AcupointBrowser'
import { Acupoint } from '@/lib/types'

export default async function FavouritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/account?next=/favourites')
  }

  // Fetch favourited acupoints via join
  const { data: favRows } = await supabase
    .from('favourites')
    .select('acupoint_id')
    .eq('user_id', user.id)

  const favIds = favRows?.map(f => f.acupoint_id) ?? []

  if (favIds.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 px-6 text-center">
        <span className="text-5xl">⭐</span>
        <h2 className="text-lg font-serif font-semibold text-vetai-text">No favourites yet</h2>
        <p className="text-sm text-vetai-muted max-w-xs">
          Tap the star on any acupoint to save it here for quick access during treatments.
        </p>
        <a
          href="/"
          className="mt-2 rounded-btn bg-vetai-primary px-6 py-3 text-sm font-semibold text-white hover:bg-vetai-primary/90 transition"
        >
          Browse acupoints
        </a>
      </div>
    )
  }

  // Fetch full data for favourited points
  const { data: acupoints } = await supabase
    .from('acupoints')
    .select('*')
    .in('id', favIds)
    .order('id')

  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-serif font-semibold text-vetai-text">My Favourites</h1>
        <p className="text-sm text-vetai-muted">{favIds.length} saved point{favIds.length !== 1 ? 's' : ''}</p>
      </div>
      <AcupointBrowser
        acupoints={(acupoints as Acupoint[]) ?? []}
        userId={user.id}
      />
    </div>
  )
}

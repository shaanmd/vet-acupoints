import { createClient } from '@/lib/supabase/server'
import AcupointBrowser from '@/components/AcupointBrowser'
import { Acupoint } from '@/lib/types'

export default async function BrowsePage() {
  const supabase = await createClient()

  // Get session (for favourites)
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all acupoints (public read, no auth required)
  const { data: acupoints, error } = await supabase
    .from('acupoints')
    .select('*')
    .order('id')

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
        <span className="text-4xl">⚠️</span>
        <p className="text-sm text-gray-500">Failed to load acupoints. Please try again.</p>
      </div>
    )
  }

  return (
    <AcupointBrowser
      acupoints={(acupoints as Acupoint[]) ?? []}
      userId={user?.id ?? null}
    />
  )
}

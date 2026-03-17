'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useFavourites(userId: string | null) {
  const [favourites, setFavourites] = useState<string[]>([]) // array of acupoint IDs
  const [loading, setLoading] = useState(false)

  const fetchFavourites = useCallback(async () => {
    if (!userId) {
      setFavourites([])
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('favourites')
      .select('acupoint_id')
      .eq('user_id', userId)
    setFavourites(data?.map(f => f.acupoint_id) ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchFavourites()
  }, [fetchFavourites])

  // Returns true if toggled successfully, false if not logged in
  async function toggle(acupointId: string): Promise<boolean> {
    if (!userId) return false

    const supabase = createClient()
    const isFav = favourites.includes(acupointId)

    if (isFav) {
      await supabase
        .from('favourites')
        .delete()
        .eq('user_id', userId)
        .eq('acupoint_id', acupointId)
      setFavourites(prev => prev.filter(id => id !== acupointId))
    } else {
      await supabase
        .from('favourites')
        .insert({ user_id: userId, acupoint_id: acupointId })
      setFavourites(prev => [...prev, acupointId])
    }
    return true
  }

  return { favourites, toggle, loading }
}

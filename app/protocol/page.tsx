import { createClient } from '@/lib/supabase/server'
import ProtocolBuilder from '@/components/ProtocolBuilder'
import Link from 'next/link'
import { Wand2 } from 'lucide-react'

export default async function ProtocolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tcvm-100 text-2xl">
            <Wand2 className="h-7 w-7 text-tcvm-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">AI Protocol Builder</h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to describe your patient&apos;s clinical signs and get a suggested acupuncture protocol powered by Claude AI.
          </p>
          <Link
            href="/account?next=/protocol"
            className="inline-flex items-center justify-center rounded-xl bg-tcvm-600 px-6 py-3 text-sm font-semibold text-white hover:bg-tcvm-700 transition"
          >
            Sign in to use Protocol Builder
          </Link>
        </div>
      </div>
    )
  }

  return <ProtocolBuilder />
}

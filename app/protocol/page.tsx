import { createClient } from '@/lib/supabase/server'
import ProtocolBuilder from '@/components/ProtocolBuilder'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default async function ProtocolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="relative rounded-card border border-vetai-border bg-vetai-surface p-8 shadow-sm overflow-hidden">
          {/* AI gradient strip */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, #1A3A5C, #48C9A0)' }}
          />
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vetai-secondary/15">
            <Sparkles className="h-7 w-7 text-vetai-secondary" />
          </div>
          <h1 className="text-xl font-serif font-semibold text-vetai-text mb-2">✦ AI Protocol Builder</h1>
          <p className="text-sm text-vetai-muted mb-6">
            Sign in to describe your patient&apos;s clinical signs and get a suggested acupuncture protocol powered by Claude AI.
          </p>
          <Link
            href="/account?next=/protocol"
            className="inline-flex items-center justify-center rounded-btn px-6 py-3 text-sm font-semibold text-white transition"
            style={{ background: 'linear-gradient(135deg, #1A3A5C, #48C9A0)' }}
          >
            Sign in to use Protocol Builder
          </Link>
        </div>
      </div>
    )
  }

  return <ProtocolBuilder />
}

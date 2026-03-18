'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, LogOut, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  userEmail?: string | null
}

export default function AuthForm({ userEmail }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  // Logged-in state
  if (userEmail) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-vetai-secondary/15">
          <CheckCircle className="h-8 w-8 text-vetai-secondary" />
        </div>
        <div className="text-center">
          <p className="text-sm text-vetai-muted">Signed in as</p>
          <p className="mt-1 font-semibold text-vetai-text">{userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-btn border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    )
  }

  // Magic link sent state
  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-vetai-secondary/15">
          <Mail className="h-8 w-8 text-vetai-secondary" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-serif font-semibold text-vetai-text">Check your email</h3>
          <p className="mt-2 text-sm text-vetai-muted">
            We sent a login link to <span className="font-medium text-vetai-text">{email}</span>
          </p>
          <p className="mt-1 text-xs text-vetai-muted/70">Link expires in 1 hour</p>
        </div>
        <button
          onClick={() => { setSent(false); setEmail('') }}
          className="text-sm text-vetai-secondary underline underline-offset-2"
        >
          Use a different email
        </button>
      </div>
    )
  }

  // Login form
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-semibold text-vetai-text">Sign in to VetAcuPoints</h2>
        <p className="mt-2 text-sm text-vetai-muted">
          Enter your email and we&apos;ll send you a magic link — no password needed.
        </p>
      </div>

      <form onSubmit={handleSendLink} className="flex flex-col gap-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full rounded-btn border border-vetai-border bg-vetai-surface py-3 pl-10 pr-4 text-sm text-vetai-text placeholder-vetai-muted/60 outline-none transition focus:border-vetai-secondary focus:ring-2 focus:ring-vetai-secondary/20"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="flex items-center justify-center gap-2 rounded-btn bg-vetai-primary py-3 text-sm font-semibold text-white transition hover:bg-vetai-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            'Send magic link'
          )}
        </button>
      </form>

      <p className="text-center text-xs text-vetai-muted/70">
        A new account will be created automatically if you&apos;re new here.
      </p>
    </div>
  )
}

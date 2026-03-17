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
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tcvm-100">
          <CheckCircle className="h-8 w-8 text-tcvm-600" />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="mt-1 font-semibold text-gray-900">{userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
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
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tcvm-100">
          <Mail className="h-8 w-8 text-tcvm-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900">Check your email</h3>
          <p className="mt-2 text-sm text-gray-500">
            We sent a login link to <span className="font-medium text-gray-900">{email}</span>
          </p>
          <p className="mt-1 text-xs text-gray-400">Link expires in 1 hour</p>
        </div>
        <button
          onClick={() => { setSent(false); setEmail('') }}
          className="text-sm text-tcvm-600 underline underline-offset-2"
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
        <h2 className="text-2xl font-bold text-gray-900">Sign in to VetAcuPoints</h2>
        <p className="mt-2 text-sm text-gray-500">
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
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-tcvm-500 focus:ring-2 focus:ring-tcvm-200"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-tcvm-600 py-3 text-sm font-semibold text-white transition hover:bg-tcvm-700 disabled:cursor-not-allowed disabled:opacity-60"
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

      <p className="text-center text-xs text-gray-400">
        A new account will be created automatically if you&apos;re new here.
      </p>
    </div>
  )
}

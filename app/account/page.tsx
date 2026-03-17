import { createClient } from '@/lib/supabase/server'
import AuthForm from '@/components/AuthForm'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {user ? (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-tcvm-100 text-2xl">
                🐾
              </div>
              <h1 className="text-xl font-bold text-gray-900">Your Account</h1>
            </div>
            <AuthForm userEmail={user.email} />
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-tcvm-100 text-2xl">
                🐾
              </div>
            </div>
            <AuthForm />
          </>
        )}
      </div>

      {!user && (
        <div className="mt-6 rounded-xl border border-tcvm-100 bg-tcvm-50 p-4">
          <p className="text-xs text-tcvm-700 font-medium text-center">
            ✨ Sign in to save favourite acupoints and generate AI treatment protocols
          </p>
        </div>
      )}
    </div>
  )
}

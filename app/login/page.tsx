'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, ArrowRight, Lock, Phone, User } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

const inputClass =
  'w-full rounded-xl border border-gold/20 bg-gold-light/40 py-3 pl-10 pr-4 text-sm text-mahogany placeholder:text-mahogany-soft/60 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  // Where to send the customer after signing in. Set by the cart drawer
  // when an unauthenticated checkout attempt redirects here.
  const cameFromCheckout = searchParams.has('redirect')
  const redirectTarget = searchParams.get('redirect') || '/'

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('atleast 6 digits')
      return
    }
    setError(null)
    login({ phone, name: name.trim() || phone })
    router.push(redirectTarget)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-gold-light to-white px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-xl shadow-gold/10">
        <div className="border-b border-gold/15 bg-gold px-6 py-8 text-center text-white">
          <h1 className="font-serif text-2xl font-bold">Urban Bites</h1>
          <p className="mt-1 text-sm text-white/80">Sign in to your account</p>
        </div>

        <div className="p-6 sm:p-8">
          {cameFromCheckout && (
            <div className="mb-5 rounded-xl border border-gold/20 bg-gold-light px-4 py-3 text-sm text-mahogany">
              Log in to finish placing your order.
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-mahogany">Full Name</span>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mahogany-soft/60" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-mahogany">Phone Number</span>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mahogany-soft/60" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03xx-xxxxxxx"
                  className={inputClass}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-mahogany">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mahogany-soft/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className={inputClass}
                />
              </div>
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-transform hover:-translate-y-0.5 hover:bg-gold/85"
            >
              Login / Register
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-xs text-mahogany-soft">
              New here? Signing in creates your account automatically.
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

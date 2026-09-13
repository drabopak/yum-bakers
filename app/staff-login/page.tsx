'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat, Bike, Crown, User, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react'

type Role = 'chef' | 'delivery' | 'owner'

const roleConfig: Record<Role, { label: string; icon: typeof ChefHat; accent: string; user: string; key: string; dest: string }> = {
  chef: { label: 'Chef', icon: ChefHat, accent: 'bg-tangerine text-cream', user: 'chef', key: 'CHEF-1234', dest: '/chef' },
  delivery: { label: 'Delivery', icon: Bike, accent: 'bg-mahogany text-cream', user: 'delivery', key: 'DEL-1234', dest: '/delivery' },
  owner: { label: 'Owner', icon: Crown, accent: 'bg-gold text-mahogany', user: 'owner', key: 'OWNER-1234', dest: '/owner' },
}

export default function StaffLoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('chef')
  const [username, setUsername] = useState('')
  const [passkey, setPasskey] = useState('')
  const [error, setError] = useState('')

  const handleRoleChange = (r: Role) => {
    setRole(r)
    setError('')
    setUsername('')
    setPasskey('')
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const cfg = roleConfig[role]
    if (username.trim() !== cfg.user || passkey.trim() !== cfg.key) {
      setError('invalid key')
      return
    }
    router.push(cfg.dest)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl font-bold text-mahogany font-serif soft-shadow">Y</span>
          <h1 className="mt-4 font-serif text-2xl font-bold text-mahogany">Staff Login</h1>
          <p className="mt-1 text-sm text-mahogany-soft">Sign in to your dashboard</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 soft-shadow-lg sm:p-8">
          <div className="mb-6 grid grid-cols-3 gap-2">
            {(Object.keys(roleConfig) as Role[]).map((r) => {
              const cfg = roleConfig[r]
              const Icon = cfg.icon
              const isActive = role === r
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-all ${
                    isActive
                      ? `${cfg.accent} border-transparent soft-shadow`
                      : 'border-border bg-cream text-mahogany-soft hover:border-gold hover:text-mahogany'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {cfg.label}
                </button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-mahogany">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mahogany-soft" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`Enter username (${role})`}
                  className="w-full rounded-xl border border-border bg-cream pl-10 pr-4 py-3 text-sm text-mahogany placeholder:text-mahogany-soft/60 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-mahogany">Passkey</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mahogany-soft" />
                <input
                  type="text"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter passkey"
                  className="w-full rounded-xl border border-border bg-cream pl-10 pr-4 py-3 text-sm text-mahogany placeholder:text-mahogany-soft/60 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-tangerine/10 px-4 py-2.5 text-sm font-semibold text-tangerine">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tangerine px-6 py-3.5 text-sm font-semibold text-cream shadow-[0_14px_30px_rgba(228,87,46,0.3)] transition-transform hover:-translate-y-0.5"
            >
              Sign In as {roleConfig[role].label}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-mahogany-soft transition-colors hover:text-tangerine">
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </a>
            <span className="text-border">|</span>
            <a href="/login" className="text-sm font-medium text-mahogany-soft transition-colors hover:text-tangerine">
              Customer Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

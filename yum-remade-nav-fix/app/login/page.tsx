'use client'

import { Suspense, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChefHat, Truck, ShieldCheck, User, AlertCircle, ArrowRight } from 'lucide-react'
import { setStaffRole } from '@/lib/session'
import { useAuth } from '@/context/auth-context'

type Role = 'customer' | 'chef' | 'delivery' | 'owner'
type StaffRoleId = 'chef' | 'delivery' | 'owner'

const ROLE_TABS: { id: Role; label: string; icon: typeof User }[] = [
  { id: 'customer', label: 'Customer', icon: User },
  { id: 'chef', label: 'Chef', icon: ChefHat },
  { id: 'delivery', label: 'Delivery', icon: Truck },
  { id: 'owner', label: 'Owner', icon: ShieldCheck },
]

const STAFF_USERNAMES: Record<StaffRoleId, string> = {
  chef: 'chef',
  delivery: 'delivery',
  owner: 'owner',
}

const STAFF_PASSKEYS: Record<StaffRoleId, string> = {
  chef: 'CHEF-1234',
  delivery: 'DEL-1234',
  owner: 'OWNER-1234',
}

const STAFF_ROUTES: Record<StaffRoleId, string> = {
  chef: '/chef',
  delivery: '/delivery',
  owner: '/owner',
}

const inputClass =
  'w-full rounded-xl border border-amber-200 bg-amber-50/40 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-200'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      {children}
    </label>
  )
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-transform hover:-translate-y-0.5 hover:bg-red-700"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  // Where to send the customer after signing in. Set by the cart drawer
  // when an unauthenticated checkout attempt redirects here.
  const cameFromCheckout = searchParams.has('redirect')
  const redirectTarget = searchParams.get('redirect') || '/'

  const [activeRole, setActiveRole] = useState<Role>('customer')
  const [error, setError] = useState<string | null>(null)

  // Customer fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // Staff fields (shared shape across chef/delivery/owner tabs)
  const [username, setUsername] = useState('')
  const [passkey, setPasskey] = useState('')

  const switchRole = (role: Role) => {
    setActiveRole(role)
    setError(null)
    setUsername('')
    setPasskey('')
  }

  const handleCustomerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('atleast 6 digits')
      return
    }
    setError(null)
    login({ phone, name: name.trim() || phone })
    router.push(redirectTarget)
  }

  const handleStaffSubmit = (role: StaffRoleId) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username.trim() !== STAFF_USERNAMES[role] || passkey.trim() !== STAFF_PASSKEYS[role]) {
      setError('invalid key')
      return
    }
    setError(null)
    setStaffRole(role)
    router.push(STAFF_ROUTES[role])
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-xl shadow-amber-900/5">
        <div className="border-b border-amber-100 bg-gradient-to-r from-amber-500 to-red-500 px-6 py-6 text-center text-white">
          <h1 className="font-serif text-2xl font-bold">Yum Bakers &amp; Sweets</h1>
          <p className="mt-1 text-sm text-amber-50">Sign in to continue</p>
        </div>

        {/* Role tabs */}
        <div className="grid grid-cols-4 gap-1 border-b border-amber-100 bg-amber-50/60 p-2">
          {ROLE_TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeRole === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchRole(id)}
                aria-pressed={isActive}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors ${
                  isActive ? 'bg-red-600 text-white shadow-sm' : 'text-amber-700 hover:bg-amber-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </div>

        <div className="p-6 sm:p-8">
          {cameFromCheckout && activeRole === 'customer' && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Log in to finish placing your order.
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {activeRole === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="flex flex-col gap-4">
              <Field label="Full Name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </Field>
              <Field label="Phone Number">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03xx-xxxxxxx"
                  className={inputClass}
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className={inputClass}
                />
              </Field>
              <SubmitButton label="Login / Register" />
              <p className="text-center text-xs text-stone-500">
                New here? Signing in creates your account automatically.
              </p>
            </form>
          )}

          {(activeRole === 'chef' || activeRole === 'delivery' || activeRole === 'owner') && (
            <form onSubmit={handleStaffSubmit(activeRole)} className="flex flex-col gap-4">
              <Field label="Username">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={STAFF_USERNAMES[activeRole]}
                  className={inputClass}
                />
              </Field>
              <Field label="Passkey">
                <input
                  type="password"
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="XXXX-1234"
                  className={inputClass}
                />
              </Field>
              <SubmitButton
                label={`Enter ${activeRole.charAt(0).toUpperCase()}${activeRole.slice(1)} Dashboard`}
              />
            </form>
          )}
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

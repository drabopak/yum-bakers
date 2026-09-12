'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  LogIn,
  LogOut,
  User as UserIcon,
  Menu as MenuIcon,
  X as CloseIcon,
  ChevronDown,
  ChefHat,
  Truck,
  ShieldCheck,
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import { useAuth } from '@/context/auth-context'
import { getStaffRole, clearStaffRole, type StaffRole } from '@/lib/session'

const NAV_LINKS = [
  { href: '#menu', label: 'Menu' },
  { href: '#portal', label: 'Portal Access' },
  { href: '#inquiry', label: 'Event Planning' },
  { href: '#branches', label: 'Branches' },
]

const STAFF_DASHBOARD: Record<StaffRole, { href: string; label: string; icon: typeof ChefHat }> = {
  chef: { href: '/chef', label: 'Chef Dashboard', icon: ChefHat },
  delivery: { href: '/delivery', label: 'Delivery Dashboard', icon: Truck },
  owner: { href: '/owner', label: 'Owner Dashboard', icon: ShieldCheck },
}

// Direct testing/QA shortcuts to every role entry point, regardless of
// current auth state — always visible so any role can be reached in one
// or two clicks without knowing a URL by heart.
const ROLE_QUICK_LINKS = [
  { href: '/login', label: 'Login (All Roles)', icon: LogIn },
  { href: '/chef', label: 'Chef KDS Dashboard', icon: ChefHat },
  { href: '/delivery', label: 'Delivery Dispatch', icon: Truck },
  { href: '/owner', label: 'Owner Command Center', icon: ShieldCheck },
]

export function Navbar() {
  const { count, bump, openCart } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  // Staff sessions live in sessionStorage (see lib/session.ts), not React
  // context, so we read it once on mount to decide whether to surface a
  // dashboard shortcut for the signed-in role.
  const [staffRole, setLocalStaffRole] = useState<StaffRole | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const roleMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalStaffRole(getStaffRole())
  }, [])

  // Close the role-access dropdown when clicking anywhere outside it.
  useEffect(() => {
    if (!roleMenuOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [roleMenuOpen])

  const dashboard = staffRole ? STAFF_DASHBOARD[staffRole] : null

  const handleStaffSignOut = () => {
    clearStaffRole()
    setLocalStaffRole(null)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-lg font-bold text-mahogany shadow-[0_6px_16px_rgba(224,159,62,0.4)] font-serif">
            Y
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-serif text-lg font-bold text-mahogany">
              Yum Bakers &amp; Sweets
            </span>
            <span className="block text-[11px] font-medium tracking-wide text-mahogany-soft">
              Since 1998 — Pure for Sure
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-mahogany md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-tangerine">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right-side actions: always visible at every breakpoint. */}
        <div className="flex items-center gap-2">
          {/* Staff / Role Login split button: the label always routes
              straight to /login; the caret opens quick-access shortcuts to
              every role dashboard, for easy testing regardless of who (if
              anyone) is currently signed in. */}
          <div ref={roleMenuRef} className="relative hidden md:flex">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-l-full border border-r-0 border-mahogany/25 bg-mahogany/5 px-3.5 py-2 text-xs font-semibold text-mahogany transition-colors hover:bg-mahogany/10"
            >
              <ShieldCheck className="h-4 w-4" />
              Staff / Role Login
            </Link>
            <button
              type="button"
              onClick={() => setRoleMenuOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={roleMenuOpen}
              aria-label="Quick role access"
              className="flex items-center rounded-r-full border border-mahogany/25 bg-mahogany/5 px-2 text-mahogany transition-colors hover:bg-mahogany/10"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-card p-1.5 soft-shadow-lg">
                <p className="px-3 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wide text-mahogany-soft">
                  Quick Role Access
                </p>
                {ROLE_QUICK_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setRoleMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-mahogany transition-colors hover:bg-gold/10"
                  >
                    <item.icon className="h-4 w-4 text-gold" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {dashboard && (
            <Link
              href={dashboard.href}
              className="hidden items-center gap-1.5 rounded-full border border-gold/50 bg-gold-soft/40 px-3 py-1.5 text-xs font-semibold text-mahogany transition-colors hover:bg-gold-soft/70 lg:flex"
            >
              <dashboard.icon className="h-3.5 w-3.5" />
              {dashboard.label}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <span
                title={user?.phone}
                className="flex items-center gap-1.5 rounded-full bg-gold-soft/50 px-3 py-2 text-xs font-semibold text-mahogany"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name || user?.phone}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                title="Logout"
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-mahogany-soft transition-colors hover:border-tangerine hover:text-tangerine"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : staffRole ? (
            <button
              type="button"
              onClick={handleStaffSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-mahogany-soft transition-colors hover:border-tangerine hover:text-tangerine"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link
              href="/login"
              aria-label="Login or Register"
              className="flex items-center gap-2 rounded-full bg-tangerine px-3.5 py-2.5 text-sm font-semibold text-cream shadow-[0_10px_20px_rgba(228,87,46,0.3)] transition-transform hover:-translate-y-0.5 sm:px-4"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login / Register</span>
            </Link>
          )}

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            className="relative flex items-center gap-2 rounded-full bg-mahogany px-3.5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-105 sm:px-4"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={2} />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span
                key={bump}
                className="cart-bump absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-tangerine px-1.5 text-xs font-bold text-cream ring-2 ring-cream"
              >
                {count}
              </span>
            )}
          </button>

          {/* Mobile menu toggle — holds the plain scroll-nav links plus the
              full Staff/Role Access list (the split-button above is desktop
              only); Login/Profile/Cart stay visible regardless of screen
              size. */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-mahogany transition-colors hover:border-gold hover:bg-gold/10 md:hidden"
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/70 bg-cream px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1 text-sm font-medium text-mahogany">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 transition-colors hover:bg-gold/10"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-3 border-t border-border/70 pt-3">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-mahogany-soft">
              Staff / Role Access
            </p>
            <div className="flex flex-col gap-1">
              {ROLE_QUICK_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-mahogany transition-colors hover:bg-gold/10"
                >
                  <item.icon className="h-4 w-4 text-gold" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

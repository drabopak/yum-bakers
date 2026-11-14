'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, LogIn, LogOut, User as UserIcon, Menu as MenuIcon, X as CloseIcon } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import { useAuth } from '@/context/auth-context'

const NAV_LINKS = [
  { href: '#menu', label: 'Menu' },
  { href: '#branches', label: 'Branches' },
]

export function Navbar() {
  const { count, bump, openCart } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-lg font-bold text-white shadow-[0_6px_16px_rgba(201,162,39,0.4)] font-serif">
            U
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-serif text-lg font-bold text-mahogany">
              Urban Bites
            </span>
            <span className="block text-[11px] font-medium tracking-wide text-mahogany-soft">
              Meet Royal Taste
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-mahogany md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-gold">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right-side actions: always visible at every breakpoint. Customer
            login/profile only — staff sign-in lives at the unlinked
            /staff-login page (see the footer), never here. */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <span
                title={user?.phone}
                className="flex items-center gap-1.5 rounded-full bg-gold-soft/40 px-3 py-2 text-xs font-semibold text-mahogany"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name || user?.phone}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                title="Logout"
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-mahogany-soft transition-colors hover:border-gold hover:text-gold"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              aria-label="Login or Register"
              className="flex items-center gap-2 rounded-full bg-gold px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(201,162,39,0.3)] transition-transform hover:-translate-y-0.5 sm:px-4"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login / Register</span>
            </Link>
          )}

          <button
            type="button"
            data-cart-target
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            className="relative flex items-center gap-2 rounded-full bg-mahogany px-3.5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 sm:px-4"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={2} />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span
                key={bump}
                className="cart-bump absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-bold text-white ring-2 ring-white"
              >
                {count}
              </span>
            )}
          </button>

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
        <div className="border-t border-gold/15 bg-white px-4 py-3 md:hidden">
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
        </div>
      )}
    </header>
  )
}

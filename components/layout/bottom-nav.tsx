'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, Radar, User } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import { useAuth } from '@/context/auth-context'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '#cart', label: 'Cart', icon: ShoppingBag, isCart: true },
  { href: '/order-status', label: 'Track', icon: Radar },
  { href: '/login', label: 'Login', icon: User, isAuth: true },
]

export function BottomNav() {
  const pathname = usePathname()
  const { count, bump, openCart } = useCart()
  const { isAuthenticated } = useAuth()

  return (
    <nav
      className="glass fixed bottom-0 left-0 right-0 z-40 border-t border-gold/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isHome = item.href === '/'
          const isTrack = item.href === '/order-status'
          const isLogin = item.isAuth

          const isActive =
            (isHome && pathname === '/') ||
            (isTrack && pathname === '/order-status')

          if (item.isCart) {
            return (
              <button
                key="cart"
                type="button"
                data-cart-target
                onClick={openCart}
                aria-label={`Open cart, ${count} items`}
                className="ios-press relative flex flex-col items-center gap-0.5 rounded-2xl px-5 py-1.5"
              >
                <span className="relative">
                  <Icon
                    className="h-6 w-6 text-mahogany"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {count > 0 && (
                    <span
                      key={bump}
                      className="cart-bump absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-bold text-white ring-2 ring-white"
                    >
                      {count}
                    </span>
                  )}
                </span>
                <span className="text-[0.6rem] font-semibold text-mahogany-soft">Cart</span>
              </button>
            )
          }

          const linkHref = isLogin
            ? isAuthenticated
              ? '/login'
              : '/login'
            : item.href

          const showActive = isLogin ? isAuthenticated : isActive

          return (
            <Link
              key={item.label}
              href={linkHref}
              aria-label={item.label}
              className={`ios-press flex flex-col items-center gap-0.5 rounded-2xl px-5 py-1.5 transition-colors ${
                showActive ? 'text-gold' : 'text-mahogany-soft'
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={showActive ? 2.5 : 2} />
              <span className={`text-[0.6rem] font-semibold ${showActive ? 'text-gold' : 'text-mahogany-soft'}`}>
                {isLogin ? (isAuthenticated ? 'Profile' : 'Login') : item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

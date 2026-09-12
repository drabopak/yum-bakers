import Link from 'next/link'
import { LogIn, ChefHat, Truck, ShieldCheck, ArrowRight, type LucideIcon } from 'lucide-react'

const PORTALS: {
  href: string
  title: string
  description: string
  icon: LucideIcon
  cta: string
}[] = [
  {
    href: '/login',
    title: 'Customer Login / Checkout',
    description:
      'Sign in to place an order, track it, and pick up right where you left off in your cart.',
    icon: LogIn,
    cta: 'Go to Login',
  },
  {
    href: '/chef',
    title: 'Chef KDS Dashboard',
    description: 'Live kitchen display for every order moving from Pending through Ready.',
    icon: ChefHat,
    cta: 'Open Chef Dashboard',
  },
  {
    href: '/delivery',
    title: 'Delivery Dispatch Portal',
    description: 'Pick up ready orders and confirm cash-on-delivery handoffs on the road.',
    icon: Truck,
    cta: 'Open Delivery Portal',
  },
  {
    href: '/owner',
    title: 'Owner Command Center',
    description: 'Revenue, active orders, staff passkeys and the full order audit log, in one view.',
    icon: ShieldCheck,
    cta: 'Open Owner Center',
  },
]

export function PortalAccessSection() {
  return (
    <section id="portal" className="scroll-mt-20 bg-gold-soft/25 px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Portal Access
          </span>
          <h2 className="mt-3 text-balance font-serif text-3xl font-extrabold text-mahogany sm:text-4xl">
            Every login, one tap away
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-mahogany-soft">
            Whether you&apos;re a customer or part of the YUM team, jump straight to your portal.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PORTALS.map((portal) => (
            <Link
              key={portal.href}
              href={portal.href}
              className="group flex flex-col rounded-3xl border border-border bg-card p-6 soft-shadow transition-transform hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold transition-colors group-hover:bg-tangerine group-hover:text-cream">
                <portal.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold text-mahogany">{portal.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mahogany-soft">
                {portal.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-tangerine">
                {portal.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChefHat, Truck, PackageCheck, Clock, Home, CheckCircle2, Bike } from 'lucide-react'
import { useOrderStore, type Order, type OrderStatus } from '@/data/order-store'
import { useAuth } from '@/context/auth-context'
import { formatRs } from '@/components/cart/cart-context'
import { ConnectionBadge } from '@/components/ui/connection-badge'
import { OrderBackgroundVideo, type BackgroundVideo } from '@/components/order/order-background-video'

const STEPS: {
  status: OrderStatus
  title: string
  description: string
  icon: typeof Clock
  video: BackgroundVideo
  phrases: string[]
}[] = [
  {
    status: 'Pending',
    title: 'Waiting for chef',
    description: 'Your order has been received and is in the kitchen queue.',
    icon: Clock,
    video: 'waiting',
    phrases: ['Your order is in the kitchen queue', 'Good things take a little time', 'Hang tight, we have got you'],
  },
  {
    status: 'Preparing',
    title: 'Your food is being prepared',
    description: 'Our chefs are cooking your order fresh, right now.',
    icon: ChefHat,
    video: 'chef',
    phrases: ['Our chefs are cooking your order fresh', 'Every item is made to order', 'Straight from the grill and fryer'],
  },
  {
    status: 'Ready',
    title: 'Waiting for delivery man',
    description: 'Your order is packed and ready — a rider will pick it up shortly.',
    icon: PackageCheck,
    video: 'waiting',
    phrases: ['Packed and ready for pickup', 'A rider will be with you shortly'],
  },
  {
    status: 'Out for Delivery',
    title: 'Food being delivered',
    description: 'Your rider is on the way to you.',
    icon: Truck,
    video: 'delivery',
    phrases: ['Your rider is on the way', 'Almost there, keep your appetite ready'],
  },
  {
    status: 'Delivered',
    title: 'Rider is waiting for you / Delivered',
    description: 'Enjoy! Thanks for ordering from Urban Bites.',
    icon: Bike,
    video: 'delivery',
    phrases: ['Enjoy your meal', 'Thank you for choosing Urban Bites'],
  },
]

const STATUS_ORDER: OrderStatus[] = STEPS.map((step) => step.status)

function CyclingPhrase({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % phrases.length), 3200)
    return () => window.clearInterval(timer)
  }, [phrases])

  return (
    <p key={index} className="phrase-fade font-serif text-lg italic text-gold sm:text-xl">
      {phrases[index]}
    </p>
  )
}

function OrderStatusContent() {
  const searchParams = useSearchParams()
  const { orders, connectionStatus } = useOrderStore()
  const { user } = useAuth()

  const idParam = searchParams.get('id')

  let order: Order | undefined
  if (idParam) {
    order = orders.find((o) => o.id === idParam)
  } else if (user?.phone) {
    order = [...orders]
      .filter((o) => o.customerPhone === user.phone)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
  }

  if (!order) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0b0b0c] px-4 text-center text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <PackageCheck className="mx-auto h-12 w-12 text-gold" />
          <h1 className="mt-4 font-serif text-xl font-bold">No active order</h1>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            We couldn&apos;t find an order to track. Place an order from the menu to see its live
            status here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#0b0b0c] transition-transform hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Back to Menu
          </Link>
        </div>
      </main>
    )
  }

  const currentIndex = STATUS_ORDER.indexOf(order.status)
  const currentStep = STEPS[currentIndex]

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-8 text-white sm:px-8">
      <OrderBackgroundVideo video={currentStep.video} />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-gold"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <ConnectionBadge status={connectionStatus} />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/55 p-6 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-gold">
              Order {order.id}
            </span>
            <h1 className="mt-4 font-serif text-2xl font-black uppercase sm:text-3xl">
              {order.status === 'Delivered' ? 'Order Delivered!' : 'Tracking Your Order'}
            </h1>
            <div className="mt-3 min-h-[1.75rem]">
              <CyclingPhrase key={order.status} phrases={currentStep.phrases} />
            </div>
            <p className="mt-2 text-sm text-white/60">
              Placed at{' '}
              {new Date(order.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' · '}
              {formatRs(order.totalAmount)}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-0">
            {STEPS.map((step, index) => {
              const isComplete = index < currentIndex
              const isActive = index === currentIndex
              const isUpcoming = index > currentIndex
              const Icon = step.icon
              const isLast = index === STEPS.length - 1

              return (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isComplete
                          ? 'border-emerald-400 bg-emerald-500 text-white'
                          : isActive
                            ? 'animate-pulse border-gold bg-gold text-[#0b0b0c]'
                            : 'border-white/20 bg-white/5 text-white/40'
                      }`}
                    >
                      {isComplete ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                    </span>
                    {!isLast && (
                      <span
                        className={`w-0.5 flex-1 ${isComplete ? 'bg-emerald-400' : 'bg-white/15'}`}
                        style={{ minHeight: '2.5rem' }}
                      />
                    )}
                  </div>
                  <div className={isLast ? 'pb-0' : 'pb-10'}>
                    <h3
                      className={`font-serif text-lg font-bold ${
                        isActive ? 'text-gold' : isComplete ? 'text-emerald-300' : 'text-white/50'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className={`mt-1 text-sm ${isUpcoming ? 'text-white/45' : 'text-white/80'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">Delivery Address</p>
            <p className="mt-1 text-sm text-white/85">{order.address}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Order Items</p>
            <ul className="mt-2 flex flex-col gap-1">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-white/85">
                  <span>
                    <span className="font-semibold">{item.quantity}×</span> {item.name}
                  </span>
                  <span>{formatRs(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={null}>
      <OrderStatusContent />
    </Suspense>
  )
}

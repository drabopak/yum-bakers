'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChefHat, Truck, PackageCheck, Clock, Home, CheckCircle2, Bike } from 'lucide-react'
import { useOrderStore, type Order, type OrderStatus } from '@/data/order-store'
import { useAuth } from '@/context/auth-context'
import { formatRs } from '@/components/cart/cart-context'
import { ConnectionBadge } from '@/components/ui/connection-badge'

const STEPS: {
  status: OrderStatus
  title: string
  description: string
  icon: typeof Clock
  eta: string
}[] = [
  {
    status: 'Pending',
    title: 'Order Received',
    description: 'Your order is in the kitchen queue.',
    icon: Clock,
    eta: '~25 min',
  },
  {
    status: 'Preparing',
    title: 'Being Prepared',
    description: 'Our chefs are cooking your order fresh.',
    icon: ChefHat,
    eta: '~18 min',
  },
  {
    status: 'Ready',
    title: 'Ready for Pickup',
    description: 'Packed and ready — a rider will pick it up shortly.',
    icon: PackageCheck,
    eta: '~10 min',
  },
  {
    status: 'Out for Delivery',
    title: 'On the Way',
    description: 'Your rider is heading to you now.',
    icon: Truck,
    eta: '~5 min',
  },
  {
    status: 'Delivered',
    title: 'Delivered',
    description: 'Enjoy! Thanks for ordering from Urban Bites.',
    icon: Bike,
    eta: 'Complete',
  },
]

const STATUS_ORDER: OrderStatus[] = STEPS.map((step) => step.status)

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pb-24 text-center text-mahogany">
        <div className="ios-shadow rounded-3xl border border-border bg-white p-8">
          <PackageCheck className="mx-auto h-12 w-12 text-gold" />
          <h1 className="mt-4 font-serif text-xl font-bold">No active order</h1>
          <p className="mt-2 max-w-sm text-sm text-mahogany-soft">
            We couldn&apos;t find an order to track. Place an order from the menu to see its live
            status here.
          </p>
          <Link
            href="/"
            className="ios-press mt-6 inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-2.5 text-sm font-semibold text-white ios-shadow-gold"
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
    <main className="min-h-screen bg-background px-4 py-6 pb-28 text-mahogany">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="ios-press inline-flex items-center gap-2 text-sm font-semibold text-mahogany-soft transition-colors hover:text-gold"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ConnectionBadge status={connectionStatus} />
        </div>

        <div className="ios-shadow mt-5 rounded-3xl border border-border bg-white p-6 sm:p-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-gold">
              Order {order.id}
            </span>
            <h1 className="mt-4 font-serif text-2xl font-black text-mahogany">
              {order.status === 'Delivered' ? 'Order Delivered!' : 'Tracking Your Order'}
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-gold-light/60 px-4 py-2">
              <Clock className="h-4 w-4 text-gold" />
              <span className="text-sm font-semibold text-gold">ETA: {currentStep.eta}</span>
            </div>
            <p className="mt-3 text-sm text-mahogany-soft">
              Placed at{' '}
              {new Date(order.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' · '}
              {formatRs(order.totalAmount)}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-8 flex items-center gap-1">
            {STEPS.map((step, index) => (
              <div
                key={step.status}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  index <= currentIndex ? 'bg-gold' : 'bg-mahogany/10'
                }`}
              />
            ))}
          </div>

          {/* Steps */}
          <div className="mt-8 flex flex-col gap-0">
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
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                        isComplete
                          ? 'border-emerald-400 bg-emerald-500 text-white'
                          : isActive
                            ? 'border-gold bg-gold text-white ios-shadow-gold'
                            : 'border-border bg-white text-mahogany-soft'
                      }`}
                    >
                      {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </span>
                    {!isLast && (
                      <span
                        className={`w-0.5 flex-1 rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-border'}`}
                        style={{ minHeight: '2rem' }}
                      />
                    )}
                  </div>
                  <div className={isLast ? 'pb-0' : 'pb-8'}>
                    <h3
                      className={`font-serif text-base font-bold ${
                        isActive ? 'text-gold' : isComplete ? 'text-emerald-600' : 'text-mahogany-soft'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className={`mt-0.5 text-sm ${isUpcoming ? 'text-mahogany-soft/60' : 'text-mahogany'}`}>
                      {step.description}
                    </p>
                    {!isUpcoming && (
                      <span className="mt-1 inline-block text-xs font-semibold text-gold/70">
                        {step.eta}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Delivery address */}
          <div className="mt-6 rounded-2xl border border-border bg-gold-light/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">Delivery Address</p>
            <p className="mt-1 text-sm text-mahogany">{order.address}</p>
          </div>

          {/* Order items */}
          <div className="mt-3 rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-mahogany-soft">Order Items</p>
            <ul className="mt-2 flex flex-col gap-1">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-mahogany">
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

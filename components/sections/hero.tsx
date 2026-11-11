'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { hasSeenIntro, INTRO_DONE_EVENT } from '@/lib/intro'

const BURGER_IMAGE =
  'https://images.pexels.com/photos/23910856/pexels-photo-23910856.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

export function Hero() {
  const [ready, setReady] = useState(false)
  const burgerFadeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasSeenIntro()) setReady(true)
    const onIntroDone = () => setReady(true)
    window.addEventListener(INTRO_DONE_EVENT, onIntroDone)
    return () => window.removeEventListener(INTRO_DONE_EVENT, onIntroDone)
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const burger = burgerFadeRef.current
      if (!burger) return
      const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.8), 0), 1)
      burger.style.opacity = String(1 - progress)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0b0b0c] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 60% at 75% 45%, rgba(224,159,62,0.22), transparent 65%), radial-gradient(40% 40% at 10% 100%, rgba(228,87,46,0.14), transparent 60%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 lg:gap-16">
        <div
          ref={burgerFadeRef}
          className="relative order-1 mx-auto w-full max-w-[min(88vw,520px)] md:order-2"
          style={{ perspective: '1400px' }}
        >
          <div className={ready ? 'burger-roll' : 'opacity-0'}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BURGER_IMAGE}
              alt="Signature gourmet burger"
              className="aspect-square w-full rounded-full object-cover shadow-[0_40px_80px_rgba(0,0,0,0.6)] ring-1 ring-gold/30"
            />
          </div>
        </div>

        <div className="order-2 text-center md:order-1 md:text-left">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.35em] text-gold ${
              ready ? 'tagline-snap' : 'opacity-0'
            }`}
          >
            Urban Bites
          </p>
          <h1 className="mt-5 font-serif text-[2.6rem] font-black uppercase leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            <span className={`block text-white ${ready ? 'tagline-snap' : 'opacity-0'}`}>
              Where Street Hustle
            </span>
            <span
              className={`gold-shine block ${ready ? 'tagline-snap' : 'opacity-0'}`}
              style={{ animationDelay: '0.25s' }}
            >
              Meet Royal Taste
            </span>
          </h1>
          <p
            className={`mx-auto mt-6 max-w-md text-pretty text-base leading-relaxed text-white/70 md:mx-0 sm:text-lg ${
              ready ? 'tagline-snap' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.45s' }}
          >
            Smash burgers, stacked pizzas and crispy fried chicken, crafted for the bold and
            served fast.
          </p>
          <a
            href="#menu"
            className={`mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-[#0b0b0c] shadow-[0_14px_30px_rgba(224,159,62,0.35)] transition-transform hover:-translate-y-0.5 hover:scale-[1.03] ${
              ready ? 'tagline-snap' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.6s' }}
          >
            Explore the Menu
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

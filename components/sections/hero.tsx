'use client'

import { ChevronDown } from 'lucide-react'

const DEAL_IMAGE =
  'https://images.pexels.com/photos/32524109/pexels-photo-32524109.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

export function Hero() {
  return (
    <section
      id="top"
      className="relative px-4 pt-6 pb-2"
    >
      <div className="ios-fade-up relative overflow-hidden rounded-3xl ios-shadow-gold">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl sm:aspect-[16/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEAL_IMAGE}
            alt="Urban Family Deal"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <div className="max-w-md">
            <span className="inline-block rounded-full bg-gold/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              Family Deal
            </span>
            <h1 className="mt-3 font-serif text-3xl font-black uppercase leading-[1.05] text-white sm:text-5xl">
              <span className="block">Where Street Hustle</span>
              <span className="gold-shine block">Meet Royal Taste</span>
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80 sm:text-base">
              Burgers, fries, wings and drinks for the whole table. From Rs. 2,850.
            </p>
            <a
              href="#menu"
              className="ios-press mt-5 inline-flex items-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gold/30"
            >
              Explore the Menu
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

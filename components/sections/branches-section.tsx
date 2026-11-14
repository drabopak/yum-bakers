'use client'

import { MapPin, Phone } from 'lucide-react'
import { branches } from '@/data/yum-data'

export function BranchesSection() {
  return (
    <section id="contact" className="px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold">
            Contact Us
          </span>
          <h2 className="mt-2 text-balance font-serif text-2xl font-black text-mahogany sm:text-3xl">
            Seven branches, one promise
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mahogany-soft">
            Tap any branch to call and place your order directly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <div
              key={branch.name}
              className="ios-shadow ios-press flex flex-col rounded-3xl border border-border bg-white p-5 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-mahogany">{branch.name}</h3>
                  <p className="mt-0.5 text-sm text-mahogany-soft">{branch.address}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {branch.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="ios-press inline-flex items-center gap-2 rounded-full bg-mahogany px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold"
                  >
                    <Phone className="h-4 w-4" />
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

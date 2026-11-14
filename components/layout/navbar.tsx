'use client'

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 glass border-b border-gold/10">
      <div className="mx-auto flex max-w-md items-center justify-center px-4 py-3">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gold text-base font-bold text-white shadow-[0_4px_12px_rgba(201,162,39,0.4)] font-serif">
            U
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-base font-bold text-mahogany">
              Urban Bites
            </span>
            <span className="block text-[10px] font-medium tracking-wide text-mahogany-soft">
              Meet Royal Taste
            </span>
          </span>
        </a>
      </div>
    </header>
  )
}

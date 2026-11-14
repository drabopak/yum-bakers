export function SiteFooter() {
  return (
    <footer className="bg-white border-t-2 border-gold text-mahogany">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl font-bold text-white font-serif">
            U
          </span>
          <h3 className="font-serif text-2xl font-bold">Urban Bites</h3>
          <p className="max-w-md text-sm leading-relaxed text-mahogany-soft">
            Where street hustle meets royal taste. Burgers, wood-fired pizzas, crispy fried chicken and fresh mithai, served fast.
          </p>
          <nav className="mt-2 flex flex-wrap justify-center gap-6 text-sm font-medium">
            <a href="#menu" className="text-mahogany-soft transition-colors hover:text-gold">
              Menu
            </a>
            <a href="#branches" className="text-mahogany-soft transition-colors hover:text-gold">
              Branches
            </a>
          </nav>
        </div>
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-gold/15 pt-6 text-center text-xs text-mahogany-soft">
          <span>© {new Date().getFullYear()} Urban Bites. All rights reserved.</span>
          <a href="/staff-login" className="text-mahogany-soft/50 transition-colors hover:text-mahogany-soft">
            Staff Portal
          </a>
        </div>
      </div>
    </footer>
  )
}

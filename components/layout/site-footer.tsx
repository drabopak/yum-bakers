export function SiteFooter() {
  return (
    <footer className="border-t border-gold/10 bg-white px-4 py-8">
      <div className="mx-auto max-w-md text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-xl font-bold text-white font-serif mx-auto">
          U
        </span>
        <h3 className="mt-3 font-serif text-xl font-bold text-mahogany">Urban Bites</h3>
        <p className="mt-2 text-sm leading-relaxed text-mahogany-soft">
          Where street hustle meets royal taste. Burgers, wood-fired pizzas, crispy fried chicken, served fast.
        </p>
        <div className="mt-6 flex flex-col items-center gap-2 border-t border-gold/10 pt-4 text-xs text-mahogany-soft">
          <span>&copy; {new Date().getFullYear()} Urban Bites. All rights reserved.</span>
          <a href="/staff-login" className="text-mahogany-soft/50 transition-colors hover:text-mahogany-soft">
            Staff Portal
          </a>
        </div>
      </div>
    </footer>
  )
}

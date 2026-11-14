import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/sections/hero'
import { MenuSection } from '@/components/sections/menu-section'
import { BranchesSection } from '@/components/sections/branches-section'
import { SiteFooter } from '@/components/layout/site-footer'
import { ReviewsSection } from '@/components/sections/reviews-section'

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="ambient-glow" aria-hidden="true" />
      <main className="relative z-10 pb-24">
        <Hero />
        <MenuSection />
        <ReviewsSection />
        <BranchesSection />
      </main>
      <SiteFooter />
    </>
  )
}

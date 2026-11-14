import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/sections/hero'
import { MenuSection } from '@/components/sections/menu-section'
import { BranchesSection } from '@/components/sections/branches-section'
import { SiteFooter } from '@/components/layout/site-footer'
import { IntroVideo } from '@/components/intro/intro-video'
import { ReviewsSection } from '@/components/sections/reviews-section'

export default function Page() {
  return (
    <>
      <IntroVideo />
      <Navbar />
      <main>
        <Hero />
        <MenuSection />
        <ReviewsSection />
        <BranchesSection />
      </main>
      <SiteFooter />
    </>
  )
}

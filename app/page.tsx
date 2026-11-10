import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/sections/hero'
import { MenuSection } from '@/components/sections/menu-section'
import { BranchesSection } from '@/components/sections/branches-section'
import { SiteFooter } from '@/components/layout/site-footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MenuSection />
        <BranchesSection />
      </main>
      <SiteFooter />
    </>
  )
}

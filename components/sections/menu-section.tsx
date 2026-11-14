'use client'

import { useRef, useState } from 'react'
import { Check, ChevronRight, Flame, Gift, Hamburger, Pizza, Sandwich, Soup, Utensils } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MenuItem } from '@/data/yum-data'
import { useCart, formatRs } from '@/components/cart/cart-context'
import { flyToCart } from '@/components/cart/fly-to-cart'
import { playAdd, playTick } from '@/lib/sounds'

type DashboardCategory = {
  id: string
  label: string
  eyebrow: string
  description: string
  image: string
  icon: LucideIcon
  items: MenuItem[]
}

const dashboardCategories: DashboardCategory[] = [
  {
    id: 'burgers',
    label: 'Burgers',
    eyebrow: '01 / Signature stacks',
    description: 'Smash-grilled patties, glossy buns and sauces made for the first bite.',
    image: 'https://images.pexels.com/photos/18713424/pexels-photo-18713424.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Hamburger,
    items: [
      { id: 'urban-smash', name: 'Urban Smash Burger', description: 'Double beef patty, cheddar, lettuce and house sauce.', price: 850, image: 'https://images.pexels.com/photos/18713424/pexels-photo-18713424.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { id: 'grill-chicken-burger', name: 'Grill Chicken Burger', description: 'Charred chicken, fresh greens and smoky mayo.', price: 780, image: 'https://images.pexels.com/photos/4315148/pexels-photo-4315148.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
    ],
  },
  {
    id: 'pizzas',
    label: 'Pizzas',
    eyebrow: '02 / Fired to order',
    description: 'Hand-stretched dough, molten cheese and bold toppings from the oven.',
    image: 'https://images.pexels.com/photos/5993865/pexels-photo-5993865.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Pizza,
    items: [
      { id: 'malai-boti-pizza', name: 'Malai Boti Pizza', description: 'Creamy malai boti, mozzarella and fresh herbs.', price: 1250, image: 'https://images.pexels.com/photos/5993865/pexels-photo-5993865.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { id: 'pizza-fries', name: 'Pizza Fries', description: 'Crispy fries layered with pizza sauce and cheese.', price: 650, image: 'https://images.pexels.com/photos/27582703/pexels-photo-27582703.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
    ],
  },
  {
    id: 'deals',
    label: 'Deals',
    eyebrow: '03 / More for the table',
    description: 'Big flavour bundles for late nights, families and hungry crews.',
    image: 'https://images.pexels.com/photos/32524109/pexels-photo-32524109.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Gift,
    items: [
      { id: 'urban-family-deal', name: 'Urban Family Deal', description: 'Burgers, fries, wings and drinks for the whole table.', price: 2850, image: 'https://images.pexels.com/photos/32524109/pexels-photo-32524109.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { id: 'midnight-combo', name: 'Midnight Combo', description: 'Two burgers, loaded fries and two chilled drinks.', price: 1850, image: 'https://images.pexels.com/photos/5086624/pexels-photo-5086624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
    ],
  },
  {
    id: 'fried-chicken',
    label: 'Fried Chicken',
    eyebrow: '04 / Crackle & crunch',
    description: 'Crispy golden chicken seasoned all the way through.',
    image: 'https://images.pexels.com/photos/6697493/pexels-photo-6697493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Flame,
    items: [
      { id: 'crispy-broast', name: 'Signature Chicken Broast', description: 'Crunchy outside, juicy inside, with our signature dip.', price: 720, image: 'https://images.pexels.com/photos/6697493/pexels-photo-6697493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { id: 'crispy-wings', name: 'Crispy Hot Wings', description: 'Fiery wings tossed in a sticky urban glaze.', price: 620, image: 'https://images.pexels.com/photos/14661492/pexels-photo-14661492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
    ],
  },
  {
    id: 'fries-pasta',
    label: 'Fries & Pasta',
    eyebrow: '05 / Comfort mode',
    description: 'Crispy sides and rich pasta bowls that never play second fiddle.',
    image: 'https://images.pexels.com/photos/8917285/pexels-photo-8917285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Soup,
    items: [
      { id: 'loaded-fries', name: 'Loaded Urban Fries', description: 'Seasoned fries, cheese, chicken and signature sauces.', price: 680, image: 'https://images.pexels.com/photos/6697493/pexels-photo-6697493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { id: 'creamy-pasta', name: 'Creamy Chicken Pasta', description: 'Silky pasta, grilled chicken and cracked pepper.', price: 850, image: 'https://images.pexels.com/photos/8917285/pexels-photo-8917285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
    ],
  },
  {
    id: 'steaks',
    label: 'Steaks',
    eyebrow: '06 / From the grill',
    description: 'Searing heat, tender cuts and a plate built for a slow, good meal.',
    image: 'https://images.pexels.com/photos/39452689/pexels-photo-39452689.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Utensils,
    items: [
      { id: 'mushroom-steak-chicken', name: 'Mushroom Steak - Chicken', description: 'Grilled chicken steak, mushroom sauce and garden vegetables.', price: 1090, image: 'https://images.pexels.com/photos/39452689/pexels-photo-39452689.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { id: 'bbq-steak-beef', name: 'BBQ Steak - Beef', description: 'Tender beef steak, BBQ glaze and grilled vegetables.', price: 1490, image: 'https://images.pexels.com/photos/36683019/pexels-photo-36683019.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
    ],
  },
  {
    id: 'wraps-sandwiches',
    label: 'Wraps & Sandwiches',
    eyebrow: '07 / Wrapped up',
    description: 'Fresh, toasted and packed with the kind of flavour you can take anywhere.',
    image: 'https://images.pexels.com/photos/36750266/pexels-photo-36750266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Sandwich,
    items: [
      { id: 'urban-beef-wrap', name: 'Urban Beef Wrap', description: 'Seasoned beef, cheese, lettuce and fries in a toasted wrap.', price: 790, image: 'https://images.pexels.com/photos/36750266/pexels-photo-36750266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { id: 'chicken-club', name: 'Chicken Club Sandwich', description: 'Grilled chicken, egg, cheese and crisp greens.', price: 720, image: 'https://images.pexels.com/photos/860620/pexels-photo-860620.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
    ],
  },
]

export function MenuSection() {
  const [activeId, setActiveId] = useState(dashboardCategories[0].id)
  const activeCategory = dashboardCategories.find((category) => category.id === activeId) ?? dashboardCategories[0]

  return (
    <section id="menu" className="scroll-mt-20 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold">Made to order</span>
          <h2 className="mt-2 font-serif text-3xl font-black text-mahogany sm:text-4xl">The Menu</h2>
        </div>

        {/* Category pills - horizontal scroll on mobile */}
        <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {dashboardCategories.map((category) => {
            const Icon = category.icon
            const isActive = category.id === activeId
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveId(category.id)
                  playTick()
                }}
                aria-pressed={isActive}
                className={`ios-press flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'border-gold bg-gold text-white ios-shadow-gold'
                    : 'border-border bg-white text-mahogany-soft'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            )
          })}
        </div>

        {/* Active category items */}
        <div key={activeCategory.id} className="menu-dashboard-detail mt-6">
          <div className="mb-5">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold">{activeCategory.eyebrow}</span>
            <h3 className="mt-1.5 font-serif text-2xl font-bold text-mahogany sm:text-3xl">{activeCategory.label}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-mahogany-soft">{activeCategory.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategory.items.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleAdd = () => {
    add(item)
    playAdd()
    if (buttonRef.current) flyToCart(buttonRef.current)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article
      className="menu-item-card ios-fade-up group overflow-hidden rounded-3xl border border-border bg-white"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative h-40 overflow-hidden sm:h-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-gold backdrop-blur-sm">
          Urban favourite
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-serif text-lg font-bold text-mahogany">{item.name}</h4>
        <p className="mt-1.5 min-h-10 text-xs leading-relaxed text-mahogany-soft">{item.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-base font-bold text-gold">{formatRs(item.price)}</span>
          <button
            ref={buttonRef}
            type="button"
            onClick={handleAdd}
            className={`ios-press rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              added ? 'bg-emerald-500 text-white' : 'bg-gold text-white ios-shadow-gold'
            }`}
          >
            {added ? <Check className="mx-auto h-4 w-4" /> : 'Order'}
          </button>
        </div>
      </div>
    </article>
  )
}

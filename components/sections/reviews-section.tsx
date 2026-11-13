'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const BURGER_IMAGE =
  'https://images.pexels.com/photos/23910856/pexels-photo-23910856.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

const REVIEWS = [
  {
    text: 'Very Welcoming........ Supportive staff.....Food Taste next level ........ Everything just outclass ..... Highly recommend',
  },
  {
    text: 'Urban Bites is a gem! The food is consistently delicious, with fresh ingredients and creative flavors. The service is top-notch, and the atmosphere is welcoming and vibrant. Highly recommend!',
  },
  {
    text: 'I really liked this restaurant! The atmosphere was pleasant, and the staff was friendly. The food was delicious every bite was a treat. I would give it a solid 5 stars for a delightful dining experience',
  },
  {
    text: 'Urban Bites offers a delightful fast food experience with a modern twist. The menu features a variety of flavorful options, from juicy burgers to crispy fries, all served with a unique flair. The ambiance is trendy and inviting, making it a great spot to grab a quick and satisfying meal',
  },
  {
    text: "Was in search for some good Loaded Fries in New City Phase 2, but couldn't find even a decent place. Urban Bites was the first and the final good fast food place that quinched the thirst for good Loaded Fries, definitely will be ordering often from them. They have their Pizza Fries, not the loaded ones, but nearly the same thing. Definitely worth a shot.",
  },
  {
    text: 'best Pizza fries, Grill Chicken Burger, Malai boti Pizza loved it. Everything was fresh, Mtlb best hai.',
  },
  {
    text: 'They are the best in town so far, must try their chicken broast',
  },
]

const AUTOPLAY_MS = 5000
const SLICES = [
  { clip: 'inset(0 0 66.5% 0)', shift: '-18%' },
  { clip: 'inset(33.5% 0 33.5% 0)', shift: '0%' },
  { clip: 'inset(66.5% 0 0 0)', shift: '18%' },
]

export function ReviewsSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [split, setSplit] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % REVIEWS.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [paused])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setSplit(entry.intersectionRatio > 0.35), {
      threshold: [0, 0.35, 1],
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const goTo = (next: number) => setIndex((next + REVIEWS.length) % REVIEWS.length)

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative overflow-hidden bg-white px-6 py-24 text-mahogany md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          background:
            'radial-gradient(60% 70% at 50% 110%, rgba(201,162,39,0.12), rgba(201,162,39,0.05) 45%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Customer Reviews
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance font-serif text-3xl font-black uppercase leading-[1.1] text-mahogany sm:text-4xl md:text-5xl">
            Your values matter a lot for us
          </h2>
        </div>

        <div className="mt-10 grid items-center gap-8 md:mt-16 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12 lg:gap-20">
          <div className="relative mx-auto aspect-square w-full max-w-[220px] sm:max-w-[280px] md:max-w-[320px]" aria-hidden="true">
            {SLICES.map((slice) => (
              <div
                key={slice.clip}
                className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  clipPath: slice.clip,
                  transform: split ? `translateY(${slice.shift})` : 'translateY(0)',
                }}
              >
                <div
                  className="h-full w-full rounded-full bg-cover bg-center ring-1 ring-gold/30"
                  style={{ backgroundImage: `url(${BURGER_IMAGE})` }}
                />
              </div>
            ))}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="overflow-hidden rounded-[2rem] border border-gold/15 bg-gold-light/50 backdrop-blur">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {REVIEWS.map((review, i) => (
                  <figure
                    key={review.text}
                    aria-hidden={i !== index}
                    className="flex w-full shrink-0 flex-col justify-between gap-6 p-6 sm:gap-8 sm:p-10 md:p-12"
                  >
                    <div className="flex gap-1" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star key={star} className="h-5 w-5 fill-gold text-gold" />
                      ))}
                    </div>
                    <blockquote className="text-pretty font-serif text-base leading-relaxed text-mahogany sm:text-lg md:text-2xl">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                  </figure>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2" role="tablist" aria-label="Choose review">
                {REVIEWS.map((review, i) => (
                  <button
                    key={review.text}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Review ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? 'w-8 bg-gold' : 'w-2 bg-mahogany/20 hover:bg-mahogany/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous review"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 transition-colors hover:border-gold hover:text-gold sm:h-11 sm:w-11"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Next review"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 transition-colors hover:border-gold hover:text-gold sm:h-11 sm:w-11"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

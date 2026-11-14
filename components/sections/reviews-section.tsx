'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const REVIEWS = [
  { text: 'Very Welcoming........ Supportive staff.....Food Taste next level ........ Everything just outclass ..... Highly recommend' },
  { text: 'Urban Bites is a gem! The food is consistently delicious, with fresh ingredients and creative flavors. The service is top-notch, and the atmosphere is welcoming and vibrant. Highly recommend!' },
  { text: 'I really liked this restaurant! The atmosphere was pleasant, and the staff was friendly. The food was delicious every bite was a treat. I would give it a solid 5 stars for a delightful dining experience' },
  { text: 'Urban Bites offers a delightful fast food experience with a modern twist. The menu features a variety of flavorful options, from juicy burgers to crispy fries, all served with a unique flair. The ambiance is trendy and inviting, making it a great spot to grab a quick and satisfying meal' },
  { text: "Was in search for some good Loaded Fries in New City Phase 2, but couldn't find even a decent place. Urban Bites was the first and the final good fast food place that quinched the thirst for good Loaded Fries, definitely will be ordering often from them. They have their Pizza Fries, not the loaded ones, but nearly the same thing. Definitely worth a shot." },
  { text: 'best Pizza fries, Grill Chicken Burger, Malai boti Pizza loved it. Everything was fresh, Mtlb best hai.' },
  { text: 'They are the best in town so far, must try their chicken broast' },
]

const AUTOPLAY_MS = 5000

export function ReviewsSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % REVIEWS.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [paused])

  const goTo = (next: number) => setIndex((next + REVIEWS.length) % REVIEWS.length)

  return (
    <section id="reviews" className="px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold">
            Customer Reviews
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl text-balance font-serif text-2xl font-black uppercase leading-[1.15] text-mahogany sm:text-3xl md:text-4xl">
            Your values matter a lot for us
          </h2>
        </div>

        <div
          className="mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="ios-shadow overflow-hidden rounded-3xl border border-border bg-white">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {REVIEWS.map((review, i) => (
                <figure
                  key={review.text}
                  aria-hidden={i !== index}
                  className="flex w-full shrink-0 flex-col gap-5 p-6 sm:p-8"
                >
                  <div className="flex gap-1" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className="h-5 w-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="text-pretty font-serif text-base leading-relaxed text-mahogany sm:text-lg md:text-xl">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Choose review">
              {REVIEWS.map((review, i) => (
                <button
                  key={review.text}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Review ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-7 bg-gold' : 'w-2 bg-mahogany/15 hover:bg-mahogany/30'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous review"
                className="ios-press flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-mahogany transition-colors hover:border-gold hover:text-gold"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next review"
                className="ios-press flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-mahogany transition-colors hover:border-gold hover:text-gold"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

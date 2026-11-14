const CART_TARGET_SELECTOR = '[data-cart-target]'

function createSparkleSVG(): string {
  return `<svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
    <defs>
      <radialGradient id="sparkle-grad">
        <stop offset="0%" stop-color="#fff3c4"/>
        <stop offset="40%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#a67c00"/>
      </radialGradient>
    </defs>
    <path d="M24 4 L27 18 L42 24 L27 30 L24 44 L21 30 L6 24 L21 18 Z" fill="url(#sparkle-grad)" stroke="#d4af37" stroke-width="0.5"/>
    <circle cx="24" cy="24" r="4" fill="#fff3c4"/>
  </svg>`
}

export function flyToCart(from: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const target = document.querySelector<HTMLElement>(CART_TARGET_SELECTOR)
  if (!target) return

  const start = from.getBoundingClientRect()
  const end = target.getBoundingClientRect()
  const startX = start.left + start.width / 2 - 24
  const startY = start.top + start.height / 2 - 24
  const endX = end.left + end.width / 2 - 24
  const endY = end.top + end.height / 2 - 24

  // Main sparkle
  const flyer = document.createElement('div')
  flyer.setAttribute('aria-hidden', 'true')
  flyer.className = 'pointer-events-none fixed left-0 top-0 z-[90]'
  flyer.style.filter = 'drop-shadow(0 8px 16px rgba(201,162,39,0.4))'
  flyer.style.transform = `translate(${startX}px, ${startY}px)`
  flyer.innerHTML = createSparkleSVG()
  document.body.appendChild(flyer)

  const midX = (startX + endX) / 2
  const peakY = Math.min(startY, endY) - 120

  const animation = flyer.animate(
    [
      { transform: `translate(${startX}px, ${startY}px) scale(0.4) rotate(0deg)`, opacity: 0 },
      { transform: `translate(${startX}px, ${startY - 30}px) scale(1.1) rotate(90deg)`, opacity: 1, offset: 0.15 },
      { transform: `translate(${midX}px, ${peakY}px) scale(1.15) rotate(200deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${endX}px, ${endY}px) scale(0.35) rotate(360deg)`, opacity: 0.3 },
    ],
    { duration: 1000, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', fill: 'forwards' },
  )
  animation.onfinish = () => flyer.remove()

  // Trailing sparkles
  for (let i = 0; i < 3; i++) {
    const trail = document.createElement('div')
    trail.setAttribute('aria-hidden', 'true')
    trail.className = 'pointer-events-none fixed left-0 top-0 z-[89]'
    trail.style.opacity = '0'
    trail.innerHTML = createSparkleSVG()
    trail.style.transform = `translate(${startX}px, ${startY}px)`
    document.body.appendChild(trail)

    const delay = i * 120
    const trailEl = trail
    setTimeout(() => {
      const trailStart = from.getBoundingClientRect()
      const tsx = trailStart.left + trailStart.width / 2 - 16
      const tsy = trailStart.top + trailStart.height / 2 - 16
      trailEl.style.transform = `translate(${tsx}px, ${tsy}px)`

      const trailAnim = trailEl.animate(
        [
          { transform: `translate(${tsx}px, ${tsy}px) scale(0.3) rotate(0deg)`, opacity: 0 },
          { transform: `translate(${tsx + (Math.random() - 0.5) * 60}px, ${tsy - 60 - i * 20}px) scale(0.6) rotate(180deg)`, opacity: 0.8, offset: 0.4 },
          { transform: `translate(${tsx + (Math.random() - 0.5) * 100}px, ${tsy - 120 - i * 30}px) scale(0.1) rotate(360deg)`, opacity: 0 },
        ],
        { duration: 700, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', fill: 'forwards' },
      )
      trailAnim.onfinish = () => trailEl.remove()
    }, delay)
  }
}

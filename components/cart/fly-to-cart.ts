const NINJA_SVG = `
<svg viewBox="0 0 96 96" width="96" height="96" aria-hidden="true">
  <ellipse cx="48" cy="90" rx="22" ry="3" fill="rgba(0,0,0,0.25)"/>
  <g class="ninja-body">
    <path d="M30 56 Q48 46 66 56 L64 74 Q48 80 32 74 Z" fill="#1c1c1e"/>
    <path d="M32 58 L20 40 L26 38 L38 54 Z" fill="#1c1c1e"/>
    <path d="M64 58 L72 46 L78 50 L68 62 Z" fill="#1c1c1e"/>
    <path d="M36 74 L34 88 L42 88 L46 76 Z" fill="#1c1c1e"/>
    <path d="M60 74 L62 88 L54 88 L50 76 Z" fill="#1c1c1e"/>
    <circle cx="48" cy="36" r="13" fill="#2a2a2d"/>
    <path d="M35 34 Q48 28 61 34 L61 39 Q48 35 35 39 Z" fill="#e09f3e"/>
    <path d="M37 40 Q48 47 59 40 L59 43 Q48 50 37 43 Z" fill="#1c1c1e"/>
    <path d="M61 33 L72 30 L70 35 L61 37 Z" fill="#e09f3e"/>
    <rect x="58" y="10" width="26" height="22" rx="3" fill="#e09f3e" transform="rotate(-12 71 21)"/>
    <path d="M58 19 L84 19" stroke="#7a5230" stroke-width="2" transform="rotate(-12 71 21)"/>
    <path d="M64 46 L58 54" stroke="#2a2a2d" stroke-width="5" stroke-linecap="round"/>
  </g>
</svg>`

const CART_TARGET_SELECTOR = '[data-cart-target]'

export function flyToCart(from: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const target = document.querySelector<HTMLElement>(CART_TARGET_SELECTOR)
  if (!target) return

  const start = from.getBoundingClientRect()
  const end = target.getBoundingClientRect()
  const startX = start.left + start.width / 2 - 48
  const startY = start.top + start.height / 2 - 48
  const dx = end.left + end.width / 2 - 48 - startX
  const dy = end.top + end.height / 2 - 48 - startY

  const flyer = document.createElement('div')
  flyer.setAttribute('aria-hidden', 'true')
  flyer.className = 'pointer-events-none fixed left-0 top-0 z-[90] drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]'
  flyer.style.transform = `translate(${startX}px, ${startY}px)`
  flyer.innerHTML = NINJA_SVG
  document.body.appendChild(flyer)

  const animation = flyer.animate(
    [
      { transform: `translate(${startX}px, ${startY}px) scale(0.6)`, opacity: 0 },
      { transform: `translate(${startX}px, ${startY - 40}px) scale(1)`, opacity: 1, offset: 0.15 },
      {
        transform: `translate(${startX + dx / 2}px, ${startY - 160}px) scale(1.05) rotate(-8deg)`,
        opacity: 1,
        offset: 0.55,
      },
      { transform: `translate(${startX + dx}px, ${startY + dy}px) scale(0.25) rotate(10deg)`, opacity: 0.2 },
    ],
    { duration: 900, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' },
  )
  animation.onfinish = () => flyer.remove()
}

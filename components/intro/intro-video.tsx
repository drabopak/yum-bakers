'use client'

import { useEffect, useRef, useState } from 'react'
import { hasSeenIntro, markIntroDone } from '@/lib/intro'

const INTRO_VIDEO_ID = 'SazTo_Ztkc0'

type YTPlayer = { destroy: () => void }
type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string
      width: string
      height: string
      playerVars: Record<string, number>
      events: { onReady?: (event: { target: YTPlayer & { playVideo: () => void } }) => void; onStateChange?: (event: { data: number }) => void }
    },
  ) => YTPlayer
  PlayerState: { ENDED: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

function loadYouTubeApi(): Promise<YTNamespace> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT as YTNamespace)
    }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    }
  })
}

export function IntroVideo() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const hostRef = useRef<HTMLDivElement>(null)
  const finishRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (hasSeenIntro()) return
    setVisible(true)

    let player: YTPlayer | null = null
    let cancelled = false
    const mount = document.createElement('div')
    hostRef.current?.appendChild(mount)

    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      player = new YT.Player(mount, {
        videoId: INTRO_VIDEO_ID,
        width: '100%',
        height: '100%',
        playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, modestbranding: 1, rel: 0, disablekb: 1 },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) finishRef.current()
          },
        },
      })
    })

    return () => {
      cancelled = true
      player?.destroy()
      mount.remove()
    }
  }, [])

  finishRef.current = () => {
    if (leaving) return
    setLeaving(true)
    markIntroDone()
    window.setTimeout(() => setVisible(false), 700)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-700 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Brand intro video"
    >
      <div
        ref={hostRef}
        className="pointer-events-none h-[100dvh] w-[min(100vw,calc(100dvh*9/16))] overflow-hidden [&_iframe]:h-full [&_iframe]:w-full"
      />
      <button
        type="button"
        onClick={() => finishRef.current()}
        className="absolute bottom-8 right-6 rounded-full border border-white/30 bg-black/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
      >
        Skip intro
      </button>
    </div>
  )
}

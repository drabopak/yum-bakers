export type BackgroundVideo = 'chef' | 'waiting' | 'delivery'

const VIDEO_IDS: Record<BackgroundVideo, string> = {
  chef: 'LUgFQ7ZLB2Y',
  waiting: 'x_o9rwq4QSk',
  delivery: 'V2qsUUug1jo',
}

export function OrderBackgroundVideo({ video }: { video: BackgroundVideo }) {
  const id = VIDEO_IDS[video]
  const src = `https://www.youtube.com/embed/${id}?controls=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=${id}&rel=0&playsinline=1&disablekb=1`

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden bg-black">
      <iframe
        key={id}
        src={src}
        title="Background video"
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        className="absolute left-1/2 top-1/2 h-[max(100vh,56.25vw)] w-[max(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2 border-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90" />
    </div>
  )
}

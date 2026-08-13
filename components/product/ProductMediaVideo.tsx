'use client'

interface ProductMediaVideoProps {
  src: string
  title: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
}

export function getEmbeddedProductVideoUrl(src: string): string | null {
  try {
    const url = new URL(src)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    let embedUrl: URL | null = null

    if (hostname === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0]
      if (videoId) embedUrl = new URL(`https://www.youtube.com/embed/${encodeURIComponent(videoId)}`)
    } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const segments = url.pathname.split('/').filter(Boolean)
      const videoId = url.searchParams.get('v')
        ?? (['embed', 'shorts'].includes(segments[0] ?? '') ? segments[1] : null)
      if (videoId) embedUrl = new URL(`https://www.youtube.com/embed/${encodeURIComponent(videoId)}`)
    } else if (hostname === 'vimeo.com' || hostname === 'player.vimeo.com') {
      const videoId = url.pathname.split('/').filter(Boolean).find((segment) => /^\d+$/.test(segment))
      if (videoId) embedUrl = new URL(`https://player.vimeo.com/video/${videoId}`)
    } else if (hostname === 'loom.com') {
      const segments = url.pathname.split('/').filter(Boolean)
      const shareIndex = segments.indexOf('share')
      const videoId = shareIndex >= 0 ? segments[shareIndex + 1] : null
      if (videoId) embedUrl = new URL(`https://www.loom.com/embed/${encodeURIComponent(videoId)}`)
    }

    return embedUrl?.toString() ?? null
  } catch {
    return null
  }
}

export function ProductMediaVideo({
  src,
  title,
  className = '',
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
}: ProductMediaVideoProps) {
  const embedUrl = getEmbeddedProductVideoUrl(src)

  if (embedUrl) {
    const url = new URL(embedUrl)
    if (autoPlay) url.searchParams.set('autoplay', '1')
    if (muted) url.searchParams.set('muted', '1')
    if (loop) url.searchParams.set('loop', '1')
    if (!controls) url.searchParams.set('controls', '0')

    return (
      <iframe
        src={url.toString()}
        title={title}
        aria-label={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className={`block size-full border-0 bg-[#101828] ${controls ? '' : 'pointer-events-none'} ${className}`}
      />
    )
  }

  return (
    <video
      src={src}
      title={title}
      aria-label={title}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      preload="metadata"
      className={`block size-full bg-[#101828] object-contain ${className}`}
    />
  )
}

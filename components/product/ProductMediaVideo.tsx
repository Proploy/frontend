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

export function ProductMediaVideo({
  src,
  title,
  className = '',
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
}: ProductMediaVideoProps) {
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

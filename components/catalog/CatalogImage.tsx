'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'

interface CatalogImageProps {
  src: string
  alt: string
  className?: string
  fallback?: ReactNode
}

function catalogImageLoader({ src }: { src: string }) {
  return src
}

/**
 * Catalog media is supplied by service-apis and can use arbitrary approved hosts.
 * Rendering it directly avoids rejecting valid URLs through Next Image's static host allowlist.
 */
export function CatalogImage({ src, alt, className = '', fallback = null }: CatalogImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (failedSrc === src) {
    return fallback
  }

  return (
    <Image
      loader={catalogImageLoader}
      unoptimized
      src={src}
      alt={alt}
      width={1}
      height={1}
      onError={() => setFailedSrc(src)}
      className={className}
    />
  )
}

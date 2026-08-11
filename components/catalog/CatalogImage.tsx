'use client'

import { useState, type ReactNode } from 'react'

interface CatalogImageProps {
  src: string
  alt: string
  className?: string
  fallback?: ReactNode
}

/**
 * Catalog media is supplied by service-apis and can use arbitrary approved hosts.
 * Rendering standard HTML img directly avoids Next.js domain constraints
 * and prevents 1px HTML attribute sizing collapses in production builds.
 */
export function CatalogImage({ src, alt, className = '', fallback = null }: CatalogImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || failedSrc === src) {
    return <>{fallback}</>
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      className={className}
      loading="lazy"
    />
  )
}

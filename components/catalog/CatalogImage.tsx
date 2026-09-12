'use client'

import { useState, useEffect, type ReactNode } from 'react'

interface CatalogImageProps {
  src: string
  alt: string
  className?: string
  fallback?: ReactNode
}

const PRODUCTION_GATEWAY = 'https://service-apis-731353524841.australia-southeast1.run.app'

/**
 * Sources that already failed this session. A remount (menu reopened, row
 * re-rendered, another page) renders the fallback at once instead of
 * requesting the asset again. Successful loads rely on the HTTP cache.
 */
const failedSources = new Set<string>()

/**
 * Catalog media is supplied by service-apis and can use arbitrary approved hosts.
 * Rendering standard HTML img directly avoids Next.js domain constraints
 * and prevents 1px HTML attribute sizing collapses in production builds.
 */
export function CatalogImage({ src, alt, className = '', fallback = null }: CatalogImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src)
  const [hasFailed, setHasFailed] = useState<boolean>(() => failedSources.has(src))

  useEffect(() => {
    setCurrentSrc(src)
    setHasFailed(failedSources.has(src))
  }, [src])

  if (!src || hasFailed) {
    return <>{fallback}</>
  }

  const handleError = () => {
    // If local localhost:8020 backend failed, retry with Cloud Run production backend before giving up
    if (currentSrc.includes('localhost:8020') || currentSrc.includes('127.0.0.1:8020')) {
      const cloudRunUrl = currentSrc.replace(/http:\/\/(localhost|127\.0\.0\.1):8020/, PRODUCTION_GATEWAY)
      setCurrentSrc(cloudRunUrl)
    } else {
      failedSources.add(src)
      setHasFailed(true)
    }
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      decoding="async"
    />
  )
}

'use client'

import { useState, useEffect } from 'react'

type InlineVideoMode = 'auto' | 'direct'

const MANAGED_EXPERT_FILE_PATH = /^\/api\/v1\/experts\/[^/]+\/links\/[^/]+\/file$/

interface InlineVideoProps {
  url: string
  title: string
  captionUrl?: string | null
  mode?: InlineVideoMode
  className?: string
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '')

    if (hostname === 'youtu.be') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      return videoId && /^[A-Za-z0-9_-]+$/.test(videoId)
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : null
    }

    if (
      hostname === 'youtube.com'
      || hostname === 'm.youtube.com'
      || hostname === 'youtube-nocookie.com'
    ) {
      const videoId = parsed.searchParams.get('v')
        ?? parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1]
      return videoId && /^[A-Za-z0-9_-]+$/.test(videoId)
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : null
    }

    if (hostname === 'vimeo.com' || hostname === 'player.vimeo.com') {
      const videoId = parsed.pathname.match(/(?:video\/)?(\d+)/)?.[1]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null
    }

    if (hostname === 'loom.com') {
      const videoId = parsed.pathname.match(/\/(?:share|embed)\/([^/]+)/)?.[1]
      return videoId ? `https://www.loom.com/embed/${videoId}` : null
    }
  } catch {
    return null
  }

  return null
}

function isDirectVideoUrl(url: string) {
  return /\.(mp4|m4v|mov|webm|ogv|ogg)(?:[?#]|$)/i.test(url)
}

function isManagedExpertFileUrl(url: string) {
  try {
    return MANAGED_EXPERT_FILE_PATH.test(new URL(url, 'http://service-apis.local').pathname)
  } catch {
    return false
  }
}

export function InlineVideo({
  url,
  title,
  captionUrl,
  mode = 'auto',
  className = '',
}: InlineVideoProps) {
  const embedUrl = mode === 'auto' ? getEmbedUrl(url) : null
  const canPlayDirectly = mode === 'direct' || isDirectVideoUrl(url) || isManagedExpertFileUrl(url)
  const [videoSrc, setVideoSrc] = useState(url)

  useEffect(() => {
    setVideoSrc(url)
  }, [url])

  const handleVideoError = () => {
    if (videoSrc.includes('localhost:8020') || videoSrc.includes('127.0.0.1:8020')) {
      const cloudRunUrl = videoSrc.replace(/http:\/\/(localhost|127\.0\.0\.1):8020/, 'https://service-apis-731353524841.australia-southeast1.run.app')
      setVideoSrc(cloudRunUrl)
    }
  }

  return (
    <div className={`flex size-full flex-col bg-[#181d27] ${className}`}>
      <div className="relative min-h-0 flex-1">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : canPlayDirectly ? (
          // Captions are rendered when the backend supplies a WebVTT URL.
          <video
            src={videoSrc}
            controls
            playsInline
            preload="metadata"
            onError={handleVideoError}
            className="absolute inset-0 size-full object-contain"
          >
            {captionUrl ? (
              <track kind="captions" src={captionUrl} srcLang="en" label="English captions" default />
            ) : null}
          </video>
        ) : (
          <div className="flex size-full items-center justify-center px-[16px] text-center text-[14px] text-white">
            This video provider cannot be embedded.
          </div>
        )}
      </div>
    </div>
  )
}

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

    // Google Drive shared links → preview embed
    if (hostname === 'drive.google.com') {
      const fileIdMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/)
      const fileId = fileIdMatch?.[1] ?? parsed.searchParams.get('id')
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null
    }
  } catch {
    return null
  }

  return null
}

/** Returns a direct-play URL for Dropbox download links, or null. */
function toDirectDownloadUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '')

    // Dropbox: swap dl=0 → dl=1 for raw file access
    if (hostname === 'dropbox.com' || hostname === 'dl.dropboxusercontent.com') {
      parsed.searchParams.set('dl', '1')
      return parsed.toString()
    }
  } catch {
    // fall through
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
  const directDownload = mode === 'auto' ? toDirectDownloadUrl(url) : null
  const canPlayDirectly = mode === 'direct' || isDirectVideoUrl(url) || isManagedExpertFileUrl(url) || Boolean(directDownload)

  const [videoSrc, setVideoSrc] = useState(directDownload ?? url)
  // 'playing' = attempting <video>, 'failed' = <video> errored → show fallback
  const [playbackState, setPlaybackState] = useState<'playing' | 'failed'>('playing')

  useEffect(() => {
    setVideoSrc(directDownload ?? url)
    setPlaybackState('playing')
  }, [url, directDownload])

  const handleVideoError = () => {
    // Try Cloud Run fallback for local dev
    if (videoSrc.includes('localhost:8020') || videoSrc.includes('127.0.0.1:8020')) {
      const cloudRunUrl = videoSrc.replace(/http:\/\/(localhost|127\.0\.0\.1):8020/, 'https://service-apis-731353524841.australia-southeast1.run.app')
      setVideoSrc(cloudRunUrl)
      return
    }
    // Mark as failed so we show the link fallback
    setPlaybackState('failed')
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
        ) : canPlayDirectly || playbackState === 'playing' ? (
          // Try playing any URL directly — uploaded files, CDN links, etc.
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
          /* Graceful fallback: offer an "Open video" link instead of a dead end */
          <div className="flex size-full flex-col items-center justify-center gap-[12px] px-[16px] text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" />
              <path d="m10 8 6 4-6 4Z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" />
            </svg>
            <p className="text-[14px] text-white/60">
              This video can&apos;t be played inline.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[6px] rounded-full bg-white/10 px-[16px] py-[8px] text-[13px] font-medium text-white/90 transition-colors hover:bg-white/20"
            >
              Open video
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

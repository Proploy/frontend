'use client'

import { useId } from 'react'

const STAR_PATH = 'm12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9Z'
const UNLIT = '#d9dde3'
const LIT = '#ffb400'

/**
 * Five-star rating where every star is filled to its own fraction of the
 * average: 4.5 lights four full stars and exactly half of the fifth. Each
 * star is a standalone SVG with the lit path clipped to that fraction, so
 * there is no overlay row that can drift out of alignment.
 */
export function RatingStars({
  rating,
  size = 24,
  showValue = true,
}: {
  rating: number
  size?: number
  showValue?: boolean
}) {
  const id = useId()
  // Fill from the one-decimal value that is displayed, so 4.53 shows "4.5"
  // and lights exactly half of the fifth star.
  const clamped = Number(Math.max(0, Math.min(5, rating)).toFixed(1))
  return (
    <span className="pp-stars" role="img" aria-label={`Rated ${clamped.toFixed(1)} out of 5`}>
      <span className="pp-stars-row">
        {[0, 1, 2, 3, 4].map((index) => {
          const fraction = Math.max(0, Math.min(1, clamped - index))
          const clipId = `${id}-star-${index}`
          return (
            <svg key={index} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <clipPath id={clipId}>
                  <rect x="0" y="0" width={24 * fraction} height="24" />
                </clipPath>
              </defs>
              <path d={STAR_PATH} fill={UNLIT} />
              {fraction > 0 && <path d={STAR_PATH} fill={LIT} clipPath={`url(#${clipId})`} />}
            </svg>
          )
        })}
      </span>
      {showValue && <span className="pp-stars-value">{clamped.toFixed(1)}</span>}
    </span>
  )
}

'use client'

import { useEffect, useState } from 'react'

const PHRASES = [
  'Reading the catalog',
  'Comparing feature sets',
  'Weighing the trade-offs',
  'Checking compliance and deployment',
  'Shortlisting candidates',
  'Writing it up',
]

export function RespondingStatus({ seed = 0 }: { seed?: number }) {
  const [phraseIndex, setPhraseIndex] = useState(Math.abs(seed) % PHRASES.length)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % PHRASES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div role="status" className="flex items-center gap-3 py-2">
      <span className="pulse-dot size-2 rounded-full bg-cobalt" aria-hidden />
      <span className="label !text-cobalt-deep">{PHRASES[phraseIndex]}…</span>
    </div>
  )
}

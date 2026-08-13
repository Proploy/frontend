'use client'

import { useEffect, useState } from 'react'

const AI_THINKING_PHRASES = [
  'Meticulously scanning product catalogs',
  'Thoroughly comparing feature sets',
  'Deeply analyzing your workflow needs',
  'Carefully weighing the trade-offs',
  'Securely verifying compliance requirements',
  'Methodically shortlisting candidates',
  'Diligently compiling evidence',
  'Intelligently structuring recommendations',
]

export function RespondingStatus({ seed = 0 }: { seed?: number }) {
  const [phraseIndex, setPhraseIndex] = useState(Math.abs(seed) % AI_THINKING_PHRASES.length)
  const [dots, setDots] = useState('.')

  // Cycle phrases every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % AI_THINKING_PHRASES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Cycle dots every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((current) => (current.length >= 3 ? '.' : current + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const currentPhrase = AI_THINKING_PHRASES[phraseIndex]

  return (
    <div
      role="status"
      className="flex items-center gap-3 py-2 text-sm font-semibold text-[#155eef] animate-pulse transition-opacity duration-300"
      style={{ textShadow: '0 0 12px rgba(21, 94, 239, 0.4)' }}
    >
      <div className="flex space-x-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-[#155eef] shadow-[0_0_8px_rgba(21,94,239,0.8)] animate-ping" style={{ animationDuration: '1s' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-[#155eef] shadow-[0_0_8px_rgba(21,94,239,0.8)] animate-ping" style={{ animationDuration: '1s', animationDelay: '0.2s' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-[#155eef] shadow-[0_0_8px_rgba(21,94,239,0.8)] animate-ping" style={{ animationDuration: '1s', animationDelay: '0.4s' }} />
      </div>
      <span className="min-w-[280px]">
        {currentPhrase}<span className="inline-block w-4 text-left">{dots}</span>
      </span>
    </div>
  )
}

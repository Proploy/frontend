'use client'

import { LoaderCircle } from 'lucide-react'

const SAM_STATUSES = [
  'SAM is carefully evaluating your request…',
  'SAM is thoughtfully reviewing the available evidence…',
  'SAM is securely checking your mandatory requirements…',
] as const

export function RespondingStatus({ seed = 0 }: { seed?: number }) {
  const status = SAM_STATUSES[Math.abs(seed) % SAM_STATUSES.length]
  return (
    <div
      role="status"
      className="flex items-center gap-2 py-2 text-sm text-[#535862]"
    >
      <LoaderCircle
        size={16}
        className="animate-spin text-[#155eef]"
        aria-hidden
      />
      {status}
    </div>
  )
}

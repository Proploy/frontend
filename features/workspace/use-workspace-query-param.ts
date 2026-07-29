'use client'

import { useSearchParams } from 'next/navigation'

export function useWorkspaceQueryParam(name: string): string | null {
  return useSearchParams().get(name)
}

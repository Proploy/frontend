'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SSOCallback() {
  const router = useRouter()

  useEffect(() => {
    // Supabase OAuth redirects here with code in URL
    // The middleware or auth callback handles the exchange
    router.push('/')
  }, [router])

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4 mt-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
'use client'

import { useEffect } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

/**
 * SSO Callback Page for Sign Up
 * Handles OAuth redirect after Google/GitHub authentication
 */
export default function SSOCallback() {
  const { signUp, setActive } = useSignUp()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      if (!signUp) return

      try {
        if (signUp.status === 'complete') {
          await setActive({ session: signUp.createdSessionId })
          router.push('/')
        }
      } catch {
        // Clerk handles OAuth callback automatically
      }
    }

    handleCallback()
  }, [signUp, setActive, router])

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign up...</p>
      </div>
    </div>
  )
}

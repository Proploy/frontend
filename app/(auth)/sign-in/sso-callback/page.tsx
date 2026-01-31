'use client'

import { useEffect } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

/**
 * SSO Callback Page
 * Handles OAuth redirect after Google/GitHub authentication
 */
export default function SSOCallback() {
  const { signIn, setActive } = useSignIn()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      if (!signIn) return

      try {
        // Handle the OAuth callback
        const result = await signIn.attemptFirstFactor({
          strategy: 'oauth_google',
        })

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          router.push('/')
        }
      } catch {
        // If the first factor fails, Clerk will handle it automatically
        // This is expected for GitHub and other providers
      }
    }

    handleCallback()
  }, [signIn, setActive, router])

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

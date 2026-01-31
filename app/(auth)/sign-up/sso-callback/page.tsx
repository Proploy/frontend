'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

/**
 * SSO Callback Page for Sign Up
 * Handles OAuth redirect after Google/Microsoft authentication
 */
export default function SSOCallback() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="text-center">
        <AuthenticateWithRedirectCallback 
          signInForceRedirectUrl="/"
          signUpForceRedirectUrl="/"
        />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4 mt-4"></div>
        <p className="text-gray-600">Completing sign up...</p>
      </div>
    </div>
  )
}

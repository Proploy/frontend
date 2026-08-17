'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import { resendVerification } from '@/lib/auth/browser-client'

function CheckEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const redirectTo = searchParams.get('redirectTo') ?? ''

  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)

  const handleResend = async () => {
    if (!email || isResending) return
    setIsResending(true)
    setResendMessage(null)
    
    try {
      const { error } = await resendVerification(email)
      setResendMessage(
        error
          ? error.message
          : 'Verification email resent. Check your inbox.',
      )
    } finally {
      setIsResending(false)
    }
  }

  const enterCodeHref = (() => {
    const params = new URLSearchParams({ email })
    if (redirectTo) params.set('redirectTo', redirectTo)
    return `/verify-email?${params.toString()}`
  })()

  return (
    <>
      <div className="mb-8">
          <h2 className="font-dm-sans font-semibold text-[30px] leading-[38px] text-[#181d27] mb-2">
            Check your email
          </h2>
          <p className="font-inter text-[16px] text-[#535862]">
            {email
              ? `We sent a verification link to ${email}.`
              : 'We sent a verification link to your email address.'}
          </p>
        </div>

        {resendMessage ? (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm" role="status">
            {resendMessage}
          </div>
        ) : null}

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => router.push(enterCodeHref)}
            className="w-full bg-[#155eef] text-white font-inter font-semibold text-[16px] py-2.5 rounded-lg hover:bg-[#1248d4] transition"
          >
            Enter code manually
          </button>

          <p className="text-center font-inter text-[14px] text-[#535862]">
            Didn&apos;t receive the email?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={!email || isResending}
              className="text-[#004eeb] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Resending...' : 'Click to resend'}
            </button>
          </p>

          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams()
              if (redirectTo) params.set('redirectTo', redirectTo)
              const q = params.toString()
              router.push(`/sign-in${q ? `?${q}` : ''}`)
            }}
            className="w-full text-[#535862] font-inter font-semibold text-[14px] py-2.5 hover:text-gray-900 transition flex items-center justify-center gap-2"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to log in
          </button>
        </div>
    </>
  )
}

function CheckEmailFormSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded-lg mb-4" />
        <div className="h-5 w-full max-w-sm bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-4">
        <div className="h-11 w-full bg-gray-200 rounded-lg" />
        <div className="h-5 w-48 bg-gray-200 rounded-lg mx-auto" />
        <div className="h-11 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

import { AuthShell } from '../auth-shell'

export default function CheckEmailPage() {
  return (
    <AuthShell>
      <div className="pp-stack pp-gap-8" style={{ width: '100%', maxWidth: 400 }}>
        <Suspense fallback={<CheckEmailFormSkeleton />}>
          <CheckEmailForm />
        </Suspense>
      </div>
    </AuthShell>
  )
}
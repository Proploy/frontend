'use client'

import { useCallback, useRef, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import {
  resendVerification,
  verifyEmail,
} from '@/lib/auth/browser-client'

const CODE_LENGTH = 6

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  const [code, setCode] = useState<string[]>(() =>
    Array.from({ length: CODE_LENGTH }, () => ''),
  )
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const focusIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(CODE_LENGTH - 1, index))
    inputsRef.current[clamped]?.focus()
    inputsRef.current[clamped]?.select()
  }, [])

  const submit = useCallback(
    async (targetCode?: string) => {
      const fullCode = targetCode ?? code.join('')
      if (fullCode.length !== CODE_LENGTH || isVerifying) return
      setIsVerifying(true)
      setError(null)
      
      try {
        const { error: verifyError } = await verifyEmail(email, fullCode)
        if (verifyError) {
          setError(verifyError.message)
          return
        }
        window.dispatchEvent(new Event('proploy-auth-changed'))
        router.push(redirectTo)
        router.refresh()
      } finally {
        setIsVerifying(false)
      }
    },
    [code, email, isVerifying, redirectTo, router],
  )

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    setCode((current) => {
      const next = [...current]
      next[index] = digit
      return next
    })
    if (digit) {
      if (index < CODE_LENGTH - 1) {
        focusIndex(index + 1)
      } else {
        // Last box filled — auto-submit with the now-complete code.
        const fullAfter = (() => {
          const tentative = [...code]
          tentative[index] = digit
          return tentative.join('')
        })()
        if (fullAfter.length === CODE_LENGTH) void submit(fullAfter)
      }
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      focusIndex(index - 1)
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusIndex(index - 1)
    } else if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      event.preventDefault()
      focusIndex(index + 1)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    event.preventDefault()
    setCode((current) => {
      const next = [...current]
      for (let i = 0; i < CODE_LENGTH; i += 1) {
        next[i] = pasted[i] ?? ''
      }
      return next
    })
    focusIndex(Math.min(pasted.length, CODE_LENGTH - 1))
    if (pasted.length === CODE_LENGTH) void submit(pasted)
  }

  const fullCode = code.join('')
  const canVerify = fullCode.length === CODE_LENGTH && !isVerifying

  const handleResend = async () => {
    if (!email || isResending) return
    setIsResending(true)
    setResendMessage(null)
    
    try {
      const { error: resendError } = await resendVerification(email)
      setResendMessage(
        resendError
          ? resendError.message
          : 'Verification email resent. Check your inbox.',
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <>
      <div className="mb-8">
          <h2 className="font-dm-sans font-semibold text-[30px] leading-[38px] text-[#181d27] mb-2">
            Check your email
          </h2>
          <p className="font-inter text-[16px] text-[#535862]">
            {email
              ? `Enter the 6-digit code we sent to ${email}.`
              : 'Enter the 6-digit code from your verification email.'}
          </p>
        </div>

        {error ? (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" role="alert">
            {error}
          </div>
        ) : null}
        {resendMessage ? (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm" role="status">
            {resendMessage}
          </div>
        ) : null}

        <div className="space-y-6 mb-6">
          <div className="flex gap-2 w-full mb-6" role="group" aria-label="Verification code">
            {Array.from({ length: CODE_LENGTH }).map((_, index) => (
              <input
                key={`code-input-${index}`}
                ref={(el) => {
                  inputsRef.current[index] = el
                }}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                aria-label={`Verification code digit ${index + 1}`}
                maxLength={1}
                value={code[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="flex-1 min-w-0 min-h-[64px] border-2 border-[#2970ff] rounded-xl bg-white text-center text-[32px] leading-[40px] tracking-[-0.64px] font-[family-name:var(--font-dm-sans)] font-medium text-[#155eef] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] focus:outline-none focus:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),0px_0px_0px_2px_white,0px_0px_0px_4px_#2970ff]"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => submit()}
            disabled={!canVerify}
            className="w-full bg-[#155eef] text-white font-inter font-semibold text-[16px] py-2.5 rounded-lg hover:bg-[#1248d4] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isVerifying ? 'Verifying...' : 'Verify email'}
          </button>
        </div>

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
          className="w-full mt-4 text-[#535862] font-inter font-semibold text-[14px] py-2.5 hover:text-gray-900 transition flex items-center justify-center gap-2"
        >
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to log in
        </button>
    </>
  )
}

function VerifyEmailSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded-lg mb-4" />
        <div className="h-5 w-full max-w-sm bg-gray-200 rounded-lg" />
      </div>
        <div className="space-y-6 mb-6">
          <div className="flex gap-2 w-full mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-box-${i}`} className="flex-1 min-w-0 min-h-[64px] bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-11 w-full bg-gray-200 rounded-lg" />
        </div>
      <div className="h-5 w-48 bg-gray-200 rounded-lg mx-auto mb-4" />
      <div className="h-11 w-full bg-gray-200 rounded-lg" />
    </div>
  )
}

import { AuthShell } from '../auth-shell'

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <div className="pp-stack pp-gap-8" style={{ width: '100%', maxWidth: 400 }}>
        <Suspense fallback={<VerifyEmailSkeleton />}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </AuthShell>
  )
}
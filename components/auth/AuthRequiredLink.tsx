'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type MouseEvent, type ReactNode, useMemo, useState } from 'react'
import { LogIn, X } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

type AuthRequiredLinkProps = {
  href: string
  className?: string
  children: ReactNode
  promptTitle?: string
  promptDescription?: string
}

export function AuthRequiredLink({
  href,
  className,
  children,
  promptTitle = 'Log in to view this expert',
  promptDescription = 'Expert profiles are available after login so we can connect requests, messages, and workspace activity to your account.',
}: AuthRequiredLinkProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const signInHref = useMemo(() => {
    const params = new URLSearchParams({ redirectTo: href })
    return `/sign-in?${params.toString()}`
  }, [href])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (user) return

    event.preventDefault()
    if (!isLoading) setIsOpen(true)
  }

  const continueToLogin = () => {
    setIsOpen(false)
    router.push(signInHref)
  }

  return (
    <>
      <Link href={href} className={className} onClick={handleClick} aria-disabled={isLoading && !user}>
        {children}
      </Link>

      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0c111d]/45 px-[16px] backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="auth-required-title">
          <div className="w-full max-w-[420px] rounded-[18px] border border-[#e9eaeb] bg-white p-[22px] shadow-[0_24px_70px_rgba(10,13,18,0.22)]">
            <div className="flex items-start justify-between gap-[16px]">
              <div className="flex size-[42px] items-center justify-center rounded-full bg-[#eff4ff] text-[#155eef]">
                <LogIn size={20} />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-[34px] items-center justify-center rounded-full text-[#717680] hover:bg-[#f5f5f5] hover:text-[#181d27]"
                aria-label="Close login prompt"
              >
                <X size={18} />
              </button>
            </div>

            <h2 id="auth-required-title" className="mt-[18px] text-[22px] font-semibold leading-[30px] text-[#181d27]">
              {promptTitle}
            </h2>
            <p className="mt-[8px] text-[15px] leading-[22px] text-[#535862]">
              {promptDescription}
            </p>

            <div className="mt-[22px] flex flex-col-reverse gap-[10px] sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-[42px] items-center justify-center rounded-[10px] border border-[#d5d7da] bg-white px-[16px] text-[14px] font-semibold text-[#414651] hover:bg-[#fafafa]"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={continueToLogin}
                className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#155eef] px-[16px] text-[14px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] hover:bg-[#004eeb]"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

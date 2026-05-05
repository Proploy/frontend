'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()

  if (pathname?.startsWith('/vendor-onboarding')) return null

  return (
    <div className="bg-[#fafbfc] content-stretch flex flex-col h-[80px] items-center justify-center relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between max-w-[1280px] px-[var(--container-padding-desktop,32px)] relative shrink-0 w-full">
        {/* Logo */}
        <div className="flex flex-row items-center self-stretch">
          <div className="content-stretch flex gap-[8px] h-full items-center relative shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/proploy-logo.png" alt="Proploy Logo" className="h-auto w-[140px]" />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="content-stretch flex gap-[36px] items-center relative shrink-0">
          <Link href="/product" className="content-stretch flex gap-[var(--spacing-xxs,2px)] items-center justify-center overflow-clip px-[var(--spacing-sm,6px)] py-[var(--spacing-xs,4px)] relative rounded-[var(--radius-md,8px)] shrink-0">
            <div className="content-stretch flex items-center justify-center px-[var(--spacing-xxs,2px)] relative shrink-0">
              <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-secondary-\(700\),#414651)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap">
                Explore Products
              </p>
            </div>
          </Link>

          <Link href="/experts" className="content-stretch flex gap-[var(--spacing-xxs,2px)] items-center justify-center overflow-clip px-[var(--spacing-sm,6px)] py-[var(--spacing-xs,4px)] relative rounded-[var(--radius-md,8px)] shrink-0">
            <div className="content-stretch flex items-center justify-center px-[var(--spacing-xxs,2px)] relative shrink-0">
              <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-secondary-\(700\),#414651)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap">
                Explore Experts
              </p>
            </div>
          </Link>

          <Link href="/for-businesses" className="content-stretch flex gap-[var(--spacing-xxs,2px)] items-center justify-center overflow-clip px-[var(--spacing-sm,6px)] py-[var(--spacing-xs,4px)] relative rounded-[var(--radius-md,8px)] shrink-0">
            <div className="content-stretch flex items-center justify-center px-[var(--spacing-xxs,2px)] relative shrink-0">
              <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-secondary-\(700\),#414651)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap">
                For Businesses
              </p>
            </div>
          </Link>

          <Link href="/for-experts" className="content-stretch flex gap-[var(--spacing-xxs,2px)] items-center justify-center overflow-clip px-[var(--spacing-sm,6px)] py-[var(--spacing-xs,4px)] relative rounded-[var(--radius-md,8px)] shrink-0">
            <div className="content-stretch flex items-center justify-center px-[var(--spacing-xxs,2px)] relative shrink-0">
              <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-secondary-\(700\),#414651)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap">
                For Experts
              </p>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div className="content-stretch flex gap-[var(--spacing-lg,12px)] items-center relative shrink-0">
          <motion.div whileHover={{ filter: 'brightness(0.95)' }} whileTap={{ filter: 'brightness(0.9)' }} transition={{ duration: 0.2 }} className="rounded-[8px]">
            <Link href="/sign-in" className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-[6px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0">
              <div className="content-stretch flex items-center justify-center px-[var(--spacing-xxs,2px)] relative shrink-0">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-secondary-\(700\),#414651)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap">
                  Log in
                </p>
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ filter: 'brightness(0.95)' }} whileTap={{ filter: 'brightness(0.9)' }} transition={{ duration: 0.2 }} className="rounded-[8px]">
            <Link href="/become-expert" className="bg-[var(--colors\/background\/bg-brand-solid,#155eef)] border-2 border-[rgba(255,255,255,0.12)] border-solid content-stretch flex gap-[6px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0">
              <div className="content-stretch flex items-center justify-center px-[var(--spacing-xxs,2px)] relative shrink-0">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-white,white)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap">
                  Become an Expert
                </p>
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


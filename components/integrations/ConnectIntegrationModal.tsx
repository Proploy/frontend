'use client'

// Connect dialog for an integration. UI-first: there's no backend OAuth yet, so
// "Connect" records an account label locally (integrations-store). For tools
// flagged needsAuth we show a short "you'll be redirected to authorize" note so
// the affordance is honest about what the real flow will do.

import { useEffect, useState } from 'react'
import { Loader2, ShieldCheck, X } from 'lucide-react'
import { BUTTON_SKEUO } from '@/components/workspace/WorkspaceShell'
import { connectIntegration } from '@/lib/integrations/integrations-store'
import type { IntegrationDef } from '@/lib/integrations/integrations-catalog'
import { IntegrationLogo } from './IntegrationLogo'

export function ConnectIntegrationModal({
  def,
  onClose,
  onConnected,
}: {
  def: IntegrationDef
  onClose: () => void
  onConnected?: () => void
}) {
  const [account, setAccount] = useState(def.defaultAccount ?? '')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, submitting])

  function handleConnect() {
    setSubmitting(true)
    // Simulate the round-trip so the button state reads as a real connect.
    window.setTimeout(() => {
      connectIntegration(def.key, account)
      setSubmitting(false)
      onConnected?.()
      onClose()
    }, 450)
  }

  const fieldClass = `w-full rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-[16px]">
      <div className="absolute inset-0 bg-[#0a0d12]/40 backdrop-blur-[2px]" onClick={submitting ? undefined : onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-title"
        className="relative flex w-full max-w-[460px] flex-col overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-start gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[20px]">
          <IntegrationLogo name={def.key} />
          <div className="flex-1">
            <h2 id="connect-title" className="font-semibold text-[18px] leading-[26px] text-[#181d27]">
              Connect {def.name}
            </h2>
            <p className="mt-[2px] text-[13px] leading-[18px] text-[#717680]">{def.blurb}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#fafafa] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-[16px] px-[24px] py-[20px]">
          <label className="flex flex-col gap-[6px]">
            <span className="text-[13px] font-medium leading-[20px] text-[#414651]">
              {def.accountLabel ?? 'Account'}
            </span>
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder={def.accountLabel ?? 'your-account'}
              className={fieldClass}
              autoFocus
            />
          </label>

          <div className="flex items-start gap-[8px] rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[10px]">
            <ShieldCheck size={16} className="mt-[1px] shrink-0 text-[#155eef]" />
            <p className="text-[12px] leading-[18px] text-[#535862]">
              {def.needsAuth
                ? `You'll be redirected to ${def.name} to authorize access. Proploy only requests the scopes it needs.`
                : `${def.name} connects instantly — no separate sign-in required.`}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-[10px] border-t border-[#e9eaeb] px-[24px] py-[16px]">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConnect}
            disabled={submitting}
            className={`inline-flex items-center gap-[6px] rounded-[8px] border-2 border-white/[0.12] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_SKEUO}`}
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Connecting…' : `Connect ${def.name}`}
          </button>
        </div>
      </div>
    </div>
  )
}

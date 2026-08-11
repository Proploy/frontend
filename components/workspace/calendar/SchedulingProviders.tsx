'use client'

// Scheduling providers strip on the Calendar page.
//
// Surfaces the connected scheduling integrations (Cal.com, Calendly, Google
// Calendar) from the shared integrations store and lets the expert choose which
// one new bookings route through. The chosen provider is stamped onto meetings
// created via the "Schedule call" flow. Cal.com ships connected + active by
// default.

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW } from '@/components/workspace/WorkspaceShell'
import { IntegrationLogo } from '@/components/integrations/IntegrationLogo'
import { ConnectIntegrationModal } from '@/components/integrations/ConnectIntegrationModal'
import { useIntegrations } from '@/lib/integrations/integrations-store'
import { SCHEDULING_INTEGRATIONS, type IntegrationDef } from '@/lib/integrations/integrations-catalog'

export function SchedulingProviders() {
  const { isConnected, accountFor, activeScheduler, setActiveScheduler } = useIntegrations()
  const [connectDef, setConnectDef] = useState<IntegrationDef | null>(null)

  return (
    <section className={`overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
      <div className="flex flex-col gap-[2px] border-b border-[#e9eaeb] px-[20px] py-[16px]">
        <div className="flex items-center gap-[8px]">
          <h2 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Scheduling</h2>
          <span className="rounded-full bg-[#eff4ff] px-[8px] py-[1px] text-[12px] font-medium text-[#155eef]">
            Cal.com
          </span>
        </div>
        <p className="text-[13px] leading-[18px] text-[#717680]">
          Choose which tool new bookings route through. Connect your own scheduler or use Proploy&rsquo;s
          built-in one.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[12px] p-[16px] sm:grid-cols-3">
        {SCHEDULING_INTEGRATIONS.map((def) => {
          const connected = isConnected(def.key)
          const active = connected && activeScheduler === def.key
          return (
            <div
              key={def.key}
              className={[
                'flex flex-col gap-[10px] rounded-[10px] border p-[14px] transition-colors',
                active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb] bg-white',
              ].join(' ')}
            >
              <div className="flex items-start gap-[10px]">
                <IntegrationLogo name={def.key} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-[6px]">
                    <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{def.name}</p>
                    {active && (
                      <span className="rounded-full bg-[#155eef] px-[7px] py-[1px] text-[11px] font-semibold leading-[16px] text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[12px] leading-[18px] text-[#717680]">
                    {connected ? accountFor(def.key) ?? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>

              {connected ? (
                <button
                  type="button"
                  onClick={() => setActiveScheduler(def.key)}
                  disabled={active}
                  className={[
                    'inline-flex items-center justify-center gap-[6px] rounded-[8px] px-[12px] py-[7px] text-[13px] font-semibold leading-[18px]',
                    active
                      ? 'cursor-default border border-[#e9eaeb] bg-white text-[#717680]'
                      : `border border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa] ${BUTTON_SKEUO}`,
                  ].join(' ')}
                >
                  {active ? (
                    <>
                      <Check size={15} /> In use
                    </>
                  ) : (
                    'Use for booking'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConnectDef(def)}
                  className={`inline-flex items-center justify-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[7px] text-[13px] font-semibold leading-[18px] text-[#414651] hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
                >
                  <Plus size={15} /> Connect
                </button>
              )}
            </div>
          )
        })}
      </div>

      {connectDef && (
        <ConnectIntegrationModal
          def={connectDef}
          onClose={() => setConnectDef(null)}
          onConnected={() => setActiveScheduler(connectDef.key)}
        />
      )}
    </section>
  )
}

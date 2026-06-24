'use client'

import { useState } from 'react'
import { Building2, CreditCard, Plug, RotateCcw } from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import { SectionCard } from '@/components/business/dashboard/ui'
import { MOCK_BUSINESS_USER } from '@/lib/service-apis/business-dashboard-mock'
import { resetDemo } from '@/lib/demo/demo-store'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className="text-[13px] font-medium leading-[18px] text-[#414651]">{label}</span>
      <input
        defaultValue={value}
        className={`rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
      />
    </label>
  )
}

const INTEGRATIONS = [
  { name: 'Single sign-on (SAML)', desc: 'Let your team sign in with your identity provider.', connected: false },
  { name: 'Slack', desc: 'Get project and approval notifications in a channel.', connected: true },
  { name: 'Accounting export', desc: 'Sync consolidated invoices to your ledger.', connected: false },
]

export default function BusinessSettingsPage() {
  const [cleared, setCleared] = useState(false)
  return (
    <BusinessPage>
      <BusinessPageHeader title="Settings" subtitle="Manage your company profile, billing, and integrations." />

      <div className="mt-[24px] flex flex-col gap-[24px]">
        <SectionCard title="Company profile">
          <div className="flex flex-col gap-[16px] p-[20px]">
            <div className="flex items-center gap-[12px]">
              <span className="flex size-[44px] items-center justify-center rounded-[10px] bg-[#f5f8ff] text-[#155eef]">
                <Building2 size={22} />
              </span>
              <div>
                <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">{MOCK_BUSINESS_USER.company}</p>
                <p className="text-[13px] leading-[18px] text-[#717680]">Business account</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
              <Field label="Company name" value={MOCK_BUSINESS_USER.company} />
              <Field label="Billing email" value={MOCK_BUSINESS_USER.email} />
              <Field label="Primary contact" value={MOCK_BUSINESS_USER.name} />
              <Field label="Industry" value="Financial services" />
            </div>
            <div>
              <button
                type="button"
                className={`rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                Save changes
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Billing">
          <div className="flex flex-wrap items-center justify-between gap-[12px] p-[20px]">
            <div className="flex items-center gap-[12px]">
              <span className="flex size-[40px] items-center justify-center rounded-[8px] bg-[#f5f5f5] text-[#414651]">
                <CreditCard size={20} />
              </span>
              <div>
                <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Visa ending 4242</p>
                <p className="text-[13px] leading-[18px] text-[#717680]">Billed monthly in USD · next invoice 30 Jun</p>
              </div>
            </div>
            <button
              type="button"
              className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              Update payment method
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Integrations">
          <ul className="divide-y divide-[#f0f0f1]">
            {INTEGRATIONS.map((it) => (
              <li key={it.name} className="flex items-center gap-[12px] px-[20px] py-[16px]">
                <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff] text-[#155eef]">
                  <Plug size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{it.name}</p>
                  <p className="text-[13px] leading-[18px] text-[#717680]">{it.desc}</p>
                </div>
                <button
                  type="button"
                  className={`shrink-0 rounded-[8px] px-[14px] py-[8px] text-[14px] font-semibold leading-[20px] ${
                    it.connected
                      ? 'border border-[#d5d7da] bg-white text-[#414651]'
                      : 'bg-[#155eef] text-white'
                  } ${BUTTON_SKEUO}`}
                >
                  {it.connected ? 'Manage' : 'Connect'}
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Demo controls">
          <div className="flex flex-wrap items-center justify-between gap-[12px] p-[20px]">
            <div>
              <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Reset demo data</p>
              <p className="text-[13px] leading-[18px] text-[#717680]">
                Clears synced messages, posted briefs, payouts, and reviews across both dashboards.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetDemo()
                setCleared(true)
              }}
              className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              <RotateCcw size={16} />
              {cleared ? 'Demo reset' : 'Reset demo'}
            </button>
          </div>
        </SectionCard>
      </div>
    </BusinessPage>
  )
}

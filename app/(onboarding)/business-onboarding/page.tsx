'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Building2, Check, CreditCard, FileSearch, Users } from 'lucide-react'
import OnboardingSidebar from '@/components/onboarding/OnboardingSidebar'

const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

const STEPS = [
  { icon: Building2, title: 'Company', subtitle: 'Tell us about your business' },
  { icon: Users, title: 'Team', subtitle: 'Invite who you work with' },
  { icon: CreditCard, title: 'Billing', subtitle: 'How you’ll pay experts' },
  { icon: FileSearch, title: 'Review', subtitle: 'Confirm and finish' },
]

const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–1,000', '1,000+']
const INDUSTRIES = ['Financial services', 'Healthcare', 'SaaS / Tech', 'Retail', 'Manufacturing', 'Other']

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className="text-[14px] font-medium leading-[20px] text-[#414651]">{label}</span>
      <input
        {...props}
        className={`rounded-[8px] border border-[#d5d7da] px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
      />
    </label>
  )
}

export default function BusinessOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [company, setCompany] = useState('')
  const [size, setSize] = useState(COMPANY_SIZES[2])
  const [industry, setIndustry] = useState(INDUSTRIES[0])
  const [contact, setContact] = useState('')
  const [invites, setInvites] = useState('')
  const [billing, setBilling] = useState('')

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const finish = () => router.push('/business/dashboard')

  return (
    <div className="flex h-full w-full">
      <div className="hidden h-full border-r border-[#e9eaeb] lg:block">
        <OnboardingSidebar currentStep={step} steps={STEPS} />
      </div>

      <div className="flex h-full flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-[28px] px-[24px] py-[40px] font-[family-name:var(--font-dm-sans)]">
          <div className="flex flex-col gap-[6px]">
            <p className="text-[14px] font-medium text-[#155eef]">Step {step + 1} of {STEPS.length}</p>
            <h1 className="font-semibold text-[28px] leading-[36px] text-[#181d27] tracking-[-0.02em]">{STEPS[step].title}</h1>
            <p className="text-[15px] leading-[22px] text-[#535862]">{STEPS[step].subtitle}</p>
          </div>

          <div className="flex flex-col gap-[20px]">
            {step === 0 && (
              <>
                <Field label="Company name" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Northwind Capital" />
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[14px] font-medium leading-[20px] text-[#414651]">Company size</span>
                  <div className="flex flex-wrap gap-[8px]">
                    {COMPANY_SIZES.map((s) => (
                      <button key={s} type="button" onClick={() => setSize(s)} className={chip(s === size)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[14px] font-medium leading-[20px] text-[#414651]">Industry</span>
                  <div className="flex flex-wrap gap-[8px]">
                    {INDUSTRIES.map((i) => (
                      <button key={i} type="button" onClick={() => setIndustry(i)} className={chip(i === industry)}>{i}</button>
                    ))}
                  </div>
                </div>
                <Field label="Your name" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Primary contact" />
              </>
            )}

            {step === 1 && (
              <>
                <label className="flex flex-col gap-[6px]">
                  <span className="text-[14px] font-medium leading-[20px] text-[#414651]">Invite teammates</span>
                  <textarea
                    value={invites}
                    onChange={(e) => setInvites(e.target.value)}
                    rows={4}
                    placeholder="Add email addresses, comma separated"
                    className={`resize-none rounded-[8px] border border-[#d5d7da] px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                  />
                  <span className="text-[13px] text-[#717680]">You can manage roles and permissions later in Team settings.</span>
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Card number" value={billing} onChange={(e) => setBilling(e.target.value)} placeholder="4242 4242 4242 4242" inputMode="numeric" />
                <div className="grid grid-cols-2 gap-[16px]">
                  <Field label="Expiry" placeholder="MM / YY" />
                  <Field label="CVC" placeholder="123" />
                </div>
                <p className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[14px] text-[13px] leading-[18px] text-[#535862]">
                  You’re billed once a month in USD across all experts. Funds sit in escrow and only release when you approve a milestone.
                </p>
              </>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-[12px]">
                <Summary label="Company" value={company || '—'} />
                <Summary label="Size" value={size} />
                <Summary label="Industry" value={industry} />
                <Summary label="Primary contact" value={contact || '—'} />
                <Summary label="Invites" value={invites ? `${invites.split(',').filter((s) => s.trim()).length} teammate(s)` : 'None yet'} />
                <Summary label="Billing" value={billing ? `Card ending ${billing.slice(-4)}` : 'Not added'} />
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-[8px]">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] disabled:opacity-40 ${BUTTON_SKEUO}`}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <Check size={16} />
                Enter dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function chip(active: boolean) {
  return `rounded-full border px-[14px] py-[7px] text-[14px] font-medium leading-[20px] transition-colors ${
    active ? 'border-[#155eef] bg-[#eff4ff] text-[#004eeb]' : 'border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa]'
  }`
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-[16px] border-b border-[#f0f0f1] pb-[10px] last:border-0">
      <span className="text-[14px] text-[#717680]">{label}</span>
      <span className="text-[14px] font-medium text-[#181d27]">{value}</span>
    </div>
  )
}

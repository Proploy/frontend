'use client'

import { Check, FileText, Globe, ShieldCheck, X } from 'lucide-react'
import { BusinessPage, BusinessPageHeader } from '@/components/business/dashboard/BusinessDashboardFrame'
import { Avatar, KpiCard, SectionCard } from '@/components/business/dashboard/ui'
import { MOCK_BUSINESS_DASHBOARD } from '@/lib/service-apis/business-dashboard-mock'

function Tick({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex size-[20px] items-center justify-center rounded-full bg-[#dcfae6] text-[#067647]">
      <Check size={13} />
    </span>
  ) : (
    <span className="inline-flex size-[20px] items-center justify-center rounded-full bg-[#fef3f2] text-[#b42318]">
      <X size={13} />
    </span>
  )
}

export default function BusinessCompliancePage() {
  const d = MOCK_BUSINESS_DASHBOARD
  const cleared = d.compliance.filter(
    (c) => c.taxForm.done && c.msa && c.identity && c.payoutMethod,
  ).length
  const countries = new Set(d.compliance.map((c) => c.country)).size

  return (
    <BusinessPage>
      <BusinessPageHeader
        title="Tax & compliance"
        subtitle="Proploy collects the right tax forms, verifies identity, and stores contracts for every expert — across 40+ countries, so you don’t have to."
      />

      <div className="mt-[24px] grid grid-cols-1 gap-[16px] sm:grid-cols-3">
        <KpiCard icon={<ShieldCheck size={18} />} label="Fully compliant" value={`${cleared} / ${d.compliance.length}`} sub="Experts ready to pay" />
        <KpiCard icon={<Globe size={18} />} label="Countries" value={String(countries)} sub="Local tax handling" />
        <KpiCard icon={<FileText size={18} />} label="Open items" value={String(d.compliance.length - cleared)} sub="Need a form or signature" />
      </div>

      <div className="mt-[24px]">
        <SectionCard title="Compliance by expert">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#f0f0f1] text-[12px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
                  <th className="px-[20px] py-[12px]">Expert</th>
                  <th className="px-[20px] py-[12px]">Classification</th>
                  <th className="px-[20px] py-[12px] text-center">Tax form</th>
                  <th className="px-[20px] py-[12px] text-center">MSA</th>
                  <th className="px-[20px] py-[12px] text-center">Identity</th>
                  <th className="px-[20px] py-[12px] text-center">Payout</th>
                </tr>
              </thead>
              <tbody>
                {d.compliance.map((c) => (
                  <tr key={c.expert} className="border-b border-[#f0f0f1] last:border-0 hover:bg-[#fafafa]">
                    <td className="px-[20px] py-[14px]">
                      <div className="flex items-center gap-[12px]">
                        <Avatar initial={c.expert.charAt(0)} color="#155eef" />
                        <div>
                          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{c.expert}</p>
                          <p className="text-[12px] leading-[18px] text-[#717680]">{c.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-[20px] py-[14px] text-[14px] text-[#414651]">{c.classification}</td>
                    <td className="px-[20px] py-[14px]">
                      <div className="flex flex-col items-center gap-[4px]">
                        <Tick ok={c.taxForm.done} />
                        <span className="text-[12px] text-[#717680]">{c.taxForm.label}</span>
                      </div>
                    </td>
                    <td className="px-[20px] py-[14px] text-center"><Tick ok={c.msa} /></td>
                    <td className="px-[20px] py-[14px] text-center"><Tick ok={c.identity} /></td>
                    <td className="px-[20px] py-[14px] text-center"><Tick ok={c.payoutMethod} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="mt-[24px]">
        <SectionCard title="What Proploy handles for you">
          <ul className="grid grid-cols-1 gap-px bg-[#f0f0f1] sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Contractor classification', 'We assess each engagement so you stay on the right side of misclassification rules.'],
              ['Tax form collection', 'W-8/W-9 and local equivalents collected and stored before the first payout.'],
              ['Contracts & MSAs', 'Every SOW and master agreement signed and stored in one place.'],
              ['Identity verification', 'Each expert and entity is KYC-verified before funds move.'],
              ['Local-currency payouts', 'Experts get paid in their own currency; you’re billed once in USD.'],
              ['40+ country coverage', 'Compliance handled wherever your experts are based.'],
            ].map(([title, body]) => (
              <li key={title} className="flex flex-col gap-[4px] bg-white p-[20px]">
                <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{title}</p>
                <p className="text-[13px] leading-[18px] text-[#717680]">{body}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </BusinessPage>
  )
}

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Home, Mail, ShieldCheck } from 'lucide-react'

const NEXT_STEPS = [
  {
    icon: FileCheck2,
    title: 'Application review',
    body: 'The Proploy team will review your expertise, portfolio links, and project evidence.',
  },
  {
    icon: Mail,
    title: 'Decision by email',
    body: 'You will receive an update at your account email once review is complete.',
  },
  {
    icon: ShieldCheck,
    title: 'Profile activation',
    body: 'Approved experts are moved into the expert network and can start receiving relevant opportunities.',
  },
]

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] pt-[112px] pb-[72px]">
      <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-[32px] px-4 md:px-8">
        <section className="overflow-hidden rounded-[8px] border border-[#d5d7da] bg-white shadow-[0px_12px_24px_-12px_rgba(10,13,18,0.18)]">
          <div className="grid min-h-[420px] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="flex flex-col justify-center gap-[28px] border-b border-[#e9eaeb] p-6 md:p-10 lg:border-b-0 lg:border-r">
              <div className="flex size-[64px] items-center justify-center rounded-full border border-[#abefc6] bg-[#ecfdf3]">
                <CheckCircle2 className="size-[34px] text-[#067647]" strokeWidth={2.25} />
              </div>

              <div className="flex max-w-[640px] flex-col gap-[14px]">
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold leading-[20px] text-[#155eef]">
                  Expert application submitted
                </p>
                <h1 className="font-[family-name:var(--font-dm-sans)] text-[40px] font-semibold leading-[48px] tracking-normal text-[#181d27] md:text-[48px] md:leading-[56px]">
                  Thanks. Your application is now in review.
                </h1>
                <p className="max-w-[560px] font-[family-name:var(--font-dm-sans)] text-[18px] leading-[28px] text-[#535862]">
                  We have received your expert profile, portfolio links, and project details. Review usually takes 3-5 business days.
                </p>
              </div>

              <div className="flex flex-col gap-[12px] sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex h-[48px] items-center justify-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[18px] font-[family-name:var(--font-dm-sans)] text-[16px] font-semibold leading-[24px] text-[#414651] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors hover:bg-[#fafafa]"
                >
                  <Home className="size-[20px]" />
                  Home
                </Link>
                <Link
                  href="/experts"
                  className="inline-flex h-[48px] items-center justify-center gap-[8px] rounded-[8px] border-2 border-white/10 bg-[#155eef] px-[18px] font-[family-name:var(--font-dm-sans)] text-[16px] font-semibold leading-[24px] text-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] transition-colors hover:bg-[#004eeb]"
                >
                  Explore experts
                  <ArrowRight className="size-[20px]" />
                </Link>
              </div>
            </div>

            <aside className="bg-[#f5f8ff] p-6 md:p-10">
              <div className="flex h-full flex-col justify-between gap-[32px]">
                <div className="flex flex-col gap-[18px]">
                  <div className="inline-flex w-fit items-center gap-[8px] rounded-full border border-[#b2ddff] bg-white px-[12px] py-[6px]">
                    <Clock3 className="size-[16px] text-[#155eef]" />
                    <span className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold leading-[18px] text-[#175cd3]">
                      3-5 business days
                    </span>
                  </div>

                  <div className="flex flex-col gap-[12px]">
                    <h2 className="font-[family-name:var(--font-dm-sans)] text-[24px] font-semibold leading-[32px] text-[#181d27]">
                      What happens next
                    </h2>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[24px] text-[#535862]">
                      Keep an eye on your email. If the review team needs more detail, they will contact you before making a final decision.
                    </p>
                  </div>
                </div>

                <div className="grid gap-[12px]">
                  {NEXT_STEPS.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <div
                        key={step.title}
                        className="rounded-[8px] border border-[#e9eaeb] bg-white p-[16px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.04)]"
                      >
                        <div className="flex gap-[12px]">
                          <div className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
                            <Icon className="size-[18px]" />
                          </div>
                          <div className="flex flex-col gap-[4px]">
                            <div className="flex items-center gap-[8px]">
                              <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold leading-[18px] text-[#717680]">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <h3 className="font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold leading-[22px] text-[#181d27]">
                                {step.title}
                              </h3>
                            </div>
                            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#535862]">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <p className="text-center font-[family-name:var(--font-dm-sans)] text-[14px] leading-[20px] text-[#717680]">
          Submitted applications cannot be edited while they are in review.
        </p>
      </main>
    </div>
  )
}

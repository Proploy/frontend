'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MessageSquareMore,
  Zap,
  BarChart3,
  MessageCircle,
  Command,
  Heart,
  Plus,
  Minus,
  MapPin,
} from 'lucide-react'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

const METRICS = [
  { value: '400+', title: 'Rollouts delivered', body: 'Implementations shipped through Proploy across CRM, ERP, analytics, and more.' },
  { value: '600%', title: 'Pipeline growth', body: 'Average increase in qualified inbound for experts on the platform.' },
  { value: '10k', title: 'Buyers searching', body: 'Operators and procurement leads sourcing experts each quarter.' },
  { value: '200+', title: '5-star reviews', body: 'Verified buyer reviews backing the experts in our network.' },
]

const VALUES = [
  {
    icon: <MessageSquareMore size={24} className="text-[#414651]" />,
    title: 'Pre-qualified briefs',
    body: 'Every lead reaches you with budget, timeline, and decision-maker already mapped — no cold discovery calls.',
  },
  {
    icon: <Zap size={24} className="text-[#414651]" />,
    title: 'Faster time-to-contract',
    body: 'Proploy handles SOW templates, scoping, and approvals so you can start billable work in days instead of weeks.',
  },
  {
    icon: <BarChart3 size={24} className="text-[#414651]" />,
    title: 'Outcome reporting built in',
    body: 'Track project health, milestones, and client satisfaction in a shared workspace — replace status decks with one dashboard.',
  },
  {
    icon: <MessageCircle size={24} className="text-[#414651]" />,
    title: 'Direct client relationships',
    body: 'You own the relationship. Proploy stays in the background once the engagement is signed.',
  },
  {
    icon: <Command size={24} className="text-[#414651]" />,
    title: 'Tools you already use',
    body: 'Connect Slack, Linear, Notion, HubSpot, and 100+ other systems so client work flows where you already work.',
  },
  {
    icon: <Heart size={24} className="text-[#414651]" />,
    title: 'A real partner team',
    body: 'A success owner backs every engagement — handling escalations, billing edge cases, and renewals so you can focus on delivery.',
  },
]

const TEAM = [
  { name: 'Alisa Hester', role: 'Founder & CEO', bio: 'Led procurement at two scaleups before Proploy. Background in SaaS evaluation and implementation.', color: '#e3c6d1' },
  { name: 'Rich Wilson', role: 'Head of Expert Network', bio: 'Built and scaled implementation partner programs at HubSpot and Atlassian.', color: '#c6d0cb' },
  { name: 'Annie Stanley', role: 'Product Lead', bio: 'Designed buyer-side workflows for B2B procurement platforms; ex-Tipalti, ex-Airtable.', color: '#ddc0ce' },
  { name: 'Johnny Bell', role: 'Engineering Lead', bio: 'Built marketplace infrastructure for service-based platforms. Former Linear engineer.', color: '#c6d0e0' },
  { name: 'Mia Ward', role: 'Customer Success', bio: 'Manages the buyer–expert relationship from first match through go-live and beyond.', color: '#d8d0c0' },
  { name: 'Archie Young', role: 'Brand & Design', bio: 'Shapes how Proploy looks, sounds, and feels across product and marketing.', color: '#bcd6e0' },
]

const FAQS = [
  {
    q: 'How does Proploy vet experts?',
    a: 'Every expert goes through a portfolio review, two reference checks with past clients, and a technical interview against the playbook for the software they implement.',
  },
  { q: 'How does Proploy make money?', a: 'Proploy takes a transparent platform fee on engagements that close through the network. You set your own rates — there is no markup on your billing.' },
  { q: 'Do I keep the client relationship?', a: 'Yes. Once an engagement is signed, the working relationship is direct between you and the client. Proploy stays in the background for billing and success.' },
  { q: 'What kinds of briefs come through?', a: 'CRM, ERP, analytics, marketing automation, finance, HR, and security tooling — typically Series A through enterprise teams looking for a vetted implementation partner.' },
  { q: 'How long does it take to get matched?', a: "Most experts receive their first qualified brief within two weeks of being approved. Match rate scales with the software categories you list on your profile." },
  { q: 'Is there a contract or minimum commitment?', a: "No long-term contract — you accept briefs as they come and can pause your profile any time from the expert dashboard." },
]

const MAP_PINS = [
  { top: '32%', left: '13%' },
  { top: '42%', left: '15%' },
  { top: '20%', left: '51%' },
  { top: '15%', left: '57%' },
  { top: '36%', left: '50%' },
  { top: '46%', left: '66%' },
  { top: '41%', left: '82%' },
  { top: '83%', left: '86%' },
  { top: '87%', left: '94%' },
]

export default function ForExpertsPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-white pt-[80px] font-[family-name:var(--font-dm-sans)] flex flex-col">
      {/* Hero */}
      <section className="py-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col items-center gap-[32px]">
          <div className="max-w-[768px] flex flex-col gap-[24px] text-center">
            <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">About us</p>
            <h1 className="font-semibold text-[48px] leading-[60px] text-[#181d27] tracking-[-0.96px]">
              Grow your software implementation practice with better-fit clients.
            </h1>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              Proploy connects vetted experts with businesses that already know they need help choosing, setting up,
              and launching the right software.
            </p>
          </div>
          <div className="flex gap-[12px]">
            <Link
              href="#"
              className={`bg-white border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
            >
              See how it works
            </Link>
            <Link
              href="/become-expert"
              className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}
            >
              Join as Expert
            </Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex justify-center">
          <div className="relative w-[1024px] max-w-full aspect-[1024/488] rounded-[16px] bg-[radial-gradient(circle,_#cbd5e1_1px,_transparent_1px)] [background-size:14px_14px]">
            {MAP_PINS.map((pin, i) => (
              <span
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: pin.top, left: pin.left }}
              >
                <span className="relative flex items-center justify-center">
                  <span className="absolute size-[40px] rounded-full bg-[#2970ff]/10" />
                  <span className="absolute size-[24px] rounded-full bg-[#2970ff]/20" />
                  <span className="size-[8px] rounded-full bg-[#2970ff]" />
                </span>
              </span>
            ))}
            {/* Selected pin tooltip */}
            <div className="absolute" style={{ top: '79%', left: '88%' }}>
              <div className="absolute -translate-x-1/2 bottom-[52px] left-1/2 bg-white border border-black/[0.08] rounded-[8px] px-[16px] py-[12px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08)] flex flex-col items-center gap-[8px] whitespace-nowrap">
                <MapPin size={20} className="text-[#155eef]" />
                <p className="font-semibold text-[12px] leading-[18px] text-[#181d27]">Melbourne, AUS</p>
                <p className="font-normal text-[12px] leading-[18px] text-[#535862] text-center">
                  100 Smith Street
                  <br />
                  Collingwood VIC 3066 AU
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process + Metrics + Image */}
      <section className="pb-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="max-w-[768px] flex flex-col gap-[20px]">
            <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">Our process</p>
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              Built for implementation experts who ship.
            </h2>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              From first brief to renewal, Proploy keeps the busy work off your plate so you can focus on rolling software out.
            </p>
          </div>
          <div className="flex flex-wrap gap-[64px] items-center">
            <div className="flex-1 min-w-[400px] max-w-[560px] grid grid-cols-1 sm:grid-cols-2 gap-x-[32px] gap-y-[64px]">
              {METRICS.map((m) => (
                <div key={m.title} className="flex flex-col items-center gap-[12px] text-center">
                  <p className="font-semibold text-[60px] leading-[72px] text-[#155eef] tracking-[-1.2px]">
                    {m.value}
                  </p>
                  <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{m.title}</p>
                  <p
                    className="font-normal text-[16px] leading-[24px] text-[#535862]"
                    dangerouslySetInnerHTML={{ __html: m.body }}
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-[400px] h-[560px] bg-gradient-to-br from-[#cbd5e1] to-[#94a3b8] rounded-[8px]" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-[96px] bg-[#fafafa]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="max-w-[768px] mx-auto flex flex-col gap-[20px] text-center">
            <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">Our values</p>
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              What experts get from Proploy
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[64px]">
            {VALUES.map((v) => (
              <div key={v.title} className="flex flex-col items-center gap-[16px] text-center">
                <div className={`size-[48px] rounded-[10px] bg-white border border-[#d5d7da] flex items-center justify-center ${BUTTON_SKEUO_SHADOW}`}>
                  {v.icon}
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{v.title}</p>
                  <p
                    className="font-normal text-[16px] leading-[24px] text-[#535862]"
                    dangerouslySetInnerHTML={{ __html: v.body }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-[96px] bg-[#fafafa]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="flex flex-wrap items-start justify-between gap-y-[32px]">
            <div className="flex-1 min-w-[480px] max-w-[768px] flex flex-col gap-[20px]">
              <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
                The team behind Proploy
              </h2>
              <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
                Operators, marketplace builders, and former implementation leads working full-time on the expert network.
              </p>
            </div>
            <div className="flex gap-[12px]">
              <Link href="#" className={`bg-white border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}>
                Read our principles
              </Link>
              <Link href="#" className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}>
                We&apos;re hiring!
              </Link>
            </div>
          </div>

          <div className="flex gap-[32px] overflow-x-auto pb-[16px]">
            {TEAM.map((m) => (
              <article
                key={m.name}
                className="relative flex flex-col justify-end h-[512px] w-[384px] shrink-0 overflow-hidden rounded-[8px]"
                style={{ background: m.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                <div className="relative backdrop-blur-[12px] bg-white/30 border-t border-white/30 px-[20px] pt-[20px] pb-[24px] flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[8px] text-white">
                    <p className="font-semibold text-[20px] leading-[30px]">{m.name}</p>
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-semibold text-[16px] leading-[24px]">{m.role}</p>
                      <p className="font-normal text-[16px] leading-[24px]">{m.bio}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pt-[96px] pb-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="max-w-[768px] mx-auto flex flex-col gap-[20px] text-center">
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              Frequently asked questions
            </h2>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              Everything you need to know about joining the Proploy expert network.
            </p>
          </div>

          <div className="max-w-[768px] mx-auto w-full flex flex-col gap-[32px]">
            {FAQS.map((faq, i) => {
              const expanded = expandedFaq === i
              return (
                <div
                  key={faq.q}
                  className={`flex flex-col w-full ${i > 0 ? 'border-t border-[#e9eaeb] pt-[24px]' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expanded ? null : i)}
                    className="flex items-start gap-[16px] w-full text-left"
                  >
                    <div className="flex-1 flex flex-col gap-[4px]">
                      <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{faq.q}</p>
                      {expanded && (
                        <p
                          className="font-normal text-[14px] leading-[20px] text-[#535862]"
                          dangerouslySetInnerHTML={{ __html: faq.a }}
                        />
                      )}
                    </div>
                    <div className="shrink-0 pt-[2px] text-[#155eef]">
                      {expanded ? <Minus size={24} /> : <Plus size={24} />}
                    </div>
                  </button>
                </div>
              )
            })}
          </div>

          <div className="max-w-[1216px] mx-auto w-full bg-[#fafafa] rounded-[16px] pt-[32px] pb-[40px] px-[32px] flex flex-col items-center gap-[32px]">
            <div className="relative h-[56px] w-[120px]">
              <div className="absolute left-0 top-[8px] size-[48px] rounded-full border-[1.5px] border-white bg-[#e3c6d1]" />
              <div className="absolute left-[72px] top-[8px] size-[48px] rounded-full border-[1.5px] border-white bg-[#c6d0cb]" />
              <div className="absolute left-[32px] top-0 size-[56px] rounded-full border-[1.5px] border-white bg-[#ddc0ce]" />
            </div>
            <div className="max-w-[768px] flex flex-col items-center gap-[8px] text-center">
              <p className="font-semibold text-[20px] leading-[30px] text-[#181d27]">Still have questions?</p>
              <p className="font-normal text-[18px] leading-[28px] text-[#535862]">
                Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
              </p>
            </div>
            <Link
              href="#"
              className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[96px] border-t border-[#e9eaeb]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-wrap items-center gap-[64px]">
          <div className="flex-1 min-w-[420px] flex flex-col gap-[48px]">
            <div className="flex flex-col gap-[24px]">
              <h2 className="font-semibold text-[48px] leading-[60px] text-[#181d27] tracking-[-0.96px]">
                No long-term contracts.
                <br />
                No catches.
              </h2>
              <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
                Apply to join the Proploy expert network — review your first brief within two weeks.
              </p>
            </div>
            <div className="flex gap-[12px]">
              <Link
                href="#"
                className={`bg-white border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
              >
                Learn more
              </Link>
              <Link
                href="/become-expert"
                className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}
              >
                Get started
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[420px] h-[496px] relative">
            <div className="absolute size-[160px] left-[calc(50%-168px)] top-0 bg-gradient-to-br from-[#fde68a] to-[#c084fc] rounded-[4px] -translate-x-1/2" />
            <div className="absolute size-[160px] top-0 left-[calc(50%-8px)] bg-gradient-to-br from-[#fca5a5] to-[#f472b6] rounded-[4px] -translate-x-1/2" />
            <div className="absolute size-[160px] left-[calc(50%-184px)] top-[80px] bg-gradient-to-br from-[#86efac] to-[#22d3ee] rounded-[4px] -translate-x-1/2" />
            <div className="absolute w-[192px] h-[128px] left-[calc(50%-192px)] top-[256px] bg-gradient-to-br from-[#a5b4fc] to-[#818cf8] rounded-[4px] -translate-x-1/2" />
            <div className="absolute w-[192px] h-[128px] left-[calc(50%+192px)] top-[256px] bg-gradient-to-br from-[#fbcfe8] to-[#f9a8d4] rounded-[4px] -translate-x-1/2" />
            <div className="absolute w-[160px] h-[240px] left-1/2 top-[256px] bg-gradient-to-br from-[#bae6fd] to-[#7dd3fc] rounded-[4px] -translate-x-1/2" />
          </div>
        </div>
      </section>

    </div>
  )
}

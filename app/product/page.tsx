'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  MapPin,
  DollarSign,
  ChevronDown,
  SlidersHorizontal,
  List,
  Check,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'
import Footer from '@/components/Footer'
import FilterPanel from '@/components/FilterPanel'
import Link from 'next/link'

// ==================== FILTER DROPDOWN ====================
interface FilterOption { value: string; label: string }

function FilterDropdown({ icon, placeholder, options, width = 'w-[200px]' }: {
  icon: React.ReactNode
  placeholder: string
  options: FilterOption[]
  width?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedLabel = options.find(o => o.value === selected)?.label

  return (
    <div ref={ref} className={`${width} relative`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${isOpen ? 'border-[#2970ff] ring-1 ring-[#2970ff]' : 'border-[#d5d7da]'} flex items-center gap-[8px] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] overflow-hidden cursor-pointer hover:bg-[#fafafa] transition-colors`}
      >
        <span className="shrink-0 size-[20px] flex items-center justify-center text-[#535862]">{icon}</span>
        <span
          className={`flex-1 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[24px] text-left truncate ${selected ? 'font-medium text-[#181d27]' : 'font-normal text-[#717680]'}`}
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown size={20} className={`shrink-0 text-[#535862] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-[4px] z-50 bg-white border border-black/8 rounded-[8px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)] py-[4px] max-h-[280px] overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { setSelected(selected === opt.value ? null : opt.value); setIsOpen(false) }}
              className="flex items-center gap-[8px] px-[6px] py-px cursor-pointer"
            >
              <div className={`flex-1 flex items-center gap-[8px] px-[8px] py-[10px] rounded-[6px] ${selected === opt.value ? 'bg-[#fafafa]' : 'hover:bg-[#fafafa]'}`}>
                <span className="flex-1 font-[family-name:var(--font-dm-sans)] font-medium text-[16px] leading-[24px] text-[#181d27]" style={{ fontVariationSettings: "'opsz' 14" }}>
                  {opt.label}
                </span>
                {selected === opt.value && <Check size={20} className="shrink-0 text-[#155eef]" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const typeOptions: FilterOption[] = [
  { value: 'crm', label: 'CRM' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'pm', label: 'Project Management' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'support', label: 'Customer Support' },
  { value: 'collaboration', label: 'Collaboration' },
]
const locationOptions: FilterOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'eu', label: 'Europe' },
  { value: 'apac', label: 'Asia Pacific' },
  { value: 'global', label: 'Global' },
]
const priceOptions: FilterOption[] = [
  { value: 'free', label: 'Free' },
  { value: 'under25', label: 'Under $25/mo' },
  { value: 'under50', label: 'Under $50/mo' },
  { value: 'under100', label: 'Under $100/mo' },
  { value: 'enterprise', label: 'Enterprise' },
]

// ==================== ASSETS ====================
const imgAvatar = '/figma-assets/6424b0d14893954b1bbf127484daab7d652e2e3f.png'
const imgAvatar1 = '/figma-assets/ab9201148cfdefe023e21366139405f0dda8c4d3.png'
const imgAvatar2 = '/figma-assets/f411169b0890cb85aaf2ca68bc27e793bfc47b0c.png'
const imgLogomark = '/figma-assets/bd6923deae5eb38ca8077d0a4868cce6c2c83fde.svg'
const avatars = [imgAvatar, imgAvatar1, imgAvatar2]

// ==================== DATA ====================
const categories = [
  'View all',
  'CRM & Sales',
  'Marketing Automation',
  'Project Management',
  'Analytics & Business Intelligence',
  'Accounting & Finance',
  'HR & Recruitment',
  'Customer Support',
  'Collaboration Tools',
  'Security & Compliance',
]

const testimonials = [
  // Column 1
  [
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+34% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—something we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
  ],
  // Column 2
  [
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
  ],
  // Column 3
  [
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
    { name: 'The Product Name', badge: '+24% Sales Increase', quote: 'Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.' },
  ],
]

// ==================== ANIMATION HELPER ====================
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ==================== TESTIMONIAL CARD ====================
function TestimonialCard({ name, badge, quote }: { name: string; badge: string; quote: string }) {
  return (
    <div className="bg-white border border-[#e9eaeb] rounded-[12px] p-[32px] flex flex-col gap-[36px]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-start justify-between">
          {/* Company logo */}
          <div className="size-[48px] bg-white border border-[#d5d7da] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] overflow-hidden flex items-center justify-center relative">
            <img src={imgLogomark} alt="" className="w-[27px] h-[33px]" />
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
          </div>
          {/* Badge */}
          <div className="flex items-center gap-[6px] bg-[#eff8ff] border border-[#b2ddff] rounded-full pl-[8px] pr-[10px] py-[2px]">
            <span className="size-[8px] relative">
              <span className="absolute left-[1px] top-[1px] size-[6px] rounded-full bg-[#2e90fa]" />
            </span>
            <span
              className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#175cd3] whitespace-nowrap"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {badge}
            </span>
          </div>
        </div>
        <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[18px] leading-[28px] text-[#181d27]">
          {name}
        </p>
        <p
          className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#535862]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {quote}
        </p>
      </div>
      <div className="flex items-center justify-between">
        {/* Avatar group */}
        <div className="flex items-start pr-[8px]">
          {avatars.map((src, i) => (
            <div
              key={i}
              className={`size-[32px] rounded-full border-[0.75px] border-black/8 shadow-[0px_0px_0px_1.5px_white] overflow-hidden ${i > 0 ? '-ml-[8px]' : ''}`}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </div>
          ))}
        </div>
        {/* Learn More link */}
        <Link href="#" className="flex items-center gap-[4px]">
          <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#004eeb]">
            Learn More
          </span>
          <ArrowRight size={20} className="text-[#004eeb]" />
        </Link>
      </div>
    </div>
  )
}

// ==================== MAIN PAGE ====================
export default function ProductPage() {
  const [activeTab, setActiveTab] = useState('View all')
  const [showAllCards, setShowAllCards] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="relative bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-[96px] pb-[96px] bg-[#fafbfc] overflow-x-clip">
        {/* Background pattern */}
        <div className="-translate-x-1/2 absolute h-[1440px] left-1/2 top-0 w-[1920px] pointer-events-none">
          <img alt="" className="absolute inset-0 max-w-none size-full object-cover opacity-80" src="/figma-assets/background-pattern.png" />
        </div>
        <div className="max-w-[1280px] mx-auto px-[32px] relative z-10">
          <FadeUp>
            <div className="flex flex-col items-center gap-[48px]">
              {/* Heading area */}
              <div className="flex flex-col items-center gap-[24px] max-w-[1024px] w-full">
                {/* Badge group */}
                <div className="flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[10px] pl-[4px] pr-[8px] py-[4px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
                  <div className="flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[6px] px-[8px] py-[2px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
                    <span className="size-[8px] relative">
                      <span className="absolute left-[1px] top-[1px] size-[6px] rounded-full bg-[#17b26a]" />
                    </span>
                    <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
                      What&apos;s new?
                    </span>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]">
                      Fruition Joined!
                    </span>
                    <ArrowRight size={16} className="text-[#414651]" />
                  </div>
                </div>

                {/* Main heading */}
                <h1 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[60px] leading-[72px] text-[#181d27] text-center tracking-[-1.2px]">
                  Find the right product and expert to help streamline your business.
                </h1>

                {/* Supporting text */}
                <p
                  className="font-[family-name:var(--font-dm-sans)] font-normal text-[20px] leading-[30px] text-[#535862] text-center max-w-[768px]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Transform your software procurement today.
                </p>
              </div>

              {/* Search + Filters */}
              <div className="flex flex-col gap-[10px] items-center w-full max-w-[820px]">
                {/* Search bar row */}
                <div className="flex gap-[16px] items-start w-full">
                  <div className="flex-1 bg-white border border-[#d5d7da] flex gap-[8px] items-center px-[14px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] focus-within:border-[#2970ff] focus-within:ring-1 focus-within:ring-[#2970ff] transition-colors">
                    <input
                      type="text"
                      placeholder="Search products, industries, and experts "
                      className="flex-1 font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] bg-transparent outline-none"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    />
                  </div>
                  <Button variant="primary" size="xl" iconOnly leadingIcon={<Search size={20} />} />
                </div>

                {/* Filter row */}
                <div className="flex flex-wrap items-start justify-between w-full gap-y-[12px]">
                  <div className="flex gap-[12px]">
                    <FilterDropdown icon={<List size={20} />} placeholder="Any Type" options={typeOptions} />
                    <FilterDropdown icon={<MapPin size={20} />} placeholder="Any Location" options={locationOptions} />
                    <FilterDropdown icon={<DollarSign size={20} />} placeholder="Any price" options={priceOptions} width="w-[168px]" />
                  </div>

                  {/* More filters button */}
                  <Button
                    variant="secondary"
                    size="md"
                    leadingIcon={<SlidersHorizontal size={20} />}
                    onClick={() => setShowFilters(true)}
                  >
                    More filters
                  </Button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== TESTIMONIAL SECTION ===== */}
      <section className="pt-[96px]">
        {/* Heading */}
        <FadeUp>
          <div className="px-[32px]">
            <div className="flex flex-col items-center gap-[20px] max-w-[768px] mx-auto text-center">
              <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
                Close more deals, stress less.
              </h2>
              <p
                className="font-[family-name:var(--font-dm-sans)] font-normal text-[20px] leading-[30px] text-[#535862]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Hear first-hand from our incredible community of customers.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Category tabs */}
        <FadeUp delay={0.1}>
          <div className="px-[32px] mt-[32px]">
            <div className="flex justify-center">
              <div className="bg-[#fafafa] border border-[#e9eaeb] rounded-[12px] p-[6px] inline-flex flex-wrap gap-[4px] justify-center w-[1026px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`h-[44px] px-[12px] py-[8px] rounded-[6px] font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] whitespace-nowrap transition-all ${
                      activeTab === cat
                        ? 'bg-white text-[#414651] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_-1px_rgba(10,13,18,0.1)]'
                        : 'text-[#717680] hover:text-[#414651]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Cards grid */}
        <FadeUp delay={0.2}>
          <div className="max-w-[1280px] mx-auto px-[32px] mt-[64px]">
            <div className="relative">
              <div
                className={`grid grid-cols-3 gap-[32px] transition-all duration-500 ${
                  !showAllCards ? 'max-h-[1580px] overflow-hidden' : ''
                }`}
              >
                {testimonials.map((column, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-[32px]">
                    {column.map((card, cardIdx) => (
                      <TestimonialCard key={cardIdx} {...card} />
                    ))}
                  </div>
                ))}
              </div>
              {/* Gradient mask */}
              {!showAllCards && (
                <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            {/* Show more button */}
            <div className="flex justify-center mt-[60px]">
              <Button
                variant="secondary"
                size="xl"
                onClick={() => setShowAllCards(!showAllCards)}
                trailingIcon={
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${showAllCards ? 'rotate-180' : ''}`}
                  />
                }
              >
                {showAllCards ? 'Show less' : 'Show more'}
              </Button>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="bg-white py-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px]">
          <FadeUp>
            <div className="flex flex-col items-center gap-[64px]">
              {/* Heading */}
              <div className="flex flex-col items-center gap-[20px] max-w-[768px] text-center">
                <div className="flex flex-col gap-[12px] w-full">
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-[#004eeb]">
                    Contact us
                  </p>
                  <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
                    Can&apos;t See Your Product?
                  </h2>
                </div>
                <p
                  className="font-[family-name:var(--font-dm-sans)] font-normal text-[20px] leading-[30px] text-[#535862]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  We&apos;re constantly expanding and would love to hear from you. Tell us what&apos;s missing.
                  We&apos;ll reach out when it&apos;s live or connect you with an expert who can help.
                </p>
              </div>

              {/* Form */}
              <form
                className="flex flex-col gap-[32px] max-w-[480px] w-full"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-[24px]">
                  {/* Name row */}
                  <div className="flex gap-[32px]">
                    <InputField
                      label="First name"
                      required
                      placeholder="First name"
                      className="flex-1"
                    />
                    <InputField
                      label="Last name"
                      required
                      placeholder="Last name"
                      className="flex-1"
                    />
                  </div>

                  {/* Email */}
                  <InputField
                    label="Email"
                    required
                    placeholder="you@company.com"
                    inputType="email"
                  />

                  {/* Phone number */}
                  <div className="flex flex-col gap-[6px]">
                    <label
                      className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                      Phone number
                    </label>
                    <div className="bg-white border border-[#d5d7da] flex items-stretch rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] overflow-hidden focus-within:border-[#2970ff] focus-within:ring-1 focus-within:ring-[#2970ff] transition-colors">
                      <div className="flex items-center gap-[2px] pl-[14px] py-[10px] shrink-0 cursor-pointer">
                        <span
                          className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#535862]"
                          style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                          US
                        </span>
                        <ChevronDown size={16} className="text-[#535862]" />
                      </div>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="flex-1 pl-[12px] pr-[14px] py-[10px] font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] bg-transparent outline-none"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-[6px]">
                    <label
                      className="flex gap-[2px] font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                      Message <span className="text-[#155eef]">*</span>
                    </label>
                    <textarea
                      placeholder="Leave us a message..."
                      required
                      rows={4}
                      className="bg-white border border-[#d5d7da] px-[14px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none focus:border-[#2970ff] focus:ring-1 focus:ring-[#2970ff] transition-colors w-full resize-y"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    />
                  </div>

                  {/* Privacy checkbox */}
                  <div className="flex gap-[12px] items-start">
                    <div className="pt-[2px] shrink-0">
                      <input
                        type="checkbox"
                        className="size-[20px] rounded-[6px] border border-[#d5d7da] accent-[#155eef] cursor-pointer"
                      />
                    </div>
                    <p
                      className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#535862]"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                      You agree to our friendly{' '}
                      <Link href="#" className="underline">
                        privacy policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                {/* Submit button */}
                <Button variant="primary" size="xl" type="submit" className="w-full">
                  Send message
                </Button>
              </form>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== NEWSLETTER CTA SECTION ===== */}
      <section className="bg-[#0040c1] py-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px]">
          <FadeUp>
            <div className="flex flex-wrap gap-[32px] items-start">
              {/* Left: Heading + description */}
              <div className="flex-1 flex flex-col gap-[20px] min-w-[480px] max-w-[768px]">
                <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[36px] leading-[44px] text-white tracking-[-0.72px]">
                  Transform Your Software Procurement Strategy
                </h2>
                <p
                  className="font-[family-name:var(--font-dm-sans)] font-normal text-[20px] leading-[30px] text-[#b2ccff]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Join leading enterprises that have modernised their procurement operations and
                  achieved consistent, high-success implementation outcomes.
                </p>
              </div>

              {/* Right: Email input + Subscribe */}
              <div className="flex flex-col gap-[6px] w-[480px]">
                <div className="flex gap-[16px]">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white border border-[#d5d7da] px-[14px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  />
                  <Button variant="primary" size="xl">
                    Subscribe
                  </Button>
                </div>
                <p
                  className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#b2ccff]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  We care about your data in our{' '}
                  <Link href="#" className="underline">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />

      {/* ===== FILTER PANEL ===== */}
      <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </div>
  )
}

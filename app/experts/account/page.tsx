'use client'

import { useState } from 'react'
import {
  Search,
  Home,
  LayoutGrid,
  FolderClosed,
  Inbox,
  Wallet,
  Users,
  Settings,
  LifeBuoy,
  ChevronDown,
  ChevronsUpDown,
  UploadCloud,
  Pencil,
  CheckCircle2,
  Trash2,
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  X,
} from 'lucide-react'

const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'
const INPUT_SHADOW = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

type NavItem = {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: string
  active?: boolean
}

const NAV_PRIMARY: NavItem[] = [
  { label: 'Home', icon: Home },
  { label: 'Workspace', icon: LayoutGrid },
  { label: 'Projects', icon: FolderClosed },
  { label: 'Leads', icon: Inbox, badge: '12' },
  { label: 'Earnings', icon: Wallet },
  { label: 'Clients', icon: Users },
]

const NAV_SECONDARY: NavItem[] = [
  { label: 'Support', icon: LifeBuoy },
]

const TABS = [
  'My details',
  'Profile',
  'Password',
  'Team',
  'Plan',
  'Billing',
  'Email',
  'Notifications',
  'Integrations',
  'API',
] as const

const COUNTRIES = [
  { code: 'AU', label: 'Australia' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'SG', label: 'Singapore' },
] as const

const TIMEZONES = [
  'Pacific Standard Time (PST) UTC−08:00',
  'Mountain Standard Time (MST) UTC−07:00',
  'Central Standard Time (CST) UTC−06:00',
  'Eastern Standard Time (EST) UTC−05:00',
  'Greenwich Mean Time (GMT) UTC+00:00',
  'Central European Time (CET) UTC+01:00',
  'Australian Eastern Standard Time (AEST) UTC+10:00',
] as const

type PortfolioFile = {
  name: string
  size: string
  state: 'complete' | 'uploading'
  progress: number
  fileType: 'PDF' | 'MP4' | 'FIG'
}

const PORTFOLIO_FILES: PortfolioFile[] = [
  {
    name: 'SaaS sourcing case study.pdf',
    size: '320 KB of 320 KB',
    state: 'complete',
    progress: 100,
    fileType: 'PDF',
  },
  {
    name: 'Supplier scorecard walkthrough.mp4',
    size: '16 MB of 16 MB',
    state: 'uploading',
    progress: 40,
    fileType: 'MP4',
  },
  {
    name: 'RFP framework template.pdf',
    size: '4 MB of 4.2 MB',
    state: 'uploading',
    progress: 80,
    fileType: 'PDF',
  },
]

const FILE_TYPE_COLORS: Record<PortfolioFile['fileType'], string> = {
  PDF: '#d92d20',
  MP4: '#155eef',
  FIG: '#9e77ed',
}

export default function ExpertsAccountPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>('My details')
  const [firstName, setFirstName] = useState('Olivia')
  const [lastName, setLastName] = useState('Rhye')
  const [email, setEmail] = useState('olivia@proploy.io')
  const [role, setRole] = useState('Procurement Consultant')
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]['code']>(
    'AU',
  )
  const [timezone, setTimezone] = useState<(typeof TIMEZONES)[number]>(
    TIMEZONES[0],
  )
  const [bio, setBio] = useState(
    "I'm a Procurement Consultant based in Melbourne, Australia. I specialise in strategic sourcing, vendor negotiation and procure-to-pay rollouts for high-growth SaaS and industrial clients.",
  )

  return (
    <div className="min-h-screen bg-[#fafafa] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <div className="max-w-[1144px] mx-auto px-[32px] py-[32px] flex flex-col gap-[20px]">
            {/* Page header */}
            <div className="flex flex-col gap-[20px]">
              <div className="flex flex-wrap items-start justify-between gap-[16px]">
                <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">
                  Settings
                </h1>
                <div className="flex items-center gap-[12px]">
                  <button
                    type="button"
                    className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white hover:bg-[#004eeb] transition-colors ${BUTTON_SKEUO}`}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Horizontal tabs */}
              <div className="border-b border-[#e9eaeb]">
                <div className="flex items-center gap-[12px] overflow-x-auto">
                  {TABS.map((tab) => {
                    const active = activeTab === tab
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-[4px] py-[8px] -mb-px font-semibold text-[14px] leading-[20px] whitespace-nowrap transition-colors ${
                          active
                            ? 'text-[#155eef]'
                            : 'text-[#535862] hover:text-[#181d27]'
                        }`}
                      >
                        {tab}
                        {active && (
                          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#155eef] rounded-full" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Section header */}
            <div className="flex flex-col gap-[4px] pb-[20px] border-b border-[#e9eaeb]">
              <h2 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">
                Personal info
              </h2>
              <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                Update your photo and personal details here.
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col">
              <FormRow label="Name*">
                <div className="flex gap-[24px]">
                  <TextInput
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="First name"
                  />
                  <TextInput
                    value={lastName}
                    onChange={setLastName}
                    placeholder="Last name"
                  />
                </div>
              </FormRow>

              <Divider />

              <FormRow label="Email address*">
                <div className="relative">
                  <svg
                    className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#717680]"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.333 4.667 6.78 8.48a2.133 2.133 0 0 0 2.44 0l5.447-3.813M3.2 12.667h9.6c.747 0 1.12 0 1.405-.146.25-.128.454-.331.581-.581.146-.286.146-.659.146-1.405V5.466c0-.746 0-1.12-.145-1.405a1.333 1.333 0 0 0-.582-.582c-.286-.145-.659-.145-1.405-.145H3.2c-.747 0-1.12 0-1.405.145-.25.128-.454.332-.582.582-.145.285-.145.659-.145 1.405v5.067c0 .746 0 1.12.145 1.405.128.25.332.454.582.582.286.145.658.145 1.405.145Z"
                      stroke="currentColor"
                      strokeWidth="1.333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-white border border-[#d5d7da] rounded-[8px] pl-[40px] pr-[14px] py-[10px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/24 ${INPUT_SHADOW}`}
                  />
                </div>
              </FormRow>

              <Divider />

              <FormRow
                label="Your photo*"
                sublabel="This will be displayed on your profile."
                align="start"
              >
                <div className="flex items-start gap-[20px]">
                  <div
                    className="size-[64px] rounded-full shrink-0 bg-gradient-to-br from-[#fde68a] via-[#fbcfe8] to-[#c084fc] flex items-center justify-center text-white font-semibold text-[20px] border border-[rgba(0,0,0,0.08)]"
                    aria-label="Profile photo for Olivia"
                  >
                    O
                  </div>
                  <FileUpload
                    title="SVG, PNG, JPG or GIF (max. 800x400px)"
                  />
                </div>
              </FormRow>

              <Divider />

              <FormRow label="Role">
                <TextInput
                  value={role}
                  onChange={setRole}
                  placeholder="Role"
                />
              </FormRow>

              <Divider />

              <FormRow label="Country">
                <SelectField
                  value={country}
                  onChange={(v) =>
                    setCountry(v as (typeof COUNTRIES)[number]['code'])
                  }
                  options={COUNTRIES.map((c) => ({
                    value: c.code,
                    label: c.label,
                  }))}
                  leadingFlag={country}
                />
              </FormRow>

              <Divider />

              <FormRow label="Timezone">
                <SelectField
                  value={timezone}
                  onChange={(v) =>
                    setTimezone(v as (typeof TIMEZONES)[number])
                  }
                  options={TIMEZONES.map((t) => ({ value: t, label: t }))}
                  leadingIcon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M14.667 8A6.667 6.667 0 1 1 1.333 8a6.667 6.667 0 0 1 13.334 0ZM8 4.667V8l2 1.333"
                        stroke="#717680"
                        strokeWidth="1.333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />
              </FormRow>

              <Divider />

              <FormRow
                label="Bio*"
                sublabel="Write a short introduction."
                align="start"
              >
                <BioEditor value={bio} onChange={setBio} />
              </FormRow>

              <Divider />

              <FormRow
                label="Case studies"
                sublabel="Share a few past procurement engagements."
                align="start"
              >
                <div className="flex flex-col gap-[16px]">
                  <FileUpload title="SVG, PNG, JPG or GIF (max. 800x400px)" />
                  {PORTFOLIO_FILES.map((f) => (
                    <FileUploadItem key={f.name} file={f} />
                  ))}
                </div>
              </FormRow>
            </div>

            {/* Section footer */}
            <div className="flex items-center justify-end gap-[12px] pt-[20px] border-t border-[#e9eaeb]">
              <button
                type="button"
                className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white hover:bg-[#004eeb] transition-colors ${BUTTON_SKEUO}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[296px] shrink-0 sticky top-0 h-screen bg-white border-r border-[#e9eaeb] px-[16px] py-[24px] gap-[24px]">
      {/* Logo */}
      <div className="px-[8px] flex items-center gap-[10px]">
        <div className="size-[32px] rounded-[8px] bg-[#155eef] flex items-center justify-center text-white font-bold text-[14px]">
          p
        </div>
        <span className="font-semibold text-[18px] leading-[28px] text-[#181d27]">
          proploy
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]"
        />
        <input
          type="text"
          placeholder="Search"
          className={`w-full bg-white border border-[#d5d7da] rounded-[8px] pl-[36px] pr-[36px] py-[8px] text-[14px] leading-[20px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
        />
        <span className="absolute right-[10px] top-1/2 -translate-y-1/2 px-[6px] py-[2px] text-[12px] leading-[18px] text-[#717680] border border-[#e9eaeb] rounded-[4px] bg-white">
          ⌘K
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-[2px]">
        {NAV_PRIMARY.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings highlighted as active */}
      <nav className="flex flex-col gap-[2px]">
        <NavLink item={{ label: 'Settings', icon: Settings, active: true }} />
        {NAV_SECONDARY.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </nav>

      {/* Used space card */}
      <UsedSpaceCard />

      {/* User card */}
      <div className="flex items-center gap-[12px] p-[8px] rounded-[8px] hover:bg-[#fafafa] transition-colors">
        <div className="size-[40px] rounded-full bg-gradient-to-br from-[#fde68a] to-[#c084fc] flex items-center justify-center text-white font-semibold text-[14px] shrink-0">
          O
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">
            Olivia Rhye
          </p>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">
            olivia@proploy.io
          </p>
        </div>
        <button
          type="button"
          aria-label="More"
          className="text-[#717680] hover:text-[#414651] shrink-0"
        >
          <ChevronsUpDown size={16} />
        </button>
      </div>
    </aside>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      className={`flex items-center gap-[12px] px-[12px] py-[8px] rounded-[6px] text-left font-semibold text-[14px] leading-[20px] transition-colors ${
        item.active
          ? 'bg-[#fafafa] text-[#252b37]'
          : 'text-[#414651] hover:bg-[#fafafa]'
      }`}
    >
      <Icon size={20} className="text-[#717680] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="px-[8px] py-[2px] rounded-full border border-[#e9eaeb] bg-white text-[12px] leading-[18px] font-medium text-[#414651]">
          {item.badge}
        </span>
      )}
    </button>
  )
}

function UsedSpaceCard() {
  const pct = 80
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px] flex flex-col gap-[16px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">
            Used space
          </p>
          <p className="font-normal text-[12px] leading-[18px] text-[#535862]">
            Your team has used 80% of your available space. Need more?
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          className="text-[#a4a7ae] hover:text-[#535862] shrink-0"
        >
          <X size={14} />
        </button>
      </div>
      <RingProgress pct={pct} />
      <div className="flex items-center gap-[12px] text-[14px] leading-[20px] font-semibold">
        <button
          type="button"
          className="text-[#535862] hover:text-[#181d27]"
        >
          Dismiss
        </button>
        <button
          type="button"
          className="text-[#004eeb] hover:underline"
        >
          Upgrade plan
        </button>
      </div>
    </div>
  )
}

function RingProgress({ pct }: { pct: number }) {
  const size = 48
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="relative size-[48px]">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#e9eaeb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#155eef"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-semibold text-[10px] leading-[14px] text-[#181d27]">
        {pct}%
      </span>
    </div>
  )
}

type FormRowProps = {
  label: string
  sublabel?: string
  align?: 'center' | 'start'
  children: React.ReactNode
}

function FormRow({
  label,
  sublabel,
  align = 'center',
  children,
}: FormRowProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-[32px] gap-y-[16px] py-[20px] ${
        align === 'start' ? 'items-start' : 'items-center'
      }`}
    >
      <div className="flex flex-col gap-[2px]">
        <p className="font-semibold text-[14px] leading-[20px] text-[#414651]">
          {label}
        </p>
        {sublabel && (
          <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
            {sublabel}
          </p>
        )}
      </div>
      <div className="max-w-[512px] w-full">{children}</div>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-[#e9eaeb]" />
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/24 ${INPUT_SHADOW}`}
    />
  )
}

function SelectField({
  value,
  onChange,
  options,
  leadingIcon,
  leadingFlag,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  leadingIcon?: React.ReactNode
  leadingFlag?: string
}) {
  return (
    <div className="relative">
      {leadingFlag && (
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 size-[20px] rounded-full overflow-hidden bg-[#e9eaeb] flex items-center justify-center text-[10px] font-semibold text-[#414651]">
          {leadingFlag}
        </span>
      )}
      {leadingIcon && !leadingFlag && (
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2">
          {leadingIcon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-white border border-[#d5d7da] rounded-[8px] ${
          leadingFlag || leadingIcon ? 'pl-[42px]' : 'pl-[14px]'
        } pr-[40px] py-[10px] font-normal text-[16px] leading-[24px] text-[#181d27] focus:outline-none focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/24 ${INPUT_SHADOW}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#a4a7ae] pointer-events-none"
      />
    </div>
  )
}

function BioEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const max = 400
  return (
    <div
      className={`bg-white border border-[#d5d7da] rounded-[8px] overflow-hidden ${INPUT_SHADOW}`}
    >
      <div className="flex items-center gap-[8px] px-[14px] py-[10px] border-b border-[#e9eaeb]">
        <button
          type="button"
          className={`inline-flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] text-[14px] leading-[20px] font-medium text-[#414651] hover:bg-[#fafafa] ${BUTTON_SKEUO} border border-[#d5d7da] bg-white`}
        >
          Normal text
          <ChevronDown size={14} className="text-[#a4a7ae]" />
        </button>
        <span className="h-[20px] w-px bg-[#e9eaeb]" aria-hidden="true" />
        <ToolbarBtn ariaLabel="Bold">
          <Bold size={16} />
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Italic">
          <Italic size={16} />
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Insert link">
          <Link2 size={16} />
        </ToolbarBtn>
        <span className="h-[20px] w-px bg-[#e9eaeb]" aria-hidden="true" />
        <ToolbarBtn ariaLabel="Bulleted list">
          <List size={16} />
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Numbered list">
          <ListOrdered size={16} />
        </ToolbarBtn>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        rows={5}
        className="w-full px-[14px] py-[12px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none resize-y min-h-[140px]"
      />
      <div className="px-[14px] py-[10px] border-t border-[#e9eaeb] flex justify-end">
        <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
          {max - value.length} characters left
        </p>
      </div>
    </div>
  )
}

function ToolbarBtn({
  children,
  ariaLabel,
}: {
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="size-[28px] rounded-[6px] flex items-center justify-center text-[#535862] hover:bg-[#fafafa] hover:text-[#181d27]"
    >
      {children}
    </button>
  )
}

function FileUpload({ title }: { title: string }) {
  return (
    <div className="w-full bg-white border border-[#e9eaeb] rounded-[12px] px-[24px] py-[16px] flex flex-col items-center gap-[12px]">
      <div
        className={`size-[40px] rounded-[8px] bg-white border border-[#d5d7da] flex items-center justify-center text-[#414651] ${BUTTON_SKEUO}`}
      >
        <UploadCloud size={20} />
      </div>
      <div className="flex flex-col items-center gap-[4px]">
        <p className="font-normal text-[14px] leading-[20px] text-[#535862] text-center">
          <span className="font-semibold text-[#004eeb] hover:underline cursor-pointer">
            Click to upload
          </span>{' '}
          or drag and drop
        </p>
        <p className="font-normal text-[12px] leading-[18px] text-[#535862] text-center">
          {title}
        </p>
      </div>
    </div>
  )
}

function FileUploadItem({ file }: { file: PortfolioFile }) {
  const accent = FILE_TYPE_COLORS[file.fileType]
  return (
    <div className="relative w-full bg-white border border-[#e9eaeb] rounded-[12px] p-[16px] flex items-start gap-[12px]">
      <FileTypeIcon type={file.fileType} color={accent} />
      <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
        <div className="flex flex-col gap-[2px]">
          <p className="font-medium text-[14px] leading-[20px] text-[#414651] truncate">
            {file.name}
          </p>
          <div className="flex items-center gap-[8px]">
            <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">
              {file.size}
            </p>
            <span className="h-[12px] w-px bg-[#e9eaeb]" aria-hidden="true" />
            <div className="flex items-center gap-[4px]">
              {file.state === 'complete' ? (
                <>
                  <CheckCircle2 size={14} className="text-[#079455]" />
                  <span className="font-medium text-[14px] leading-[20px] text-[#079455]">
                    Complete
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud size={14} className="text-[#717680]" />
                  <span className="font-medium text-[14px] leading-[20px] text-[#717680]">
                    Uploading...
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[12px]">
          <div className="flex-1 h-[8px] rounded-full bg-[#e9eaeb] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#155eef]"
              style={{ width: `${file.progress}%` }}
            />
          </div>
          <span className="font-medium text-[14px] leading-[20px] text-[#414651] tabular-nums">
            {file.progress}%
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-label="Remove file"
        className="absolute right-[7px] top-[7px] size-[28px] rounded-[6px] flex items-center justify-center text-[#a4a7ae] hover:bg-[#fafafa] hover:text-[#535862]"
      >
        {file.state === 'complete' ? (
          <Trash2 size={16} />
        ) : (
          <Pencil size={16} />
        )}
      </button>
    </div>
  )
}

function FileTypeIcon({
  type,
  color,
}: {
  type: PortfolioFile['fileType']
  color: string
}) {
  return (
    <div className="relative shrink-0 w-[32px] h-[40px]">
      <svg
        viewBox="0 0 32 40"
        className="w-full h-full"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z"
          fill="#ffffff"
          stroke="#d5d7da"
        />
        <path
          d="M20 0v8a4 4 0 0 0 4 4h8"
          stroke="#d5d7da"
          fill="none"
        />
      </svg>
      <span
        className="absolute left-[1px] bottom-[6px] px-[3px] py-[1px] rounded-[2px] text-[10px] leading-[12px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {type}
      </span>
    </div>
  )
}

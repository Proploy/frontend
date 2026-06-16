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
  Plus,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MoreVertical,
  Monitor,
  Check,
  DownloadCloud,
  Mail,
} from 'lucide-react'

import { Sidebar as ExpertSidebar } from '@/components/experts/dashboard/ExpertDashboardFrame'

const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'
const INPUT_SHADOW = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

const TABS = [
  'My details',
  'Password',
  'Team',
  'Plan',
  'Billing',
  'Email',
  'Notifications',
  'Integrations',
  'API',
] as const

type Tab = (typeof TABS)[number]

// Badge counts shown next to certain tabs in the Figma designs.
const TAB_BADGES: Partial<Record<Tab, string>> = {
  Team: '48',
  Notifications: '2',
}

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

// ── Team tab data ──────────────────────────────────────────────────────────
type TeamMember = {
  name: string
  handle: string
  initials: string
  gradient: string
  status: 'Active' | 'Offline'
  email: string
  teams: string[]
}

const AVATAR_GRADIENTS = [
  'bg-gradient-to-br from-[#fde68a] via-[#fbcfe8] to-[#c084fc]',
  'bg-gradient-to-br from-[#a5f3fc] via-[#93c5fd] to-[#818cf8]',
  'bg-gradient-to-br from-[#fbcfe8] via-[#f9a8d4] to-[#f472b6]',
  'bg-gradient-to-br from-[#bbf7d0] via-[#86efac] to-[#34d399]',
  'bg-gradient-to-br from-[#fed7aa] via-[#fdba74] to-[#fb923c]',
  'bg-gradient-to-br from-[#ddd6fe] via-[#c4b5fd] to-[#a78bfa]',
]

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Olivia Bennett',
    handle: '@olivia',
    initials: 'OB',
    gradient: AVATAR_GRADIENTS[0],
    status: 'Active',
    email: 'olivia.bennett@proploy.io',
    teams: ['Strategic Sourcing', 'Category Management'],
  },
  {
    name: 'Marcus Hale',
    handle: '@marcus',
    initials: 'MH',
    gradient: AVATAR_GRADIENTS[1],
    status: 'Active',
    email: 'marcus.hale@proploy.io',
    teams: ['Contract Management', 'Vendor Management'],
  },
  {
    name: 'Priya Nair',
    handle: '@priya',
    initials: 'PN',
    gradient: AVATAR_GRADIENTS[2],
    status: 'Offline',
    email: 'priya.nair@proploy.io',
    teams: ['Spend Analytics', 'Category Management'],
  },
  {
    name: 'Daniel Osei',
    handle: '@daniel',
    initials: 'DO',
    gradient: AVATAR_GRADIENTS[3],
    status: 'Active',
    email: 'daniel.osei@proploy.io',
    teams: ['Strategic Sourcing', 'Vendor Management', 'Risk & Compliance'],
  },
  {
    name: 'Carla Mendez',
    handle: '@carla',
    initials: 'CM',
    gradient: 'bg-[#e9eaeb] !text-[#414651]',
    status: 'Offline',
    email: 'carla.mendez@proploy.io',
    teams: ['Contract Management', 'Risk & Compliance'],
  },
  {
    name: 'Naomi Wright',
    handle: '@naomi',
    initials: 'NW',
    gradient: AVATAR_GRADIENTS[4],
    status: 'Active',
    email: 'naomi.wright@proploy.io',
    teams: ['Spend Analytics', 'Strategic Sourcing'],
  },
  {
    name: 'Devon Clarke',
    handle: '@devon',
    initials: 'DC',
    gradient: AVATAR_GRADIENTS[5],
    status: 'Active',
    email: 'devon.clarke@proploy.io',
    teams: ['Vendor Management', 'Risk & Compliance', 'Spend Analytics'],
  },
  {
    name: 'Oliver Diaz',
    handle: '@oliver',
    initials: 'OD',
    gradient: AVATAR_GRADIENTS[1],
    status: 'Active',
    email: 'oliver.diaz@proploy.io',
    teams: ['Category Management', 'Contract Management'],
  },
]

const TEAM_DOT_COLORS: Record<string, string> = {
  'Strategic Sourcing': '#155eef',
  'Category Management': '#6938ef',
  'Contract Management': '#ee46bc',
  'Vendor Management': '#16b364',
  'Spend Analytics': '#ef6820',
  'Risk & Compliance': '#f04438',
}

// ── Billing tab data ───────────────────────────────────────────────────────
type Invoice = { label: string; date: string }

const INVOICES: Invoice[] = [
  { label: 'Invoice #007 – Dec 2025', date: 'Dec 1, 2025' },
  { label: 'Invoice #006 – Nov 2025', date: 'Nov 1, 2025' },
  { label: 'Invoice #005 – Oct 2025', date: 'Oct 1, 2025' },
  { label: 'Invoice #004 – Sep 2025', date: 'Sep 1, 2025' },
  { label: 'Invoice #003 – Aug 2025', date: 'Aug 1, 2025' },
  { label: 'Invoice #002 – Jul 2025', date: 'Jul 1, 2025' },
  { label: 'Invoice #001 – Jun 2025', date: 'Jun 1, 2025' },
]

// ── Notifications tab data ─────────────────────────────────────────────────
type NotifChannels = { push: boolean; email: boolean; sms: boolean }
type NotifRow = { key: string; title: string; desc: string; defaults: NotifChannels }

const NOTIFICATION_ROWS: NotifRow[] = [
  {
    key: 'leads',
    title: 'New leads',
    desc: 'Get notified when a new client lead matches your procurement expertise.',
    defaults: { push: true, email: true, sms: true },
  },
  {
    key: 'messages',
    title: 'Messages',
    desc: 'Replies from clients and updates on your active conversations.',
    defaults: { push: true, email: true, sms: false },
  },
  {
    key: 'projects',
    title: 'Project updates',
    desc: 'Milestones, deliverables and status changes on engagements you’re running.',
    defaults: { push: true, email: false, sms: false },
  },
  {
    key: 'payouts',
    title: 'Payments & payouts',
    desc: 'Invoices paid, payouts sent and changes to your earnings.',
    defaults: { push: false, email: true, sms: false },
  },
]

// ── Integrations tab data ──────────────────────────────────────────────────
type Integration = { key: string; name: string; desc: string; on: boolean }

const INTEGRATIONS: Integration[] = [
  {
    key: 'slack',
    name: 'Slack',
    desc: 'Get lead alerts and client messages in your channels.',
    on: true,
  },
  {
    key: 'docusign',
    name: 'DocuSign',
    desc: 'Send and track contracts and SOWs for e-signature.',
    on: true,
  },
  {
    key: 'quickbooks',
    name: 'QuickBooks',
    desc: 'Sync invoices and reconcile your Proploy payouts.',
    on: true,
  },
  {
    key: 'gdrive',
    name: 'Google Drive',
    desc: 'Attach proposals and deliverables straight from Drive.',
    on: true,
  },
  {
    key: 'hubspot',
    name: 'HubSpot',
    desc: 'Push client leads and engagements into your CRM.',
    on: true,
  },
  {
    key: 'zapier',
    name: 'Zapier',
    desc: 'Automate your sourcing workflow across 6,000+ apps.',
    on: false,
  },
]

export default function ExpertsAccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('My details')
  // "My details" toggles between a read-only view and an editable form.
  const [editing, setEditing] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafafa] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="flex">
        <ExpertSidebar />
        <div className="flex-1 min-w-0">
          <div className="max-w-[1144px] mx-auto px-[32px] py-[32px] flex flex-col gap-[20px]">
            {/* Page header */}
            <div className="flex flex-col gap-[20px]">
              {/* min-h keeps the tab bar at a constant offset whether or not
                  the header shows action buttons. */}
              <div className="flex flex-wrap items-center justify-between gap-[16px] min-h-[40px]">
                <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">
                  Settings
                </h1>
                {activeTab === 'My details' &&
                  (editing ? (
                    <div className="flex items-center gap-[12px]">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white hover:bg-[#004eeb] transition-colors ${BUTTON_SKEUO}`}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className={`inline-flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
                    >
                      <Pencil size={16} className="text-[#414651]" />
                      Edit
                    </button>
                  ))}
              </div>

              {/* Horizontal tabs */}
              <div className="border-b border-[#e9eaeb]">
                <div className="flex items-center gap-[12px] overflow-x-auto">
                  {TABS.map((tab) => {
                    const active = activeTab === tab
                    const badge = TAB_BADGES[tab]
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab)
                          setEditing(false)
                        }}
                        className={`relative px-[4px] py-[8px] -mb-px font-semibold text-[14px] leading-[20px] whitespace-nowrap transition-colors flex items-center gap-[8px] ${
                          active
                            ? 'text-[#155eef]'
                            : 'text-[#535862] hover:text-[#181d27]'
                        }`}
                      >
                        {tab}
                        {badge && (
                          <span className="px-[8px] py-[2px] rounded-full border border-[#e9eaeb] bg-white text-[12px] leading-[18px] font-medium text-[#414651]">
                            {badge}
                          </span>
                        )}
                        {active && (
                          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#155eef] rounded-full" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === 'My details' && (
              <MyDetailsPanel editing={editing} onDone={() => setEditing(false)} />
            )}
            {activeTab === 'Password' && <PasswordPanel />}
            {activeTab === 'Team' && <TeamPanel />}
            {activeTab === 'Billing' && <BillingPanel />}
            {activeTab === 'Notifications' && <NotificationsPanel />}
            {activeTab === 'Integrations' && <IntegrationsPanel />}
            {(activeTab === 'Plan' ||
              activeTab === 'Email' ||
              activeTab === 'API') && <ComingSoonPanel title={activeTab} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── My details panel ─────────────────────────────────────────────────────────
function MyDetailsPanel({ editing, onDone }: { editing: boolean; onDone: () => void }) {
  const [firstName, setFirstName] = useState('Olivia')
  const [lastName, setLastName] = useState('Bennett')
  const [email, setEmail] = useState('olivia.bennett@proploy.io')
  const [role, setRole] = useState('Procurement Consultant')
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]['code']>('AU')
  const [timezone, setTimezone] = useState<(typeof TIMEZONES)[number]>(TIMEZONES[6])
  const [bio, setBio] = useState(
    "Procurement consultant on Proploy with 12+ years across strategic sourcing, vendor negotiation and procure-to-pay rollouts. I help SaaS and industrial clients cut spend and de-risk their supplier base.",
  )
  const ro = !editing

  return (
    <>
      <SectionHeader
        title="Personal info"
        subtitle={
          editing
            ? 'Update your photo and personal details here.'
            : 'Your photo and personal details. Tap Edit to make changes.'
        }
      />

      <div className="flex flex-col">
        <FormRow label="Name*">
          <div className="flex gap-[24px]">
            <TextInput
              value={firstName}
              onChange={setFirstName}
              placeholder="First name"
              disabled={ro}
            />
            <TextInput
              value={lastName}
              onChange={setLastName}
              placeholder="Last name"
              disabled={ro}
            />
          </div>
        </FormRow>

        <Divider />

        <FormRow label="Email address*">
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#717680]"
            />
            <input
              type="email"
              value={email}
              disabled={ro}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-white border border-[#d5d7da] rounded-[8px] pl-[40px] pr-[14px] py-[10px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/24 disabled:bg-[#fafafa] disabled:text-[#414651] disabled:cursor-default ${INPUT_SHADOW}`}
            />
          </div>
        </FormRow>

        <Divider />

        <FormRow
          label="Your photo*"
          sublabel="This will be displayed on your Proploy profile."
          align="start"
        >
          <div className="flex items-start gap-[20px]">
            <div
              className="size-[64px] rounded-full shrink-0 bg-gradient-to-br from-[#fde68a] via-[#fbcfe8] to-[#c084fc] flex items-center justify-center text-white font-semibold text-[20px] border border-[rgba(0,0,0,0.08)]"
              aria-label="Profile photo for Olivia"
            >
              O
            </div>
            {editing && <FileUpload title="SVG, PNG, JPG or GIF (max. 800x400px)" />}
          </div>
        </FormRow>

        <Divider />

        <FormRow label="Role">
          <TextInput value={role} onChange={setRole} placeholder="Role" disabled={ro} />
        </FormRow>

        <Divider />

        <FormRow label="Country">
          <SelectField
            value={country}
            onChange={(v) => setCountry(v as (typeof COUNTRIES)[number]['code'])}
            options={COUNTRIES.map((c) => ({ value: c.code, label: c.label }))}
            leadingFlag={country}
            disabled={ro}
          />
        </FormRow>

        <Divider />

        <FormRow label="Timezone">
          <SelectField
            value={timezone}
            onChange={(v) => setTimezone(v as (typeof TIMEZONES)[number])}
            options={TIMEZONES.map((t) => ({ value: t, label: t }))}
            disabled={ro}
            leadingIcon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

        <FormRow label="Bio*" sublabel="Write a short introduction." align="start">
          <BioEditor value={bio} onChange={setBio} disabled={ro} />
        </FormRow>

        <Divider />

        <FormRow
          label="Case studies"
          sublabel="Share a few past procurement engagements."
          align="start"
        >
          <div className="flex flex-col gap-[16px]">
            {editing && <FileUpload title="PDF, MP4 or FIG (max. 25MB)" />}
            {PORTFOLIO_FILES.map((f) => (
              <FileUploadItem key={f.name} file={f} />
            ))}
          </div>
        </FormRow>
      </div>

      {editing && <FooterActions primaryLabel="Save" onCancel={onDone} onPrimary={onDone} />}
    </>
  )
}

// ── Password panel ───────────────────────────────────────────────────────────
function PasswordPanel() {
  const [current, setCurrent] = useState('············')
  const [next, setNext] = useState('············')
  const [confirm, setConfirm] = useState('············')

  const sessions = [
    {
      device: '2024 MacBook Pro 14-inch',
      location: 'Melbourne, Australia',
      when: '22 Jan at 10:40am',
      active: true,
    },
    {
      device: '2024 MacBook Pro 14-inch',
      location: 'Melbourne, Australia',
      when: '22 Jan at 4:20pm',
      active: false,
    },
  ]

  return (
    <>
      <SectionHeader
        title="Password"
        subtitle="Please enter your current password to change your password."
      />

      <div className="flex flex-col">
        <FormRow label="Current password*">
          <PasswordInput value={current} onChange={setCurrent} />
        </FormRow>

        <Divider />

        <FormRow label="New password*" align="start">
          <div className="flex flex-col gap-[6px]">
            <PasswordInput value={next} onChange={setNext} />
            <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
              Your new password must be more than 8 characters.
            </p>
          </div>
        </FormRow>

        <Divider />

        <FormRow label="Confirm new password*">
          <PasswordInput value={confirm} onChange={setConfirm} />
        </FormRow>
      </div>

      <FooterActions primaryLabel="Update password" />

      {/* Where you're logged in */}
      <div className="flex items-start justify-between gap-[16px] pt-[20px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">
            Where you&rsquo;re logged in
          </h2>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
            We&rsquo;ll alert you via{' '}
            <span className="font-semibold text-[#414651]">olivia.bennett@proploy.io</span> if
            there is any unusual activity on your account.
          </p>
        </div>
        <KebabButton />
      </div>

      <div className="flex flex-col">
        {sessions.map((s, i) => (
          <div key={i}>
            {i > 0 && <Divider />}
            <div className="flex items-center gap-[16px] py-[16px]">
              <div className="size-[40px] rounded-full bg-[#fafafa] border border-[#e9eaeb] flex items-center justify-center text-[#414651] shrink-0">
                <Monitor size={20} />
              </div>
              <div className="flex flex-col gap-[2px] min-w-0">
                <div className="flex items-center gap-[8px]">
                  <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">
                    {s.device}
                  </p>
                  {s.active && (
                    <span className="inline-flex items-center gap-[6px] px-[8px] py-[2px] rounded-full bg-white border border-[#d5d7da] text-[12px] leading-[18px] font-medium text-[#414651]">
                      <span className="size-[8px] rounded-full bg-[#17b26a]" />
                      Active now
                    </span>
                  )}
                </div>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">
                  {s.location} &middot; {s.when}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function PasswordInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-normal text-[16px] leading-[24px] text-[#181d27] focus:outline-none focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/24 ${INPUT_SHADOW}`}
    />
  )
}

// ── Team panel ───────────────────────────────────────────────────────────────
function TeamPanel() {
  return (
    <div
      className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden shadow-[0px_1px_2px_0px_rgba(10,13,18,0.06),0px_1px_3px_0px_rgba(10,13,18,0.10)]`}
    >
      {/* Card header */}
      <div className="flex flex-wrap items-start justify-between gap-[16px] px-[24px] pt-[20px] pb-[20px]">
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-[8px]">
            <h2 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">
              Team members
            </h2>
            <span className="px-[8px] py-[2px] rounded-full border border-[#e9eaeb] bg-white text-[12px] leading-[18px] font-medium text-[#414651]">
              48 users
            </span>
          </div>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
            Manage your team members and their account permissions here.
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            className={`inline-flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
          >
            <DownloadCloud size={16} className="text-[#414651]" />
            Download CSV
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white hover:bg-[#004eeb] transition-colors ${BUTTON_SKEUO}`}
          >
            <Plus size={16} />
            Add user
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-[#e9eaeb] bg-[#fafafa]">
              <Th className="pl-[24px]">
                <div className="flex items-center gap-[12px]">
                  <input type="checkbox" className="size-[16px] rounded-[4px] accent-[#155eef]" />
                  <SortHeader label="Name" />
                </div>
              </Th>
              <Th>
                <SortHeader label="Status" />
              </Th>
              <Th>
                <SortHeader label="Email address" />
              </Th>
              <Th>
                <SortHeader label="Teams" />
              </Th>
              <Th className="pr-[24px]" />
            </tr>
          </thead>
          <tbody>
            {TEAM_MEMBERS.map((m) => (
              <tr key={m.handle} className="border-b border-[#e9eaeb] last:border-b-0">
                <Td className="pl-[24px]">
                  <div className="flex items-center gap-[12px]">
                    <input
                      type="checkbox"
                      className="size-[16px] rounded-[4px] accent-[#155eef]"
                    />
                    <div
                      className={`size-[40px] rounded-full flex items-center justify-center text-white font-semibold text-[14px] shrink-0 border border-black/[0.08] ${m.gradient}`}
                    >
                      {m.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[14px] leading-[20px] text-[#181d27] whitespace-nowrap">
                        {m.name}
                      </span>
                      <span className="font-normal text-[14px] leading-[20px] text-[#535862]">
                        {m.handle}
                      </span>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className="inline-flex items-center gap-[6px] px-[8px] py-[2px] rounded-full bg-white border border-[#d5d7da] text-[12px] leading-[18px] font-medium text-[#414651]">
                    <span
                      className="size-[8px] rounded-full"
                      style={{ backgroundColor: m.status === 'Active' ? '#17b26a' : '#a4a7ae' }}
                    />
                    {m.status}
                  </span>
                </Td>
                <Td>
                  <span className="font-normal text-[14px] leading-[20px] text-[#535862] whitespace-nowrap">
                    {m.email}
                  </span>
                </Td>
                <Td>
                  <div className="flex items-center gap-[6px] flex-wrap">
                    {m.teams.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-[6px] px-[8px] py-[2px] rounded-full bg-white border border-[#d5d7da] text-[12px] leading-[18px] font-medium text-[#414651] whitespace-nowrap"
                      >
                        <span
                          className="size-[8px] rounded-full"
                          style={{ backgroundColor: TEAM_DOT_COLORS[t] ?? '#717680' }}
                        />
                        {t}
                      </span>
                    ))}
                  </div>
                </Td>
                <Td className="pr-[24px]">
                  <div className="flex items-center justify-end gap-[4px]">
                    <IconButton ariaLabel={`Delete ${m.name}`}>
                      <Trash2 size={16} />
                    </IconButton>
                    <IconButton ariaLabel={`Edit ${m.name}`}>
                      <Pencil size={16} />
                    </IconButton>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-[12px] px-[24px] py-[16px] border-t border-[#e9eaeb]">
        <button
          type="button"
          className={`inline-flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[8px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        <div className="hidden sm:flex items-center gap-[2px]">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              className={`size-[40px] rounded-[8px] font-medium text-[14px] leading-[20px] transition-colors ${
                n === 1
                  ? 'bg-[#fafafa] text-[#252b37]'
                  : 'text-[#535862] hover:bg-[#fafafa]'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`inline-flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[8px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
        >
          Next
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

function Th({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={`text-left font-semibold text-[12px] leading-[18px] text-[#717680] px-[24px] py-[12px] ${className}`}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <td className={`px-[24px] py-[16px] align-middle ${className}`}>{children}</td>
}

function SortHeader({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-[4px] text-[12px] leading-[18px] font-semibold text-[#717680]">
      {label}
      <ChevronsUpDown size={12} className="text-[#a4a7ae]" />
    </span>
  )
}

// ── Billing panel ────────────────────────────────────────────────────────────
function BillingPanel() {
  return (
    <>
      <SectionHeader title="Billing" subtitle="Manage your billing and payment details." />

      {/* Plan + payment method cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        {/* Plan card */}
        <div className="bg-white border border-[#e9eaeb] rounded-[12px] flex flex-col shadow-[0px_1px_2px_0px_rgba(10,13,18,0.06)]">
          <div className="flex items-start justify-between gap-[16px] p-[24px]">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center gap-[8px]">
                  <h3 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">
                    Pro plan
                  </h3>
                  <span className="px-[8px] py-[2px] rounded-full border border-[#d5d7da] bg-white text-[12px] leading-[18px] font-medium text-[#414651]">
                    Monthly
                  </span>
                </div>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  Everything you need to win and run client work on Proploy.
                </p>
              </div>
              <div className="flex flex-col gap-[8px] w-full max-w-[260px]">
                <p className="font-semibold text-[14px] leading-[20px] text-[#414651]">
                  14 of 20 client seats
                </p>
                <div className="h-[8px] rounded-full bg-[#e9eaeb] overflow-hidden">
                  <div className="h-full rounded-full bg-[#155eef]" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
            <p className="font-semibold text-[36px] leading-[44px] text-[#181d27] whitespace-nowrap tracking-[-0.02em]">
              $10
              <span className="font-normal text-[16px] leading-[24px] text-[#535862]">
                {' '}
                per month
              </span>
            </p>
          </div>
          <div className="px-[24px] py-[16px] border-t border-[#e9eaeb] flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline"
            >
              Upgrade plan
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Payment method card */}
        <div className="bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[16px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.06)]">
          <div className="flex flex-col gap-[4px]">
            <h3 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">
              Payment method
            </h3>
            <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
              Change how you pay for your plan.
            </p>
          </div>
          <div className="border border-[#e9eaeb] rounded-[12px] p-[16px] flex items-start gap-[16px]">
            <VisaLogo />
            <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
              <div className="flex flex-col gap-[2px]">
                <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">
                  Visa ending in 1234
                </p>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  Expiry 06/2025
                </p>
              </div>
              <p className="inline-flex items-center gap-[6px] font-normal text-[14px] leading-[20px] text-[#535862]">
                <Mail size={16} className="text-[#717680]" />
                billing@proploy.io
              </p>
            </div>
            <button
              type="button"
              className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[8px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Billing and invoicing */}
      <div className="flex flex-wrap items-start justify-between gap-[16px] pt-[20px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">
            Billing and invoicing
          </h2>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
            Pick an account plan that fits your workflow.
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            className={`inline-flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
          >
            <DownloadCloud size={16} className="text-[#414651]" />
            Download all
          </button>
          <KebabButton />
        </div>
      </div>

      {/* Invoices table */}
      <div className="bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden shadow-[0px_1px_2px_0px_rgba(10,13,18,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e9eaeb] bg-[#fafafa]">
                <Th className="pl-[24px]">
                  <div className="flex items-center gap-[12px]">
                    <input type="checkbox" className="size-[16px] rounded-[4px] accent-[#155eef]" />
                    <SortHeader label="Invoice" />
                  </div>
                </Th>
                <Th>
                  <span className="inline-flex items-center gap-[4px] text-[12px] leading-[18px] font-semibold text-[#717680]">
                    Billing date
                    <ChevronDown size={12} className="text-[#a4a7ae]" />
                  </span>
                </Th>
                <Th>
                  <SortHeader label="Status" />
                </Th>
                <Th>
                  <SortHeader label="Amount" />
                </Th>
                <Th>
                  <SortHeader label="Plan" />
                </Th>
                <Th className="pr-[24px]" />
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.label} className="border-b border-[#e9eaeb] last:border-b-0">
                  <Td className="pl-[24px]">
                    <div className="flex items-center gap-[12px]">
                      <input
                        type="checkbox"
                        className="size-[16px] rounded-[4px] accent-[#155eef]"
                      />
                      <PdfIcon />
                      <span className="font-medium text-[14px] leading-[20px] text-[#181d27] whitespace-nowrap">
                        {inv.label}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <span className="font-normal text-[14px] leading-[20px] text-[#535862] whitespace-nowrap">
                      {inv.date}
                    </span>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-[6px] px-[8px] py-[2px] rounded-full bg-[#ecfdf3] border border-[#abefc6] text-[12px] leading-[18px] font-medium text-[#067647]">
                      <Check size={12} className="text-[#17b26a]" />
                      Paid
                    </span>
                  </Td>
                  <Td>
                    <span className="font-normal text-[14px] leading-[20px] text-[#535862] whitespace-nowrap">
                      USD $10.00
                    </span>
                  </Td>
                  <Td>
                    <span className="font-normal text-[14px] leading-[20px] text-[#535862] whitespace-nowrap">
                      Pro plan
                    </span>
                  </Td>
                  <Td className="pr-[24px]">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── Notifications panel ──────────────────────────────────────────────────────
function NotificationsPanel() {
  const [state, setState] = useState<Record<string, NotifChannels>>(() =>
    Object.fromEntries(NOTIFICATION_ROWS.map((r) => [r.key, { ...r.defaults }])),
  )

  const set = (key: string, channel: keyof NotifChannels, value: boolean) =>
    setState((prev) => ({ ...prev, [key]: { ...prev[key], [channel]: value } }))

  return (
    <>
      <SectionHeader
        title="Notification settings"
        subtitle="We may still send you important notifications about your account outside of your notification settings."
      />

      <div className="flex flex-col">
        {NOTIFICATION_ROWS.map((row, i) => (
          <div key={row.key}>
            {i > 0 && <Divider />}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-[32px] gap-y-[16px] py-[20px] items-start">
              <div className="flex flex-col gap-[2px]">
                <p className="font-semibold text-[14px] leading-[20px] text-[#414651]">
                  {row.title}
                </p>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  {row.desc}
                </p>
              </div>
              <div className="flex flex-col gap-[16px]">
                <ToggleRow
                  label="Push"
                  on={state[row.key].push}
                  onChange={(v) => set(row.key, 'push', v)}
                />
                <ToggleRow
                  label="Email"
                  on={state[row.key].email}
                  onChange={(v) => set(row.key, 'email', v)}
                />
                <ToggleRow
                  label="SMS"
                  on={state[row.key].sms}
                  onChange={(v) => set(row.key, 'sms', v)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function ToggleRow({
  label,
  on,
  onChange,
}: {
  label: string
  on: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-[8px] cursor-pointer">
      <Toggle on={on} onChange={onChange} ariaLabel={label} />
      <span className="font-medium text-[14px] leading-[20px] text-[#414651]">{label}</span>
    </label>
  )
}

// ── Integrations panel ───────────────────────────────────────────────────────
function IntegrationsPanel() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INTEGRATIONS.map((a) => [a.key, a.on])),
  )

  return (
    <>
      {/* Update banner */}
      <div className="bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden flex flex-col sm:flex-row shadow-[0px_1px_2px_0px_rgba(10,13,18,0.06)]">
        <div
          className="w-full sm:w-[204px] h-[140px] sm:h-auto shrink-0 bg-gradient-to-br from-[#fbcfe8] via-[#c4b5fd] to-[#93c5fd]"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-[16px] p-[24px]">
          <div className="flex flex-col gap-[4px]">
            <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
              Proploy just got an upgrade!
            </p>
            <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
              Your new expert dashboard surfaces hotter leads and faster payouts.
            </p>
          </div>
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              Dismiss
            </button>
            <button
              type="button"
              className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white hover:bg-[#004eeb] transition-colors ${BUTTON_SKEUO}`}
            >
              Changelog
            </button>
          </div>
        </div>
      </div>

      {/* Connected apps header */}
      <div className="flex flex-wrap items-start justify-between gap-[16px] pt-[20px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">
            Connected apps
          </h2>
          <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
            Supercharge your workflow and connect the tool you use every day.
          </p>
        </div>
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={16}
            className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#717680]"
          />
          <input
            type="text"
            placeholder="Search"
            className={`w-full bg-white border border-[#d5d7da] rounded-[8px] pl-[40px] pr-[40px] py-[10px] text-[14px] leading-[20px] placeholder:text-[#717680] focus:outline-none focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/24 ${INPUT_SHADOW}`}
          />
          <span className="absolute right-[10px] top-1/2 -translate-y-1/2 px-[6px] py-[2px] text-[12px] leading-[18px] text-[#717680] border border-[#e9eaeb] rounded-[4px] bg-white">
            ⌘K
          </span>
        </div>
      </div>

      {/* App list */}
      <div className="flex flex-col">
        {INTEGRATIONS.map((app, i) => (
          <div key={app.key}>
            {i > 0 && <Divider />}
            <div className="flex items-center gap-[16px] py-[16px]">
              <BrandLogo name={app.key} />
              <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                  {app.name}
                </p>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  {app.desc}
                </p>
              </div>
              <button
                type="button"
                className="font-semibold text-[14px] leading-[20px] text-[#535862] hover:text-[#181d27] whitespace-nowrap"
              >
                Learn more
              </button>
              <Toggle
                on={state[app.key]}
                onChange={(v) => setState((p) => ({ ...p, [app.key]: v }))}
                ariaLabel={`Toggle ${app.name}`}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function ComingSoonPanel({ title }: { title: string }) {
  return (
    <>
      <SectionHeader title={title} subtitle={`The ${title} settings are coming soon.`} />
      <div className="flex items-center justify-center py-[64px] text-center">
        <p className="font-normal text-[14px] leading-[20px] text-[#717680] max-w-[360px]">
          This section hasn&rsquo;t been designed yet. Pick another tab to manage your account.
        </p>
      </div>
    </>
  )
}

// ── Shared presentational pieces ─────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-[4px] pb-[20px] border-b border-[#e9eaeb]">
      <h2 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{title}</h2>
      <p className="font-normal text-[14px] leading-[20px] text-[#535862]">{subtitle}</p>
    </div>
  )
}

function FooterActions({
  primaryLabel,
  onCancel,
  onPrimary,
}: {
  primaryLabel: string
  onCancel?: () => void
  onPrimary?: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-[12px] pt-[20px] border-t border-[#e9eaeb]">
      <button
        type="button"
        onClick={onCancel}
        className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onPrimary}
        className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white hover:bg-[#004eeb] transition-colors ${BUTTON_SKEUO}`}
      >
        {primaryLabel}
      </button>
    </div>
  )
}

function Toggle({
  on,
  onChange,
  ariaLabel,
}: {
  on: boolean
  onChange: (v: boolean) => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => onChange(!on)}
      className={`relative w-[36px] h-[20px] rounded-full p-[2px] transition-colors shrink-0 focus:outline-none focus:ring-4 focus:ring-[#155eef]/24 ${
        on ? 'bg-[#155eef]' : 'bg-[#e9eaeb]'
      }`}
    >
      <span
        className={`block size-[16px] rounded-full bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.10)] transition-transform ${
          on ? 'translate-x-[16px]' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function IconButton({
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
      className="size-[36px] rounded-[8px] flex items-center justify-center text-[#a4a7ae] hover:bg-[#fafafa] hover:text-[#535862] transition-colors"
    >
      {children}
    </button>
  )
}

function KebabButton() {
  return (
    <button
      type="button"
      aria-label="More options"
      className="size-[36px] rounded-[8px] flex items-center justify-center text-[#a4a7ae] hover:bg-[#fafafa] hover:text-[#535862] shrink-0"
    >
      <MoreVertical size={20} />
    </button>
  )
}

function PdfIcon() {
  return (
    <div className="relative shrink-0 w-[32px] h-[40px]">
      <svg viewBox="0 0 32 40" className="w-full h-full" fill="none" aria-hidden="true">
        <path
          d="M0 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z"
          fill="#ffffff"
          stroke="#d5d7da"
        />
        <path d="M20 0v8a4 4 0 0 0 4 4h8" stroke="#d5d7da" fill="none" />
      </svg>
      <span
        className="absolute left-[1px] bottom-[6px] px-[3px] py-[1px] rounded-[2px] text-[10px] leading-[12px] font-bold text-white"
        style={{ backgroundColor: '#d92d20' }}
      >
        PDF
      </span>
    </div>
  )
}

function VisaLogo() {
  return (
    <div className="w-[46px] h-[32px] rounded-[6px] border border-[#e9eaeb] bg-white flex items-center justify-center shrink-0">
      <span className="font-bold italic text-[14px] leading-none tracking-[-0.02em] text-[#1a1f71]">
        VISA
      </span>
    </div>
  )
}

function BrandLogo({ name }: { name: string }) {
  const wrap = (children: React.ReactNode, bg = 'bg-white') => (
    <div
      className={`size-[40px] rounded-[10px] border border-[#e9eaeb] flex items-center justify-center shrink-0 ${bg}`}
    >
      {children}
    </div>
  )

  switch (name) {
    case 'docusign':
      return wrap(
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="5" fill="#ffcc00" />
          <path
            d="M6 12.5 10 16.5 18 7.5"
            stroke="#1a1a1a"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>,
      )
    case 'quickbooks':
      return wrap(
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="#2ca01c" />
          <text
            x="12"
            y="16.5"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#fff"
            fontFamily="sans-serif"
          >
            qb
          </text>
        </svg>,
      )
    case 'gdrive':
      return wrap(
        <svg width="22" height="20" viewBox="0 0 87 78" aria-hidden="true">
          <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
          <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
          <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
          <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
          <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
          <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
        </svg>,
      )
    case 'hubspot':
      return wrap(
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ff7a59" aria-hidden="true">
          <path d="M17 8.2V5.6a2 2 0 1 0-2 0v2.6a6 6 0 0 0-2.4 1l-6-4.7a2.3 2.3 0 1 0-1.2 1.6l5.9 4.6a6 6 0 1 0 8.9-.9 6 6 0 0 0-1.2-.6Zm-2.5 9.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
        </svg>,
      )
    case 'zapier':
      return wrap(
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14.5 12a8.6 8.6 0 0 1-.3 2.2 8.6 8.6 0 0 1-2.2.3 8.6 8.6 0 0 1-2.2-.3A8.6 8.6 0 0 1 9.5 12a8.6 8.6 0 0 1 .3-2.2A8.6 8.6 0 0 1 12 9.5a8.6 8.6 0 0 1 2.2.3 8.6 8.6 0 0 1 .3 2.2ZM24 10.6h-6.8l4.8-4.8-1.7-1.7-4.8 4.8V2.1h-2.4v6.8L8.3 4.1 6.6 5.8l4.8 4.8H4.6v2.4h6.8l-4.8 4.8 1.7 1.7 4.8-4.8v6.8h2.4v-6.8l4.8 4.8 1.7-1.7-4.8-4.8H24Z"
            fill="#ff4f00"
          />
        </svg>,
      )
    case 'slack':
      return wrap(
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5.04 15.1a2.1 2.1 0 1 1-2.1-2.1h2.1v2.1Zm1.06 0a2.1 2.1 0 0 1 4.2 0v5.26a2.1 2.1 0 1 1-4.2 0V15.1Z"
            fill="#e01e5a"
          />
          <path
            d="M8.2 5.04a2.1 2.1 0 1 1 2.1-2.1v2.1H8.2Zm0 1.06a2.1 2.1 0 0 1 0 4.2H2.94a2.1 2.1 0 1 1 0-4.2H8.2Z"
            fill="#36c5f0"
          />
          <path
            d="M18.96 8.2a2.1 2.1 0 1 1 2.1 2.1h-2.1V8.2Zm-1.06 0a2.1 2.1 0 0 1-4.2 0V2.94a2.1 2.1 0 1 1 4.2 0V8.2Z"
            fill="#2eb67d"
          />
          <path
            d="M15.8 18.96a2.1 2.1 0 1 1-2.1 2.1v-2.1h2.1Zm0-1.06a2.1 2.1 0 0 1 0-4.2h5.26a2.1 2.1 0 1 1 0 4.2H15.8Z"
            fill="#ecb22e"
          />
        </svg>,
      )
    default:
      return wrap(<span className="font-bold text-[#414651]">{name.charAt(0).toUpperCase()}</span>)
  }
}


type FormRowProps = {
  label: string
  sublabel?: string
  align?: 'center' | 'start'
  children: React.ReactNode
}

function FormRow({ label, sublabel, align = 'center', children }: FormRowProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-[32px] gap-y-[16px] py-[20px] ${
        align === 'start' ? 'items-start' : 'items-center'
      }`}
    >
      <div className="flex flex-col gap-[2px]">
        <p className="font-semibold text-[14px] leading-[20px] text-[#414651]">{label}</p>
        {sublabel && (
          <p className="font-normal text-[14px] leading-[20px] text-[#535862]">{sublabel}</p>
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
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/24 disabled:bg-[#fafafa] disabled:text-[#414651] disabled:cursor-default ${INPUT_SHADOW}`}
    />
  )
}

function SelectField({
  value,
  onChange,
  options,
  leadingIcon,
  leadingFlag,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  leadingIcon?: React.ReactNode
  leadingFlag?: string
  disabled?: boolean
}) {
  return (
    <div className="relative">
      {leadingFlag && (
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 size-[20px] rounded-full overflow-hidden bg-[#e9eaeb] flex items-center justify-center text-[10px] font-semibold text-[#414651]">
          {leadingFlag}
        </span>
      )}
      {leadingIcon && !leadingFlag && (
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2">{leadingIcon}</span>
      )}
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-white border border-[#d5d7da] rounded-[8px] ${
          leadingFlag || leadingIcon ? 'pl-[42px]' : 'pl-[14px]'
        } pr-[40px] py-[10px] font-normal text-[16px] leading-[24px] text-[#181d27] focus:outline-none focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/24 disabled:bg-[#fafafa] disabled:text-[#414651] disabled:cursor-default ${INPUT_SHADOW}`}
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
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  const max = 400
  return (
    <div
      className={`bg-white border border-[#d5d7da] rounded-[8px] overflow-hidden ${
        disabled ? 'bg-[#fafafa]' : ''
      } ${INPUT_SHADOW}`}
    >
      <div
        className={`flex items-center gap-[8px] px-[14px] py-[10px] border-b border-[#e9eaeb] ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
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
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        rows={5}
        className="w-full px-[14px] py-[12px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none resize-y min-h-[140px] disabled:bg-[#fafafa] disabled:text-[#414651] disabled:cursor-default"
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
        <p className="font-normal text-[12px] leading-[18px] text-[#535862] text-center">{title}</p>
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
            <div className="h-full rounded-full bg-[#155eef]" style={{ width: `${file.progress}%` }} />
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
        {file.state === 'complete' ? <Trash2 size={16} /> : <Pencil size={16} />}
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
      <svg viewBox="0 0 32 40" className="w-full h-full" fill="none" aria-hidden="true">
        <path
          d="M0 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z"
          fill="#ffffff"
          stroke="#d5d7da"
        />
        <path d="M20 0v8a4 4 0 0 0 4 4h8" stroke="#d5d7da" fill="none" />
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

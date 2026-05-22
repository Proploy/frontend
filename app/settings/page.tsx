'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail, Shield, UserRound } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useUserSettings } from '@/hooks/use-user-settings'
import type { AccountSettingsViewModel } from '@/hooks/types/settings-view-models'

const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

export default function SettingsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { settings, loading, saving, error, updateSettings } = useUserSettings({
    enabled: Boolean(user && !isAuthLoading),
  })

  if (isAuthLoading || loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] pt-[120px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#155eef]" />
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fafafa] pt-[120px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
        <EmptySettingsState
          title="Sign in required"
          body="Use your Proploy account to access settings."
          actionHref="/sign-in?redirect=/settings"
          actionLabel="Sign in"
        />
      </main>
    )
  }

  if (!settings) {
    return (
      <main className="min-h-screen bg-[#fafafa] pt-[120px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
        <EmptySettingsState
          title="Settings unavailable"
          body={error?.error.message ?? 'Your account settings could not be loaded.'}
          actionHref="/"
          actionLabel="Go home"
        />
      </main>
    )
  }

  return (
    <SettingsContent
      key={settings.id}
      settings={settings}
      saving={saving}
      errorMessage={error?.error.message ?? null}
      onSave={async (name) => {
        const result = await updateSettings({ name: name.trim() || null })
        return result.ok
      }}
    />
  )
}

function SettingsContent({
  settings,
  saving,
  errorMessage,
  onSave,
}: {
  settings: AccountSettingsViewModel
  saving: boolean
  errorMessage: string | null
  onSave: (name: string) => Promise<boolean>
}) {
  const [name, setName] = useState(settings.name)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const avatarSrc = settings.profilePictureUrl || settings.avatarUrl

  const handleSave = async () => {
    setSaveMessage(null)
    const ok = await onSave(name)
    if (ok) setSaveMessage('Settings saved.')
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pt-[120px] pb-16 font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-8 px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/experts/dashboard" className="mb-4 inline-flex items-center gap-2 text-[14px] leading-[20px] font-semibold text-[#004eeb] hover:underline">
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>
            <h1 className="text-[28px] leading-[36px] font-semibold">Settings</h1>
            <p className="mt-1 text-[16px] leading-[24px] text-[#535862]">
              Account settings are loaded from service-apis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className={`inline-flex items-center justify-center rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] leading-[20px] font-semibold text-white disabled:opacity-60 ${BUTTON_SKEUO}`}
          >
            {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
            Save changes
          </button>
        </div>

        <section className="rounded-[16px] border border-[#e9eaeb] bg-white p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="relative size-20 overflow-hidden rounded-full bg-gradient-to-br from-[#dbeafe] to-[#c084fc]">
              {avatarSrc ? (
                <Image src={avatarSrc} alt={settings.name} fill className="object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-[28px] font-semibold text-white">
                  {settings.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[22px] leading-[30px] font-semibold">{settings.name}</p>
              <p className="mt-1 text-[15px] leading-[22px] text-[#535862]">{settings.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <label className="grid gap-1.5">
              <span className="text-[14px] leading-[20px] font-medium text-[#414651]">Display name</span>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setSaveMessage(null)
                }}
                className="h-11 rounded-[8px] border border-[#d5d7da] bg-white px-3 text-[15px] leading-[22px] outline-none focus:border-[#2970ff] focus:ring-1 focus:ring-[#2970ff]"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SettingsInfo icon={<Mail size={18} />} label="Email" value={settings.email} />
              <SettingsInfo icon={<Shield size={18} />} label="Role" value={settings.role} />
              <SettingsInfo icon={<UserRound size={18} />} label="Created" value={settings.createdAtLabel} />
            </div>

            {errorMessage && (
              <p className="flex items-center gap-2 text-[14px] leading-[20px] text-[#d92d20]">
                <AlertCircle size={16} />
                {errorMessage}
              </p>
            )}
            {saveMessage && (
              <p className="flex items-center gap-2 text-[14px] leading-[20px] text-[#067647]">
                <CheckCircle2 size={16} />
                {saveMessage}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function SettingsInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[12px] bg-[#fafafa] p-4">
      <span className="mt-0.5 text-[#717680]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[13px] leading-[18px] font-medium text-[#717680]">{label}</p>
        <p className="break-words text-[15px] leading-[22px] font-medium text-[#181d27]">{value}</p>
      </div>
    </div>
  )
}

function EmptySettingsState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string
  body: string
  actionHref: string
  actionLabel: string
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-[520px] rounded-[16px] border border-[#e9eaeb] bg-white p-8 text-center">
        <h1 className="text-[24px] leading-[32px] font-semibold">{title}</h1>
        <p className="mt-2 text-[15px] leading-[22px] text-[#535862]">{body}</p>
        <Link
          href={actionHref}
          className={`mt-6 inline-flex rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] leading-[20px] font-semibold text-white ${BUTTON_SKEUO}`}
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  )
}

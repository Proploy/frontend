'use client'

import { FileText, LockKeyhole } from 'lucide-react'
import {
  CARD_SHADOW,
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import { useCurrentUserRole } from '@/features/workspace'

export function WorkspaceModuleGap({
  title,
  body,
  endpoint,
  expertOnly = false,
}: {
  title: string
  body: string
  endpoint: string
  expertOnly?: boolean
}) {
  const state = useCurrentUserRole()
  const allowed = !expertOnly || state.role === 'expert' || state.role === 'admin'

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace" />

  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-h-[60vh] items-center justify-center px-[24px] py-[48px]">
        <section className={`max-w-[560px] rounded-[16px] border border-[#e9eaeb] bg-white p-[32px] text-center ${CARD_SHADOW}`}>
          <div className="mx-auto flex size-[56px] items-center justify-center rounded-full bg-[#eff4ff] text-[#155eef]">
            {allowed ? <FileText size={28} /> : <LockKeyhole size={28} />}
          </div>
          <h1 className="mt-[16px] text-[24px] font-semibold leading-[32px] text-[#181d27]">{title}</h1>
          <p className="mt-[8px] text-[15px] leading-[24px] text-[#535862]">
            {allowed ? body : 'This workspace section is available to approved expert accounts.'}
          </p>
          {allowed && (
            <p className="mt-[16px] rounded-[8px] border border-[#fedf89] bg-[#fffaeb] px-[12px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
              Waiting on service-apis: {endpoint}
            </p>
          )}
        </section>
      </main>
    </WorkspaceShell>
  )
}

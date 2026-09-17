'use client'

import { FileText, LockKeyhole } from 'lucide-react'
import {

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
  const allowed = !expertOnly || state.role === 'expert'

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace" />

  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-h-[60vh] items-center justify-center px-[24px] py-[48px]">
        <section className="pf-card max-w-[560px] p-[32px] text-center">
          <div className="mx-auto flex size-[56px] items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
            {allowed ? <FileText size={28} /> : <LockKeyhole size={28} />}
          </div>
          <h1 className="pf-title mt-[16px]">{title}</h1>
          <p className="mt-[8px] text-[15px] leading-[24px] text-ink-soft">
            {allowed ? body : 'This workspace section is available to approved expert accounts.'}
          </p>
          {allowed && (
            <p className="mt-[16px] rounded-[8px] border border-warn-line bg-warn-soft px-[12px] py-[10px] text-[13px] leading-[18px] text-warn">
              Waiting on service-apis: {endpoint}
            </p>
          )}
        </section>
      </main>
    </WorkspaceShell>
  )
}

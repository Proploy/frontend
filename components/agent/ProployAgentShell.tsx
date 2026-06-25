'use client'

import type { ReactNode } from 'react'

import { ProployAgentProvider } from './proploy-agent-context'
import ProployResearchPanel from './ProployResearchPanel'

function ShellContent({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ProployResearchPanel />
    </>
  )
}

export default function ProployAgentShell({ children }: { children: ReactNode }) {
  return (
    <ProployAgentProvider>
      <ShellContent>{children}</ShellContent>
    </ProployAgentProvider>
  )
}

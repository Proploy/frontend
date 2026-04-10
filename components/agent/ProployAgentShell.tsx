'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { ProployAgentProvider, useProployAgent } from './proploy-agent-context'
import ProployResearchPanel from './ProployResearchPanel'

function ShellContent({ children }: { children: ReactNode }) {
  const { setIsOpen, pageContext } = useProployAgent()

  useEffect(() => {
    if (pageContext.pageType === 'product') {
      setIsOpen(true)
    }
  }, [pageContext.pageType, setIsOpen])

  return (
    <>
      <main className="flex-1 pt-20">{children}</main>
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

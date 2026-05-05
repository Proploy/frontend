'use client'

import { useEffect } from 'react'

import { useProployAgent } from './proploy-agent-context'

export default function AgentContextBridge({
  context,
}: {
  context: Record<string, unknown>
}) {
  const { setPageContext } = useProployAgent()

  useEffect(() => {
    setPageContext(context)
  }, [context, setPageContext])

  return null
}

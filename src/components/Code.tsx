import React from 'react'

interface CodeProps {
  children: React.ReactNode
}

export function Code({ children }: CodeProps) {
  return <code className="px-1.5 py-0.5 rounded bg-zinc-100 font-mono text-sm">{children}</code>
}

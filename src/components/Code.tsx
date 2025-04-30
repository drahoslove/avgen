import React from 'react'

export const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="bg-zinc-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
)

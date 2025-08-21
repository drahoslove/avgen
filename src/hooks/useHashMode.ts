import { useEffect, useState } from 'react'
import { modeSchema, Mode } from '../constants/modes'

export const useHashMode = (defaultMode: Mode = 'default'): Mode => {
  const [mode, setMode] = useState<Mode>(() => {
    // Get initial mode from hash or use default
    const hash = window.location.hash.slice(1)
    return modeSchema.safeParse(hash).success ? (hash as Mode) : defaultMode
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      setMode(modeSchema.safeParse(hash).success ? (hash as Mode) : defaultMode)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [defaultMode])

  return mode
}

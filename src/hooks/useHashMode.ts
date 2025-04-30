import { useEffect, useState } from 'react'
import { ContentStyle } from '../components/Content'
import { styleSchema } from '../constants/styles'

export const useHashMode = (defaultMode: ContentStyle = 'default'): ContentStyle => {
  const [mode, setMode] = useState<ContentStyle>(() => {
    // Get initial mode from hash or use default
    const hash = window.location.hash.slice(1)
    return styleSchema.safeParse(hash).success ? (hash as ContentStyle) : defaultMode
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      setMode(styleSchema.safeParse(hash).success ? (hash as ContentStyle) : defaultMode)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [defaultMode])

  return mode
}

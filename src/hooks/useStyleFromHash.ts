import { useEffect, useState } from 'react'
import { ContentStyle } from '../components/Content'
import { styleSchema } from '../constants/styles'

export const useStyleFromHash = (defaultStyle: ContentStyle = 'default'): ContentStyle => {
  const [style, setStyle] = useState<ContentStyle>(() => {
    // Get initial style from hash or use default
    const hash = window.location.hash.slice(1)
    return styleSchema.safeParse(hash).success ? (hash as ContentStyle) : defaultStyle
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      setStyle(styleSchema.safeParse(hash).success ? (hash as ContentStyle) : defaultStyle)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [defaultStyle])

  return style
}

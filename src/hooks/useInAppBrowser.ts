import { useState, useEffect } from 'react'

const detectInAppBrowser = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase()

  // Check for specific in-app browser identifiers
  const inAppPatterns = [
    'fbav',
    'fban',
    'instagram',
    'whatsapp',
    'twitter',
    't.co',
    'linkedin',
    'snapchat',
    'tiktok',
    'micromessenger',
  ]

  const hasInAppPattern = inAppPatterns.some(pattern => userAgent.includes(pattern))

  if (hasInAppPattern) return true

  // Additional checks for suspicious patterns
  if (userAgent.includes('wv') && userAgent.includes('android')) {
    // Android WebView - could be in-app browser
    return true
  }

  return false
}

export const useInAppBrowser = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false)
  const [ignoreWarning, setIgnoreWarning] = useState(() => {
    return sessionStorage.getItem('ignoreInAppWarning') === 'true'
  })

  useEffect(() => {
    setIsInAppBrowser(detectInAppBrowser())
  }, [])

  const handleIgnoreWarning = () => {
    setIgnoreWarning(true)
    sessionStorage.setItem('ignoreInAppWarning', 'true')
  }

  return {
    isInAppBrowser,
    ignoreWarning,
    handleIgnoreWarning,
    shouldShowWarning: isInAppBrowser && !ignoreWarning,
  }
}

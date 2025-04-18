const splitToLines = (str: string) => {
  return str
    .split(/\/\/|\n/gi) // brean on new line
    .map(line => line.trim())
    .filter(Boolean)
}

export const inLines = (str: string) => {
  return splitToLines(str).map((line: string, i: number) => <div key={i}>{line}</div>)
}

export const getScale = (breakpoint: number, str: string) => {
  const largestPart = splitToLines(str).reduce((max, part, i) => {
    if (i === 0) {
      return part
    }
    return part.length > max.length ? part : max
  }, '')
  return Math.min(1, breakpoint / (largestPart.length || 1)) // scale down if more than 8 letters
}

// Format date based on language
export const formatDate = (date: string, localeCode: string) => {
  if (!date || !localeCode) return ''
  const dateObj = new Date(date)
  const formatter = new Intl.DateTimeFormat(localeCode, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return formatter.format(dateObj)
}

// Format time range for display
export const formatTime = (time: string, localeCode: string) => {
  if (!time) return ''
  const date = new Date(`2025-01-01T${time}:00`)
  const formatter = new Intl.DateTimeFormat(localeCode, {
    hour: 'numeric',
    minute: 'numeric',
  })
  return formatter.format(date)
}

export const trimNonLetters = (str: string) => {
  if (!str) return ''
  return str
    .trim()
    .replace(/^[.,;: ]+/, '')
    .replace(/[.,;: ]+$/, '')
    .trim()
}

// Convert timestamp to local ISO string
export const toLocalIsoString = (timestamp: number | string) => {
  const date = new Date(timestamp)
  return date.toLocaleString('sv').replace(' ', 'T')
}

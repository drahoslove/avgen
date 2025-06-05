// Returns an array of lines from a string
export const splitToLines = (str: string) => {
  return str
    .split(/\/\/|\n/gi) // break on new line
    .map(line => line.trim())
    .filter(Boolean)
}

// Replace a space nearest of the middle of the string by new line when the string is longer than certaian amount
export const insertBreak = (str: string, minLength = 10) => {
  if (!str) return str
  if (str.length <= minLength) return str
  const words = str.split(' ')
  if (words.length <= 1) return str

  const targetMiddle = str.length / 2
  // Find break point closest to middle
  let bestBreakIndex = 0
  let currentLength = 0
  let minDiff = str.length
  words.forEach((word, i) => {
    currentLength += word.length
    if (i > 0) currentLength++ // Account for spaces between words

    const diff = Math.abs(currentLength - targetMiddle)
    if (diff < minDiff) {
      minDiff = diff
      bestBreakIndex = i + 1
    }
  })

  // Join words back together with newline at best break point
  return [
    words.slice(0, bestBreakIndex).join(' ').trim(),
    '\n',
    words.slice(bestBreakIndex).join(' ').trim(),
  ].join('')
}

export const inLines = (str: string, maxLines = 2) => {
  return splitToLines(str)
    .slice(0, maxLines)
    .map((line: string, i: number, { length }) => (
      <div key={i} className={length > 1 ? '-my-[0.1em]' : ''}>
        {line}
      </div>
    ))
}

// Returns a scaling factor <1 when the longest line of string is largen than breakpoint
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
  if (!localeCode) return time

  // Special cases for midnight and times between 00:00-00:59
  // if (time.startsWith('00:') && localeCode.startsWith('en')) {
  //   return `${time} AM`
  // }
  if (time === '24:00') {
    if (localeCode.startsWith('en')) {
      // return '12:00 AM'
    } else {
      return time
    }
  }

  const date = new Date(`2025-01-01T${time}`)
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
  return date.toLocaleString('sv').replace(' ', 'T') // use hack with SV date being close to ISO
}

// Capitalize text using locale-aware transformation
export const capitalize = (text: string | undefined | null): string => {
  if (!text) return ''
  // First replace ß with ẞ before general uppercase transformation
  return text.replace(/ß/g, 'ẞ').toLocaleUpperCase()
}

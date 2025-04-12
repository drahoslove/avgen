export const inLines = (str: string) => {
  return str.split(/\/\/|\n/gi).map((line: string, i: number) => <div key={i}>{line}</div>)
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
  const date = new Date(`2025-01-01T${time}:00Z`)
  const formatter = new Intl.DateTimeFormat(localeCode, {
    hour: 'numeric',
    minute: 'numeric',
  })
  return formatter.format(date)
}

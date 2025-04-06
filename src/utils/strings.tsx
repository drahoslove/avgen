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
  if (!['en-US', 'en-GB'].includes(localeCode)) return time // only format time for non English

  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const formattedHour = hour % 12 || 12
  return `${formattedHour}:${minutes} ${period}`
}

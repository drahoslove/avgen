import { z } from 'zod'
import { trimNonLetters, toLocalIsoString } from './strings'
import type { EventData } from '../types'
import safeFetch from './safeFetch'

const FbEventSchema = z.object({
  name: z.string(), // "Cube of Truth: Prague: 29. b\u0159ezna: 15:00 ",
  current_start_timestamp: z.number(), // 1712985600
  event_place: z.object({
    name: z.string(), // "V\u00e1clavsk\u00e9 n\u00e1m\u011bst\u00ed (Wenceslas Square) Prague"
  }),
})

type FbEvent = z.infer<typeof FbEventSchema>

const findNestedItem = (data: unknown, key: string): unknown => {
  if (typeof data !== 'object' || data === null) {
    return null
  }
  if (key in data) {
    return (data as Record<string, unknown>)[key]
  }
  for (const item of Object.values(data)) {
    const result = findNestedItem(item, key)
    if (result) {
      return result
    }
  }
  return null
}

const importFromFb = async (url: string): Promise<EventData> => {
  const page = await safeFetch(url)
  const html = await page.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const scripts = doc.querySelectorAll('script[data-sjs]')

  let parsedData: FbEvent | null = null
  let end_timestamp: number | null = null

  for (const script of scripts) {
    const json = script.textContent
    if (!json) {
      continue
    }
    let data: unknown
    try {
      data = JSON.parse(json)
    } catch (e) {
      console.error('Error parsing json data', e)
      continue
    }
    if (!end_timestamp) {
      end_timestamp = findNestedItem(data, 'end_timestamp') as number | null
    }
    if (!parsedData) {
      const event = findNestedItem(data, 'event')
      if (!event) {
        continue
      }
      try {
        parsedData = FbEventSchema.parse(event)
      } catch (e) {
        console.log('failed parsing data, skipping', e)
        continue
      }
    }

    if (parsedData && end_timestamp) {
      break
    }
  }

  if (!parsedData || !end_timestamp) {
    throw new Error('Error parsing data')
  }

  const { event_place, name } = parsedData

  const chapterName = trimNonLetters(decodeURI(name).split(':')[1])
  const locationName = trimNonLetters(decodeURI(event_place.name).replace(chapterName, ''))
  const startDatetime = toLocalIsoString(parsedData.current_start_timestamp)
  const endDatetime = toLocalIsoString(end_timestamp)
  const date = startDatetime.split('T')[0]
  const timeStart = startDatetime.split('T')[1].split('.')[0].replace(/:00$/, '')
  const timeEnd = endDatetime.split('T')[1].split('.')[0].replace(/:00$/, '')

  return {
    chapterName,
    location: locationName,
    date,
    timeStart,
    timeEnd,
  }
}

export default importFromFb

import { create } from 'zustand'
import { z } from 'zod'
import type { ZodObject, ZodRawShape } from 'zod'
import { ContentStore, BackgroundStore, GrayscaleMethod } from '../types'
const DEFAULT_IMAGE = '/bg/1.jpg'
const previousImage = localStorage.getItem('backgroundImage')

// use zod to parse
const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
})
const grayscaleWeightsSchema = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
})

// parse a zod schema from a string
const parse =
  <T extends ZodRawShape>(zodSchema: ZodObject<T>) =>
  (value: string): z.infer<typeof zodSchema> => {
    const parsedValue = zodSchema.parse(JSON.parse(value))
    if (typeof parsedValue !== 'object') {
      throw new Error('Parsed value is not an object')
    }
    return parsedValue
  }

const localStorageOr = <T>(parser: (value: string) => T, key: string, defaultValue: T): T => {
  const value = localStorage.getItem(key)
  if (value === null) {
    return defaultValue
  }
  try {
    return parser(value)
  } catch (e) {
    console.error('Error parsing content store value', e)
    return defaultValue
  }
}

const bgLocalStorageOr = <T>(parser: (value: string) => T, key: string, defaultValue: T): T => {
  if (!previousImage || previousImage?.endsWith(DEFAULT_IMAGE)) {
    // only use saved settings if image is not default
    return defaultValue
  }
  return localStorageOr(parser, key, defaultValue)
}

const useContentStore = create<ContentStore>(set => ({
  chapter: localStorageOr(String, 'chapter', 'PRAGUE'),
  setChapter: chapter => set({ chapter }),
  date: localStorageOr(String, 'date', new Date().toISOString().split('T')[0]),
  setDate: date => set({ date }),
  startTime: localStorageOr(String, 'startTime', '17:00'),
  setStartTime: startTime => set({ startTime }),
  endTime: localStorageOr(String, 'endTime', '19:00'),
  setEndTime: endTime => set({ endTime }),
  location: localStorageOr(String, 'location', 'Wenceslas Square'),
  setLocation: location => set({ location }),
  locale: localStorageOr(String, 'locale', 'en-US'),
  setLocale: locale =>
    set(state => ({
      locale,
      // prevent locale and secondary locale to be the same
      secondaryLocale: locale === state.secondaryLocale ? '' : state.secondaryLocale,
    })),
  secondaryLocale: localStorageOr(String, 'secondaryLocale', ''),
  setSecondaryLocale: secondaryLocale => set({ secondaryLocale }),
}))

const useBackgroundStore = create<BackgroundStore>(set => ({
  backgroundImage: previousImage || DEFAULT_IMAGE,
  setBackgroundImage: backgroundImage => set({ backgroundImage }),
  opacity: bgLocalStorageOr(Number, 'opacity', 65),
  setOpacity: opacity => set({ opacity }),
  position: bgLocalStorageOr(parse(positionSchema), 'position', { x: 50, y: 50 }),
  setPosition: position => set({ position }),
  zoom: bgLocalStorageOr(Number, 'zoom', 100),
  setZoom: zoom => set({ zoom }),
  blur: bgLocalStorageOr(Number, 'blur', 0),
  setBlur: blur => set({ blur }),
  grayscaleMethod: bgLocalStorageOr(String, 'grayscaleMethod', 'luma') as GrayscaleMethod,
  setGrayscaleMethod: grayscaleMethod => set({ grayscaleMethod }),
  customGrayscaleValues: bgLocalStorageOr(parse(grayscaleWeightsSchema), 'customGrayscaleValues', {
    r: 0.299,
    g: 0.587,
    b: 0.114,
  }),
  setCustomGrayscaleValues: values => set({ customGrayscaleValues: values }),
}))

// save to local storage
useContentStore.subscribe(state => {
  localStorage.setItem('chapter', state.chapter)
  localStorage.setItem('date', state.date)
  localStorage.setItem('startTime', state.startTime)
  localStorage.setItem('endTime', state.endTime)
  localStorage.setItem('location', state.location)
  localStorage.setItem('locale', state.locale)
  localStorage.setItem('secondaryLocale', state.secondaryLocale)
})

useBackgroundStore.subscribe(state => {
  localStorage.setItem('backgroundImage', state.backgroundImage || '')
  localStorage.setItem('opacity', state.opacity.toString())
  localStorage.setItem('position', JSON.stringify(state.position))
  localStorage.setItem('zoom', state.zoom.toString())
  localStorage.setItem('blur', state.blur.toString())
  localStorage.setItem('grayscaleMethod', state.grayscaleMethod)
  localStorage.setItem('customGrayscaleValues', JSON.stringify(state.customGrayscaleValues))
})

export { useContentStore, useBackgroundStore }

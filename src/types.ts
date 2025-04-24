export type GrayscaleMethod = 'none' | 'luma' | 'average' | 'luminosity' | 'lightness' | 'custom'

export interface GrayscaleWeights {
  r: number
  g: number
  b: number
}

export type SocialLinkType = 'web' | 'instagram' | 'facebook' | 'youtube'

export interface SocialLink {
  type: SocialLinkType
  handle: string
}

export interface ContentStore {
  chapter: string
  setChapter: (chapter: string) => void
  date: string
  setDate: (date: string) => void
  startTime: string
  setStartTime: (startTime: string) => void
  endTime: string
  setEndTime: (endTime: string) => void
  location: string
  setLocation: (location: string) => void
  locale: string
  setLocale: (locale: string) => void
  secondaryLocale: string
  setSecondaryLocale: (secondaryLocale: string) => void
  socialLinks: SocialLink[]
  setSocialLinks: (socialLinks: SocialLink[]) => void
}

export interface BackgroundStore {
  backgroundImage: string | null
  setBackgroundImage: (backgroundImage: string | null) => void
  opacity: number
  setOpacity: (opacity: number) => void
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
  zoom: number
  setZoom: (zoom: number) => void
  blur: number
  setBlur: (blur: number) => void
  grayscaleMethod: GrayscaleMethod
  setGrayscaleMethod: (grayscaleMethod: GrayscaleMethod) => void
  customGrayscaleValues: GrayscaleWeights
  setCustomGrayscaleValues: (values: GrayscaleWeights) => void
}

export interface EventData {
  chapterName: string
  location: string
  date: string // YYYY-MM-DD
  timeStart: string // HH:MM
  timeEnd: string // HH:MM
}

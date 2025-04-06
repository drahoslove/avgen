export type GrayscaleMethod = 'none' | 'luma' | 'average' | 'luminosity' | 'lightness' | 'custom'

export interface GrayscaleWeights {
  r: number
  g: number
  b: number
}

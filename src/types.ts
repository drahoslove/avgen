export type GrayscaleMethod = 'luma' | 'average' | 'luminosity' | 'lightness' | 'custom';

export interface GrayscaleWeights {
  r: number;
  g: number;
  b: number;
}

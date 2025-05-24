export const BACKGROUND_IMAGES = [1, 4, 6].map(num => `/bg/${num}.webp`)

export const DEFAULT_IMAGE = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)]

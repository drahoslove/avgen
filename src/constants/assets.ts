export const BACKGROUND_IMAGES = [1, 2, 3, 4, 5, 6].map(num => `/bg/${num}.jpg`)

export const DEFAULT_IMAGE = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)]

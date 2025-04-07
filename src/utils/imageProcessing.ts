import type { GrayscaleMethod, GrayscaleWeights } from '../types'

export const processImage = async (
  imageUrl: string,
  method: GrayscaleMethod,
  customWeights?: GrayscaleWeights
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Draw original image
      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Process each pixel
      loop: for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        let gray
        const weights = customWeights || { r: 0.299, g: 0.587, b: 0.114 }

        switch (method) {
          case 'none':
            break loop
          case 'luma':
            // Weighted method - human perception
            gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b)
            break
          case 'average':
            // Simple average
            gray = Math.round((r + g + b) / 3)
            break
          case 'luminosity':
            // Perceived brightness
            gray = Math.round(0.21 * r + 0.72 * g + 0.07 * b)
            break
          case 'lightness':
            // Max & min values
            gray = Math.round((Math.max(r, g, b) + Math.min(r, g, b)) / 2)
            break
          case 'custom':
            // Custom weights
            gray = Math.round(weights.r * r + weights.g * g + weights.b * b)
            break
          default:
            gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b)
        }

        // Set RGB channels to grayscale value
        data[i] = gray // R
        data[i + 1] = gray // G
        data[i + 2] = gray // B
        // Alpha channel (data[i + 3]) remains unchanged
      }

      // Put processed image data back
      ctx.putImageData(imageData, 0, 0)

      // Convert to data URL
      resolve(canvas.toDataURL('image/png'))
    }

    img.onerror = () => {
      reject(new Error('Failed to process image'))
    }

    img.src = imageUrl
  })
}

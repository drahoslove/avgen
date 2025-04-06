import { useState } from 'react'
import { PhotoIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import type { GrayscaleMethod } from '../types'

interface BackgroundFormProps {
  backgroundImage: string | null
  setBackgroundImage: (value: string | null) => void
  opacity: number
  setOpacity: (value: number) => void
  position: { x: number; y: number }
  setPosition: (value: { x: number; y: number }) => void
  zoom: number
  setZoom: (value: number) => void
  grayscaleMethod: GrayscaleMethod
  setGrayscaleMethod: (value: GrayscaleMethod) => void
  customGrayscaleValues?: {
    r: number
    g: number
    b: number
  }
  setCustomGrayscaleValues?: (values: { r: number; g: number; b: number }) => void
}

export function BackgroundForm({
  backgroundImage,
  setBackgroundImage,
  opacity,
  setOpacity,
  position,
  setPosition,
  zoom,
  setZoom,
  grayscaleMethod,
  setGrayscaleMethod,
  customGrayscaleValues = { r: 0.299, g: 0.587, b: 0.114 },
  setCustomGrayscaleValues,
}: BackgroundFormProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        setBackgroundImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Background Image</label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={e => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = e => {
                setBackgroundImage(e.target?.result as string)
              }
              reader.readAsDataURL(file)
            }
          }}
        >
          {backgroundImage ? (
            <div className="relative">
              <img
                src={backgroundImage}
                alt="Background preview"
                className="max-h-40 mx-auto rounded"
              />
              <button
                onClick={() => setBackgroundImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="text-gray-500">
              <PhotoIcon className="h-12 w-12 mx-auto mb-4" />
              <p>Drag and drop an image here, or click to select</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="background-upload"
              />
              <button
                onClick={() => document.getElementById('background-upload')?.click()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Select Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Adjustments */}
      {backgroundImage && (
        <div className="space-y-4">
          {/* Grayscale Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              Grayscale Method
            </label>
            <select
              value={grayscaleMethod}
              onChange={e => setGrayscaleMethod(e.target.value as GrayscaleMethod)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="luma">Luma (Weighted RGB)</option>
              <option value="average">Average (Simple RGB)</option>
              <option value="luminosity">Luminosity (Perceived Brightness)</option>
              <option value="lightness">Lightness (Max/Min RGB)</option>
              <option value="custom">Custom Weights</option>
            </select>
          </div>

          {/* Custom Grayscale Controls */}
          {grayscaleMethod === 'custom' && setCustomGrayscaleValues && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Custom RGB Weights</h3>
              {/* Red Weight */}
              <div className="space-y-1">
                <label className="block text-xs text-gray-600">Red (R)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customGrayscaleValues.r * 100}
                  onChange={e =>
                    setCustomGrayscaleValues({
                      ...customGrayscaleValues,
                      r: Number(e.target.value) / 100,
                    })
                  }
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-right">
                  {(customGrayscaleValues.r * 100).toFixed(1)}%
                </div>
              </div>
              {/* Green Weight */}
              <div className="space-y-1">
                <label className="block text-xs text-gray-600">Green (G)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customGrayscaleValues.g * 100}
                  onChange={e =>
                    setCustomGrayscaleValues({
                      ...customGrayscaleValues,
                      g: Number(e.target.value) / 100,
                    })
                  }
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-right">
                  {(customGrayscaleValues.g * 100).toFixed(1)}%
                </div>
              </div>
              {/* Blue Weight */}
              <div className="space-y-1">
                <label className="block text-xs text-gray-600">Blue (B)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customGrayscaleValues.b * 100}
                  onChange={e =>
                    setCustomGrayscaleValues({
                      ...customGrayscaleValues,
                      b: Number(e.target.value) / 100,
                    })
                  }
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-right">
                  {(customGrayscaleValues.b * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {/* Opacity Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Darkness</label>
            <input
              type="range"
              min="50"
              max="100"
              value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zoom</label>
            <input
              type="range"
              min="100"
              max="200"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Position Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={position.x}
                onChange={e => setPosition({ ...position, x: Number(e.target.value) })}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={position.y}
                onChange={e => setPosition({ ...position, y: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

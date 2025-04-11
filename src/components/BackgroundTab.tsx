import { useState } from 'react'
import {
  PhotoIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  ArrowRightIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'
import { SunIcon, CloudIcon } from '@heroicons/react/24/outline'
import { Input, Listbox } from '@headlessui/react'
import type { GrayscaleMethod } from '../types'

interface BackgroundTabProps {
  backgroundImage: string | null
  setBackgroundImage: (value: string | null) => void
  isBackgroundImageEditable: boolean
  opacity: number
  setOpacity: (value: number) => void
  blur: number
  setBlur: (value: number) => void
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

export function BackgroundTab({
  backgroundImage,
  setBackgroundImage,
  isBackgroundImageEditable,
  opacity,
  setOpacity,
  blur,
  setBlur,
  position,
  setPosition,
  zoom,
  setZoom,
  grayscaleMethod,
  setGrayscaleMethod,
  customGrayscaleValues = { r: 0.299, g: 0.587, b: 0.114 },
  setCustomGrayscaleValues,
}: BackgroundTabProps) {
  const [dragOver, setDragOver] = useState(false)
  const defaultUrl = window.location.href + 'bg/1.jpg'
  const [url, setUrl] = useState(backgroundImage?.startsWith('http') ? backgroundImage : defaultUrl)
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
    <div className="space-y-3">
      {/* Image Upload */}
      <div className="space-y-2 flex flex-col">
        <label className="block text-sm font-medium text-zinc-900">
          {backgroundImage ? 'Background Image' : 'Load from file'}
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-zinc-500'
          } ${backgroundImage ? 'mx-auto' : ''}`}
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
                className="max-h-32 mx-auto rounded"
              />
              <button
                onClick={() => setBackgroundImage(null)}
                className="absolute w-7 h-7 -top-7 -right-7 flex items-center justify-center bg-brand-red text-white p-0 rounded-full hover:bg-red-400 cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="text-zinc-800 p-2">
              <PhotoIcon className="h-12 w-12 mx-auto mb-4" />
              {/* hide on mobile */}
              <p className="hidden sm:block">Drag'n'drop or click</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="background-upload"
              />
              <button
                onClick={() => document.getElementById('background-upload')?.click()}
                className="mt-4 px-4 py-2 bg-zinc-500 text-white rounded hover:bg-zinc-600 cursor-pointer"
              >
                Select Image
              </button>
              {/* note */}
              <p className="mt-2 text-xs text-zinc-500">
                The image will not leave your device until you share it.
              </p>
            </div>
          )}
        </div>
      </div>
      {!backgroundImage && (
        <>
          {/* or separator*/}
          <div className="flex items-center gap-2">
            <span className="border-b border-zinc-400 flex-1"></span>
            <span className="font-bold text-zinc-400">OR</span>
            <span className="border-b border-zinc-400 flex-1"></span>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-900">Load from URL</label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={url}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setBackgroundImage(url)
                  }
                }}
              />
              <button
                onClick={() => setBackgroundImage(url)}
                className="px-4 h-10 py-2 bg-zinc-500 text-white rounded hover:bg-zinc-600 cursor-pointer"
              >
                {/* <CloudArrowDownIcon className="h-5 w-5" /> */}
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
      {/* Image Adjustments */}
      {backgroundImage && (
        <div className="space-y-4">
          {/* Grayscale Method Selection */}
          {isBackgroundImageEditable && (
            <div>
              <label
                htmlFor="grayscaleMethod"
                className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-2"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                Grayscale Method
              </label>
              <Listbox value={grayscaleMethod} onChange={setGrayscaleMethod}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-3 pr-10 text-left text-sm text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="block truncate capitalize">{grayscaleMethod}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {[
                      {
                        label: 'None',
                        value: 'none',
                      },
                      {
                        label: (
                          <span>
                            Luma
                            <span className="opacity-40"> (default)</span>
                          </span>
                        ),
                        value: 'luma',
                      },
                      {
                        label: 'Lightness',
                        value: 'lightness',
                      },
                      {
                        label: 'Average',
                        value: 'average',
                      },
                      {
                        label: 'Custom',
                        value: 'custom',
                      },
                    ].map(({ label, value }) => (
                      <Listbox.Option
                        key={value}
                        value={value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                            active ? 'bg-blue-50 text-blue-900' : 'text-zinc-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate capitalize ${selected ? 'font-medium' : 'font-normal'}`}
                            >
                              {label}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          )}

          {/* Custom Grayscale Controls */}
          {grayscaleMethod === 'custom' && setCustomGrayscaleValues && (
            <div className="space-y-4 p-4 bg-zinc-50 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-700">Custom RGB Weights</h3>
              {/* Red Weight */}
              <div className="space-y-1">
                <label className="block text-xs text-zinc-600">Red (R)</label>
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
                  className="w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-700 [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="text-xs text-zinc-500 text-right">
                  {(customGrayscaleValues.r * 100).toFixed(1)}%
                </div>
              </div>
              {/* Green Weight */}
              <div className="space-y-1">
                <label className="block text-xs text-zinc-600">Green (G)</label>
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
                  className="w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-700 [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="text-xs text-zinc-500 text-right">
                  {(customGrayscaleValues.g * 100).toFixed(1)}%
                </div>
              </div>
              {/* Blue Weight */}
              <div className="space-y-1">
                <label className="block text-xs text-zinc-600">Blue (B)</label>
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
                  className="w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-700 [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="text-xs text-zinc-500 text-right">
                  {(customGrayscaleValues.b * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {/* Opacity Slider */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <SunIcon className="h-5 w-5" />
              Darkness
            </label>
            <input
              type="range"
              min="40"
              max="90"
              value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-700 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Blur Slider */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <CloudIcon className="h-5 w-5" />
              Blur
            </label>
            <input
              type="range"
              min="0"
              step="1"
              max="8"
              value={blur}
              onChange={e => setBlur(Number(e.target.value))}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-700 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Zoom Slider */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <ArrowsPointingOutIcon className="h-5 w-5" />
              Zoom
            </label>
            <input
              type="range"
              min="100"
              max="200"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-700 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Position Controls */}
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                  <ArrowsUpDownIcon className="h-5 w-5 rotate-90" />
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.x}
                  onChange={e => setPosition({ ...position, x: Number(e.target.value) })}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-700 [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                  <ArrowsUpDownIcon className="h-5 w-5 rotate-0" />
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.y}
                  onChange={e => setPosition({ ...position, y: Number(e.target.value) })}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-700 [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

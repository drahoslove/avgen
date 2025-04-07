import { forwardRef, useEffect, useState } from 'react'

import whiteLogo from '../assets/AV-Symbol-White-Transparent.png'
import whiteLogoTop from '../assets/AV-Logo-White-Transparent.svg'
import { processImage } from '../utils/imageProcessing'
import { inLines, formatTime, formatDate } from '../utils/strings'
import type { GrayscaleMethod } from '../types'
import { LOCALIZATIONS } from '../constants/localization'

interface PosterPreviewProps {
  chapter: string
  timeStart: string
  timeEnd: string
  date: string
  location: string
  locale: (typeof LOCALIZATIONS)[number]['code']
  secondaryLocale: (typeof LOCALIZATIONS)[number]['code']
  backgroundImage: string | null
  opacity: number
  position: { x: number; y: number }
  zoom: number
  grayscaleMethod: GrayscaleMethod
  customGrayscaleValues: { r: number; g: number; b: number }
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  (
    {
      chapter,
      timeStart,
      timeEnd,
      date,
      location,
      locale,
      secondaryLocale,
      backgroundImage,
      opacity,
      position,
      zoom,
      grayscaleMethod,
      customGrayscaleValues,
    },
    ref
  ) => {
    const [processedImage, setProcessedImage] = useState<string | null>(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [isImageError, setIsImageError] = useState(false)

    useEffect(() => {
      if (backgroundImage) {
        processImage(backgroundImage, grayscaleMethod, customGrayscaleValues)
          .then(processedImage => {
            setProcessedImage(processedImage)
            setIsImageError(false)
          })
          .catch(() => {
            setIsImageError(true)
          })
      } else {
        setProcessedImage(null)
      }
    }, [backgroundImage, grayscaleMethod, customGrayscaleValues])

    // Update container size on resize
    useEffect(() => {
      const updateSize = () => {
        if (ref && 'current' in ref && ref.current) {
          const { width, height } = ref.current.getBoundingClientRect()
          setContainerSize({ width, height })
        }
      }

      updateSize()
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }, [ref])

    const timeRange = `${formatTime(timeStart, secondaryLocale || locale)} – ${formatTime(timeEnd, secondaryLocale || locale)}`

    // Calculate base font size based on container height
    const baseFontSize =
      ref && 'current' in ref && ref.current?.style.height
        ? parseInt(ref.current.style.height) / 60 // Use fixed height when set
        : containerSize.height / 60 // Fallback to container height

    return (
      <div className="w-full bg-gray-300 sm:rounded-lg shadow-lg p-6 lg:h-[calc(100vh-3rem)] overflow-hidden">
        <div
          ref={ref}
          className="relative h-full mx-auto aspect-[4/5] bg-black rounded-lg shadow-lg overflow-hidden"
          style={{ fontSize: `${baseFontSize}px` }}
        >
          {/* Background Image */}
          {processedImage && (
            <img
              src={processedImage}
              alt=""
              className="hidden"
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${!isImageError && processedImage ? processedImage : backgroundImage})`,
              backgroundSize: `${zoom}%`,
              backgroundPosition: `${position.x}% ${position.y}%`,
            }}
          />

          {/* Black overlay with adjustable opacity */}
          <div
            className="absolute inset-0 bg-black"
            style={{
              opacity: opacity / 100,
            }}
          />

          {/* Content - Always fully opaque */}
          <div className="absolute inset-0 flex flex-col items-center text-white">
            {/* Top Logo */}
            <div className="aspect-[4/3] flex items-center justify-center mt-[1.5em] w-[11em]">
              <img
                src={whiteLogoTop}
                alt="Anonymous for the Voiceless"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center text-center flex-grow w-full">
              <h1 className=" text-[4.25em] text-white text-stroke-[0.1em] text-stroke-white font-bold font-libre-franklin">
                {(
                  LOCALIZATIONS.find(loc => loc.code === locale)?.['Cube of Truth'] ?? ''
                ).toLocaleUpperCase()}
              </h1>

              <div className="mb-[1em]">
                <h2
                  className={`text-gray-300 ${secondaryLocale ? 'visible' : 'invisible'} text-[2.5em] font-libre-franklin`}
                >
                  {(
                    LOCALIZATIONS.find(loc => loc.code === secondaryLocale)?.['Cube of Truth'] ??
                    'Cube of Truth'
                  ).toLocaleUpperCase()}
                </h2>
              </div>

              <div className="text-brand-red text-[6em] tracking-[0.2em] -mr-[0.2em] font-black font-libre-franklin">
                {inLines(chapter)}
              </div>

              <div>
                <div className="flex flex-col">
                  <div className="text-[2.5em] font-libre-franklin">
                    {formatDate(date, locale).toLocaleUpperCase()}
                  </div>
                  <div
                    className={`text-gray-300 mt-[0m] ${secondaryLocale ? 'visible' : 'invisible'} text-[2.5em] font-libre-franklin`}
                  >
                    {formatDate(date, secondaryLocale || locale).toLocaleUpperCase()}
                  </div>
                </div>
                <div className="text-[4em] font-libre-franklin">{timeRange}</div>
              </div>

              <div className=" text-[1.75em] px-[2em] font-libre-franklin">{inLines(location)}</div>
            </div>

            {/* Bottom Logo */}
            <div className="aspect-square flex items-center justify-center my-[3em] w-[5em]">
              <img
                src={whiteLogo}
                alt="Anonymous for the Voiceless"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
)

PosterPreview.displayName = 'PosterPreview'

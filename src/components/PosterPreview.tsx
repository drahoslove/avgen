import { forwardRef, useEffect, useState } from 'react'

import whiteLogo from '../assets/AV-Symbol-White-Transparent.png'
import whiteLogoTop from '../assets/AV-Logo-White-Transparent.svg'
import { processImage } from '../utils/imageProcessing'
import { inLines } from '../utils/strings'
import type { GrayscaleMethod } from '../types'
import { LOCALIZATIONS } from '../constants/localization'

interface PosterPreviewProps {
  chapter: string
  englishDate: string
  localizedDate: string
  timeRange: string
  location: string
  locale: (typeof LOCALIZATIONS)[number]['code']
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
      englishDate,
      localizedDate,
      timeRange,
      location,
      locale,
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

    useEffect(() => {
      if (backgroundImage) {
        processImage(backgroundImage, grayscaleMethod, customGrayscaleValues)
          .then(setProcessedImage)
          .catch(console.error)
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

    // Calculate base font size based on container height
    const baseFontSize =
      ref && 'current' in ref && ref.current?.style.height
        ? parseInt(ref.current.style.height) / 60 // Use fixed height when set
        : containerSize.height / 60 // Fallback to container height

    return (
      <div className="w-full bg-gray-300 sm:rounded-lg shadow-lg p-6 lg:h-[calc(100vh-3rem)] overflow-hidden">
        {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Preview
      </h2> */}
        <div
          ref={ref}
          className="relative h-full mx-auto aspect-[4/5] bg-black rounded-lg shadow-lg overflow-hidden"
          style={{ fontSize: `${baseFontSize}px` }}
        >
          {/* Background Image */}
          {processedImage && (
            <>
              <img
                src={processedImage}
                alt=""
                className="hidden"
                onLoad={() => setIsImageLoaded(true)}
              />
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundImage: `url(${processedImage})`,
                  backgroundSize: `${zoom}%`,
                  backgroundPosition: `${position.x}% ${position.y}%`,
                }}
              />
            </>
          )}

          {/* Black overlay with adjustable opacity */}
          <div
            className="absolute inset-0 bg-black"
            style={{
              opacity: opacity / 100,
            }}
          />

          {/* Content - Always fully opaque */}
          <div className="absolute inset-0 flex flex-col items-center p-[0em] text-white">
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
              <h1 className="font-bold mb-[0em] text-[4.25em] text-white text-stroke-[0.1em] text-stroke-white font-libre-franklin">
                CUBE OF TRUTH
              </h1>

              <div className="mb-[1em]">
                <h2
                  className={`text-gray-300 ${locale !== 'en-US' ? 'visible' : 'invisible'} text-[2.5em] font-libre-franklin`}
                >
                  {LOCALIZATIONS.find(loc => loc.code === locale)?.['Cube of Truth']}
                </h2>
              </div>

              <div className="font-bold text-brand-red mb-[0em] text-[6em] tracking-[0.3em] -mr-[0.35em] font-libre-franklin">
                {inLines(chapter)}
              </div>

              <div className="space-y-[0em] mb-[0em]">
                <div className="flex flex-col">
                  <div className="text-[2.5em] font-libre-franklin">
                    {englishDate.toLocaleUpperCase()}
                  </div>
                  <div
                    className={`text-gray-300 mt-[0m] ${locale !== 'en-US' ? 'visible' : 'invisible'} text-[2.5em] font-libre-franklin`}
                  >
                    {localizedDate.toLocaleUpperCase()}
                  </div>
                </div>
                <div className="text-[4em] font-libre-franklin">{timeRange}</div>
              </div>

              <div className="mb-[0em] text-[1.75em] px-[2em] font-libre-franklin">
                {inLines(location)}
              </div>
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

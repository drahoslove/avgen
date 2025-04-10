import { forwardRef, useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'

import whiteLogo from '../assets/AV-Symbol-White-Transparent.png'
import whiteLogoTop from '../assets/AV-Logo-White-Transparent.svg'
import { processImage } from '../utils/imageProcessing'
import { inLines, formatTime, formatDate } from '../utils/strings'
import { LOCALIZATIONS } from '../constants/localization'
import { useBackgroundStore, useContentStore } from '../hooks/useStore'

interface PosterPreviewProps {
  isBackgroundImageEditable: boolean
  setIsBackgroundImageEditable: (isBackgroundImageEditable: boolean) => void
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ isBackgroundImageEditable, setIsBackgroundImageEditable }, ref) => {
    const { chapter, date, startTime, endTime, location, locale, secondaryLocale } =
      useContentStore(
        useShallow(state => ({
          chapter: state.chapter,
          date: state.date,
          startTime: state.startTime,
          endTime: state.endTime,
          location: state.location,
          locale: state.locale,
          secondaryLocale: state.secondaryLocale,
        }))
      )
    const {
      backgroundImage,
      opacity,
      position,
      zoom,
      blur,
      grayscaleMethod,
      customGrayscaleValues,
    } = useBackgroundStore(
      useShallow(state => ({
        backgroundImage: state.backgroundImage,
        opacity: state.opacity,
        position: state.position,
        zoom: state.zoom,
        blur: state.blur,
        grayscaleMethod: state.grayscaleMethod,
        customGrayscaleValues: state.customGrayscaleValues,
      }))
    )

    const [processedImage, setProcessedImage] = useState<string | null>(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    useEffect(() => {
      if (backgroundImage) {
        processImage(backgroundImage, grayscaleMethod, blur, customGrayscaleValues)
          .then(processedImage => {
            setProcessedImage(processedImage)
            setIsBackgroundImageEditable(true)
          })
          .catch(() => {
            setIsBackgroundImageEditable(false)
          })
      } else {
        setProcessedImage(null)
      }
    }, [
      backgroundImage,
      grayscaleMethod,
      blur,
      customGrayscaleValues,
      setIsBackgroundImageEditable,
    ])

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

    const timeRange = `${formatTime(startTime, secondaryLocale || locale)} – ${formatTime(endTime, secondaryLocale || locale)}`

    // Calculate base font size based on container height
    const baseFontSize = containerSize.height / 60

    return (
      <div className="w-full bg-zinc-300 sm:rounded-lg shadow-lg p-6 lg:h-[calc(100vh-3rem)] overflow-hidden">
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
              backgroundImage: `url(${isBackgroundImageEditable && processedImage ? processedImage : backgroundImage})`,
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
                  className={`text-zinc-300 ${secondaryLocale ? 'visible' : 'invisible'} text-[2.5em] font-libre-franklin`}
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
                    className={`text-zinc-300 mt-[0m] ${secondaryLocale ? 'visible' : 'invisible'} text-[2.5em] font-libre-franklin`}
                  >
                    {formatDate(date, secondaryLocale || locale).toLocaleUpperCase()}
                  </div>
                </div>
                <div className="text-[4em] font-libre-franklin">{timeRange}</div>
              </div>

              <div className=" text-[2em] px-[2em] font-libre-franklin">{inLines(location)}</div>
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

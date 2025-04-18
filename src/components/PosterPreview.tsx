import { forwardRef, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/shallow'

import whiteLogo from '../assets/AV-Symbol-White-Transparent.png'
import whiteLogoTop from '../assets/AV-Logo-White-Transparent.svg'
import { processImage } from '../utils/imageProcessing'
import { inLines, formatTime, formatDate, getScale } from '../utils/strings'
import { LOCALIZATIONS } from '../constants/localization'
import { useBackgroundStore, useContentStore } from '../hooks/useStore'
import { safeUrl } from '../utils/safeFetch'

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
      backgroundImage: rawBackgroundImage,
      opacity,
      position,
      zoom,
      setZoom,
      blur,
      grayscaleMethod,
      customGrayscaleValues,
    } = useBackgroundStore(
      useShallow(state => ({
        backgroundImage: state.backgroundImage,
        opacity: state.opacity,
        position: state.position,
        zoom: state.zoom,
        setZoom: state.setZoom,
        blur: state.blur,
        grayscaleMethod: state.grayscaleMethod,
        customGrayscaleValues: state.customGrayscaleValues,
      }))
    )

    const [processedImage, setProcessedImage] = useState<string | null>(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    const backgroundImage = useMemo(() => {
      // fetch the iamge throught the cloud worker to overcome CORS, if needed
      if (
        rawBackgroundImage?.startsWith('http') &&
        !rawBackgroundImage.startsWith(window.location.href)
      ) {
        return safeUrl(rawBackgroundImage)
      }
      return rawBackgroundImage
    }, [rawBackgroundImage])

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

    const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.target as HTMLImageElement
      const ratioRatio = width / height / (containerSize.width / containerSize.height)
      if (ratioRatio > 1) {
        // too wide - should zoom
        setZoom(Math.max(100, Math.ceil(zoom * ratioRatio)))
      } else {
        setZoom(100)
      }
      setIsImageLoaded(true)
    }

    const TITLE =
      LOCALIZATIONS.find(loc => loc.code === locale)?.['Cube of Truth'] ?? 'Cube of Truth'
    const TITLE_SECONDARY =
      LOCALIZATIONS.find(loc => loc.code === secondaryLocale)?.['Cube of Truth'] ?? 'Cube of Truth'

    const timeRange = `${formatTime(startTime, secondaryLocale || locale)} – ${formatTime(endTime, secondaryLocale || locale)}`

    // Calculate base font size based on container height
    const baseFontSize = containerSize.height / 60

    return (
      <div
        ref={ref}
        className="relative h-full mx-auto aspect-[4/5] bg-black rounded-lg shadow-lg overflow-hidden"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        {/* Background Image */}
        {processedImage && ( // only used to detect first image loaded event
          <img src={processedImage} alt="" className="hidden" onLoad={onLoad} />
        )}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${isBackgroundImageEditable && processedImage ? processedImage : backgroundImage})`,
            backgroundSize: `${zoom}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundRepeat: 'no-repeat',
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
          <div className="text-center font-libre-franklin">
            <h1
              className="uppercase text-[4.25em]/[1.5em] text-white text-stroke-white font-bold whitespace-nowrap"
              style={{ scale: getScale(15, TITLE) }}
            >
              {TITLE}
            </h1>

            <h2
              className={`uppercase text-zinc-300 ${secondaryLocale ? 'visible' : 'invisible'} text-[2.5em] mb-[0.25em]`}
            >
              {TITLE_SECONDARY}
            </h2>

            <div
              className="uppercase text-brand-red text-[6em]/[1.2em] tracking-[0.2em] -mr-[0.2em] mt-[0em] mb-[0.3em] font-black whitespace-nowrap"
              style={{ scale: getScale(8, chapter) }}
            >
              {inLines(chapter)}
            </div>

            <div className="uppercase text-[2.5em]">{formatDate(date, locale)}</div>
            <div
              className={`uppercase text-zinc-300 text-[2.5em] ${secondaryLocale ? 'visible' : 'invisible'}`}
            >
              {formatDate(date, secondaryLocale || locale)}
            </div>

            <div className="text-[3.75em]">{timeRange}</div>

            <div className="text-[2.25em] px-[2em] whitespace-nowrap">{inLines(location)}</div>
          </div>

          {/* Bottom Logo */}
          <div
            className={`aspect-square flex items-center justify-center my-[3em] w-[5em]  ${inLines(chapter).length > 1 ? 'invisible' : 'visible'}`}
          >
            <img
              src={whiteLogo}
              alt="Anonymous for the Voiceless"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    )
  }
)

PosterPreview.displayName = 'PosterPreview'

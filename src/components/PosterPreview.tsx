import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import Slider from 'react-slick'

import { processImage } from '../utils/imageProcessing'
import { useBackgroundStore, useContentStore, useSliderStore } from '../hooks/useStore'
import { safeUrl } from '../utils/safeFetch'
import Content from './Content'
import { EM_ROWS } from '../constants/dimensions'

interface PosterPreviewProps {
  isBackgroundImageEditable: boolean
  setIsBackgroundImageEditable: (isBackgroundImageEditable: boolean) => void
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ isBackgroundImageEditable, setIsBackgroundImageEditable }, ref) => {
    const sliderRef = useRef<Slider>(null)
    const { setSliderRef, setCurrentSlide } = useSliderStore(
      useShallow(state => ({
        setSliderRef: state.setSliderRef,
        setCurrentSlide: state.setCurrentSlide,
      }))
    )
    const {
      chapter,
      date,
      startTime,
      endTime,
      location,
      locale,
      socialLinks,
      secondaryLocale,
      includeYear,
    } = useContentStore(
      useShallow(state => ({
        chapter: state.chapter,
        date: state.date,
        startTime: state.startTime,
        endTime: state.endTime,
        location: state.location,
        locale: state.locale,
        socialLinks: state.socialLinks,
        secondaryLocale: state.secondaryLocale,
        includeYear: state.includeYear,
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
      // fetch the image through the cloud worker to overcome CORS, if needed
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

    const TITLE = 'Cube of Truth'
    // LOCALIZATIONS.find(loc => loc.code === locale)?.['Cube of Truth'] ?? 'Cube of Truth'
    const TITLE_SECONDARY = 'Cube of Truth'
    // LOCALIZATIONS.find(loc => loc.code === secondaryLocale)?.['Cube of Truth'] ?? 'Cube of Truth'

    // Calculate base font size based on container height
    const baseFontSize = containerSize.height / EM_ROWS

    const handleBeforeChange = (_: number, newIndex: number) => {
      setCurrentSlide(newIndex)
    }

    // Set slider ref when it's available
    useEffect(() => {
      if (sliderRef.current) {
        setSliderRef(sliderRef.current)
      }
    }, [setSliderRef])

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

        {/* Content */}
        <div className="absolute inset-0">
          <Slider
            ref={sliderRef}
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            className="h-full [&_.slick-list]:!h-full [&_.slick-track]:!flex [&_.slick-track]:!h-full [&_.slick-slide]:!h-full [&_.slick-slide>div]:!h-full"
            swipe={secondaryLocale ? true : false}
            touchThreshold={10}
            beforeChange={handleBeforeChange}
          >
            <div className="h-full w-full flex items-center justify-center relative">
              <Content
                style={'default'}
                title={TITLE}
                subTitle={''}
                chapter={chapter}
                date={date}
                startTime={startTime}
                endTime={endTime}
                location={location}
                locale={locale}
                socialLinks={socialLinks}
                includeYear={includeYear}
              />
            </div>
            {secondaryLocale && (
              <div className="h-full w-full flex items-center justify-center relative">
                <Content
                  style={'default'}
                  title={TITLE_SECONDARY}
                  subTitle={''}
                  chapter={chapter}
                  date={date}
                  startTime={startTime}
                  endTime={endTime}
                  location={location}
                  locale={secondaryLocale}
                  socialLinks={socialLinks}
                  includeYear={includeYear}
                />
              </div>
            )}
          </Slider>
        </div>
      </div>
    )
  }
)

PosterPreview.displayName = 'PosterPreview'

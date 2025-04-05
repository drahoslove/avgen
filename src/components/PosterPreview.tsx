import { forwardRef, useEffect, useState } from 'react'

import whiteLogo from '../assets/AV-Symbol-White-Transparent.png'
import whiteLogoTop from '../assets/AV-Logo-White-Transparent.svg'
import { processImage, GrayscaleMethod } from '../utils/imageProcessing'

interface PosterPreviewProps {
  chapter: string
  englishDate: string
  localizedDate: string
  timeRange: string
  location: string
  language: string
  backgroundImage: string | null
  opacity: number
  position: { x: number; y: number }
  zoom: number
  grayscaleMethod: GrayscaleMethod
  customGrayscaleValues: { r: number; g: number; b: number }
}

// Base size for rem calculations (1rem = 16px by default)
const BASE_SIZE = 16;

// Poster dimensions in rem
const POSTER_WIDTH = 1012;
const POSTER_HEIGHT = 1350;

// Derived sizes in rem
const PADDING = 3;         // 48px
const LOGO_TOP_SIZE = 10;  // 160px
const LOGO_BOTTOM_SIZE = 5; // 
const TITLE_SIZE = 2.5;    // 40px
const SUBTITLE_SIZE = 1.5; // 24px
const CHAPTER_SIZE = 3;    // 48px
const TEXT_SIZE = 1.75;    // 28px

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(({
  chapter,
  englishDate,
  localizedDate,
  timeRange,
  location,
  language,
  backgroundImage,
  opacity,
  position,
  zoom,
  grayscaleMethod,
  customGrayscaleValues,
}, ref) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  useEffect(() => {
    if (backgroundImage) {
      processImage(backgroundImage, grayscaleMethod, customGrayscaleValues)
        .then(setProcessedImage)
        .catch(console.error);
    } else {
      setProcessedImage(null);
    }
  }, [backgroundImage, grayscaleMethod, customGrayscaleValues]);

  return (
    <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Preview
      </h2> */}
      <div 
        ref={ref}
        className="relative bg-black rounded-lg overflow-hidden"
        style={{
          width: '100%',
          paddingBottom: `${(POSTER_HEIGHT / POSTER_WIDTH) * 100}%`,
        }}
      >
        {/* Background Image */}
        {processedImage && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${processedImage})`,
              backgroundSize: `${zoom}%`,
              backgroundPosition: `${position.x}% ${position.y}%`,
            }}
          />
        )}

        {/* Black overlay with adjustable opacity */}
        <div 
          className="absolute inset-0 bg-black"
          style={{
            opacity: opacity / 100
          }}
        />

        {/* Content - Always fully opaque */}
        <div className="absolute inset-0 flex flex-col items-center p-12 text-white">
          {/* Top Logo */}
          <div 
            className="aspect-square mb-12 flex items-center justify-center"
            style={{ width: `${LOGO_TOP_SIZE}rem` }}
          >
            <img 
              src={whiteLogoTop} 
              alt="Anonymous for the Voiceless" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center text-center flex-grow w-full">
            <h1 
              className="font-bold mb-2"
              style={{ fontSize: `${TITLE_SIZE}rem` }}
            >
              CUBE OF TRUTH
            </h1>
            
            <div className="h-6 mb-12">
              <h2 
                className={`text-gray-300 ${language !== 'english' ? 'visible' : 'invisible'}`}
                style={{ fontSize: `${SUBTITLE_SIZE}rem` }}
              >
                Kostka Pravdy
              </h2>
            </div>

            <div 
              className="font-bold text-red-600 mb-12"
              style={{ fontSize: `${CHAPTER_SIZE}rem` }}
            >
              {chapter}
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex flex-col">
                <div style={{ fontSize: `${TEXT_SIZE}rem` }}>
                  {englishDate}
                </div>
                <div className="h-5">
                  <div 
                    className={`text-gray-300 mt-2 ${language !== 'english' ? 'visible' : 'invisible'}`}
                    style={{ fontSize: `${SUBTITLE_SIZE}rem` }}
                  >
                    {localizedDate}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: `${TEXT_SIZE}rem` }}>{timeRange}</div>
            </div>

            <div 
              className="mb-18"
              style={{ fontSize: `${TEXT_SIZE}rem` }}
            >
              {location}
            </div>
          </div>

          {/* Bottom Logo */}
          <div 
            className="aspect-square flex items-center justify-center"
            style={{ width: `${LOGO_BOTTOM_SIZE}rem` }}
          >
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
})

PosterPreview.displayName = 'PosterPreview'
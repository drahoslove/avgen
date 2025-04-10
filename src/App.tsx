import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas-pro'
import { PosterForm } from './components/PosterForm'
import { PosterPreview } from './components/PosterPreview'
import ActionButtons from './components/ActionButtons'
import type { GrayscaleMethod } from './types'
import { useScrollDirection } from './hooks/useScrollDirection'

function App() {
  // State management
  // load from local storage if available
  const [chapter, setChapter] = useState(localStorage.getItem('chapter') || 'PRAGUE')
  const [date, setDate] = useState(
    localStorage.getItem('date') || new Date().toISOString().split('T')[0]
  )
  const [startTime, setStartTime] = useState(localStorage.getItem('startTime') || '17:00')
  const [endTime, setEndTime] = useState(localStorage.getItem('endTime') || '19:00')
  const [location, setLocation] = useState(localStorage.getItem('location') || 'Wenceslas Square')
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en-US')
  const [secondaryLocale, setSecondaryLocale] = useState(
    localStorage.getItem('secondaryLocale') || ''
  )
  const [isBackgroundImageEditable, setIsBackgroundImageEditable] = useState(false)
  const [grayscaleMethod, setGrayscaleMethod] = useState<GrayscaleMethod>('luma')
  const [customGrayscaleValues, setCustomGrayscaleValues] = useState({
    r: 0.299,
    g: 0.587,
    b: 0.114,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Reference to the preview container
  const previewRef = useRef<HTMLDivElement>(null)

  // Background image state
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    localStorage.getItem('backgroundUrl') || '/bg/1.jpg'
  )
  const [opacity, setOpacity] = useState(75)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [zoom, setZoom] = useState(100)
  const [blur, setBlur] = useState(0)
  const scrollDirection = useScrollDirection()

  // save to locale storage
  useEffect(() => {
    localStorage.setItem('chapter', chapter)
    localStorage.setItem('date', date)
    localStorage.setItem('startTime', startTime)
    localStorage.setItem('endTime', endTime)
    localStorage.setItem('location', location)
    localStorage.setItem('locale', locale)
    localStorage.setItem('secondaryLocale', secondaryLocale)
    localStorage.setItem('backgroundUrl', backgroundImage || '')
  }, [
    chapter,
    date,
    startTime,
    endTime,
    location,
    locale,
    secondaryLocale,
    grayscaleMethod,
    customGrayscaleValues,
    backgroundImage,
  ])

  useEffect(() => {
    if (locale === secondaryLocale) {
      setSecondaryLocale('')
    }
  }, [locale, secondaryLocale])

  const getCanvas = async () => {
    if (!previewRef.current) return null
    // Set fixed dimensions for image generation
    const [width, height] = [1080, 1350] // should be  be 4/5
    const baseFontSize = height / 60

    try {
      return await html2canvas(previewRef.current, {
        scale: 1,
        backgroundColor: '#000000',
        logging: false,
        onclone: (_, element) => {
          element.style.width = `${width}px`
          element.style.height = `${height}px`
          element.style.fontSize = `${baseFontSize}px`
        },
      })
    } catch (error) {
      console.error('Error generating image:', error)
      return null
    }
  }

  // Function to generate image and return the blob
  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!previewRef.current) return null
    try {
      const canvas = await getCanvas()
      if (!canvas) return null
      return new Promise<Blob>(resolve => {
        canvas.toBlob(
          blob => {
            resolve(blob as Blob)
          },
          'image/png',
          1.0
        )
      })
    } catch (error) {
      console.error('Error generating image:', error)
      return null
    }
  }

  // Function to download the image
  const downloadImage = async () => {
    setIsGenerating(true)
    if (!previewRef.current) return
    try {
      const canvas = await getCanvas()
      if (!canvas) return
      const dataUrl = canvas.toDataURL('image/png')
      if (!dataUrl) return

      const link = document.createElement('a')
      link.download = `cube-of-truth-${chapter.toLowerCase().replace(/\s+/g, '-')}-${date}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Function to share the image
  const shareImage = async () => {
    setIsSharing(true)
    try {
      const blob = await generateImageBlob()
      if (!blob) return

      const file = new File(
        [blob],
        `cube-of-truth-${chapter.toLowerCase().replace(/\s+/g, '-')}-${date}.png`,
        {
          type: 'image/png',
        }
      )

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Cube of Truth',
          text: `Join us at the Cube of Truth in ${chapter}!`,
        })
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ])
        alert('Image copied to clipboard!')
      }
    } catch (error) {
      console.error('Share error:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-0 sm:p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-0 sm:gap-6 max-w-7xl mx-auto pb-20 lg:pb-0 h-full">
        <div className="w-full lg:w-1/3 bg-zinc-300 sm:rounded-lg shadow-lg p-6 flex flex-col h-full lg:min-h-[calc(100vh-3rem)]">
          <PosterForm
            chapter={chapter}
            setChapter={setChapter}
            date={date}
            setDate={setDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            location={location}
            setLocation={setLocation}
            locale={locale}
            setLocale={setLocale}
            secondaryLocale={secondaryLocale}
            setSecondaryLocale={setSecondaryLocale}
            onGenerateImage={e => {
              e.preventDefault()
              void downloadImage()
            }}
            onShare={e => {
              e.preventDefault()
              void shareImage()
            }}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            isBackgroundImageEditable={isBackgroundImageEditable}
            opacity={opacity}
            setOpacity={setOpacity}
            position={position}
            setPosition={setPosition}
            zoom={zoom}
            setZoom={setZoom}
            blur={blur}
            setBlur={setBlur}
            grayscaleMethod={grayscaleMethod}
            setGrayscaleMethod={setGrayscaleMethod}
            customGrayscaleValues={customGrayscaleValues}
            setCustomGrayscaleValues={setCustomGrayscaleValues}
            isGenerating={isGenerating}
            isSharing={isSharing}
          />
        </div>
        <div className="w-full lg:w-2/3 flex items-center justify-center h-full sticky top-[1.5rem]">
          <PosterPreview
            ref={previewRef}
            chapter={chapter}
            date={date}
            timeStart={startTime}
            timeEnd={endTime}
            location={location}
            locale={locale}
            secondaryLocale={secondaryLocale}
            backgroundImage={backgroundImage}
            isBackgroundImageEditable={isBackgroundImageEditable}
            setIsBackgroundImageEditable={setIsBackgroundImageEditable}
            opacity={opacity}
            position={position}
            zoom={zoom}
            blur={blur}
            grayscaleMethod={grayscaleMethod}
            customGrayscaleValues={customGrayscaleValues}
          />
        </div>
      </div>

      {/* Action buttons at the bottom - visible only on mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 lg:hidden bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out ${
          scrollDirection === 'up' ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <ActionButtons
          handleGenerateImage={() => {
            void downloadImage()
          }}
          isGenerating={isGenerating}
          handleShare={() => {
            void shareImage()
          }}
          isSharing={isSharing}
        />
      </div>
    </div>
  )
}

export default App

import { useState, useRef } from 'react'
import html2canvas from 'html2canvas-pro'
import { PosterForm } from './components/PosterForm'
import { PosterPreview } from './components/PosterPreview'
import type { GrayscaleMethod } from './types'
import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/20/solid'
import { useScrollDirection } from './hooks/useScrollDirection'

function App() {
  // State management
  const [chapter, setChapter] = useState('PRAGUE')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('17:00')
  const [endTime, setEndTime] = useState('19:00')
  const [location, setLocation] = useState('Wenceslas Square')
  const [language, setLanguage] = useState('English')
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
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(75)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [zoom, setZoom] = useState(100)

  const scrollDirection = useScrollDirection()

  // Format date based on language
  const formatDate = (date: string, lang: string) => {
    if (!date) return ''
    const dateObj = new Date(date)
    const formatter = new Intl.DateTimeFormat(lang === 'Czech' ? 'cs-CZ' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    return formatter.format(dateObj)
  }

  // Get both English and localized date strings
  const englishDate = formatDate(date, 'english')
  const localizedDate = formatDate(date, language)

  // Format time range for display
  const formatTime = (time: string, lang: string) => {
    if (lang !== 'English') return time

    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const period = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${period}`
  }

  const timeRange =
    language === 'English'
      ? `${formatTime(startTime, language)} – ${formatTime(endTime, language)}`
      : `${startTime} – ${endTime}`

  // Function to generate image and return the blob
  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!previewRef.current) return null

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        logging: false,
        useCORS: true,
      })

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
  const handleGenerateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (previewRef.current) {
      // Set fixed dimensions for image generation
      previewRef.current.style.width = '1080px'
      previewRef.current.style.height = '1350px'
      setIsGenerating(true) // must be set after the dimensions are set
      // wait a frame
      await new Promise(resolve => requestAnimationFrame(resolve)) // wait for the layout to be updated

      try {
        const dataUrl = await html2canvas(previewRef.current, {
          scale: 1,
          useCORS: true,
          backgroundColor: '#000000',
        }).then(canvas => canvas.toDataURL('image/png'))

        // Reset dimensions after generation
        previewRef.current.style.width = ''
        previewRef.current.style.height = ''

        const link = document.createElement('a')
        link.download = `cube-of-truth-${chapter.toLowerCase().replace(/\s+/g, '-')}.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error('Error generating image:', error)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  // Function to share the image
  const shareImage = async () => {
    try {
      const blob = await generateImageBlob()
      if (!blob) return

      const file = new File([blob], `cube-of-truth-${chapter.toLowerCase()}-${date}.png`, {
        type: 'image/png',
      })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Cube of Truth Poster',
          text: `Join us at the Cube of Truth in ${chapter}!`,
        })
      } else {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ])
          alert('Image copied to clipboard!')
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError)
          // If clipboard fails, fall back to download
          await handleGenerateImage({
            preventDefault: () => {},
          } as React.MouseEvent<HTMLButtonElement>)
        }
      }
    } catch (error) {
      console.error('Share error:', error)
      // If sharing fails, fall back to download
      await handleGenerateImage({ preventDefault: () => {} } as React.MouseEvent<HTMLButtonElement>)
    }
  }

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSharing(true)
    try {
      await shareImage()
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-0 sm:p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-0 sm:gap-6 max-w-7xl mx-auto pb-20 lg:pb-0 h-full">
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
          language={language}
          setLanguage={setLanguage}
          onGenerateImage={e => {
            e.preventDefault()
            void handleGenerateImage(e)
          }}
          onShare={e => {
            e.preventDefault()
            void handleShare(e)
          }}
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
          opacity={opacity}
          setOpacity={setOpacity}
          position={position}
          setPosition={setPosition}
          zoom={zoom}
          setZoom={setZoom}
          grayscaleMethod={grayscaleMethod}
          setGrayscaleMethod={setGrayscaleMethod}
          customGrayscaleValues={customGrayscaleValues}
          setCustomGrayscaleValues={setCustomGrayscaleValues}
          isGenerating={isGenerating}
          isSharing={isSharing}
        />
        <div className="w-full lg:w-2/3 flex items-center justify-center h-full">
          <PosterPreview
            ref={previewRef}
            chapter={chapter}
            englishDate={englishDate}
            localizedDate={localizedDate}
            timeRange={timeRange}
            location={location}
            language={language}
            backgroundImage={backgroundImage}
            opacity={opacity}
            position={position}
            zoom={zoom}
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
        <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto">
          <button
            onClick={e => {
              e.preventDefault()
              void handleGenerateImage(e)
            }}
            disabled={isGenerating}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Download</span>
              </>
            )}
          </button>
          <button
            onClick={e => {
              e.preventDefault()
              void handleShare(e)
            }}
            disabled={isSharing}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSharing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

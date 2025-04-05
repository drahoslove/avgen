import { useState, useRef } from 'react'
import html2canvas from 'html2canvas-pro'
import { PosterForm } from './components/PosterForm'
import { PosterPreview } from './components/PosterPreview'
import type { GrayscaleMethod } from './types'

function App() {
  // State management
  const [chapter, setChapter] = useState('PRAGUE')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('17:00')
  const [endTime, setEndTime] = useState('19:00')
  const [location, setLocation] = useState('Wenceslas Square')
  const [language, setLanguage] = useState('czech')
  const [grayscaleMethod, setGrayscaleMethod] = useState<GrayscaleMethod>('luma')
  const [customGrayscaleValues, setCustomGrayscaleValues] = useState({
    r: 0.299,
    g: 0.587,
    b: 0.114,
  })

  // Reference to the preview container
  const previewRef = useRef<HTMLDivElement>(null)

  // Background image state
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(75)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [zoom, setZoom] = useState(100)

  // Format date based on language
  const formatDate = (date: string, lang: string) => {
    if (!date) return ''
    const dateObj = new Date(date)
    const formatter = new Intl.DateTimeFormat(lang === 'czech' ? 'cs-CZ' : 'en-US', {
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
  const timeRange = `${startTime}–${endTime}`

  // Function to generate image and return the blob
  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!previewRef.current) return null

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        logging: false,
        useCORS: true
      })

      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob)
        }, 'image/png', 1.0)
      })
    } catch (error) {
      console.error('Error generating image:', error)
      return null
    }
  }

  // Function to download the image
  const generateImage = async () => {
    const blob = await generateImageBlob()
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `cube-of-truth-${chapter.toLowerCase()}-${date}.png`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  // Function to share the image
  const shareImage = async () => {
    const blob = await generateImageBlob()
    if (!blob) return

    const file = new File([blob], `cube-of-truth-${chapter.toLowerCase()}-${date}.png`, {
      type: 'image/png'
    })

    try {
      if (navigator.share && navigator.canShare({ files: [file] })) {
        // Use Web Share API if available
        await navigator.share({
          files: [file],
          title: 'Cube of Truth Poster',
          text: `Join us at the Cube of Truth in ${chapter}!`
        })
      } else {
        // Fallback to clipboard
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ])
          alert('Image copied to clipboard!')
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError)
          // If clipboard fails, fall back to download
          await generateImage()
        }
      }
    } catch (error) {
      console.error('Share error:', error)
      // If sharing fails, fall back to download
      await generateImage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
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
          onGenerateImage={generateImage}
          onShare={shareImage}
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
        />

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
  )
}

export default App
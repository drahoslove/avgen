import { useState, useRef } from 'react'
import html2canvas from 'html2canvas-pro'
import { useShallow } from 'zustand/shallow'
import { PosterForm } from '../components/PosterForm'
import { PosterPreview } from '../components/PosterPreview'
import ActionButtons from '../components/ActionButtons'
import { useScrollDirection } from '../hooks/useScrollDirection'
import { useContentStore } from '../hooks/useStore'
import { useInAppBrowser } from '../hooks/useInAppBrowser'
import { TARGET_WIDTH, TARGET_HEIGHT, EM_ROWS } from '../constants/dimensions'

function Home() {
  // State management
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isBackgroundImageEditable, setIsBackgroundImageEditable] = useState(false)

  // Reference to the preview container
  const previewRef = useRef<HTMLDivElement>(null)

  // Background image state
  const scrollDirection = useScrollDirection()

  // Detect if user is in an in-app browser
  const { shouldShowWarning, handleIgnoreWarning } = useInAppBrowser()

  const { chapter, date, locale, secondaryLocale } = useContentStore(
    useShallow(state => ({
      chapter: state.chapter,
      date: state.date,
      locale: state.locale,
      secondaryLocale: state.secondaryLocale,
    }))
  )

  const getCanvas = async (targetLocale: string) => {
    if (!previewRef.current) return null
    // Set fixed dimensions for image generation
    const [width, height] = [TARGET_WIDTH, TARGET_HEIGHT] // should be  be 4/5
    const baseFontSize = height / EM_ROWS

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 1,
        backgroundColor: '#000000',
        logging: false,
        onclone: (_, element) => {
          element.style.width = `${width}px`
          element.style.height = `${height}px`
          element.style.fontSize = `${baseFontSize}px`

          // Fix slider positioning for capture
          const sliderTrack = element.querySelector('.slick-track') as HTMLDivElement
          if (sliderTrack) {
            sliderTrack.style.transform = 'none'
            sliderTrack.style.width = '100%'
          }

          // Show only the slide for the target locale
          const slides = element.querySelectorAll('.slick-slide')
          slides.forEach((slide, index) => {
            const slideDiv = slide as HTMLDivElement
            if (slideDiv) {
              const shouldDisplay =
                (targetLocale === locale && index === 0) ||
                (targetLocale === secondaryLocale && index === 1)
              slideDiv.style.display = shouldDisplay ? 'block' : 'none'
              if (shouldDisplay) {
                slideDiv.style.width = '100%'
              }
            }
          })
        },
      })
      return canvas
    } catch (error) {
      console.error('Error generating image:', error)
      return null
    }
  }

  // Function to generate image and return the blob
  const generateImageBlob = async (targetLocale: string): Promise<Blob | null> => {
    if (!previewRef.current) return null
    try {
      const canvas = await getCanvas(targetLocale)
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
      console.error(
        'Error generating image:',
        error instanceof Error ? error.message : 'Unknown error'
      )
      return null
    }
  }

  // Function to download the image(s)
  const downloadImage = async () => {
    setIsGenerating(true)
    if (!previewRef.current) return
    try {
      // Generate primary locale image
      const primaryCanvas = await getCanvas(locale)
      if (!primaryCanvas) return
      const primaryDataUrl = primaryCanvas.toDataURL('image/png')
      const primaryLink = document.createElement('a')
      primaryLink.download = `cube-of-truth-${chapter.toLowerCase().replace(/\s+/g, '-')}-${date}-${locale}.png`
      primaryLink.href = primaryDataUrl
      primaryLink.target = '_system'
      primaryLink.click()

      // Generate secondary locale image if exists
      if (secondaryLocale) {
        const secondaryCanvas = await getCanvas(secondaryLocale)
        if (!secondaryCanvas) return
        const secondaryDataUrl = secondaryCanvas.toDataURL('image/png')
        const secondaryLink = document.createElement('a')
        secondaryLink.download = `cube-of-truth-${chapter.toLowerCase().replace(/\s+/g, '-')}-${date}-${secondaryLocale}.png`
        secondaryLink.href = secondaryDataUrl
        secondaryLink.target = '_system'
        secondaryLink.click()
      }
    } catch (error) {
      console.error(
        'Error generating image:',
        error instanceof Error ? error.message : 'Unknown error'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  // Function to share the image
  const shareImage = async () => {
    setIsSharing(true)
    try {
      const blobs: Blob[] = []

      // Generate primary locale image
      const primaryBlob = await generateImageBlob(locale)
      if (primaryBlob) blobs.push(primaryBlob)

      // Generate secondary locale image if exists
      if (secondaryLocale) {
        const secondaryBlob = await generateImageBlob(secondaryLocale)
        if (secondaryBlob) blobs.push(secondaryBlob)
      }

      if (blobs.length === 0) {
        alert('Image(s) not generated. Try another browser.')
        return
      }

      const files = blobs.map((blob, index) => {
        const localeCode = index === 0 ? locale : secondaryLocale
        return new File(
          [blob],
          `cube-of-truth-${chapter.toLowerCase().replace(/\s+/g, '-')}-${date}-${localeCode}.png`,
          { type: 'image/png' }
        )
      })

      if (navigator.share && navigator.canShare({ files })) {
        await navigator.share({
          files,
          title: 'Cube of Truth',
          text: `Join us at the Cube of Truth in ${chapter}!`,
        })
      } else {
        // If sharing multiple files isn't supported, just copy the primary locale image
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blobs[0] }),
          ...(blobs.length > 1 ? [new ClipboardItem({ 'image/png': blobs[1] })] : []),
        ])
        alert('Image(s) copied to clipboard!')
      }
    } catch (error) {
      console.error('Share error:', error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-0 sm:p-4 md:p-6">
      {/* In-app browser warning */}
      {shouldShowWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-3 text-center text-sm font-medium shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1 text-center">
              For the best experience, open this page in your browser instead of the chat app.
              <button
                onClick={() => window.open(window.location.href, '_blank')}
                className="ml-3 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md cursor-pointer"
              >
                Open in Browser
              </button>
            </div>
            <button
              onClick={handleIgnoreWarning}
              className="ml-4 px-1.5 py-0.5 text-xs text-yellow-800 bg-yellow-400 hover:bg-yellow-500 rounded transition-colors opacity-70 hover:opacity-100"
              title="Don't show this warning again"
            >
              Ignore
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-0 sm:gap-6 max-w-7xl mx-auto pb-20 lg:pb-0 h-full">
        <div className="w-full lg:w-1/3 bg-zinc-300 sm:rounded-lg shadow-lg p-4 md:p-6 flex flex-col h-full lg:min-h-[calc(100vh-3rem)]">
          <PosterForm
            onGenerateImage={e => {
              e.preventDefault()
              void downloadImage()
            }}
            onShare={e => {
              e.preventDefault()
              void shareImage()
            }}
            isGenerating={isGenerating}
            isSharing={isSharing}
            isBackgroundImageEditable={isBackgroundImageEditable}
          />
        </div>
        <div className="lg:w-2/3 flex items-center justify-center h-full sticky top-[1.5rem]">
          <div className="w-full bg-zinc-300 sm:rounded-lg shadow-lg p-4 md:p-6 lg:h-[calc(100vh-3rem)]">
            <PosterPreview
              ref={previewRef}
              isBackgroundImageEditable={isBackgroundImageEditable}
              setIsBackgroundImageEditable={setIsBackgroundImageEditable}
            />
          </div>
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

export default Home

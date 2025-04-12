import { useState, useRef } from 'react'
import html2canvas from 'html2canvas-pro'
import { useShallow } from 'zustand/shallow'
import { PosterForm } from './components/PosterForm'
import { PosterPreview } from './components/PosterPreview'
import ActionButtons from './components/ActionButtons'
import { useScrollDirection } from './hooks/useScrollDirection'
import { useContentStore } from './hooks/useStore'

function App() {
  // State management

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const [isBackgroundImageEditable, setIsBackgroundImageEditable] = useState(false)

  // Reference to the preview container
  const previewRef = useRef<HTMLDivElement>(null)

  // Background image state
  const scrollDirection = useScrollDirection()

  const { chapter, date } = useContentStore(
    useShallow(state => ({
      chapter: state.chapter,
      date: state.date,
    }))
  )

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

export default App

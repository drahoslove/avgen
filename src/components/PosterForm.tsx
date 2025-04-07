import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'
import { ContentTab } from './ContentTab'
import { BackgroundTab } from './BackgroundTab'
import type { GrayscaleMethod } from '../types'
import { About } from './About'
import { useEffect, useState, useRef } from 'react'

interface PosterFormProps {
  chapter: string
  setChapter: (value: string) => void
  date: string
  setDate: (value: string) => void
  startTime: string
  setStartTime: (value: string) => void
  endTime: string
  setEndTime: (value: string) => void
  location: string
  setLocation: (value: string) => void
  locale: string
  setLocale: (value: string) => void
  secondaryLocale: string
  setSecondaryLocale: (value: string) => void
  onGenerateImage: (e: React.MouseEvent<HTMLButtonElement>) => void
  onShare: (e: React.MouseEvent<HTMLButtonElement>) => void
  backgroundImage: string | null
  setBackgroundImage: (value: string | null) => void
  isBackgroundImageEditable: boolean
  opacity: number
  setOpacity: (value: number) => void
  position: { x: number; y: number }
  setPosition: (value: { x: number; y: number }) => void
  zoom: number
  setZoom: (value: number) => void
  grayscaleMethod: GrayscaleMethod
  setGrayscaleMethod: (value: GrayscaleMethod) => void
  customGrayscaleValues: { r: number; g: number; b: number }
  setCustomGrayscaleValues: (values: { r: number; g: number; b: number }) => void
  isGenerating: boolean
  isSharing: boolean
}

export function PosterForm({
  chapter,
  setChapter,
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  location,
  setLocation,
  locale,
  setLocale,
  secondaryLocale,
  setSecondaryLocale,
  onGenerateImage,
  onShare,
  backgroundImage,
  setBackgroundImage,
  isBackgroundImageEditable,
  opacity,
  setOpacity,
  position,
  setPosition,
  zoom,
  setZoom,
  grayscaleMethod,
  setGrayscaleMethod,
  customGrayscaleValues,
  setCustomGrayscaleValues,
  isGenerating,
  isSharing,
}: PosterFormProps) {
  const handleGenerateImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    void onGenerateImage(e)
  }

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    void onShare(e)
  }

  const [rest, setRest] = useState<string>('erator ')
  const [letters, setLetters] = useState<string[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const timeout: ReturnType<typeof setTimeout> | null = null
    const t = rest.split('')
    timeoutRef.current = setTimeout(
      () => {
        if (t.length > 0) {
          const letter = t.shift() ?? ''
          setLetters([...letters, letter])
          setRest(t.join(''))
        } else {
          clearTimeout(timeoutRef.current ?? undefined)
        }
      },
      letters.length === 0 ? 500 : 250
    )
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [letters])

  return (
    <div className="w-full lg:w-1/3 bg-zinc-300 sm:rounded-lg shadow-lg p-6 flex flex-col h-full lg:min-h-[calc(100vh-3rem)]">
      {/* headline */}
      <div className="flex">
        <h1 className="bg-zinc-900 text-2xl text-white mb-6 font-bold font-libre-franklin rounded-md p-1 px-3">
          <a href="/">
            <span className="text-white underline">AV Gen</span>
            {letters.map((letter, index, { length }) => (
              <span
                key={index}
                className={`${index !== length - 1 ? 'text-brand-red decoration-brand-red' : 'text-black decoration-black'} underline  transition-colors duration-1000 ease-in-out`}
              >
                {letter}
              </span>
            ))}
            <span className="text-black decoration-black underline">{rest}</span>
          </a>
        </h1>
        <div className="flex flex-grow justify-end pt-1">
          <About />
        </div>
      </div>
      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-lg bg-zinc-100/[0.75] shadow-sm p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full rounded-md py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out cursor-pointer
              ${
                selected
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-600 hover:bg-white/[0.5] hover:text-zinc-900'
              }`
            }
          >
            Content
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-md py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out cursor-pointer
              ${
                selected
                  ? 'bg-white text-zinc-900'
                  : ' text-zinc-600 hover:bg-white/[0.5] hover:text-zinc-900'
              }`
            }
          >
            Background
          </Tab>
        </Tab.List>
        <Tab.Panels className="flex-1">
          <Tab.Panel>
            <ContentTab
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
            />
          </Tab.Panel>
          <Tab.Panel>
            <BackgroundTab
              backgroundImage={backgroundImage}
              setBackgroundImage={setBackgroundImage}
              isBackgroundImageEditable={isBackgroundImageEditable}
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
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Action buttons - at the bottom of the form */}
      <div className="mt-auto pt-6 hidden lg:grid grid-cols-2 gap-4">
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating}
          className="bg-zinc-700 hover:bg-zinc-800 cursor-pointer text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          onClick={handleShare}
          disabled={isSharing}
          className="bg-zinc-700 hover:bg-zinc-800 cursor-pointer text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
  )
}

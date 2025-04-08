import { useEffect, useState, useRef } from 'react'
import { Tab } from '@headlessui/react'
import { ContentTab } from './ContentTab'
import { BackgroundTab } from './BackgroundTab'
import About from './About'
import ActionButtons from './ActionButtons'
import type { GrayscaleMethod } from '../types'

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
  blur: number
  setBlur: (value: number) => void
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
  blur,
  setBlur,
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
  }, [letters, rest])

  return (
    <>
      {/* headline */}
      <div className="flex">
        <h1 className="bg-zinc-900 text-2xl text-white mb-6 font-bold font-libre-franklin rounded-md p-1 px-3">
          <a href="/">
            <span className="text-white underline">AV Gen</span>
            {letters.map((letter, index, { length }) => (
              <span
                key={index}
                className={`${index !== length - 1 ? 'text-brand-red decoration-brand-red' : 'text-zinc-900 decoration-zinc-9text-zinc-900'} underline  transition-colors duration-1000 ease-in-out`}
              >
                {letter}
              </span>
            ))}
            <span className="text-zinc-900 decoration-black underline">{rest}</span>
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
              blur={blur}
              setBlur={setBlur}
              grayscaleMethod={grayscaleMethod}
              setGrayscaleMethod={setGrayscaleMethod}
              customGrayscaleValues={customGrayscaleValues}
              setCustomGrayscaleValues={setCustomGrayscaleValues}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Action buttons - at the bottom of the form */}
      <div className="mt-auto pt-8 hidden lg:block">
        <ActionButtons
          handleGenerateImage={handleGenerateImage}
          isGenerating={isGenerating}
          handleShare={handleShare}
          isSharing={isSharing}
        />
      </div>
    </>
  )
}

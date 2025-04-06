import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'
import { ContentForm } from './ContentForm'
import { BackgroundForm } from './BackgroundForm'
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
  language: string
  setLanguage: (value: string) => void
  onGenerateImage: () => Promise<void>
  onShare: () => Promise<void>
  backgroundImage: string | null
  setBackgroundImage: (value: string | null) => void
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
  language,
  setLanguage,
  onGenerateImage,
  onShare,
  backgroundImage,
  setBackgroundImage,
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
}: PosterFormProps) {
  const handleGenerateImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    void onGenerateImage()
  }

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    void onShare()
  }

  return (
    <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'
              }`
            }
          >
            Content
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'
              }`
            }
          >
            Background
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ContentForm
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
            />
          </Tab.Panel>
          <Tab.Panel>
            <BackgroundForm
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
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4 mt-12">
        <button
          onClick={handleGenerateImage}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Download</span>
        </button>
        <button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2"
        >
          <ShareIcon className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}

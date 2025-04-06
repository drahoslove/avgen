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
  onGenerateImage: (e: React.MouseEvent<HTMLButtonElement>) => void
  onShare: (e: React.MouseEvent<HTMLButtonElement>) => void
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

  return (
    <div className="w-full lg:w-1/3 bg-gray-300 sm:rounded-lg shadow-lg p-6 flex flex-col h-full lg:min-h-[calc(100vh-3rem)]">
      {/* headline */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        AV Gen<span className="opacity-50">erator</span>
      </h1>
      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-gray-100/[0.5] p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out cursor-pointer
              ${
                selected
                  ? 'bg-white text-gray-900 shadow-md ring-1 ring-gray-200'
                  : 'text-gray-600 hover:bg-white/[0.5] hover:text-gray-900'
              }`
            }
          >
            Content
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out cursor-pointer
              ${
                selected
                  ? 'bg-white text-gray-900 shadow-md ring-1 ring-gray-200'
                  : ' text-gray-600 hover:bg-white/[0.5] hover:text-gray-900'
              }`
            }
          >
            Background
          </Tab>
        </Tab.List>
        <Tab.Panels className="flex-1">
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

      {/* Action buttons - at the bottom of the form */}
      <div className="mt-auto pt-6 hidden lg:grid grid-cols-2 gap-4">
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating}
          className="bg-gray-700 hover:bg-gray-800 cursor-pointer text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-gray-700 hover:bg-gray-800 cursor-pointer text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

import { Tab } from '@headlessui/react'
import { ContentTab } from './ContentTab'
import { BackgroundTab } from './BackgroundTab'
import Header from './Header'
import ActionButtons from './ActionButtons'
import About from './About'

interface PosterFormProps {
  onGenerateImage: (e: React.MouseEvent<HTMLButtonElement>) => void
  onShare: (e: React.MouseEvent<HTMLButtonElement>) => void
  isBackgroundImageEditable: boolean
  isGenerating: boolean
  isSharing: boolean
}

export function PosterForm({
  onGenerateImage,
  onShare,
  isBackgroundImageEditable,
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
    <>
      {/* headline */}
      <div className="flex">
        <Header />
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
            <ContentTab />
          </Tab.Panel>
          <Tab.Panel>
            <BackgroundTab isBackgroundImageEditable={isBackgroundImageEditable} />
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

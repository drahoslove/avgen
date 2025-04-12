import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline'
import Spinner from './icons/spinner'
type ActionButtonsProps = {
  handleGenerateImage: (e: React.MouseEvent<HTMLButtonElement>) => void
  isGenerating: boolean
  handleShare: (e: React.MouseEvent<HTMLButtonElement>) => void
  isSharing: boolean
}

const ActionButtons = ({
  handleGenerateImage,
  isGenerating,
  handleShare,
  isSharing,
}: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto">
      <button
        onClick={handleGenerateImage}
        disabled={isGenerating}
        className="bg-zinc-700 hover:bg-zinc-800 cursor-pointer text-white font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Spinner className="-ml-1 mr-3 h-5 w-5" />
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
            <Spinner className="-ml-1 mr-3 h-5 w-5" />
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
  )
}

export default ActionButtons

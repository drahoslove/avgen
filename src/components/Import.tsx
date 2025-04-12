import { useState } from 'react'
import {
  ArrowDownOnSquareIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react'
import { useShallow } from 'zustand/shallow'
import importFromArc from '../utils/importArc'
import type { EventData } from '../types'
import { useContentStore } from '../hooks/useStore'
import Spinner from './icons/spinner'

const Import = () => {
  const { setChapter, setLocation, setDate, setStartTime, setEndTime } = useContentStore(
    useShallow(state => ({
      setChapter: state.setChapter,
      setLocation: state.setLocation,
      setDate: state.setDate,
      setStartTime: state.setStartTime,
      setEndTime: state.setEndTime,
    }))
  )
  const [isOpen, setIsOpen] = useState(false)
  const [arcUrl, setArcUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const importFrom = (importer: (url: string) => Promise<EventData>, url: string) => () => {
    setIsLoading(true)
    setIsOpen(false)
    // e.preventDefault()
    void (async () => {
      try {
        if (!url) return
        const eventData = await importer(url)
        setChapter(eventData.chapterName)
        setLocation(eventData.location)
        setDate(eventData.date)
        setStartTime(eventData.timeStart)
        setEndTime(eventData.timeEnd)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return (
    <>
      <button
        className="px-4 h-10 py-2 bg-zinc-500/90 text-white rounded-md hover:bg-zinc-600 shadow-sm cursor-pointer"
        onClick={() => setIsOpen(true)}
        title="Import"
      >
        {isLoading ? <Spinner /> : <ArrowDownOnSquareIcon className="h-5 w-5" />}
      </button>
      <Dialog
        transition
        open={isOpen}
        as="div"
        className="fixed inset-0 z-10 w-screen overflow-y-auto bg-zinc-900/75 transition-colors duration-300 ease-out data-[closed]:bg-zinc-900/0"
        onClose={() => setIsOpen(false)}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white/75 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 shadow-black/[0.5] shadow-xl"
          >
            <DialogTitle className="mb-3 text-md font-bold text-zinc-900 flex items-center gap-2">
              <ArrowDownOnSquareIcon className="h-5 w-5" />
              Import from
            </DialogTitle>
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-zinc-900 flex items-center justify-between">
                    <span>Animal Rights Calendar</span>
                    <small className="inline-flex items-center gap-1">
                      <a
                        title="Open Animal Rights Calendar"
                        className="inline-flex items-center gap-1"
                        href="https://animalrightscalendar.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MagnifyingGlassIcon className="h-3 w-3" />
                        {/* <ArrowUpRightIcon className="h-3 w-3" /> */}
                      </a>
                    </small>
                  </label>
                  <Input
                    type="text"
                    placeholder="https://animalrightscalendar.org/events/fedcba"
                    value={arcUrl}
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-zinc-300"
                    onChange={e => setArcUrl(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        importFrom(importFromArc, arcUrl)()
                      }
                    }}
                  />
                </div>
                <button
                  onClick={importFrom(importFromArc, arcUrl)}
                  disabled={isLoading || !arcUrl}
                  className="px-4 h-10 py-2 bg-zinc-500/90 text-white rounded-md hover:bg-zinc-600 shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-zinc-500/90"
                >
                  {isLoading ? <Spinner /> : <ArrowRightIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default Import

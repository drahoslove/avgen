import { Popover } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

const About = () => {
  return (
    <Popover className="relative">
      <Popover.Button className="cursor-pointer">
        <InformationCircleIcon className="h-6 w-6" />
      </Popover.Button>
      <Popover.Panel className="absolute right-0 mt-2 w-72 bg-zinc-600 rounded-lg shadow-black/[0.5] shadow-xl p-4 z-20">
        <div className="">
          <h3 className="text-lg font-medium text-white mb-2">About</h3>
          <p className="text-sm text-white mb-4">
            This tool generates an announcement poster for your local Cube&nbsp;of&nbsp;Truth event.
          </p>
          <p className="text-sm text-white">
            Made by{' '}
            <a
              href="https://github.com/drahoslove"
              className="text-white underline"
              target="_blank"
            >
              Draho
            </a>{' '}
            from AV Brno for all chapters of{' '}
            <a
              href="https://anonymousforthevoiceless.org"
              className="text-white underline"
              target=""
            >
              Anonymous for the Voiceless
            </a>
          </p>
          <h3 className="text-lg font-medium text-white mb-2 mt-4">Help</h3>
          <p className="text-sm text-white">
            For bug reports and feature requests, feel free to contact me at{' '}
            <a href="mailto:av@draho.cz" className="text-white underline" target="_blank">
              av@draho.cz
            </a>
          </p>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default About

import {
  GlobeAltIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/20/solid'
import { useShallow } from 'zustand/shallow'
import { Listbox, Textarea } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { LOCALIZATIONS } from '../constants/localization'
import { useContentStore } from '../hooks/useStore'

export function ContentTab() {
  const {
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
  } = useContentStore(
    useShallow(state => ({
      chapter: state.chapter,
      setChapter: state.setChapter,
      date: state.date,
      setDate: state.setDate,
      startTime: state.startTime,
      setStartTime: state.setStartTime,
      endTime: state.endTime,
      setEndTime: state.setEndTime,
      location: state.location,
      setLocation: state.setLocation,
      locale: state.locale,
      setLocale: state.setLocale,
      secondaryLocale: state.secondaryLocale,
      setSecondaryLocale: state.setSecondaryLocale,
    }))
  )

  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options = []
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const hour = hours.toString().padStart(2, '0')
        const minute = minutes.toString().padStart(2, '0')
        options.push(`${hour}:${minute}`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  return (
    <div className="space-y-6">
      {/* Chapter Input */}
      <div className="space-y-1">
        <label
          htmlFor="chapter"
          className="text-sm font-medium text-zinc-900 flex items-center gap-2"
        >
          <BuildingOffice2Icon className="h-5 w-5" />
          Chapter Name
        </label>
        <Textarea
          id="chapter"
          rows={chapter.split('\n').length || 1}
          value={chapter}
          onChange={e => setChapter(e.target.value.toLocaleUpperCase())}
          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter city name"
        />
      </div>

      {/* Date Input */}
      <div className="space-y-1">
        <label htmlFor="date" className="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Time Range Inputs */}
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Start Time
            </label>
            <Listbox
              value={startTime}
              onChange={value => {
                setStartTime(value)
                if (value >= endTime) {
                  const startIndex = timeOptions.indexOf(value)
                  if (startIndex < timeOptions.length - 1) {
                    setEndTime(timeOptions[startIndex + 1])
                  }
                }
              }}
            >
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white px-3 py-3 text-left text-sm text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className="block truncate">{startTime}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {timeOptions.map(time => (
                    <Listbox.Option
                      key={time}
                      value={time}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-blue-50 text-blue-900' : 'text-zinc-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                          >
                            {time}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              End Time
            </label>
            <Listbox value={endTime} onChange={setEndTime}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white px-3 py-3 text-left text-sm text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className="block truncate">{endTime}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {timeOptions
                    .filter(time => time > startTime)
                    .map(time => (
                      <Listbox.Option
                        key={time}
                        value={time}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                            active ? 'bg-blue-50 text-blue-900' : 'text-zinc-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                            >
                              {time}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>
      </div>

      {/* Location Input */}
      <div className="space-y-1">
        <label
          htmlFor="location"
          className="text-sm font-medium text-zinc-900 flex items-center gap-2"
        >
          <MapPinIcon className="h-5 w-5" />
          Location
        </label>
        <Textarea
          id="location"
          rows={location.split('\n').length || 1}
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter location"
        />
      </div>

      {/* Language Selection */}
      <div className="space-y-1 grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="language"
            className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-2"
          >
            <GlobeAltIcon className="h-5 w-5" />
            Localization
          </label>
          <Listbox value={locale} onChange={setLocale}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white px-3 py-3 text-left text-sm text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="block truncate">
                  {LOCALIZATIONS.find(loc => loc.code === locale)?.name}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 -top-[2rem] mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {LOCALIZATIONS.map(loc => (
                  <Listbox.Option
                    key={loc.code}
                    value={loc.code}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                        active ? 'bg-blue-50 text-blue-900' : 'text-zinc-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {loc.name}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <div>
          <label
            htmlFor="secondaryLocale"
            className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-2"
          >
            Secondary
          </label>
          <Listbox value={secondaryLocale} onChange={setSecondaryLocale}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white px-3 py-3 text-left text-sm text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="block truncate">
                  {LOCALIZATIONS.find(loc => loc.code === secondaryLocale)?.name ?? 'None'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 -top-[2rem] mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {[
                  {
                    code: '',
                    name: 'None',
                  },
                  ...LOCALIZATIONS,
                ]
                  .filter(loc => loc.code !== locale)
                  .map(loc => (
                    <Listbox.Option
                      key={loc.code}
                      value={loc.code}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-blue-50 text-blue-900' : 'text-zinc-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                          >
                            {loc.name}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  )
}

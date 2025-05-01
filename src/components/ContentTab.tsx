import { useEffect, useState } from 'react'
import {
  GlobeAltIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOffice2Icon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid'
import { useShallow } from 'zustand/shallow'
import { Listbox, Textarea } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { LOCALIZATIONS } from '../constants/localization'
import { useContentStore, useSliderStore } from '../hooks/useStore'
import Import from './Import'
import { insertBreak, splitToLines } from '../utils/strings'

// Type for localization
type Localization = (typeof LOCALIZATIONS)[number]
type LocalizationCode = Localization['code']

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
      secondaryLocale: state.secondaryLocale as LocalizationCode | null,
      setSecondaryLocale: state.setSecondaryLocale as (locale: LocalizationCode | null) => void,
    }))
  )

  const { sliderRef, currentSlide } = useSliderStore(
    useShallow(state => ({
      sliderRef: state.sliderRef,
      currentSlide: state.currentSlide,
    }))
  )

  // if chapter name or location changes a lot via pasting a text, apply insert break
  const [lastChapterLength, setLastChapterLength] = useState(chapter.length)
  const [lastLocationLength, setLastLocationLength] = useState(location.length)
  const [chapterError, setChapterError] = useState('')
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    const lengthDiff = chapter.length - lastChapterLength
    setLastChapterLength(chapter.length)

    const lines = splitToLines(chapter)
    if (lines.length > 2) {
      setChapterError('Chapter name cannot exceed 2 lines')
    } else {
      setChapterError('')
    }

    // Only process if length increased by more than 1 character (indicating a paste)
    if (lengthDiff > 1) {
      if (chapter.length > 12 && !chapter.includes('\n')) {
        setChapter(insertBreak(chapter, 12))
      }
    }
  }, [chapter, lastChapterLength, setChapter])

  useEffect(() => {
    const lengthDiff = location.length - lastLocationLength
    setLastLocationLength(location.length)

    const lines = splitToLines(location)
    if (lines.length > 2) {
      setLocationError('Location cannot exceed 2 lines')
    } else {
      setLocationError('')
    }

    // Only process if length increased by more than 1 character (indicating a paste)
    if (lengthDiff > 1) {
      if (location.length > 32 && !location.includes('\n')) {
        setLocation(insertBreak(location, 32))
      }
    }
  }, [location, lastLocationLength, setLocation])

  // Generate time options in 15-minute intervals
  const generateTimeOptions = (variant: 'start' | 'end') => {
    const options = []

    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const hour = hours.toString().padStart(2, '0')
        const minute = minutes.toString().padStart(2, '0')
        options.push(`${hour}:${minute}`)
      }
    }
    if (variant === 'end') {
      options.shift()
      options.push('24:00')
    }
    return options
  }

  const startTimeOptions = generateTimeOptions('start')
  const endTimeOptions = generateTimeOptions('end')

  // Switch slides when locales change
  useEffect(() => {
    if (!sliderRef) return

    // If secondary locale is removed, ensure we're on the first slide
    if (!secondaryLocale) {
      sliderRef.slickGoTo(0)
      return
    }

    // If locale changes, go to slide 0
    sliderRef.slickGoTo(0)
  }, [locale, sliderRef, secondaryLocale])

  useEffect(() => {
    if (!sliderRef || !secondaryLocale) return

    // If secondary locale changes, go to slide 1
    sliderRef.slickGoTo(1)
  }, [secondaryLocale, sliderRef])

  // Get the localization data for the current locale
  const currentLocalization = LOCALIZATIONS.find(loc => loc.code === locale)
  const secondaryLocalization = secondaryLocale
    ? LOCALIZATIONS.find(loc => loc.code === secondaryLocale)
    : null

  return (
    <div className="space-y-5">
      {/* Chapter Input */}
      <div className="space-y-1 flex-1">
        <label
          htmlFor="chapter"
          className="text-sm font-medium text-zinc-900 flex items-center gap-2"
        >
          <BuildingOffice2Icon className="h-5 w-5" />
          Chapter Name
        </label>
        <div className="flex gap-4">
          <div className="w-full">
            <Textarea
              id="chapter"
              rows={chapter.split('\n').length || 1}
              value={chapter}
              onChange={e => setChapter(e.target.value)}
              className={`w-full px-3 py-2 bg-white rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                chapterError ? 'border-red-500' : ''
              }`}
              placeholder="Enter city name"
            />
            {chapterError && <p className="mt-1 text-sm text-red-500">{chapterError}</p>}
          </div>
          <Import />
        </div>
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
          className="w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Time Range Inputs */}
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
                const startIndex = startTimeOptions.indexOf(value)
                if (startIndex < startTimeOptions.length - 1) {
                  setEndTime(startTimeOptions[startIndex + 1])
                }
              }
            }}
          >
            <div className="relative z-20">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white px-3 py-2 text-left text-md text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="block truncate">{startTime}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {startTimeOptions.map(time => (
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
            <div className="relative z-20">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white px-3 py-2 text-left text-md text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="block truncate">{endTime}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {endTimeOptions
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
          className={`w-full px-3 py-2 bg-white rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            locationError ? 'border-red-500' : ''
          }`}
          placeholder="Enter location"
        />
        {locationError && <p className="mt-1 text-sm text-red-500">{locationError}</p>}
      </div>

      {/* Locale Selector */}
      <div className="space-y-4 relative mb-2">
        <div className="grid grid-cols-2 gap-4">
          <div className={`space-y-1 z-10 ${secondaryLocale ? 'p-1' : ''}`}>
            <label
              className="text-sm font-medium text-zinc-900 flex items-center gap-2 cursor-pointer"
              onClick={() => sliderRef?.slickGoTo(0)}
            >
              <GlobeAltIcon className="h-5 w-5" />
              Date localization
            </label>
            <Listbox value={locale} onChange={setLocale}>
              <div className="relative">
                <Listbox.Button
                  className={`relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                    currentSlide === 0 ? '' : ''
                  }`}
                >
                  <span className="block truncate">{currentLocalization?.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {LOCALIZATIONS.map(loc => (
                    <Listbox.Option
                      key={loc.code}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                      value={loc.code}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                          >
                            {loc.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          <div className={`space-y-1 z-10 ${secondaryLocale ? 'p-1' : ''}`}>
            <label
              className="text-sm font-medium text-zinc-900 flex items-center gap-2 cursor-pointer"
              onClick={() => secondaryLocale && sliderRef?.slickGoTo(1)}
            >
              <GlobeAltIcon className="h-5 w-5" />
              Secondary
            </label>
            <Listbox
              value={secondaryLocale || ''}
              onChange={value => setSecondaryLocale(value || null)}
            >
              <div className="relative">
                <Listbox.Button
                  className={`relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                    currentSlide === 1 && secondaryLocale ? '' : ''
                  }`}
                >
                  <span className="block truncate">{secondaryLocalization?.name || 'None'}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    value=""
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          None
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  {LOCALIZATIONS.filter(loc => loc.code !== locale).map(loc => (
                    <Listbox.Option
                      key={loc.code}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                      value={loc.code}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                          >
                            {loc.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
          {/* Animated background */}
          {secondaryLocale && (
            <div
              className="absolute inset-0 pointer-events-none"
              onClick={() => sliderRef?.slickGoTo(currentSlide === 0 ? 1 : 0)}
            >
              <div
                className={`absolute top-[0px] h-full bg-zinc-100/75 w-[calc(50%-8px)] rounded-lg transition-transform duration-500 ease-in-out ${
                  currentSlide === 0 ? 'translate-x-0' : 'translate-x-[calc(100%+16px)]'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* note when secondary locale is selected */}
      {secondaryLocale && (
        <div className="text-sm text-zinc-500 flex items-center gap-2">
          <InformationCircleIcon className="h-5 w-5" />
          Two images will be generated, one for each locale.
        </div>
      )}
    </div>
  )
}

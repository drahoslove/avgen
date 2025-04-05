import { 
  GlobeAltIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOffice2Icon 
} from '@heroicons/react/24/outline'

interface ContentFormProps {
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
}

export function ContentForm({
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
}: ContentFormProps) {
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
      <div className="space-y-2">
        <label htmlFor="chapter" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <BuildingOffice2Icon className="h-5 w-5" />
          Chapter Name
        </label>
        <input
          type="text"
          id="chapter"
          value={chapter}
          onChange={(e) => setChapter(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter city name"
        />
      </div>

      {/* Date Input */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Time Range Inputs */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />Start Time
            </label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value)
                if (e.target.value >= endTime) {
                  const startIndex = timeOptions.indexOf(e.target.value)
                  if (startIndex < timeOptions.length - 1) {
                    setEndTime(timeOptions[startIndex + 1])
                  }
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />End Time
            </label>
            <select
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeOptions
                .filter(time => time > startTime)
                .map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location Input */}
      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter location"
        />
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <GlobeAltIcon className="h-5 w-5" />
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="english">English</option>
          <option value="czech">Czech</option>
        </select>
      </div>
    </div>
  )
}

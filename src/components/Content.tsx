import React from 'react'
import { z } from 'zod'
import { inLines, formatTime, formatDate, getScale } from '../utils/strings'
import whiteLogoTop from '../assets/AV-Logo-White-Transparent.svg'
import whiteLogo from '../assets/AV-Symbol-White-Transparent.png'
import { styleSchema } from '../constants/styles'

export type ContentStyle = z.infer<typeof styleSchema>

interface StyleConfig {
  container: string
  topLogo: {
    container: string
    show: boolean
  }
  mainContent: {
    container: string
    title: string
    titleSecondary: string
    chapter: string
    date: string
    dateSecondary: string
    timeRange: string
    location: string
  }
  bottomLogo: {
    container: string
    show: boolean
  }
}

const styleConfigs: Record<ContentStyle, StyleConfig> = {
  default: {
    container: 'absolute inset-0 flex flex-col items-center text-white',
    topLogo: {
      container: 'aspect-[4/3] flex items-center justify-center mt-[1.5em] w-[11em]',
      show: true,
    },
    mainContent: {
      container: 'text-center font-libre-franklin',
      title: 'text-[4.25em]/[1.5em] font-bold uppercase whitespace-nowrap text-stroke-white',
      titleSecondary: 'text-[2.5em] text-zinc-300 uppercase mb-[0.25em]',
      chapter:
        'text-[6em]/[1.2em] tracking-[0.2em] font-black uppercase text-brand-red whitespace-nowrap -mr-[0.2em] mb-[0.3em]',
      date: 'text-[2.5em] uppercase',
      dateSecondary: 'text-[2.5em] uppercase text-zinc-300',
      timeRange: 'text-[3.75em]',
      location: 'text-[2.25em] px-[2em] whitespace-nowrap',
    },
    bottomLogo: {
      container: 'aspect-square flex items-center justify-center my-[3em] w-[5em]',
      show: true,
    },
  },
  prague: {
    container: 'absolute inset-0 flex flex-col items-center text-white',
    topLogo: {
      container: 'aspect-[4/3] flex items-center justify-center mt-[1.5em] w-[11em]',
      show: true,
    },
    mainContent: {
      container: 'text-center font-libre-franklin',
      title: 'text-[4.25em]/[1.5em] font-bold uppercase whitespace-nowrap text-stroke-white',
      titleSecondary: 'text-[2.5em] text-zinc-300 uppercase mb-[0.25em]',
      chapter:
        'text-[6em]/[1.2em] tracking-[0.2em] font-black uppercase text-brand-red whitespace-nowrap -mr-[0.2em] mb-[0.3em]',
      date: 'text-[2.5em] uppercase',
      dateSecondary: 'text-[2.5em] uppercase text-zinc-300',
      timeRange: 'text-[3.75em]',
      location: 'text-[2.25em] px-[2em] whitespace-nowrap',
    },
    bottomLogo: {
      container: 'aspect-square flex items-center justify-center my-[3em] w-[5em]',
      show: true,
    },
  },
}

interface ContentProps {
  title: string
  titleSecondary: string
  chapter: string
  date: string
  startTime: string
  endTime: string
  location: string
  secondaryLocale: string | null
  locale: string
  style?: ContentStyle
}

const Content: React.FC<ContentProps> = ({
  title,
  titleSecondary,
  chapter,
  date,
  startTime,
  endTime,
  location,
  secondaryLocale,
  locale,
  style = 'default',
}) => {
  const timeRange = `${formatTime(startTime, secondaryLocale || locale)} – ${formatTime(endTime, secondaryLocale || locale)}`
  const styles = styleConfigs[style]

  return (
    <div className={styles.container}>
      {styles.topLogo.show && (
        <div className={styles.topLogo.container}>
          <img
            src={whiteLogoTop}
            alt="Anonymous for the Voiceless"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className={styles.mainContent.container}>
        <h1 className={styles.mainContent.title} style={{ scale: getScale(15, title) }}>
          {title}
        </h1>

        <h2
          className={`${styles.mainContent.titleSecondary} ${secondaryLocale ? 'visible' : 'invisible'}`}
        >
          {titleSecondary}
        </h2>

        <div className={styles.mainContent.chapter} style={{ scale: getScale(8, chapter) }}>
          {inLines(chapter)}
        </div>

        <div className={styles.mainContent.date}>{formatDate(date, locale)}</div>
        <div
          className={`${styles.mainContent.dateSecondary} ${secondaryLocale ? 'visible' : 'invisible'}`}
        >
          {formatDate(date, secondaryLocale || locale)}
        </div>

        <div className={styles.mainContent.timeRange}>{timeRange}</div>

        <div className={styles.mainContent.location}>{inLines(location)}</div>
      </div>

      {styles.bottomLogo.show && (
        <div
          className={`${styles.bottomLogo.container} ${inLines(chapter).length > 1 ? 'invisible' : 'visible'}`}
        >
          <img
            src={whiteLogo}
            alt="Anonymous for the Voiceless"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  )
}

export default Content

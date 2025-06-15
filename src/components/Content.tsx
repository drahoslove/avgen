import React from 'react'
import { z } from 'zod'
import { inLines, formatTime, formatDate, getScale, capitalize } from '../utils/strings'
import {
  getSocialTypeOrder,
  isValidInstagramHandle,
  SOCIAL_LABELS,
  formatSocialHandle,
} from '../utils/social'
import whiteLogoTop from '../assets/AV-Logo-White-Transparent.svg'
import whiteLogo from '../assets/AV-Symbol-White-Transparent.png'
import { styleSchema } from '../constants/styles'
import { SocialLink } from '../types'
import instagramIcon from '../assets/icons/instagram.svg'
import facebookIcon from '../assets/icons/facebook.svg'
import youtubeIcon from '../assets/icons/youtube.svg'
import globeIcon from '../assets/icons/globe.svg'

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
    subTitle: string
    chapter: string
    date: string
    subDate: string
    timeRange: string
    location: string
  }
  bottomLogo: {
    container: string
    show: boolean
  }
}

// all sizes in this component must use em as unit
// make sure to not nest usage of em inside another element with text-[em]

const styleConfigs: Record<ContentStyle, StyleConfig> = {
  old: {
    container:
      'absolute inset-0 flex flex-col items-center text-white pointer-events-none select-none',
    topLogo: {
      container: 'aspect-[4/3] flex items-center justify-center mt-[1.5em] w-[11em]',
      show: true,
    },
    mainContent: {
      container: 'text-center font-libre-franklin flex-1 flex flex-col items-center',
      title: 'text-[4.25em]/[1.5em] font-bold whitespace-nowrap text-stroke-white',
      subTitle: 'text-[2.5em] text-zinc-300 mb-[0.25em]',
      chapter:
        'text-[6em]/[1.2em] tracking-[0.2em] font-black text-brand-red whitespace-nowrap -mr-[0.2em] mb-[0.3em]',
      date: 'text-[2.5em]',
      subDate: 'text-[2.5em] text-zinc-300',
      timeRange: 'text-[3.75em]',
      location: 'text-[2.25em] px-[2em] whitespace-nowrap',
    },
    bottomLogo: {
      container: 'aspect-square flex items-center justify-center my-[3em] w-[5em]',
      show: true,
    },
  },
  default: {
    container:
      'absolute inset-0 flex flex-col items-center text-white pointer-events-none select-none',
    topLogo: {
      container: 'aspect-[4/3] flex items-center justify-center mt-[1.5em] w-[11em]',
      show: true,
    },
    mainContent: {
      container: 'text-center font-libre-franklin',
      title:
        'text-[4.25em]/[1.5em] word-spacing-wide font-bold whitespace-nowrap text-stroke-white',
      subTitle: 'text-[2.5em] word-spacing-wide text-zinc-300 mb-[0.25em]',
      chapter:
        'text-[6em]/[1.2em] tracking-[0.2em] word-spacing-wide font-black text-brand-red whitespace-nowrap -mr-[0.2em] mb-[0.3em]',
      date: 'text-[2.5em]/[1.75em] word-spacing-wide font-bold bg-brand-red text-white inline px-[0.5em] py-[0.25em]',
      subDate: 'text-[2.5em]/[1.75em] word-spacing-wide text-zinc-300',
      timeRange: 'text-[3.5em]',
      location: 'text-[2.25em] word-spacing-wider px-[2em] whitespace-nowrap',
    },
    bottomLogo: {
      container: 'aspect-square flex items-center justify-center my-[3em] w-[5em]',
      show: false,
    },
  },
}

interface ContentProps {
  title: string
  subTitle: string
  chapter: string
  date: string
  startTime: string
  endTime: string
  location: string
  locale: string
  style?: ContentStyle
  socialLinks: SocialLink[]
  includeYear: boolean
}

const getSocialIcon = (type: string) => {
  const iconClass = 'h-full w-full object-contain'

  switch (type) {
    case 'instagram':
      return <img src={instagramIcon} alt={SOCIAL_LABELS.instagram} className={iconClass} />
    case 'facebook':
      return <img src={facebookIcon} alt={SOCIAL_LABELS.facebook} className={iconClass} />
    case 'youtube':
      return (
        <img src={youtubeIcon} alt={SOCIAL_LABELS.youtube} className={`${iconClass} scale-[1.1]`} />
      )
    case 'web':
    case 'linktree':
      return <img src={globeIcon} alt={SOCIAL_LABELS.web} className={`${iconClass} scale-[1.1]`} />
    default:
      return <img src={globeIcon} alt={SOCIAL_LABELS.web} className={`${iconClass} scale-[1.1]`} />
  }
}

const isValidSocialLink = (link: SocialLink) => {
  if (link.type === 'web') return true
  if (!link.handle) return false
  if (link.type === 'instagram') return isValidInstagramHandle(link.handle)
  return true // other social links just need non-empty handle
}

const Content: React.FC<ContentProps> = ({
  title,
  subTitle,
  chapter,
  date,
  startTime,
  endTime,
  location,
  locale,
  style = 'default',
  socialLinks,
  includeYear,
}) => {
  const timeRange = `${formatTime(startTime, locale)} – ${formatTime(endTime, locale)}`
  const styles = styleConfigs[style]
  const validSocialLinks = socialLinks
    .filter(isValidSocialLink)
    .sort((a, b) => getSocialTypeOrder(a.type) - getSocialTypeOrder(b.type))

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
          {capitalize(title)}
        </h1>

        <h2 className={`${styles.mainContent.subTitle} ${subTitle ? 'visible' : 'invisible'}`}>
          {capitalize(subTitle || '.')}
        </h2>

        <div className={styles.mainContent.chapter} style={{ scale: getScale(8, chapter) }}>
          {inLines(capitalize(chapter))}
        </div>

        <div className={styles.mainContent.date}>
          {capitalize(formatDate(date, locale, includeYear))}
        </div>
        <div className={`${styles.mainContent.subDate} invisible`}>
          {capitalize(formatDate(date, locale, includeYear))}
        </div>

        <div className={styles.mainContent.timeRange}>{timeRange}</div>

        <div className={styles.mainContent.location}>{inLines(capitalize(location))}</div>
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

      <div className="flex-1" />

      {validSocialLinks.length > 0 && (
        <div className="mb-[1.2em] flex items-center justify-center gap-[1.75em]">
          {validSocialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-[0.75em]">
              <div className="w-[1.25em] h-[1.25em]">{getSocialIcon(link.type)}</div>
              <span className="mb-[0em] text-[1.25em]">
                {formatSocialHandle(link.type, link.handle)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Content

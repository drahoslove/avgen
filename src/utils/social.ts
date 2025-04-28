/**
 * Pure TypeScript utilities for social functionality
 */

import { SocialLinkType } from '../types'

export const isValidInstagramHandle = (handle: string): boolean => {
  return /^av(?:__|_|\.)(?=[a-zA-Z])/.test(handle)
}

export const getSocialTypeOrder = (type: string): number => {
  switch (type) {
    case 'instagram':
      return 0
    case 'facebook':
      return 1
    case 'youtube':
      return 2
    case 'web':
      return 3
    default:
      return 4
  }
}

export const SOCIAL_TYPES: SocialLinkType[] = ['web', 'instagram', 'facebook', 'youtube']

export const SOCIAL_LABELS: Record<SocialLinkType, string> = {
  web: 'Web',
  instagram: 'IG',
  facebook: 'FB',
  youtube: 'YT',
}

export const placeholderByType = (type: SocialLinkType): string => {
  switch (type) {
    case 'instagram':
      return 'Enter handle'
    case 'facebook':
      return 'Enter page name'
    case 'youtube':
      return 'Enter channel name'
    default:
      return 'Enter URL'
  }
}
export const WEB_URL = 'jointhecube.com'

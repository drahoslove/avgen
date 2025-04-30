/**
 * Pure TypeScript utilities for social functionality
 */

import { SocialLinkType } from '../types'

export const WEB_URL = 'jointhecube.com'

export const SOCIAL_TYPES: SocialLinkType[] = [
  'web',
  'instagram',
  'facebook',
  'youtube',
  'linktree',
]

export const SOCIAL_LABELS: Record<SocialLinkType, string> = {
  web: 'JoinTheCube.com',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'Youtube',
  linktree: 'Linktree',
}

export const getSocialTypeOrder = (type: string): number => {
  switch (type) {
    case 'instagram':
      return 0
    case 'facebook':
      return 1
    case 'youtube':
      return 2
    case 'linktree':
      return 3
    case 'web':
      return 4
    default:
      return -1
  }
}

const isValidAVHandle = (handle: string): boolean => {
  return /^av(?:__|_|\.)(?=[a-zA-Z])/.test(handle)
}

export const isValidInstagramHandle = isValidAVHandle

export const isValidLinktreeHandle = isValidAVHandle

export const placeholderByType = (type: SocialLinkType): string => {
  switch (type) {
    case 'instagram':
      return 'IG handle'
    case 'facebook':
      return 'FB page name'
    case 'youtube':
      return 'YT channel name'
    case 'linktree':
      return 'linktree handle'
    default:
      return 'Enter URL'
  }
}

export const formatSocialHandle = (type: SocialLinkType, handle: string): string => {
  switch (type) {
    case 'web':
      return handle
    case 'linktree':
      return `linktr.ee/${handle}`
    default:
      return handle
  }
}

import React, { useState } from 'react'
import { LinkIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useShallow } from 'zustand/shallow'
import { Listbox } from '@headlessui/react'
import { useContentStore } from '../hooks/useStore'
import { SocialLink, SocialLinkType } from '../types'
import {
  isValidInstagramHandle,
  isValidLinktreeHandle,
  SOCIAL_TYPES,
  SOCIAL_LABELS,
  WEB_URL,
  placeholderByType,
  getSocialTypeOrder,
} from '../utils/social'
import { wrapSocialIcon } from './icons/IconUtils'
import { Code } from './Code'
import { GlobeIcon } from './icons/GlobeIcon'
import { InstagramIcon } from './icons/InstagramIcon'
import { FacebookIcon } from './icons/FacebookIcon'
import { YoutubeIcon } from './icons/YoutubeIcon'
import { LinktreeIcon } from './icons/LinktreeIcon'

const MAX_LINKS = 3

const SocialIcons = {
  web: wrapSocialIcon(GlobeIcon),
  instagram: wrapSocialIcon(InstagramIcon),
  facebook: wrapSocialIcon(FacebookIcon),
  youtube: wrapSocialIcon(YoutubeIcon),
  linktree: wrapSocialIcon(LinktreeIcon),
}

export function LinksTab() {
  const { socialLinks, setSocialLinks } = useContentStore(
    useShallow(state => ({
      socialLinks: state.socialLinks || [],
      setSocialLinks: state.setSocialLinks,
    }))
  )
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const hasWebLink = socialLinks.some((link: SocialLink) => link.type === 'web')

  const getOrder = (type: SocialLinkType): number => {
    return getSocialTypeOrder(type)
  }

  const countLinkType = (type: SocialLinkType): number => {
    return socialLinks.filter(link => link.type === type).length
  }

  const getAvailableTypes = (currentType: SocialLinkType): SocialLinkType[] => {
    // If this is the current type of this link, always include it
    const availableTypes = SOCIAL_TYPES.filter(type => {
      if (type === currentType) return true

      // Check type-specific restrictions
      switch (type) {
        case 'web':
          return !hasWebLink
        case 'instagram':
          return countLinkType('instagram') < 2
        default:
          return countLinkType(type) === 0
      }
    })

    return availableTypes
  }

  const handleAddLink = () => {
    if (socialLinks.length < MAX_LINKS) {
      // Default to instagram if web is already present
      const newType: SocialLinkType = hasWebLink ? 'instagram' : 'web'
      setSocialLinks([...socialLinks, { type: newType, handle: newType === 'web' ? WEB_URL : '' }])
    }
  }

  const handleRemoveLink = (index: number) => {
    const newLinks = [...socialLinks]
    newLinks.splice(index, 1)
    setSocialLinks(newLinks)
  }

  const handleLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks]
    if (field === 'type') {
      // If changing to web type, set handle to the fixed URL
      // For other types, clear the handle
      newLinks[index] = {
        type: value as SocialLinkType,
        handle: value === 'web' ? WEB_URL : socialLinks[index].handle,
      }
      setSocialLinks(newLinks)

      // Focus the input field after type selection (except for web type)
      if (value !== 'web') {
        // Use setTimeout to ensure the input is rendered before focusing
        setTimeout(() => {
          const input = document.querySelector<HTMLInputElement>(
            `input[name="link-${index}-handle"]`
          )
          if (input) {
            input.focus()
          }
        }, 1)
      }
    } else {
      // If it's web type, don't allow handle changes
      if (newLinks[index].type === 'web') {
        return
      }
      newLinks[index] = { ...newLinks[index], [field]: value }
      setSocialLinks(newLinks)
    }

    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(`${index}-${field}`))
  }

  const isFieldTouched = (index: number, field: keyof SocialLink) => {
    return touchedFields.has(`${index}-${field}`)
  }

  const isFieldInvalid = (index: number, field: keyof SocialLink) => {
    const link = socialLinks[index]
    if (!isFieldTouched(index, field)) return false

    if (field === 'handle') {
      if (!link.handle) return true
      if (link.type === 'instagram' && !isValidInstagramHandle(link.handle)) return true
      if (link.type === 'linktree' && !isValidLinktreeHandle(link.handle)) return true
    }
    return false
  }

  const getFieldErrorMessage = (index: number, field: keyof SocialLink) => {
    const link = socialLinks[index]
    if (field === 'handle') {
      if (!link.handle) return 'This field is required'

      switch (link.type) {
        case 'instagram':
          if (!isValidInstagramHandle(link.handle)) {
            return (
              <>
                Instagram handle must start with <Code>av.</Code>, <Code>av_</Code> or{' '}
                <Code>av__</Code>
              </>
            )
          }
          break
        case 'linktree':
          if (!isValidLinktreeHandle(link.handle)) {
            return (
              <>
                Linktree handle must start with <Code>av.</Code>, <Code>av_</Code> or{' '}
                <Code>av__</Code>
              </>
            )
          }
          break
        case 'facebook':
        case 'youtube':
          // These types just need a non-empty handle, which is already checked above
          break
      }
    }
    return null
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <LinkIcon className="h-[1.25em] w-[1.25em]" />
          Social Links
        </label>

        <div className="space-y-4">
          <div className="flex flex-col">
            {socialLinks.map((link: SocialLink, index: number) => (
              <div key={index} className="flex gap-2 mb-4" style={{ order: getOrder(link.type) }}>
                <div className="w-2/5">
                  <Listbox
                    value={link.type}
                    onChange={(value: SocialLinkType) => handleLinkChange(index, 'type', value)}
                  >
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left text-md text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <span className="flex items-center">
                          {React.createElement(SocialIcons[link.type], {
                            className: 'h-[1.25em] w-[1.25em] text-zinc-600',
                          })}
                          <span className="ml-2 block truncate">{SOCIAL_LABELS[link.type]}</span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-[1.25em] w-[1.25em] text-zinc-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {getAvailableTypes(link.type).map(type => (
                          <Listbox.Option
                            key={type}
                            value={type}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                active ? 'bg-blue-50 text-blue-900' : 'text-zinc-900'
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <span
                                className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}
                              >
                                {React.createElement(SocialIcons[type], {
                                  className: `h-[1.25em] w-[1.25em] ${active ? 'text-blue-600' : 'text-zinc-600'}`,
                                })}
                                <span className="ml-2 block truncate">{SOCIAL_LABELS[type]}</span>
                              </span>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {link.type === 'web' ? (
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={WEB_URL}
                          disabled
                          className="w-full min-w-0 px-3 py-2 bg-zinc-50/50 rounded-lg focus:outline-none text-zinc-900"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveLink(index)}
                        className="p-2 text-zinc-500 hover:text-zinc-700 focus:outline-none"
                      >
                        <TrashIcon className="h-[1.25em] w-[1.25em]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={link.handle}
                          name={`link-${index}-handle`}
                          onChange={e => handleLinkChange(index, 'handle', e.target.value)}
                          onBlur={() =>
                            setTouchedFields(prev => new Set(prev).add(`${index}-handle`))
                          }
                          placeholder={placeholderByType(link.type)}
                          className={`w-full min-w-0 px-3 py-2 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            ${isFieldInvalid(index, 'handle') ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {isFieldInvalid(index, 'handle') && (
                          <p className="mt-1 text-sm text-red-500">
                            {getFieldErrorMessage(index, 'handle')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveLink(index)}
                        className="p-2 text-zinc-500 hover:text-zinc-700 focus:outline-none"
                      >
                        <TrashIcon className="h-[1.25em] w-[1.25em]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleAddLink}
            disabled={socialLinks.length >= MAX_LINKS}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              socialLinks.length >= MAX_LINKS
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <PlusIcon className="h-[1.25em] w-[1.25em]" />
            Add
          </button>
          {socialLinks.length >= MAX_LINKS && (
            <p className="text-sm text-zinc-500">Maximum of {MAX_LINKS} items allowed</p>
          )}
        </div>
      </div>
    </div>
  )
}

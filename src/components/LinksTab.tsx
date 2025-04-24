import React, { useState } from 'react'
import { LinkIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useShallow } from 'zustand/shallow'
import { Listbox } from '@headlessui/react'
import { useContentStore } from '../hooks/useStore'
import { SocialLink, SocialLinkType } from '../types'

const MAX_LINKS = 3
const WEB_URL = 'jointhecube.com'

const SOCIAL_TYPES: SocialLinkType[] = ['web', 'instagram', 'facebook']

const SocialLabels: Record<SocialLinkType, string> = {
  web: 'Web',
  instagram: 'IG',
  facebook: 'FB',
}

const SocialIcons = {
  web: GlobeAltIcon,
  instagram: (props: React.ComponentProps<'svg'>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  facebook: (props: React.ComponentProps<'svg'>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
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

  const getAvailableTypes = (currentType: SocialLinkType): SocialLinkType[] => {
    // If this link is currently web type, include it in options
    if (currentType === 'web') {
      return SOCIAL_TYPES
    }
    // Otherwise, only show web if no other link is web type
    const nonWebTypes: SocialLinkType[] = ['instagram', 'facebook']
    return hasWebLink ? nonWebTypes : [...nonWebTypes, 'web']
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
        handle: value === 'web' ? WEB_URL : '',
      }
    } else {
      // If it's web type, don't allow handle changes
      if (newLinks[index].type === 'web') {
        return
      }
      newLinks[index] = { ...newLinks[index], [field]: value }
    }
    setSocialLinks(newLinks)

    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(`${index}-${field}`))
  }

  const isFieldTouched = (index: number, field: keyof SocialLink) => {
    return touchedFields.has(`${index}-${field}`)
  }

  const isValidInstagramHandle = (handle: string) => {
    return /^av(?:__|_|\.)(?=[a-zA-Z])/.test(handle)
  }

  const isFieldInvalid = (index: number, field: keyof SocialLink) => {
    const link = socialLinks[index]
    if (!isFieldTouched(index, field)) return false

    if (field === 'handle') {
      if (!link.handle) return true
      if (link.type === 'instagram' && !isValidInstagramHandle(link.handle)) return true
    }
    return false
  }

  const getFieldErrorMessage = (index: number, field: keyof SocialLink) => {
    const link = socialLinks[index]
    if (
      field === 'handle' &&
      link.type === 'instagram' &&
      link.handle &&
      !isValidInstagramHandle(link.handle)
    ) {
      return 'Instagram handle must start with "av_", "av__", or "av."'
    }
    return 'This field is required'
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Social Links
        </label>

        <div className="space-y-4">
          {socialLinks.map((link: SocialLink, index: number) => (
            <div key={index} className="flex gap-2">
              <div className="w-1/3">
                <Listbox
                  value={link.type}
                  onChange={(value: SocialLinkType) => handleLinkChange(index, 'type', value)}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left text-md text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <span className="flex items-center">
                        {React.createElement(SocialIcons[link.type as keyof typeof SocialIcons], {
                          className: 'h-5 w-5 text-zinc-600',
                        })}
                        <span className="ml-2 block truncate">{SocialLabels[link.type]}</span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
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
                                className: `h-5 w-5 ${active ? 'text-blue-600' : 'text-zinc-600'}`,
                              })}
                              <span className="ml-2 block truncate">{SocialLabels[type]}</span>
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
                    <div className="flex-1 min-w-0 px-3 py-2 bg-zinc-50 rounded-lg text-zinc-600">
                      {WEB_URL}
                    </div>
                    <button
                      onClick={() => handleRemoveLink(index)}
                      className="p-2 text-zinc-500 hover:text-zinc-700 focus:outline-none"
                    >
                      <TrashIcon className="h-5 w-5" />
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
                        onChange={e => handleLinkChange(index, 'handle', e.target.value)}
                        onBlur={() =>
                          setTouchedFields(prev => new Set(prev).add(`${index}-handle`))
                        }
                        placeholder={`Enter ${link.type} handle`}
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
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleAddLink}
          disabled={socialLinks.length >= MAX_LINKS}
          className={`mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            socialLinks.length >= MAX_LINKS
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              : 'bg-white text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          <PlusIcon className="h-5 w-5" />
          Add Link
        </button>
        {socialLinks.length >= MAX_LINKS && (
          <p className="mt-2 text-sm text-zinc-500">Maximum of {MAX_LINKS} social links allowed</p>
        )}
      </div>
    </div>
  )
}

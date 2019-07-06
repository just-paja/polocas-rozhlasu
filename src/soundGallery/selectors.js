import { createSelector } from 'reselect'
import { getFlag } from 'react-saga-rest'

import { categoryStore } from '../soundCategories'
import { clearSearch, splitSearchPatterns, stringSearch } from '../search'
import { soundStore } from '../sounds'
import { tagStore } from '../soundTags'

const memoizeSearch = state => state.soundGallery.search
const memoizeTarget = state => state.soundGallery.target

export const getSoundSearchValue = createSelector(
  memoizeSearch,
  state => state.search
)

export const isGalleryEmpty = createSelector(
  soundStore.getSize,
  gallerySize => gallerySize <= 0
)

export const getSoundSearchValueCleared = createSelector(
  getSoundSearchValue,
  value => clearSearch(value)
)

const hasRelevantTitle = (item, search) => Boolean(item.title) &&
  Object.keys(item.title).some(key => stringSearch(item.title[key], search).relevant)

const isRelevant = (item, search, inclusive = false) => (
  stringSearch(item.name, search, inclusive).relevant ||
  hasRelevantTitle(item, search)
)

const hasRelevantTags = (sound, relevantTags) => relevantTags &&
  sound.tags &&
  relevantTags.every(
    tagGroup => tagGroup.some(
      tag => sound.tags.indexOf(tag) !== -1
    )
  )

const getRelevantTags = (tags, search) => {
  const searchSplit = splitSearchPatterns(search)
  return searchSplit.map(pattern => tags
    .filter(tag => isRelevant(tag, pattern))
    .map(tag => tag.name))
}

export const getGallerySoundsWithFlags = createSelector(
  [soundStore.getAll, categoryStore.getAll],
  (sounds, categories) => sounds.map(sound => ({
    ...sound,
    isUsed: categories.some(category => category.sounds.indexOf(sound.uuid) !== -1)
  }))
)

export const getErrorsFilter = getFlag(memoizeSearch, 'filterErrors')
export const getUsedFilter = getFlag(memoizeSearch, 'filterUsed')

export const getGallerySoundList = createSelector(
  [
    getGallerySoundsWithFlags,
    tagStore.getAll,
    getSoundSearchValueCleared,
    getErrorsFilter,
    getUsedFilter
  ],
  (sounds, tags, search, filterErrors, filterUsed) => {
    let soundsFiltered = sounds
    if (filterUsed) {
      soundsFiltered = soundsFiltered.filter(sound => !sound.isUsed)
    }
    if (filterErrors) {
      soundsFiltered = soundsFiltered.filter(sound => !sound.error)
    }
    if (search) {
      const relevantTags = getRelevantTags(tags, search)
      soundsFiltered = soundsFiltered
        .filter(sound => isRelevant(sound, search) || hasRelevantTags(sound, relevantTags))
    }
    return soundsFiltered.slice(0, 20)
  }
)

export const getGalleryTarget = createSelector(
  memoizeTarget,
  state => state
)
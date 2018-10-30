import { createSelector } from 'reselect';

import { memoizeSoundList } from '../../sounds/selectors';

export const getCategories = state => state.soundCategories.list;

export const getCategoriesWithStatus = createSelector(
  [getCategories, memoizeSoundList],
  (categories, sounds) => categories.map(category => ({
    ...category,
    playing: category.sounds.some(soundUuid => sounds.find(sound => (
      sound.uuid === soundUuid
      && sound.playing
    )))
  }))
);

const memoizeCategory = (state, uuid) => getCategories(state).find(
  category => category.uuid === uuid
);

export const getCategoryListUuids = createSelector(
  getCategories,
  list => list.map(category => category.uuid)
);

export const getCategory = createSelector(
  memoizeCategory,
  category => category
);

export const getCategoryByName = createSelector(
  (state, name) => getCategories(state).find(
    category => category.name === name
  ),
  category => category
);

export const getCategoryName = createSelector(
  memoizeCategory,
  category => category.name
);

export const getCategoryBoardUuid = createSelector(
  memoizeCategory,
  category => category.board
);

export const getCategorySoundUuids = createSelector(
  memoizeCategory,
  category => category.sounds
);

export const getCategorySounds = createSelector(
  [memoizeCategory, memoizeSoundList],
  (category, soundList) => soundList.filter(
    sound => category.sounds.indexOf(sound.uuid) !== -1
  )
);

export const getCategoryEditStatus = createSelector(
  memoizeCategory,
  category => category.edit
);

export const getCategoryLoopStatus = createSelector(
  memoizeCategory,
  category => category.loop
);

export const getCategoryMutedStatus = createSelector(
  memoizeCategory,
  category => category.muted
);

export const getCategoryExclusiveStatus = createSelector(
  memoizeCategory,
  category => category.exclusive
);

export const getCategorySoundPlayingUuids = createSelector(
  [memoizeCategory, memoizeSoundList],
  (category, allSounds) => category.sounds
    .filter((uuid) => {
      const sound = allSounds.find(filterSound => filterSound.uuid === uuid);
      return sound && sound.playing;
    })
);

export const getCategoryPlayingStatus = createSelector(
  [memoizeCategory, memoizeSoundList],
  (category, allSounds) => allSounds
    .filter(sound => category.sounds.indexOf(sound.uuid) !== -1)
    .some(sound => sound.playing)
);

export const getCategoryVolume = createSelector(
  memoizeCategory,
  category => category.volume
);

export const areSoundCategoriesEmpty = createSelector(
  getCategoryListUuids,
  state => state.length === 0
);

export const getSoundCategories = createSelector(
  (state, soundUuid) => getCategories(state)
    .filter(category => category.sounds.indexOf(soundUuid) !== -1),
  state => state
);

export const getAllUnusedSoundsByTag = createSelector(
  [
    (state, tag) => memoizeSoundList(state)
      .filter(sound => sound.tags && sound.tags.indexOf(tag) !== -1),
    getCategories,
  ],
  (sounds, categories) => sounds.filter(
    sound => !categories.find(category => category.sounds.indexOf(sound.uuid) !== -1)
  )
);

export const isSoundUsed = createSelector(
  [getCategories, (state, soundUuid) => soundUuid],
  (categories, soundUuid) => categories.some(category => category.sounds.indexOf(soundUuid) !== -1)
);

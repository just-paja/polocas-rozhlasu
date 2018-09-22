import { createSelector } from 'reselect';

import { stringSearch } from '../../search';
import { getSoundSearchValueCleared } from '../../selectors/soundSearch';
import { memoizeSoundList } from '../../sounds/selectors';

const getFeature = state => state.soundCategories.list;

const memoizeCategory = (state, uuid) => getFeature(state).find(
  category => category.uuid === uuid
);

export const getDefaultCategory = createSelector(
  getFeature,
  categoryList => categoryList.find(category => category.name === null)
);

export const getCategoryListUuids = createSelector(
  getFeature,
  list => list.map(category => category.uuid)
);

export const getCategory = createSelector(
  memoizeCategory,
  category => category
);

export const getCategoryByName = createSelector(
  (state, name) => state.categoryList.find(
    category => category.name === name
  ),
  category => category
);

export const getCategoryName = createSelector(
  memoizeCategory,
  category => category.name
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

export const getCategoryFilteredSoundUuids = createSelector(
  [getCategorySounds, getSoundSearchValueCleared],
  (sounds, search) => {
    if (search) {
      return sounds
        .filter(sound => stringSearch(sound.name, search).relevant)
        .map(sound => sound.uuid);
    }
    return sounds.map(sound => sound.uuid);
  }
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
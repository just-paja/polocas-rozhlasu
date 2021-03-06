import soundGallery from '../soundGallery/reducers'
import soundWorkspaces from '../soundWorkspaces/reducers'

import { boardStore } from '../soundBoards'
import { categoryStore } from '../soundCategories'
import { combineReducers } from 'redux'
import { createEntitiesReducer, operations } from 'redux-entity-routines'
import { dialogStore } from '../dialogs'
import { libraryStore } from '../soundLibraries'
import { moduleStore } from '../soundModules'
import { reducer as form } from 'redux-form'
import { soundStore } from '../sounds'
import { storyRoutines, storyStore } from '../soundStories'
import { tagStore } from '../soundTags'

const appReducer = combineReducers({
  entities: createEntitiesReducer(
    boardStore,
    categoryStore,
    dialogStore,
    libraryStore,
    moduleStore,
    soundStore,
    storyStore,
    tagStore
  ),
  form,
  operations,
  soundGallery,
  soundWorkspaces
})

function normalizeStoryState (state, story) {
  const { name, uuid, entities, ...nextState } = story
  if (!entities) {
    return {
      ...state,
      ...nextState,
      entities: {
        ...state.entities,
        boards: [],
        categories: [],
        dialogs: [],
        libraries: [],
        modules: [],
        sounds: [],
        tags: []
      }
    }
  }
  const { stories, ...otherEntities } = entities
  return {
    ...state,
    ...nextState,
    entities: {
      ...state.entities,
      ...otherEntities
    }
  }
}

export default (state, action) => {
  if (action.type === storyRoutines.load.SUCCESS) {
    return appReducer(normalizeStoryState(state, action.payload), action)
  }
  return appReducer(state, action)
}

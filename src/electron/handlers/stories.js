function mapStories (storyNames) {
  return storyNames.map(storyName => ({
    name: storyName
  }))
}

export function listStories (storyManager) {
  return (messenger, routine, action) =>
    storyManager.listStories()
      .then(stories => messenger.sendMessage(routine.success(null, mapStories(stories))))
      .catch(error => messenger.sendMessage(routine.failure(null, error.message)))
}

export function saveStory (storyManager) {
  return (messenger, routine, action) =>
    storyManager.saveStory(action.payload)
      .then(story => messenger.sendMessage(routine.success(null, story)))
      .catch(error => messenger.sendMessage(routine.failure(null, error.message)))
}
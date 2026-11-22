const HISTORY_KEY = 'plantguard-history'
const MAX_HISTORY_ENTRIES = 20

export function getHistory() {
  try {
    const storedHistory = window.localStorage.getItem(HISTORY_KEY)
    if (!storedHistory) return []

    const history = JSON.parse(storedHistory)
    if (!Array.isArray(history)) {
      throw new Error('Stored prediction history is not a list.')
    }
    return history
  } catch (error) {
    throw new Error('Could not read prediction history.', { cause: error })
  }
}

export function addToHistory(entry) {
  try {
    const history = getHistory()
    const newEntry = {
      ...entry,
      id: Date.now(),
      date: new Date().toISOString(),
    }
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([newEntry, ...history].slice(0, MAX_HISTORY_ENTRIES)),
    )
    return newEntry
  } catch (error) {
    throw new Error('Could not save this prediction to history.', {
      cause: error,
    })
  }
}

export function removeFromHistory(id) {
  try {
    const history = getHistory()
    const updatedHistory = history.filter((entry) => entry.id !== id)
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
    return updatedHistory
  } catch (error) {
    throw new Error('Could not remove this prediction from history.', {
      cause: error,
    })
  }
}

export function clearHistory() {
  try {
    window.localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    throw new Error('Could not clear prediction history.', { cause: error })
  }
}

export function makeThumbnail(url, width = 160) {
  return new Promise((resolve, reject) => {
    try {
      const image = new Image()
      image.onload = () => {
        try {
          const thumbnailWidth = Math.max(1, Math.round(width))
          const thumbnailHeight = Math.max(
            1,
            Math.round((image.naturalHeight / image.naturalWidth) * thumbnailWidth),
          )
          const canvas = document.createElement('canvas')
          canvas.width = thumbnailWidth
          canvas.height = thumbnailHeight
          const context = canvas.getContext('2d')
          if (!context) {
            reject(new Error('Could not access the thumbnail canvas.'))
            return
          }

          context.drawImage(image, 0, 0, thumbnailWidth, thumbnailHeight)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        } catch (error) {
          reject(new Error('Could not create an image thumbnail.', { cause: error }))
        }
      }
      image.onerror = () => reject(new Error('Could not load the image thumbnail.'))
      image.src = url
    } catch (error) {
      reject(new Error('Could not prepare the image thumbnail.', { cause: error }))
    }
  })
}

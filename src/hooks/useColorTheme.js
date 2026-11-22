import { useEffect, useState } from 'react'

export const COLOR_THEMES = [
  { id: 'forest', label: 'Forest', color: '#15803d' },
  { id: 'meadow', label: 'Meadow', color: '#72a63a' },
]

function getInitialColorTheme() {
  try {
    const savedTheme = window.localStorage.getItem('plantguard-color')
    return COLOR_THEMES.some(({ id }) => id === savedTheme)
      ? savedTheme
      : 'forest'
  } catch {
    return 'forest'
  }
}

export default function useColorTheme() {
  const [colorTheme, setColorTheme] = useState(getInitialColorTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = colorTheme
    try {
      window.localStorage.setItem('plantguard-color', colorTheme)
    } catch {
      // The selected theme remains active when storage is unavailable.
    }
  }, [colorTheme])

  return { colorTheme, setColorTheme }
}

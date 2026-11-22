import { useEffect, useState } from 'react'

function getInitialTheme() {
  let savedTheme
  try {
    savedTheme = window.localStorage.getItem('plantguard-theme')
  } catch {
    savedTheme = null
  }
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      window.localStorage.setItem('plantguard-theme', theme)
    } catch {
      // The visual theme remains active when storage is unavailable.
    }
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}

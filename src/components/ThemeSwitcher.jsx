import useColorTheme, { COLOR_THEMES } from '../hooks/useColorTheme'

export default function ThemeSwitcher() {
  const { colorTheme, setColorTheme } = useColorTheme()

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-sm"
      role="radiogroup"
      aria-label="Color theme"
    >
      {COLOR_THEMES.map(({ id, label, color }) => {
        const isSelected = colorTheme === id
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${label} color theme`}
            title={label}
            onClick={() => setColorTheme(id)}
            className={`flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ${
              isSelected ? 'bg-white shadow-md' : ''
            }`}
          >
            <span
              className="h-6 w-6 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: color }}
            />
          </button>
        )
      })}
    </div>
  )
}

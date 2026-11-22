import { useEffect, useRef, useState } from 'react'
import { LeafyGreen } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import ThemeSwitcher from './ThemeSwitcher'

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Disease Info', to: '/disease-info' },
  { label: 'History', to: '/history' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false)
  const previousScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const scrollDifference = currentScrollY - previousScrollY.current

      if (currentScrollY <= 80) {
        setIsHidden(false)
      } else if (scrollDifference > 4) {
        setIsHidden(true)
      } else if (scrollDifference < -4) {
        setIsHidden(false)
      }

      if (Math.abs(scrollDifference) > 4) {
        previousScrollY.current = currentScrollY
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 px-3 pt-3 transition-transform duration-300 ease-in-out sm:px-6 sm:pt-4 ${
        isHidden ? '-translate-y-[110%]' : 'translate-y-0'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 rounded-2xl border border-green-100 bg-white px-3 py-3 text-green-950 shadow-lg shadow-green-950/10 dark:border-green-900 dark:bg-green-950 dark:text-green-50 sm:gap-x-6 sm:px-5">
        <NavLink
          to="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600"
          aria-label="PlantGuard home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-800 text-green-50 shadow-sm transition group-hover:bg-green-700 dark:bg-green-700 dark:group-hover:bg-green-600">
            <LeafyGreen size={23} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            Plant<span className="text-green-700 dark:text-green-300">Guard</span>
          </span>
        </NavLink>

        <nav
          className="order-3 -mx-1 flex w-full min-w-0 gap-1 overflow-x-auto px-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:justify-center lg:pt-0"
          aria-label="Main navigation"
        >
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition-colors lg:px-3 lg:text-sm ${
                  isActive
                    ? 'bg-green-800 font-semibold text-white shadow-sm dark:bg-green-700'
                    : 'text-green-800 hover:bg-green-50 hover:text-green-900 dark:text-gray-300 dark:hover:bg-green-950 dark:hover:text-green-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

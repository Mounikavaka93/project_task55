import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ tone = 'default', className = '' }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  const toneClass = tone === 'inverse'
    ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
    : 'border-line bg-panel text-ink hover:bg-panel-2'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`inline-grid size-10 cursor-pointer place-items-center rounded-xl border transition duration-200 ${toneClass} ${className}`}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

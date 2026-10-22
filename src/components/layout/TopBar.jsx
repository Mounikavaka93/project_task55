import { Menu, Search, X } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

export default function TopBar({ query, setQuery, onMenu, menuOpen }) {
  return (
    <header className="flex items-center gap-2 border-b border-line bg-canvas/90 px-3 py-2.5 backdrop-blur sm:gap-3 sm:px-4">
      <button
        type="button"
        className="inline-grid size-10 cursor-pointer place-items-center rounded-xl border border-line bg-panel md:hidden"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
        onClick={onMenu}
      >
        <Menu size={18} />
      </button>
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search mail</span>
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search mail"
          className="h-10 w-full rounded-[0.85rem] border border-line bg-panel pr-10 pl-9 text-sm text-ink transition duration-200 outline-none placeholder:text-faint focus:border-accent focus:shadow-[0_0_0_4px_var(--sf-accent-soft)]"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted hover:text-ink"
            onClick={() => setQuery('')}
          >
            <X size={15} />
          </button>
        ) : null}
      </label>
      <ThemeToggle className="md:hidden" />
    </header>
  )
}

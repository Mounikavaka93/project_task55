import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell() {
  const [query, setQuery] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()
  const [trackedPath, setTrackedPath] = useState(pathname)
  if (pathname !== trackedPath) {
    setTrackedPath(pathname)
    setNavOpen(false)
  }
  const reading = /^\/[^/]+\/.+/.test(pathname)
  const hideFab = pathname.startsWith('/compose') || reading || navOpen

  return (
    <div className="h-dvh overflow-hidden bg-canvas text-ink">
      <a href="#mail-main" className="skip-link absolute top-3 left-3 z-[90] -translate-y-24 rounded-lg bg-panel px-3 py-2 shadow focus:translate-y-0">
        Skip to mail
      </a>
      <div className="flex h-full">
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar query={query} setQuery={setQuery} menuOpen={navOpen} onMenu={() => setNavOpen(true)} />
          <div id="mail-main" className="min-h-0 flex-1">
            <Outlet context={{ query, setQuery }} />
          </div>
        </div>
      </div>
      {hideFab ? null : (
        <Link
          to="/compose"
          className="fixed right-4 bottom-5 z-20 grid size-14 place-items-center rounded-full bg-accent text-accent-ink shadow-lg md:hidden"
          aria-label="Compose mail"
        >
          <PenLine size={22} />
        </Link>
      )}
    </div>
  )
}

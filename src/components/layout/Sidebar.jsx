import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, PenLine } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useMail } from '../../context/MailContext'
import { useTheme } from '../../context/ThemeContext'
import { FOLDERS } from '../../data/folders'
import { folderCount } from '../../utils/mail'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Logo from '../brand/Logo'
import Avatar from '../ui/Avatar'

export default function Sidebar({ open, onClose }) {
  const { user, signOut } = useAuth()
  const { emails } = useMail()
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const closeRef = useRef(null)
  const composing = pathname.startsWith('/compose')

  useEffect(() => {
    if (!open) return undefined
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {open ? (
        <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 cursor-pointer bg-[#1c1916]/45 md:hidden" onClick={onClose} />
      ) : null}
      <aside
        id="app-sidebar"
        inert={!isDesktop && !open ? true : undefined}
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(86vw,280px)] flex-col border-r border-line bg-sidebar transition-transform duration-300 ease-out motion-reduce:transition-none md:static md:z-auto md:w-[220px] md:translate-x-0 lg:w-[240px] xl:w-[260px] ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <Link to="/inbox" className="min-w-0" onClick={onClose}>
            <Logo className="[&_span]:text-[1.3rem]" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            className="cursor-pointer rounded-lg px-2 py-1 text-sm text-muted md:hidden"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="px-3">
          <Link
            to="/compose"
            onClick={onClose}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition duration-200 ${composing ? 'bg-accent-strong text-accent-ink' : 'bg-accent text-accent-ink hover:bg-accent-strong'}`}
          >
            <PenLine size={18} />
            Compose
          </Link>
        </div>

        <nav className="scroll-area mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4" aria-label="Mail folders">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Mailboxes</p>
          <ul className="space-y-1">
            {FOLDERS.map((folder) => {
              const Icon = folder.icon
              const active = pathname === `/${folder.id}` || pathname.startsWith(`/${folder.id}/`)
              const count = folderCount(emails, folder.id)
              const emphasized = folder.id === 'inbox' || folder.id === 'spam'
              return (
                <li key={folder.id}>
                  <Link
                    to={`/${folder.id}`}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition duration-200 ${active ? 'bg-accent-soft font-semibold text-ink' : 'text-muted hover:bg-panel-2 hover:text-ink'}`}
                  >
                    <Icon size={18} className={`shrink-0 ${active ? 'text-accent' : ''}`} />
                    <span className="flex-1">{folder.label}</span>
                    {count > 0 ? (
                      <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold ${emphasized ? 'bg-accent text-accent-ink' : 'bg-panel-2 text-muted'}`}>
                        {count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-line px-3 py-3">
          <div className="mb-3 flex items-center justify-between rounded-xl bg-panel px-3 py-2">
            <span className="text-sm">Dark mode</span>
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Dark mode"
              onClick={toggle}
              className={`relative h-6 w-11 cursor-pointer rounded-full transition duration-200 ${theme === 'dark' ? 'bg-accent' : 'bg-line'}`}
            >
              <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition duration-200 ${theme === 'dark' ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          <div className="flex items-start gap-3 px-3">
            <Avatar name={user?.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-muted" title={user?.email}>{user?.email}</p>
              <p className="truncate text-[11px] text-faint">{user?.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line text-sm font-medium transition duration-200 hover:bg-panel"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

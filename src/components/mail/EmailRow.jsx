import { useEffect, useState } from 'react'
import { MoreHorizontal, Paperclip, Star } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { formatWhen } from '../../utils/format'

function rowActions(email) {
  if (email.folder === 'trash') {
    return [
      { id: 'restore', label: 'Restore' },
      { id: 'delete', label: 'Delete forever' },
    ]
  }
  if (email.folder === 'spam') {
    return [
      { id: 'not-spam', label: 'Not spam' },
      { id: 'delete', label: 'Delete' },
    ]
  }
  if (email.folder === 'drafts') {
    return [{ id: 'delete', label: 'Delete' }]
  }
  const items = [{ id: 'read', label: email.read ? 'Mark as unread' : 'Mark as read' }]
  items.push(email.folder === 'archive' ? { id: 'inbox', label: 'Move to inbox' } : { id: 'archive', label: 'Archive' })
  if (email.folder !== 'spam') items.push({ id: 'spam', label: 'Mark as spam' })
  items.push({ id: 'delete', label: 'Delete' })
  return items
}

export default function EmailRow({ email, active, onOpen, onStar, onAction }) {
  const [menu, setMenu] = useState(null)

  useEffect(() => {
    if (!menu) return undefined
    const close = () => setMenu(null)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [menu])

  function openMenu(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const flip = rect.bottom + 220 > window.innerHeight
    setMenu({
      top: flip ? rect.top - 6 : rect.bottom + 6,
      left: Math.min(Math.max(8, rect.right - 188), window.innerWidth - 196),
      flip,
    })
  }

  return (
    <li className={`border-b border-line transition-colors duration-200 ${active ? 'bg-accent-soft' : 'hover:bg-panel-2'}`}>
      <div className="flex items-start gap-2.5 px-4 py-3">
        <span className={`mt-[13px] size-2 shrink-0 rounded-full ${email.read ? 'bg-transparent' : 'bg-accent'}`} />
        <Avatar name={email.from.name} size={36} />
        <button type="button" onClick={() => onOpen(email)} className="min-w-0 flex-1 cursor-pointer py-0.5 text-left">
          <span className="flex items-center justify-between gap-3">
            <span className={`truncate text-sm leading-5 ${email.read ? 'font-medium' : 'font-semibold'}`}>{email.from.name}</span>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs leading-5 text-faint">
              {email.attachments?.length ? <Paperclip size={13} /> : null}
              {formatWhen(email.date)}
            </span>
          </span>
          <span className={`mt-0.5 block truncate text-sm leading-5 ${email.read ? 'text-muted' : 'font-semibold'}`}>{email.subject || '(no subject)'}</span>
          <span className="mt-0.5 block truncate text-xs leading-5 text-muted">{email.preview}</span>
        </button>
        <div className="mt-0.5 flex shrink-0 items-center">
        <button
          type="button"
          aria-label={email.starred ? 'Unstar' : 'Star'}
          title={email.starred ? 'Unstar' : 'Star'}
          onClick={() => onStar(email)}
          className={`inline-grid size-8 cursor-pointer place-items-center rounded-lg transition duration-200 hover:bg-panel ${email.starred ? 'text-star' : 'text-faint hover:text-star'}`}
        >
          <Star size={16} className={email.starred ? 'fill-current' : ''} />
        </button>
        <button
          type="button"
          aria-label="Message actions"
          aria-expanded={Boolean(menu)}
          title="Message actions"
          onClick={openMenu}
          className="inline-grid size-8 cursor-pointer place-items-center rounded-lg text-faint transition duration-200 hover:bg-panel hover:text-ink"
        >
          <MoreHorizontal size={16} />
        </button>
        </div>
      </div>
      {menu ? (
        <>
          <button type="button" aria-label="Close actions" className="fixed inset-0 z-40 cursor-default" onClick={() => setMenu(null)} />
          <div
            role="menu"
            className="fixed z-50 w-44 rounded-xl border border-line bg-panel p-1 shadow-xl"
            style={{ top: menu.top, left: menu.left, transform: menu.flip ? 'translateY(-100%)' : undefined }}
          >
            {rowActions(email).map((action) => (
              <button
                key={action.id}
                type="button"
                role="menuitem"
                className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm hover:bg-panel-2"
                onClick={() => {
                  setMenu(null)
                  onAction(action.id, email)
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </li>
  )
}

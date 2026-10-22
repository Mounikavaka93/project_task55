import { ChevronLeft, Forward, MailOpen, Paperclip, Reply, RotateCcw, ShieldAlert, Star, Trash2, Archive } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useMail } from '../../context/MailContext'
import { formatFull, formatSize, peopleLabel } from '../../utils/format'
import { sanitizeHtml } from '../../utils/sanitize'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import IconButton from '../ui/IconButton'

export default function EmailReader({ email, onBack, onReply, onReplyAll, onForward, onAction }) {
  const { user } = useAuth()
  const { notify } = useMail()
  const mine = email.from.email.toLowerCase() === user.email.toLowerCase()
  const firstName = email.from.name.split(' ')[0]

  return (
    <article className="flex h-full min-h-0 flex-col">
      <div className="scroll-area min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center gap-1 border-b border-line bg-canvas/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <IconButton label="Back to list" className="order-1 shrink-0 lg:hidden" onClick={onBack}>
          <ChevronLeft size={18} />
        </IconButton>
        <div className="order-3 grid w-full grid-cols-3 gap-1 lg:order-2 lg:flex lg:w-auto">
          <Button variant="secondary" className="h-9 w-full px-2 lg:w-auto lg:px-2.5" onClick={onReply}>
            <Reply size={15} /> Reply
          </Button>
          <Button variant="secondary" className="h-9 w-full px-2 lg:w-auto lg:px-2.5" onClick={onReplyAll}>
            <Reply size={15} /> Reply all
          </Button>
          <Button variant="secondary" className="h-9 w-full px-2 lg:w-auto lg:px-2.5" onClick={onForward}>
            <Forward size={15} /> Forward
          </Button>
        </div>
        <div className="order-2 ml-auto flex items-center lg:order-3">
          <IconButton label={email.starred ? 'Unstar' : 'Star'} onClick={() => onAction('star', email)}>
            <Star size={16} className={email.starred ? 'fill-current text-star' : ''} />
          </IconButton>
          {email.folder === 'trash' ? (
            <IconButton label="Restore" onClick={() => onAction('restore', email)}>
              <RotateCcw size={16} />
            </IconButton>
          ) : null}
          {email.folder === 'archive' ? (
            <IconButton label="Move to inbox" onClick={() => onAction('inbox', email)}>
              <Archive size={16} />
            </IconButton>
          ) : email.folder !== 'trash' && email.folder !== 'spam' && email.folder !== 'drafts' ? (
            <IconButton label="Archive" onClick={() => onAction('archive', email)}>
              <Archive size={16} />
            </IconButton>
          ) : null}
          {email.folder === 'spam' ? (
            <IconButton label="Not spam" onClick={() => onAction('not-spam', email)}>
              <ShieldAlert size={16} />
            </IconButton>
          ) : email.folder !== 'trash' && email.folder !== 'drafts' ? (
            <IconButton label="Mark as spam" onClick={() => onAction('spam', email)}>
              <ShieldAlert size={16} />
            </IconButton>
          ) : null}
          <IconButton label={email.read ? 'Mark as unread' : 'Mark as read'} onClick={() => onAction('read', email)}>
            <MailOpen size={16} />
          </IconButton>
          <IconButton label={email.folder === 'trash' ? 'Delete forever' : 'Delete'} onClick={() => onAction('delete', email)}>
            <Trash2 size={16} />
          </IconButton>
        </div>
          </div>

          <div className="py-5 sm:py-6">
          {email.folder === 'spam' ? (
            <div className="mb-4 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-ink">
              Sablefinch filed this as spam.
              <button type="button" className="ml-2 cursor-pointer font-semibold text-accent" onClick={() => onAction('not-spam', email)}>
                Not spam
              </button>
            </div>
          ) : null}
          {email.folder === 'trash' ? (
            <div className="mb-4 rounded-xl border border-line bg-panel-2 px-4 py-3 text-sm">
              This message is in Trash.
              <button type="button" className="ml-2 cursor-pointer font-semibold text-accent" onClick={() => onAction('restore', email)}>
                Restore
              </button>
            </div>
          ) : null}

          <h1 className="font-display text-[1.7rem] leading-tight text-balance sm:text-4xl">{email.subject || '(no subject)'}</h1>
          <div className="mt-5 flex items-start gap-3">
            <Avatar name={email.from.name} size={42} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-5">{email.from.name}</p>
              <p className="truncate text-sm text-muted">{email.from.email}</p>
              <p className="mt-1 text-xs text-faint">{formatFull(email.date)}</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2">
                  <dt className="text-faint">To</dt>
                  <dd className="min-w-0 break-words">{peopleLabel(email.to)}</dd>
                </div>
                {email.cc?.length ? (
                  <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2">
                    <dt className="text-faint">Cc</dt>
                    <dd className="min-w-0 break-words">{peopleLabel(email.cc)}</dd>
                  </div>
                ) : null}
                {mine && email.bcc?.length ? (
                  <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2">
                    <dt className="text-faint">Bcc</dt>
                    <dd className="min-w-0 break-words">{peopleLabel(email.bcc)}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>

          <div className="prose-mail mt-6 text-[15.5px]" dangerouslySetInnerHTML={{ __html: sanitizeHtml(email.body) }} />

          {email.attachments?.length ? (
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {email.attachments.map((file) => (
                <li key={file.id}>
                  <button
                    type="button"
                    onClick={() => notify(`${file.name} stays listed here. This demo does not open file contents.`)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-line bg-panel px-3 py-2.5 text-left transition duration-200 hover:border-accent"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                      <Paperclip size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted">{formatSize(file.size)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={onReply}
            className="mt-8 flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-line bg-panel px-4 py-3 text-left text-sm text-muted transition duration-200 hover:border-accent"
          >
            <Reply size={16} />
            Reply to {firstName}…
          </button>
          </div>
        </div>
      </div>
    </article>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { useMail } from '../context/MailContext'
import { FOLDERS } from '../data/folders'
import { useTitle } from '../hooks/useTitle'
import { folderCount, visibleEmails } from '../utils/mail'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import EmailReader from '../components/mail/EmailReader'
import EmailRow from '../components/mail/EmailRow'
import { SkeletonReader, SkeletonRows } from '../components/mail/SkeletonRows'

export default function Mailbox() {
  const { folder, emailId } = useParams()
  const navigate = useNavigate()
  const { query, setQuery } = useOutletContext()
  const { emails, ready, toggleStar, markRead, markAllRead, move, removeForever, emptyTrash, notify } = useMail()
  const folderMeta = FOLDERS.find((item) => item.id === folder)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [emptyOpen, setEmptyOpen] = useState(false)
  const openedRef = useRef(null)
  const unread = folderCount(emails, 'inbox')
  useTitle(!folderMeta ? 'Mail' : folderMeta.id === 'inbox' && unread ? `Inbox (${unread})` : folderMeta.label)

  const list = useMemo(() => (folderMeta ? visibleEmails(emails, folderMeta.id, query) : []), [emails, folderMeta, query])
  const active = emails.find((email) => email.id === emailId)

  useEffect(() => {
    if (!ready || !emailId) {
      openedRef.current = null
      return
    }
    if (openedRef.current === emailId) return
    const email = emails.find((item) => item.id === emailId)
    if (!email || email.folder === 'drafts') return
    openedRef.current = emailId
    if (!email.read) markRead(emailId, true)
  }, [ready, emailId, emails, markRead])

  useEffect(() => {
    if (!emailId) return
    const email = emails.find((item) => item.id === emailId)
    if (email?.folder === 'drafts') navigate(`/compose?draft=${email.id}`, { replace: true })
  }, [emailId, emails, navigate])

  if (!folderMeta) return <Navigate to="/inbox" replace />

  function leaveIfOpen(id) {
    if (id === emailId) navigate(`/${folderMeta.id}`)
  }

  function handleAction(action, email) {
    if (action === 'star') {
      toggleStar(email.id)
      return
    }
    if (action === 'read') {
      markRead(email.id, !email.read)
      notify(email.read ? 'Marked as unread' : 'Marked as read')
      return
    }
    if (action === 'archive') {
      move(email.id, 'archive')
      notify('Archived')
      leaveIfOpen(email.id)
      return
    }
    if (action === 'inbox' || action === 'restore' || action === 'not-spam') {
      move(email.id, 'inbox')
      notify(action === 'restore' ? 'Restored to inbox' : 'Moved to inbox')
      if (folderMeta.id !== 'inbox') leaveIfOpen(email.id)
      return
    }
    if (action === 'spam') {
      move(email.id, 'spam')
      notify('Marked as spam')
      leaveIfOpen(email.id)
      return
    }
    if (action === 'delete') {
      if (email.folder === 'trash') {
        setPendingDelete(email)
        return
      }
      move(email.id, 'trash')
      notify('Moved to trash')
      leaveIfOpen(email.id)
    }
  }

  const Icon = folderMeta.icon
  const headerCount = query
    ? `${list.length} ${list.length === 1 ? 'result' : 'results'}`
    : folderMeta.id === 'inbox'
      ? `${list.length} ${list.length === 1 ? 'message' : 'messages'} · ${unread} unread`
      : `${list.length} ${list.length === 1 ? 'message' : 'messages'}`

  return (
    <div className="flex h-full min-h-0">
      <section className={`${emailId ? 'hidden lg:flex' : 'flex'} h-full min-h-0 w-full min-w-0 flex-col border-line lg:w-[340px] lg:shrink-0 lg:border-r xl:w-[400px] 2xl:w-[460px]`}>
        <div className="border-b border-line px-4 py-4">
          <div className="flex min-h-8 items-center justify-between gap-3">
            <h1 className="min-w-0 font-display text-[1.7rem] leading-none">{folderMeta.label}</h1>
            <div className="flex shrink-0 items-center gap-3">
            {folderMeta.id === 'inbox' && unread > 0 && !query ? (
              <button type="button" className="cursor-pointer text-xs font-semibold text-accent" onClick={() => { markAllRead('inbox'); notify('Inbox marked as read') }}>
                Mark all read
              </button>
            ) : null}
            {folderMeta.id === 'trash' && emails.some((email) => email.folder === 'trash') ? (
              <button type="button" className="cursor-pointer text-xs font-semibold text-danger" onClick={() => setEmptyOpen(true)}>
                Empty trash
              </button>
            ) : null}
            </div>
          </div>
          <p className="mt-1.5 text-xs text-muted">{headerCount}</p>
        </div>
        <div className="scroll-area min-h-0 flex-1 overflow-y-auto pb-24 md:pb-0" aria-busy={!ready}>
          {!ready ? (
            <SkeletonRows />
          ) : list.length === 0 ? (
            <EmptyState
              icon={Icon}
              title={query ? 'No matching mail' : folderMeta.emptyTitle}
              body={query ? `Nothing in ${folderMeta.label} matches “${query}”.` : folderMeta.emptyBody}
              action={query ? (
                <Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>
              ) : folderMeta.id === 'inbox' || folderMeta.id === 'drafts' ? (
                <Link to="/compose" className="inline-flex h-10 items-center rounded-xl bg-accent px-3.5 text-sm font-semibold text-accent-ink">Compose</Link>
              ) : null}
            />
          ) : (
            <ul>
              {list.map((email) => (
                <EmailRow
                  key={email.id}
                  email={email}
                  active={email.id === emailId}
                  onOpen={(item) => {
                    if (item.folder === 'drafts') navigate(`/compose?draft=${item.id}`)
                    else navigate(`/${folderMeta.id}/${item.id}`)
                  }}
                  onStar={(item) => toggleStar(item.id)}
                  onAction={handleAction}
                />
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className={`${emailId ? 'flex' : 'hidden lg:flex'} min-h-0 min-w-0 flex-1 flex-col bg-canvas`}>
        {!ready ? (
          <SkeletonReader />
        ) : !emailId ? (
          <EmptyState icon={Icon} title="Select a message" body="Open something from the list, or start a new one." action={<Link to="/compose" className="inline-flex h-10 items-center rounded-xl bg-accent px-3.5 text-sm font-semibold text-accent-ink">Compose</Link>} />
        ) : !active ? (
          <EmptyState icon={Icon} title="This message is gone" body="It may have been deleted. Choose another from the list." />
        ) : (
          <EmailReader
            email={active}
            onBack={() => navigate(`/${folderMeta.id}`)}
            onReply={() => navigate(`/compose?mode=reply&source=${active.id}`)}
            onReplyAll={() => navigate(`/compose?mode=replyAll&source=${active.id}`)}
            onForward={() => navigate(`/compose?mode=forward&source=${active.id}`)}
            onAction={handleAction}
          />
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete forever?"
        body="This message will be removed from Trash and cannot be restored."
        confirmLabel="Delete forever"
        danger
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          removeForever(pendingDelete.id)
          notify('Deleted')
          leaveIfOpen(pendingDelete.id)
          setPendingDelete(null)
        }}
      />
      <ConfirmDialog
        open={emptyOpen}
        title="Empty trash?"
        body="Every message in Trash will be removed for good."
        confirmLabel="Empty trash"
        danger
        onClose={() => setEmptyOpen(false)}
        onConfirm={() => {
          emptyTrash()
          notify('Trash emptied')
          if (active?.folder === 'trash') navigate('/trash')
          setEmptyOpen(false)
        }}
      />
    </div>
  )
}

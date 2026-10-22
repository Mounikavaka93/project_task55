import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail } from 'lucide-react'
import ComposeForm from '../components/mail/ComposeForm'
import { SkeletonReader } from '../components/mail/SkeletonRows'
import EmptyState from '../components/ui/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useMail } from '../context/MailContext'
import { useTitle } from '../hooks/useTitle'
import { buildComposeSeed } from '../utils/mail'

export default function ComposePage() {
  const [params] = useSearchParams()
  const { emails, ready } = useMail()
  const { user } = useAuth()
  const mode = params.get('mode')
  const draftId = params.get('draft')
  const sourceId = params.get('source')
  const seedKey = `${mode || 'new'}:${draftId || ''}:${sourceId || ''}:${ready ? 'ready' : 'wait'}`
  const initial = useMemo(
    () => buildComposeSeed({ emails, user, mode, draftId, sourceId }),
    // Mailbox updates should not wipe a message that is already being written.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, draftId, sourceId, user, ready],
  )
  useTitle(initial.heading)

  return (
    <div className="flex h-full min-h-0 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col">
        {!ready ? (
          <div className="rounded-3xl border border-line bg-panel">
            <SkeletonReader />
          </div>
        ) : initial.missing ? (
          <div className="rounded-3xl border border-line bg-panel">
            <EmptyState
              icon={Mail}
              title="That message is not here"
              body="It may have been deleted. Start a new one instead."
              action={<Link to="/compose" className="inline-flex h-10 items-center rounded-xl bg-accent px-3.5 text-sm font-semibold text-accent-ink">New message</Link>}
            />
          </div>
        ) : (
          <ComposeForm key={seedKey} user={user} initial={initial} />
        )}
      </div>
    </div>
  )
}

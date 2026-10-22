import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paperclip, X } from 'lucide-react'
import { useMail } from '../../context/MailContext'
import { textFromHtml, formatSize, wait } from '../../utils/format'
import { isValidEmail } from '../../utils/validation'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'
import Spinner from '../ui/Spinner'
import TextField from '../ui/TextField'
import Editor from './Editor'
import RecipientField from './RecipientField'

const MAX_FILES = 8
const MAX_BYTES = 10 * 1024 * 1024

export default function ComposeForm({ user, initial }) {
  const navigate = useNavigate()
  const { send, saveDraft, removeForever, notify } = useMail()
  const [to, setTo] = useState(initial.to)
  const [cc, setCc] = useState(initial.cc)
  const [bcc, setBcc] = useState(initial.bcc)
  const [subject, setSubject] = useState(initial.subject)
  const [body, setBody] = useState(initial.body)
  const [attachments, setAttachments] = useState(initial.attachments)
  const [showCc, setShowCc] = useState(initial.cc.length > 0)
  const [showBcc, setShowBcc] = useState(initial.bcc.length > 0)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [discardOpen, setDiscardOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const toRef = useRef(null)
  const ccRef = useRef(null)
  const bccRef = useRef(null)
  const fileRef = useRef(null)

  function addFiles(fileList) {
    const accepted = []
    let oversized = ''
    ;[...fileList].forEach((file) => {
      if (file.size > MAX_BYTES) {
        if (!oversized) oversized = file.name
        return
      }
      accepted.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        mime: file.type || 'application/octet-stream',
      })
    })
    if (oversized) notify(`${oversized} is larger than 10 MB.`)
    if (attachments.length + accepted.length > MAX_FILES) notify('You can attach up to 8 files.')
    setAttachments((current) => {
      const room = Math.max(MAX_FILES - current.length, 0)
      return [...current, ...accepted.slice(0, room)]
    })
  }

  function collect() {
    const nextTo = toRef.current?.flush()
    const nextCc = showCc ? ccRef.current?.flush() : cc
    const nextBcc = showBcc ? bccRef.current?.flush() : bcc
    if (!nextTo || nextCc == null || nextBcc == null) return null
    return { to: nextTo, cc: nextCc, bcc: nextBcc }
  }

  async function onSend(event) {
    event.preventDefault()
    const people = collect()
    if (!people) return
    const nextErrors = {}
    if (!people.to.length) nextErrors.to = 'Add at least one recipient.'
    else if (people.to.some((person) => !isValidEmail(person.email))) nextErrors.to = 'Check the recipients.'
    if (people.cc.some((person) => !isValidEmail(person.email))) nextErrors.cc = 'Check the Cc addresses.'
    if (people.bcc.some((person) => !isValidEmail(person.email))) nextErrors.bcc = 'Check the Bcc addresses.'
    if (!subject.trim()) nextErrors.subject = 'Add a subject before sending.'
    if (!textFromHtml(body)) nextErrors.body = 'Write a message before sending.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setStatus('sending')
    await wait(560)
    const id = send({ draftId: initial.draftId, ...people, subject, body, attachments })
    setStatus('')
    notify('Message sent')
    navigate(`/sent/${id}`)
  }

  async function onSave() {
    const people = collect()
    if (!people) return
    const hasContent = people.to.length || people.cc.length || people.bcc.length || subject.trim() || textFromHtml(body) || attachments.length
    if (!hasContent) {
      setErrors({ form: 'Add something before saving a draft.' })
      return
    }
    setStatus('saving')
    await wait(350)
    const id = saveDraft({ draftId: initial.draftId, ...people, subject, body, attachments })
    setStatus('')
    notify('Draft saved')
    if (!initial.draftId) navigate(`/compose?draft=${id}`, { replace: true })
  }

  function requestDiscard() {
    const hasContent = to.length || cc.length || bcc.length || subject.trim() || textFromHtml(body) || attachments.length || initial.draftId
    if (!hasContent) {
      navigate('/inbox')
      return
    }
    setDiscardOpen(true)
  }

  function confirmDiscard() {
    if (initial.draftId) {
      removeForever(initial.draftId)
      notify('Draft discarded')
    }
    navigate('/inbox')
  }

  return (
    <form
      onSubmit={onSend}
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border bg-panel shadow-[0_18px_50px_rgba(48,36,22,0.06)] ${dragOver ? 'border-accent' : 'border-line'}`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        addFiles(event.dataTransfer.files)
      }}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-4 sm:px-6">
        <div>
          <h1 className="font-display text-3xl leading-none">{initial.heading}</h1>
          <p className="mt-2 text-sm text-muted">
            From {user.name} · {user.email}
          </p>
        </div>
      </div>

      <div className="scroll-area min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
        {errors.form ? (
          <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
            {errors.form}
          </p>
        ) : null}
        <RecipientField
          ref={toRef}
          id="compose-to"
          label="To"
          people={to}
          onChange={setTo}
          error={errors.to}
          placeholder="name@email.com"
          extra={(
            <span className="flex gap-3 text-sm">
              {showCc ? null : (
                <button type="button" className="cursor-pointer font-medium text-accent" onClick={() => setShowCc(true)}>
                  Cc
                </button>
              )}
              {showBcc ? null : (
                <button type="button" className="cursor-pointer font-medium text-accent" onClick={() => setShowBcc(true)}>
                  Bcc
                </button>
              )}
            </span>
          )}
        />
        {showCc ? (
          <RecipientField ref={ccRef} id="compose-cc" label="Cc" people={cc} onChange={setCc} error={errors.cc} placeholder="Add Cc" />
        ) : null}
        {showBcc ? (
          <RecipientField ref={bccRef} id="compose-bcc" label="Bcc" people={bcc} onChange={setBcc} error={errors.bcc} placeholder="Add Bcc" />
        ) : null}
        <TextField
          id="compose-subject"
          label="Subject"
          value={subject}
          maxLength={180}
          error={errors.subject}
          onChange={(event) => setSubject(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault()
          }}
        />
        <div>
          <p className="mb-1.5 text-sm font-medium">Message</p>
          <Editor initialValue={initial.body} onChange={setBody} invalid={Boolean(errors.body)} />
          {errors.body ? (
            <p role="alert" className="mt-1.5 text-sm text-danger">
              {errors.body}
            </p>
          ) : null}
        </div>

        <div>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files)
              event.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line px-3 text-sm text-muted transition duration-200 hover:border-accent hover:text-ink"
          >
            <Paperclip size={16} />
            Add attachment
          </button>
          {attachments.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {attachments.map((file) => (
                <li key={file.id} className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-panel-2 py-1 pr-1 pl-3 text-xs">
                  <span className="truncate">{file.name}</span>
                  <span className="text-faint">{formatSize(file.size)}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    className="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-panel"
                    onClick={() => setAttachments((current) => current.filter((item) => item.id !== file.id))}
                  >
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-faint">Or drop files here. Up to 8 files, 10 MB each.</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-line px-4 py-3 sm:px-6">
        <Button type="submit" disabled={status !== ''}>
          {status === 'sending' ? <Spinner /> : null}
          {status === 'sending' ? 'Sending…' : 'Send'}
        </Button>
        <Button variant="secondary" onClick={onSave} disabled={status !== ''}>
          {status === 'saving' ? <Spinner /> : null}
          {status === 'saving' ? 'Saving…' : 'Save draft'}
        </Button>
        <Button variant="ghost" onClick={requestDiscard} disabled={status !== ''}>
          Discard
        </Button>
      </div>

      <ConfirmDialog
        open={discardOpen}
        title="Discard this message?"
        body={initial.draftId ? 'This draft will be deleted.' : 'What you have written will be thrown away.'}
        confirmLabel="Discard"
        danger
        onConfirm={confirmDiscard}
        onClose={() => setDiscardOpen(false)}
      />
    </form>
  )
}

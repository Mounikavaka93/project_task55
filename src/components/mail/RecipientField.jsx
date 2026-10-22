import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { isValidEmail } from '../../utils/validation'

function uniqueMerge(people, tokens) {
  const next = [...people]
  tokens.forEach((email) => {
    const normalized = email.trim()
    if (!normalized) return
    if (next.some((person) => person.email.toLowerCase() === normalized.toLowerCase())) return
    next.push({ name: normalized.split('@')[0], email: normalized })
  })
  return next
}

function chipLabel(person) {
  const local = person.email.split('@')[0]
  if (person.name && person.name !== local) return `${person.name} · ${person.email}`
  return person.email
}

const RecipientField = forwardRef(function RecipientField({ id, label, people, onChange, error, placeholder, extra }, ref) {
  const [draft, setDraft] = useState('')
  const [localError, setLocalError] = useState('')
  const peopleRef = useRef(people)

  useEffect(() => {
    peopleRef.current = people
  })

  function commit(raw) {
    const tokens = raw.split(/[,;\s]+/).map((item) => item.trim()).filter(Boolean)
    if (!tokens.length) return peopleRef.current
    const invalid = tokens.find((token) => !isValidEmail(token))
    if (invalid) {
      setLocalError(`${invalid} is not a valid email.`)
      return null
    }
    const next = uniqueMerge(peopleRef.current, tokens)
    peopleRef.current = next
    setLocalError('')
    setDraft('')
    onChange(next)
    return next
  }

  useImperativeHandle(ref, () => ({
    flush() {
      if (!draft.trim()) return peopleRef.current
      return commit(draft)
    },
  }))

  const message = localError || error

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {extra}
      </div>
      <div className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border bg-panel px-2 py-1.5 transition ${message ? 'border-danger' : 'border-line focus-within:border-accent focus-within:shadow-[0_0_0_4px_var(--sf-accent-soft)]'}`}>
        {people.map((person) => (
          <span key={person.email} title={person.email} className="inline-flex max-w-full items-center gap-1 rounded-full bg-accent-soft px-2 py-1 text-xs text-ink">
            <span className="truncate">{chipLabel(person)}</span>
            <button
              type="button"
              aria-label={`Remove ${person.email}`}
              className="cursor-pointer text-muted hover:text-ink"
              onClick={() => {
                const next = people.filter((item) => item.email !== person.email)
                peopleRef.current = next
                onChange(next)
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={people.length ? '' : placeholder}
          onChange={(event) => {
            setDraft(event.target.value)
            setLocalError('')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',' || event.key === ';') {
              event.preventDefault()
              commit(draft)
            } else if (event.key === 'Backspace' && !draft && people.length) {
              const next = people.slice(0, -1)
              peopleRef.current = next
              onChange(next)
            }
          }}
          onBlur={() => {
            if (draft.trim()) commit(draft)
          }}
          className="h-8 min-w-[140px] flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
          aria-invalid={Boolean(message)}
          aria-describedby={message ? `${id}-error` : undefined}
        />
      </div>
      {message ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {message}
        </p>
      ) : null}
    </div>
  )
})

export default RecipientField

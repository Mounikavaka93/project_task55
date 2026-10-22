import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEMO_USER } from '../data/demoUser'
import { seedDemoMail, welcomeMail } from '../data/seedMail'
import { useAuth } from './AuthContext'
import { sanitizeHtml } from '../utils/sanitize'
import { readJson, writeJson } from '../utils/storage'
import { textFromHtml } from '../utils/format'

const MailContext = createContext(null)

function mailKey(userId) {
  return `sablefinch-mail-${userId}`
}

function buildRecord(payload, user, { id, folder }) {
  const body = sanitizeHtml(payload.body || '')
  const preview = textFromHtml(body).slice(0, 140)
  return {
    id,
    folder,
    from: { name: user.name, email: user.email },
    to: payload.to || [],
    cc: payload.cc || [],
    bcc: payload.bcc || [],
    subject: (payload.subject || '').trim(),
    body,
    preview: preview || '(no message yet)',
    date: new Date().toISOString(),
    read: true,
    starred: false,
    attachments: (payload.attachments || []).map(({ id: fileId, name, size, mime }) => ({
      id: fileId,
      name,
      size,
      mime,
    })),
  }
}

export function MailProvider({ children }) {
  const { user } = useAuth()
  const [emails, setEmails] = useState([])
  const [ready, setReady] = useState(() => !user)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (!user) return undefined
    const key = mailKey(user.id)
    const stored = readJson(key, null)
    const data = Array.isArray(stored) ? stored : user.id === DEMO_USER.id ? seedDemoMail() : welcomeMail(user)
    if (!Array.isArray(stored)) writeJson(key, data)
    const timeout = window.setTimeout(() => {
      setEmails(data)
      setReady(true)
    }, 480)
    return () => window.clearTimeout(timeout)
  }, [user])

  useEffect(() => {
    if (!user || !ready) return
    writeJson(mailKey(user.id), emails)
  }, [emails, ready, user])

  const notify = useCallback((message) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message }].slice(-3))
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2800)
  }, [])

  const toggleStar = useCallback((id) => {
    setEmails((prev) => prev.map((email) => (email.id === id ? { ...email, starred: !email.starred } : email)))
  }, [])

  const markRead = useCallback((id, read) => {
    setEmails((prev) => prev.map((email) => (email.id === id ? { ...email, read } : email)))
  }, [])

  const markAllRead = useCallback((folder) => {
    setEmails((prev) => prev.map((email) => (email.folder === folder ? { ...email, read: true } : email)))
  }, [])

  const move = useCallback((id, folder) => {
    setEmails((prev) => prev.map((email) => (email.id === id ? { ...email, folder } : email)))
  }, [])

  const removeForever = useCallback((id) => {
    setEmails((prev) => prev.filter((email) => email.id !== id))
  }, [])

  const emptyTrash = useCallback(() => {
    setEmails((prev) => prev.filter((email) => email.folder !== 'trash'))
  }, [])

  const send = useCallback(
    (payload) => {
      if (!user) return null
      const id = crypto.randomUUID()
      const email = buildRecord(payload, user, { id, folder: 'sent' })
      setEmails((prev) => [email, ...prev.filter((item) => item.id !== payload.draftId)])
      return id
    },
    [user],
  )

  const saveDraft = useCallback(
    (payload) => {
      if (!user) return null
      const id = payload.draftId || crypto.randomUUID()
      setEmails((prev) => {
        const current = prev.find((item) => item.id === id)
        const email = buildRecord(payload, user, { id, folder: 'drafts' })
        email.starred = current?.starred || false
        return [email, ...prev.filter((item) => item.id !== id)]
      })
      return id
    },
    [user],
  )

  const value = useMemo(
    () => ({
      emails,
      ready,
      toggleStar,
      markRead,
      markAllRead,
      move,
      removeForever,
      emptyTrash,
      send,
      saveDraft,
      notify,
    }),
    [emails, ready, toggleStar, markRead, markAllRead, move, removeForever, emptyTrash, send, saveDraft, notify],
  )

  return (
    <MailContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-full bg-[#241f1b] px-4 py-2 text-sm text-[#f6f1ea] shadow-lg">
            {toast.message}
          </div>
        ))}
      </div>
    </MailContext.Provider>
  )
}

export function useMail() {
  const context = useContext(MailContext)
  if (!context) throw new Error('useMail must be used within MailProvider')
  return context
}

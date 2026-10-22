import { escapeHtml, formatFull, textFromHtml } from './format'

export function folderCount(emails, folderId) {
  if (folderId === 'inbox' || folderId === 'spam') {
    return emails.filter((email) => email.folder === folderId && !email.read).length
  }
  if (folderId === 'starred') {
    return emails.filter((email) => email.starred && email.folder !== 'trash').length
  }
  return emails.filter((email) => email.folder === folderId).length
}

export function visibleEmails(emails, folderId, query) {
  const needle = query.trim().toLowerCase()
  return emails
    .filter((email) => {
      if (folderId === 'starred') return email.starred && email.folder !== 'trash'
      return email.folder === folderId
    })
    .filter((email) => {
      if (!needle) return true
      const haystack = [
        email.subject,
        email.preview,
        email.from?.name,
        email.from?.email,
        ...(email.to || []).flatMap((person) => [person.name, person.email]),
        ...(email.cc || []).flatMap((person) => [person.name, person.email]),
        textFromHtml(email.body),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
    .sort((left, right) => new Date(right.date) - new Date(left.date))
}

export function withPrefix(subject, prefix) {
  const clean = (subject || '').trim() || '(no subject)'
  return clean.toLowerCase().startsWith(prefix.toLowerCase()) ? clean : `${prefix} ${clean}`
}

function uniquePeople(people) {
  const seen = new Set()
  return people.filter((person) => {
    const key = person.email.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function replyRecipients(email, myEmail) {
  if (email.from.email.toLowerCase() === myEmail.toLowerCase()) return email.to
  return [email.from]
}

export function replyAllCc(email, myEmail, to) {
  const excluded = new Set([myEmail.toLowerCase(), ...to.map((person) => person.email.toLowerCase())])
  return uniquePeople([...(email.to || []), ...(email.cc || [])].filter((person) => !excluded.has(person.email.toLowerCase())))
}

export function quoteEmail(email) {
  const when = formatFull(email.date)
  return `<p><br></p><blockquote><p>On ${when}, ${escapeHtml(email.from.name)} &lt;${escapeHtml(email.from.email)}&gt; wrote:</p>${email.body}</blockquote>`
}

export function buildComposeSeed({ emails, user, mode, draftId, sourceId }) {
  const blank = {
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    attachments: [],
    draftId: null,
    heading: 'New message',
    missing: false,
  }

  if (draftId) {
    const draft = emails.find((email) => email.id === draftId)
    if (!draft || draft.folder !== 'drafts') return { ...blank, missing: true, heading: 'Draft' }
    return {
      to: draft.to || [],
      cc: draft.cc || [],
      bcc: draft.bcc || [],
      subject: draft.subject === '(no subject)' ? '' : draft.subject,
      body: draft.body || '',
      attachments: draft.attachments || [],
      draftId: draft.id,
      heading: 'Draft',
      missing: false,
    }
  }

  if (!mode) return blank

  const source = emails.find((email) => email.id === sourceId)
  if (!source) return { ...blank, missing: true, heading: 'Message' }

  if (mode === 'forward') {
    return {
      ...blank,
      subject: withPrefix(source.subject, 'Fwd:'),
      body: quoteEmail(source),
      attachments: (source.attachments || []).map((file) => ({ ...file, id: crypto.randomUUID() })),
      heading: 'Forward',
    }
  }

  const to = replyRecipients(source, user.email)
  const cc = mode === 'replyAll' ? replyAllCc(source, user.email, to) : []
  return {
    ...blank,
    to,
    cc,
    subject: withPrefix(source.subject, 'Re:'),
    body: quoteEmail(source),
    heading: mode === 'replyAll' ? 'Reply all' : 'Reply',
  }
}

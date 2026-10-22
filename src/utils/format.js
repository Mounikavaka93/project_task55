export function formatWhen(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const now = new Date()
  const startOfDay = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate())
  const dayDelta = Math.round((startOfDay(now) - startOfDay(date)) / 86400000)

  if (dayDelta <= 0) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (dayDelta === 1) return 'Yesterday'
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatFull(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return `${day} at ${time}`
}

export function formatSize(bytes) {
  if (!Number.isFinite(bytes)) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function textFromHtml(html) {
  if (!html) return ''
  const node = document.createElement('div')
  node.innerHTML = html
  return (node.textContent || '').replace(/\s+/g, ' ').trim()
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]))
}

export function peopleLabel(people = []) {
  if (!people.length) return 'No recipients'
  return people
    .map((person) => {
      const local = person.email.split('@')[0]
      if (person.name && person.name !== local) return person.name
      return person.email
    })
    .join(', ')
}

export function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

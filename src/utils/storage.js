export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore quota and private-mode failures. The session still works in memory.
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore storage failures.
  }
}

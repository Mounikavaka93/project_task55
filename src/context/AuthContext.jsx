import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { DEMO_USER } from '../data/demoUser'
import { welcomeMail } from '../data/seedMail'
import { readJson, removeKey, writeJson } from '../utils/storage'

const USERS_KEY = 'sablefinch-users'
const SESSION_KEY = 'sablefinch-session'
const AuthContext = createContext(null)

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'Member',
  }
}

function loadUsers() {
  const stored = readJson(USERS_KEY, null)
  if (!Array.isArray(stored) || stored.length === 0) {
    writeJson(USERS_KEY, [DEMO_USER])
    return [DEMO_USER]
  }
  if (!stored.some((item) => item.email === DEMO_USER.email)) {
    const next = [...stored, DEMO_USER]
    writeJson(USERS_KEY, next)
    return next
  }
  return stored
}

function loadSession() {
  const stored = readJson(SESSION_KEY, null)
  if (!stored?.id || !stored?.email || !stored?.name) return null
  return publicUser(stored)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)

  const signIn = useCallback((email, password) => {
    const found = loadUsers().find((item) => item.email === email.trim().toLowerCase())
    if (!found || found.password !== password) {
      return { ok: false, error: 'Email or password is incorrect.' }
    }
    const session = publicUser(found)
    writeJson(SESSION_KEY, session)
    setUser(session)
    return { ok: true }
  }, [])

  const signUp = useCallback(({ name, email, password }) => {
    const users = loadUsers()
    const normalized = email.trim().toLowerCase()
    if (users.some((item) => item.email === normalized)) {
      return { ok: false, error: 'An account with that email already exists.' }
    }
    const account = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      password,
      role: 'Member',
    }
    const session = publicUser(account)
    writeJson(USERS_KEY, [...users, account])
    writeJson(`sablefinch-mail-${account.id}`, welcomeMail(session))
    writeJson(SESSION_KEY, session)
    setUser(session)
    return { ok: true }
  }, [])

  const resetPassword = useCallback((email, password) => {
    const users = loadUsers()
    const normalized = email.trim().toLowerCase()
    const index = users.findIndex((item) => item.email === normalized)
    if (index < 0) return { ok: false, error: 'No account uses that email.' }
    const next = [...users]
    next[index] = { ...next[index], password }
    writeJson(USERS_KEY, next)
    return { ok: true }
  }, [])

  const hasAccount = useCallback((email) => {
    return loadUsers().some((item) => item.email === email.trim().toLowerCase())
  }, [])

  const signOut = useCallback(() => {
    removeKey(SESSION_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, signIn, signUp, signOut, resetPassword, hasAccount }),
    [user, signIn, signUp, signOut, resetPassword, hasAccount],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

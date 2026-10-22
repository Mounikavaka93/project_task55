import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/auth/AuthShell'
import Button from '../components/ui/Button'
import PasswordField from '../components/ui/PasswordField'
import Spinner from '../components/ui/Spinner'
import TextField from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import { DEMO_USER } from '../data/demoUser'
import { useTitle } from '../hooks/useTitle'
import { wait } from '../utils/format'
import { validateEmail } from '../utils/validation'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  useTitle('Sign in')

  function fillDemo() {
    setEmail(DEMO_USER.email)
    setPassword(DEMO_USER.password)
    setErrors({})
    setFormError('')
  }

  async function onSubmit(event) {
    event.preventDefault()
    const next = {
      email: validateEmail(email),
      password: password ? '' : 'Password is required.',
    }
    setErrors(next)
    setFormError('')
    if (next.email || next.password) return
    setPending(true)
    await wait(350)
    const result = signIn(email, password)
    setPending(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    const dest = location.state?.from?.pathname
    const blocked = !dest || ['/signin', '/signup', '/forgot-password'].includes(dest)
    navigate(blocked ? '/inbox' : dest)
  }

  return (
    <AuthShell>
      <p className="text-xs font-semibold tracking-[0.16em] text-faint uppercase">Welcome back</p>
      <h1 className="mt-2 font-display text-4xl leading-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted">Use the sample inbox, or the account you created in this browser.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        {formError ? (
          <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
            {formError}
          </p>
        ) : null}
        <TextField
          id="signin-email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          maxLength={120}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value)
            setErrors((current) => ({ ...current, email: '' }))
            setFormError('')
          }}
        />
        <PasswordField
          id="signin-password"
          label="Password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(event) => {
            setPassword(event.target.value)
            setErrors((current) => ({ ...current, password: '' }))
            setFormError('')
          }}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Spinner /> : null}
          {pending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-6 rounded-2xl border border-line bg-panel-2 p-4">
        <p className="text-sm font-semibold">Sample inbox</p>
        <p className="mt-1 text-sm text-muted">
          {DEMO_USER.email}
          <br />
          {DEMO_USER.password}
        </p>
        <Button variant="secondary" className="mt-3 w-full" onClick={fillDemo}>
          Fill sample account
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted">
        New here?{' '}
        <Link to="/signup" className="font-semibold text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}

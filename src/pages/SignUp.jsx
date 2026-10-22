import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/auth/AuthShell'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import PasswordField from '../components/ui/PasswordField'
import Spinner from '../components/ui/Spinner'
import TextField from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import { useTitle } from '../hooks/useTitle'
import { wait } from '../utils/format'
import { validateConfirm, validateEmail, validateName, validatePassword } from '../utils/validation'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  useTitle('Create account')

  async function onSubmit(event) {
    event.preventDefault()
    const next = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validateConfirm(password, confirm),
      agreed: agreed ? '' : 'Please agree to the terms to create an account.',
    }
    setErrors(next)
    setFormError('')
    if (Object.values(next).some(Boolean)) return
    setPending(true)
    await wait(400)
    const result = signUp({ name, email, password })
    setPending(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    navigate('/inbox')
  }

  return (
    <AuthShell>
      <p className="text-xs font-semibold tracking-[0.16em] text-faint uppercase">New desk</p>
      <h1 className="mt-2 font-display text-4xl leading-tight">Create an account</h1>
      <p className="mt-2 text-sm text-muted">Your name, mail, and messages stay in this browser.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        {formError ? (
          <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
            {formError}
          </p>
        ) : null}
        <TextField
          id="signup-name"
          label="Name"
          autoComplete="name"
          value={name}
          maxLength={60}
          error={errors.name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          maxLength={120}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordField
          id="signup-password"
          label="Password"
          autoComplete="new-password"
          value={password}
          hint="At least 8 characters, with a letter and a number."
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          autoComplete="new-password"
          value={confirm}
          error={errors.confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
        <div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => {
                setAgreed(event.target.checked)
                setErrors((current) => ({ ...current, agreed: '' }))
              }}
              className="mt-0.5 size-4 accent-[#14685f]"
            />
            <span>
              I agree to the{' '}
              <button type="button" className="cursor-pointer font-semibold text-accent hover:underline" onClick={() => setTermsOpen(true)}>
                Sablefinch terms
              </button>
              .
            </span>
          </label>
          {errors.agreed ? (
            <p role="alert" className="mt-1.5 text-sm text-danger">
              {errors.agreed}
            </p>
          ) : null}
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Spinner /> : null}
          {pending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted">
        Already have a desk?{' '}
        <Link to="/signin" className="font-semibold text-accent hover:underline">
          Sign in
        </Link>
      </p>
      <ConfirmDialog
        open={termsOpen}
        title="Sablefinch terms"
        body="Sablefinch is a local demo. Mail and passwords stay in this browser and are not sent to a server. Use a password you do not use anywhere else."
        confirmLabel="I agree"
        onConfirm={() => {
          setAgreed(true)
          setTermsOpen(false)
          setErrors((current) => ({ ...current, agreed: '' }))
        }}
        onClose={() => setTermsOpen(false)}
      />
    </AuthShell>
  )
}

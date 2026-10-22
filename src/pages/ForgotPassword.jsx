import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import AuthShell from '../components/auth/AuthShell'
import Button from '../components/ui/Button'
import PasswordField from '../components/ui/PasswordField'
import Spinner from '../components/ui/Spinner'
import TextField from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import { DEMO_USER } from '../data/demoUser'
import { useTitle } from '../hooks/useTitle'
import { wait } from '../utils/format'
import { validateConfirm, validateEmail, validatePassword } from '../utils/validation'

export default function ForgotPassword() {
  const { hasAccount, resetPassword } = useAuth()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  useTitle('Reset password')

  async function onEmail(event) {
    event.preventDefault()
    const emailError = validateEmail(email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }
    setPending(true)
    await wait(300)
    setPending(false)
    if (!hasAccount(email)) {
      setErrors({ email: 'No account uses that email.' })
      return
    }
    setErrors({})
    setStep('password')
  }

  async function onPassword(event) {
    event.preventDefault()
    const next = {
      password: validatePassword(password),
      confirm: validateConfirm(password, confirm),
    }
    setErrors(next)
    if (next.password || next.confirm) return
    setPending(true)
    await wait(350)
    const result = resetPassword(email, password)
    setPending(false)
    if (!result.ok) {
      setErrors({ password: result.error })
      return
    }
    setStep('done')
  }

  return (
    <AuthShell>
      {step === 'done' ? (
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
            <Check size={22} />
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight">Password updated</h1>
          <p className="mt-2 text-sm text-muted">You can sign in with the new password for {email}.</p>
          <Link to="/signin" className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink">
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold tracking-[0.16em] text-faint uppercase">Account help</p>
          <h1 className="mt-2 font-display text-4xl leading-tight">Reset password</h1>
          <p className="mt-2 text-sm text-muted">
            {step === 'email'
              ? 'Enter the email for your Sablefinch account. This demo updates the password here, since there is no mail server.'
              : `Choose a new password for ${email}.`}
          </p>
          {step === 'email' ? (
            <form className="mt-6 space-y-4" onSubmit={onEmail} noValidate>
              <TextField
                id="reset-email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                maxLength={120}
                error={errors.email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Spinner /> : null}
                Continue
              </Button>
              <p className="text-xs text-faint">Try the sample account: {DEMO_USER.email}</p>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={onPassword} noValidate>
              <PasswordField
                id="reset-password"
                label="New password"
                autoComplete="new-password"
                value={password}
                hint="At least 8 characters, with a letter and a number."
                error={errors.password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <PasswordField
                id="reset-confirm"
                label="Confirm new password"
                autoComplete="new-password"
                value={confirm}
                error={errors.confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Spinner /> : null}
                {pending ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          )}
          <p className="mt-6 text-sm text-muted">
            <Link to="/signin" className="font-semibold text-accent hover:underline">
              Back to sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  )
}

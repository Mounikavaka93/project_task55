const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value) {
  return EMAIL.test(String(value || '').trim())
}

export function validateEmail(value) {
  const email = String(value || '').trim()
  if (!email) return 'Email is required.'
  if (!isValidEmail(email)) return 'Enter a valid email address.'
  return ''
}

export function validatePassword(value, { requiredOnly = false } = {}) {
  if (!value) return 'Password is required.'
  if (requiredOnly) return ''
  if (value.length < 8) return 'Use at least 8 characters.'
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Include at least one letter and one number.'
  }
  return ''
}

export function validateName(value) {
  const name = String(value || '').trim()
  if (!name) return 'Name is required.'
  if (name.length < 2) return 'Name looks too short.'
  if (name.length > 60) return 'Name is too long.'
  return ''
}

export function validateConfirm(password, confirm) {
  if (!confirm) return 'Confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return ''
}

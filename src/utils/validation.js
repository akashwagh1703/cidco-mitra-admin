export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) ? '' : 'Invalid email address'
}

/** Login / presence check — do not enforce strength (existing accounts may differ). */
export const validatePassword = (password, isRequired = true) => {
  if (!password || !password.trim()) return isRequired ? 'Password is required' : ''
  return ''
}

/** New account / password change strength rules (match API). */
export const validatePasswordStrength = (password, isRequired = true) => {
  if (!password || !password.trim()) return isRequired ? 'Password is required' : ''
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include letters and numbers'
  }
  return ''
}

/** Keep only digits, capped at 10 (for controlled phone inputs). */
export const normalizePhoneInput = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 10)

/**
 * Phone/contact must be exactly 10 digits when provided.
 * @param {string} phone
 * @param {boolean} isRequired
 * @param {string} fieldName
 */
export const validatePhone = (phone, isRequired = true, fieldName = 'Phone number') => {
  const raw = phone == null ? '' : String(phone).trim()
  if (!raw) return isRequired ? `${fieldName} is required` : ''
  const digits = normalizePhoneInput(raw)
  if (digits.length < 10) return `${fieldName} must be at least 10 digits`
  if (digits.length > 10 || raw !== digits) return `${fieldName} must be at most 10 digits`
  return ''
}

export const validateRequired = (value, fieldName = 'This field') => {
  return value && value.trim().length > 0 ? '' : `${fieldName} is required`
}

export const validateUrl = (url, isRequired = false) => {
  if (!url || !url.trim()) return isRequired ? 'URL is required' : ''
  const re = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  return re.test(url) ? '' : 'Invalid URL format'
}

export const validateColor = (color) => {
  if (!color || !color.trim()) return 'Color is required'
  const re = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return re.test(color) ? '' : 'Invalid color format (use #RRGGBB)'
}

export const validateNumber = (value, min, max) => {
  if (!value) return 'This field is required'
  const num = Number(value)
  if (isNaN(num)) return 'Must be a valid number'
  if (min !== undefined && num < min) return `Must be at least ${min}`
  if (max !== undefined && num > max) return `Must be at most ${max}`
  return ''
}

export const validateLength = (value, min, max, fieldName = 'This field') => {
  if (!value || !value.trim()) return `${fieldName} is required`
  if (min && value.length < min) return `${fieldName} must be at least ${min} characters`
  if (max && value.length > max) return `${fieldName} must be at most ${max} characters`
  return ''
}

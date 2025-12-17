export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) ? '' : 'Invalid email address'
}

export const validatePassword = (password, isRequired = true) => {
  if (!password || !password.trim()) return isRequired ? 'Password is required' : ''
  return password.length >= 6 ? '' : 'Password must be at least 6 characters'
}

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Phone number is required'
  const re = /^[0-9]{10}$/
  return re.test(phone) ? '' : 'Phone number must be 10 digits'
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

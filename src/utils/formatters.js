const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const toValidDate = (date) => {
  if (!date && date !== 0) return null

  // Date-only strings (YYYY-MM-DD) — parse as local to avoid timezone day shift
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number)
    const parsed = new Date(year, month - 1, day)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const parsed = date instanceof Date ? date : new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatTimeFromDate = (parsed) => {
  let hours = parsed.getHours()
  const minutes = String(parsed.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${ampm}`
}

/** Format time strings like "09:30:00" or "09:30" → "9:30 AM" */
export const formatTime = (time) => {
  if (!time || typeof time !== 'string') return '—'

  const match = time.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?/)
  if (!match) return time

  let hours = Number(match[1])
  const minutes = match[2]
  if (Number.isNaN(hours) || hours > 23) return time

  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${ampm}`
}

/** e.g. 12 Nov 2026 */
export const formatDate = (date) => {
  const parsed = toValidDate(date)
  if (!parsed) return '—'

  return `${parsed.getDate()} ${MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`
}

/** e.g. 12 Nov 2026 12:06 PM */
export const formatDateTime = (date) => {
  const parsed = toValidDate(date)
  if (!parsed) return '—'

  return `${formatDate(parsed)} ${formatTimeFromDate(parsed)}`
}

/** Combine appointment date + time → e.g. 12 Nov 2026 9:30 AM */
export const formatAppointmentDateTime = (date, time) => {
  const datePart = formatDate(date)
  if (datePart === '—') return '—'
  if (!time) return datePart
  return `${datePart} ${formatTime(time)}`
}

export const formatRelativeTime = (date) => {
  const parsed = toValidDate(date)
  if (!parsed) return '—'

  // Prefer absolute date/time for consistency across admin
  return formatDateTime(parsed)
}

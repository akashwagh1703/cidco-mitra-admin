import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(container) {
  if (!container) return []
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  )
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)
  const onCloseRef = useRef(onClose)

  // Keep latest onClose without re-running the open/focus effect
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    previouslyFocused.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current?.()
        return
      }

      if (e.key !== 'Tab' || !dialogRef.current) return

      const focusable = getFocusable(dialogRef.current)
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)

    // Initial focus once on open — prefer a form field, not the close button
    const focusTimer = window.setTimeout(() => {
      const root = dialogRef.current
      if (!root) return

      const preferred =
        root.querySelector(
          'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'
        ) || getFocusable(root).find((el) => el.getAttribute('aria-label') !== 'Close dialog')

      ;(preferred || root)?.focus?.()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'unset'
      previouslyFocused.current?.focus?.()
    }
  }, [isOpen]) // intentionally NOT depending on onClose

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="presentation">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity animate-fade-in"
          onClick={() => onCloseRef.current?.()}
          aria-hidden="true"
        />

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          className={`relative bg-white dark:bg-secondary-800 rounded-lg shadow-xl w-full ${sizes[size]} transition-colors duration-300 animate-scale-in outline-none`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 id="modal-title" className="text-lg font-semibold text-secondary-900 dark:text-white">{title}</h3>
            <button
              type="button"
              onClick={() => onCloseRef.current?.()}
              aria-label="Close dialog"
              className="text-secondary-400 dark:text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

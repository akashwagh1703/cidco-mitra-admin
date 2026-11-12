import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

export default function SearchableSelect({
  label,
  error,
  options = [],
  value = '',
  onChange,
  name,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  className = '',
  disabled = false,
  required = false,
  compact = false,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)
  const searchRef = useRef(null)

  const selected = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)),
    [options, value]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((opt) => {
      const labelText = String(opt.label ?? '').toLowerCase()
      const valueText = String(opt.value ?? '').toLowerCase()
      return labelText.includes(q) || valueText.includes(q)
    })
  }, [options, query])

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus())
    }
  }, [open])

  const emit = (nextValue) => {
    onChange?.({
      target: {
        name,
        value: nextValue,
      },
    })
    setOpen(false)
    setQuery('')
  }

  return (
    <div className={`w-full ${className}`} ref={rootRef}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-1">
          {label}
          {required ? <span className="text-red-500 ml-0.5">*</span> : null}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            setOpen((v) => !v)
          }}
          className={`
            w-full flex items-center justify-between gap-2 text-left
            border rounded-md bg-white dark:bg-gray-700 text-secondary-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-secondary-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
            ${compact ? 'h-8 px-1.5 text-xs' : 'px-3 py-2 text-sm'}
            ${error ? 'border-red-500' : 'border-secondary-300 dark:border-gray-600'}
            ${open ? 'ring-2 ring-primary-500 border-transparent' : ''}
          `}
        >
          <span className={`truncate ${selected ? '' : 'text-secondary-400 dark:text-gray-400'}`}>
            {selected?.label || placeholder}
          </span>
          <ChevronDown size={compact ? 12 : 16} className={`shrink-0 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-secondary-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 px-2 py-1.5 border-b border-secondary-100 dark:border-gray-700">
              <Search size={14} className="text-secondary-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm outline-none text-secondary-900 dark:text-white placeholder:text-secondary-400"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    setOpen(false)
                    setQuery('')
                  }
                  if (e.key === 'Enter' && filtered.length === 1) {
                    e.preventDefault()
                    emit(filtered[0].value)
                  }
                }}
              />
            </div>
            <ul className="max-h-48 overflow-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-sm text-secondary-500">No matches</li>
              ) : (
                filtered.map((opt) => {
                  const isActive = String(opt.value) === String(value)
                  return (
                    <li key={String(opt.value)}>
                      <button
                        type="button"
                        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-left hover:bg-primary-50 dark:hover:bg-gray-700 ${
                          isActive ? 'bg-primary-50 dark:bg-gray-700 text-primary-700 dark:text-primary-300' : 'text-secondary-800 dark:text-gray-100'
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => emit(opt.value)}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isActive ? <Check size={14} className="shrink-0" /> : null}
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

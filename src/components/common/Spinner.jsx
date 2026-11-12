export default function Spinner({ className = 'h-8 w-8', label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center py-8" role="status" aria-label={label}>
      <div
        className={`${className} animate-spin rounded-full border-2 border-primary-200 border-t-primary-600 dark:border-secondary-600 dark:border-t-primary-400`}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

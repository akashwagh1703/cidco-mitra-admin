export default function Card({ children, className = '', title, action, size = 'md' }) {
  const compact = size === 'sm'

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-secondary-200 dark:border-gray-700 transition-colors duration-300 ${className}`}>
      {(title || action) && (
        <div className={`border-b border-secondary-200 dark:border-gray-700 flex items-center justify-between gap-3 ${compact ? 'px-4 py-2.5' : 'px-6 py-4'}`}>
          {title && (
            <h3 className={`font-semibold text-secondary-900 dark:text-white truncate ${compact ? 'text-sm' : 'text-lg'}`}>
              {title}
            </h3>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={compact ? 'p-4' : 'p-6'}>
        {children}
      </div>
    </div>
  )
}

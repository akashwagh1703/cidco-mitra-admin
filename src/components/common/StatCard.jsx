export default function StatCard({ title, value, icon: Icon, trend, color = 'primary', size = 'md' }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  }

  const compact = size === 'sm'

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-secondary-200 dark:border-gray-700 transition-colors duration-300 ${
        compact ? 'px-3 py-2.5' : 'p-6'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className={`font-medium text-secondary-600 dark:text-gray-400 truncate ${compact ? 'text-[11px] leading-tight' : 'text-sm'}`}>
            {title}
          </p>
          <p className={`font-bold text-secondary-900 dark:text-white tabular-nums ${compact ? 'mt-0.5 text-xl' : 'mt-2 text-3xl'}`}>
            {value}
          </p>
          {trend && (
            <p className={`mt-1 text-xs ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-md shrink-0 ${colors[color]} ${compact ? 'p-1.5' : 'p-3'}`}>
            <Icon size={compact ? 16 : 24} />
          </div>
        )}
      </div>
    </div>
  )
}

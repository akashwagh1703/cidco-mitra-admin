export default function StatCard({ title, value, icon: Icon, trend, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-secondary-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  )
}

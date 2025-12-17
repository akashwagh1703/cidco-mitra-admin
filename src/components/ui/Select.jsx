export default function Select({ 
  label, 
  error, 
  options = [],
  className = '',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 border rounded-md
          bg-white dark:bg-gray-700 text-secondary-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-secondary-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-secondary-300 dark:border-gray-600'}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

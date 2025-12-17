export default function Badge({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-secondary-100 dark:bg-gray-700 text-secondary-800 dark:text-gray-300',
    primary: 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
  }

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  )
}

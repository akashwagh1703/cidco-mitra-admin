const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white',
  secondary: 'bg-secondary-200 hover:bg-secondary-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-secondary-900 dark:text-white',
  outline: 'border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  ghost: 'hover:bg-secondary-100 dark:hover:bg-gray-700 text-secondary-700 dark:text-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled,
  as,
  ...props 
}) {
  const Component = as || 'button'
  
  return (
    <Component
      className={`
        inline-flex items-center justify-center
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  )
}

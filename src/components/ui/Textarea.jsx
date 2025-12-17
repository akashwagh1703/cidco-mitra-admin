export default function Textarea({ 
  label, 
  error, 
  className = '',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-secondary-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-secondary-300'}
          ${className}
        `}
        rows={4}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

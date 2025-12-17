export default function PageHeader({ title, description, action, breadcrumb }) {
  return (
    <div className="mb-6">
      {breadcrumb}
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-secondary-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}

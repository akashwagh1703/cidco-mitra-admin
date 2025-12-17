export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon size={48} className="text-secondary-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-secondary-900 mb-2">{title}</h3>
      {description && (
        <p className="text-secondary-600 mb-4">{description}</p>
      )}
      {action}
    </div>
  )
}

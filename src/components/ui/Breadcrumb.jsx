import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-2 text-secondary-400" />}
          {item.path ? (
            <Link 
              to={item.path} 
              className="text-secondary-600 hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-secondary-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

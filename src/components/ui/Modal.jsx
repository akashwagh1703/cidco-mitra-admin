import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizes[size]} transition-colors duration-300`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-secondary-400 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

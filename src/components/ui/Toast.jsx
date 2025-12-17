import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import useToastStore from '../../store/toastStore'

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle
}

const colors = {
  success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
}

export default function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
              min-w-[300px] max-w-md
              ${colors[toast.type]}
            `}
          >
            <Icon size={20} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

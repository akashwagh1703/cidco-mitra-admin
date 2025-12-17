import { ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NoAccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
            <ShieldAlert size={48} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-2">403</h1>
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-4">Access Denied</h2>
        <p className="text-secondary-600 dark:text-gray-400 mb-8 max-w-md">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}

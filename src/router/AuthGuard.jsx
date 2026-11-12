import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function SessionLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
      <div className="text-secondary-600 dark:text-secondary-300 text-sm">Loading session...</div>
    </div>
  )
}

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitializing } = useAuthStore()

  if (isInitializing) {
    return <SessionLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

/** Redirect authenticated users away from guest-only pages (e.g. /login). */
export function GuestGuard({ children }) {
  const { isAuthenticated, isInitializing } = useAuthStore()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (isInitializing) {
    return <SessionLoading />
  }

  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

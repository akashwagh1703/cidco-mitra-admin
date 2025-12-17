import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function RoleGuard({ permission, children }) {
  const { hasPermission } = useAuthStore()

  if (!hasPermission(permission)) {
    return <Navigate to="/no-access" replace />
  }

  return children
}

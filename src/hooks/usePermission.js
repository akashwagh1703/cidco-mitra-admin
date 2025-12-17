import useAuthStore from '../store/authStore'

export default function usePermission() {
  const { hasPermission } = useAuthStore()

  return {
    hasPermission,
    canView: (permission) => hasPermission(permission),
    canEdit: (permission) => hasPermission(permission),
    canDelete: (permission) => hasPermission(permission)
  }
}

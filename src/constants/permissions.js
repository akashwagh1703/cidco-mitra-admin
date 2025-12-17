export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_LEADS: 'manage_leads',
  UPDATE_LEAD_STATUS: 'update_lead_status',
  VIEW_NOTIFICATIONS: 'view_notifications',
  MANAGE_WEBSITE_SETTINGS: 'manage_website_settings',
  MANAGE_EMAIL_SETTINGS: 'manage_email_settings',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  ACCESS_REPORTS: 'access_reports'
}

export const DEFAULT_ROLES = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    permissions: Object.values(PERMISSIONS)
  },
  ADMIN: {
    name: 'Admin',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_LEADS,
      PERMISSIONS.UPDATE_LEAD_STATUS,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_WEBSITE_SETTINGS,
      PERMISSIONS.MANAGE_EMAIL_SETTINGS,
      PERMISSIONS.MANAGE_USERS
    ]
  },
  MANAGER: {
    name: 'Manager',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_LEADS,
      PERMISSIONS.UPDATE_LEAD_STATUS,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.ACCESS_REPORTS
    ]
  },
  AGENT: {
    name: 'Agent',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.UPDATE_LEAD_STATUS,
      PERMISSIONS.VIEW_NOTIFICATIONS
    ]
  }
}

import { LayoutDashboard, Users, UserCog, Mail, Settings, Bell, FileText, Briefcase, Calendar } from 'lucide-react'
import { PERMISSIONS } from './permissions'

export const NAVIGATION = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    permission: PERMISSIONS.VIEW_DASHBOARD
  },
  {
    name: 'Leads',
    path: '/leads',
    icon: FileText,
    permission: PERMISSIONS.MANAGE_LEADS
  },
  {
    name: 'Appointments',
    path: '/appointments',
    icon: Calendar,
    permission: PERMISSIONS.MANAGE_LEADS
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    permission: PERMISSIONS.VIEW_NOTIFICATIONS
  },
  {
    name: 'Users',
    path: '/users',
    icon: Users,
    permission: PERMISSIONS.MANAGE_USERS
  },
  {
    name: 'Roles',
    path: '/roles',
    icon: UserCog,
    permission: PERMISSIONS.MANAGE_ROLES
  },
  {
    name: 'Services',
    path: '/services',
    icon: Briefcase,
    permission: PERMISSIONS.MANAGE_WEBSITE_SETTINGS
  },
  {
    name: 'Settings',
    icon: Settings,
    permission: PERMISSIONS.MANAGE_WEBSITE_SETTINGS,
    children: [
      { name: 'General', path: '/settings/general' },
      { name: 'Branding', path: '/settings/branding' },
      { name: 'Homepage', path: '/settings/home' },
      { name: 'SEO', path: '/settings/seo' },
      { name: 'Email', path: '/settings/email', permission: PERMISSIONS.MANAGE_EMAIL_SETTINGS }
    ]
  }
]

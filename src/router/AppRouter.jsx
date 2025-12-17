import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AuthGuard from './AuthGuard'
import RoleGuard from './RoleGuard'
import AdminLayout from '../layouts/AdminLayout'
import NoAccess from '../layouts/NoAccess'
import { PERMISSIONS } from '../constants/permissions'

const Login = lazy(() => import('../pages/auth/Login'))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const LeadList = lazy(() => import('../pages/leads/LeadList'))
const LeadDetail = lazy(() => import('../pages/leads/LeadDetail'))
const Appointments = lazy(() => import('../pages/appointments/Appointments'))
const Notifications = lazy(() => import('../pages/notifications/Notifications'))
const Users = lazy(() => import('../pages/users/Users'))
const Roles = lazy(() => import('../pages/roles/Roles'))
const GeneralSettings = lazy(() => import('../pages/settings/general/GeneralSettings'))
const BrandingSettings = lazy(() => import('../pages/settings/branding/BrandingSettings'))
const HomeSettings = lazy(() => import('../pages/settings/home/HomeSettings'))
const SEOSettings = lazy(() => import('../pages/settings/seo/SEOSettings'))
const EmailSettings = lazy(() => import('../pages/settings/email/EmailSettings'))
const Services = lazy(() => import('../pages/services/Services'))

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/no-access" element={<NoAccess />} />
        
        <Route path="/" element={<AuthGuard><AdminLayout /></AuthGuard>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={
            <RoleGuard permission={PERMISSIONS.VIEW_DASHBOARD}>
              <Dashboard />
            </RoleGuard>
          } />
          
          <Route path="leads" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_LEADS}>
              <LeadList />
            </RoleGuard>
          } />
          
          <Route path="leads/:id" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_LEADS}>
              <LeadDetail />
            </RoleGuard>
          } />
          
          <Route path="appointments" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_LEADS}>
              <Appointments />
            </RoleGuard>
          } />
          
          <Route path="notifications" element={
            <RoleGuard permission={PERMISSIONS.VIEW_NOTIFICATIONS}>
              <Notifications />
            </RoleGuard>
          } />
          
          <Route path="users" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_USERS}>
              <Users />
            </RoleGuard>
          } />
          
          <Route path="roles" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_ROLES}>
              <Roles />
            </RoleGuard>
          } />
          
          <Route path="settings/general" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_WEBSITE_SETTINGS}>
              <GeneralSettings />
            </RoleGuard>
          } />
          
          <Route path="settings/branding" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_WEBSITE_SETTINGS}>
              <BrandingSettings />
            </RoleGuard>
          } />
          
          <Route path="settings/home" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_WEBSITE_SETTINGS}>
              <HomeSettings />
            </RoleGuard>
          } />
          
          <Route path="settings/seo" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_WEBSITE_SETTINGS}>
              <SEOSettings />
            </RoleGuard>
          } />
          
          <Route path="settings/email" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_EMAIL_SETTINGS}>
              <EmailSettings />
            </RoleGuard>
          } />
          
          <Route path="services" element={
            <RoleGuard permission={PERMISSIONS.MANAGE_WEBSITE_SETTINGS}>
              <Services />
            </RoleGuard>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

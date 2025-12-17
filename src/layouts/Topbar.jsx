import { Bell, Menu, User, LogOut, Moon, Sun, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useNotificationStore from '../store/notificationStore'
import useUIStore from '../store/uiStore'
import { formatRelativeTime } from '../utils/formatters'
import { notificationService } from '../services/notificationService'
import { authService } from '../services/authService'
import { useTranslation } from '../locales/translations'

export default function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { notifications, unreadCount, markAsRead, setNotifications } = useNotificationStore()
  const { toggleSidebar, theme, toggleTheme, language, setLanguage } = useUIStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)
  const t = useTranslation(language)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications()
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      navigate('/login')
    }
  }

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await notificationService.markAsRead(notification.id)
        markAsRead(notification.id)
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    } finally {
      setShowNotifications(false)
      navigate('/notifications')
    }
  }

  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors text-secondary-900 dark:text-white"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors text-secondary-900 dark:text-white"
            title={theme === 'light' ? t('darkMode') : t('lightMode')}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowLanguage(!showLanguage)}
              className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors text-secondary-900 dark:text-white"
              title={t('language')}
            >
              <Globe size={20} />
            </button>

            {showLanguage && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700">
                {['en', 'mr', 'hi'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setShowLanguage(false) }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors ${
                      language === lang ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-secondary-900 dark:text-white'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors text-secondary-900 dark:text-white"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
                  <h3 className="font-semibold text-secondary-900 dark:text-white">{t('notifications')}</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-secondary-600 dark:text-secondary-400">
                    {t('noNotifications')}
                  </div>
                ) : (
                  <div>
                    {notifications.slice(0, 5).map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`
                          w-full text-left p-4 border-b border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors
                          ${!notification.read_at ? 'bg-blue-50 dark:bg-blue-900' : ''}
                        `}
                      >
                        <p className="text-sm font-medium text-secondary-900 dark:text-white">{notification.title}</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User size={16} className="text-primary-700 dark:text-primary-300" />
              </div>
              <span className="text-sm font-medium text-secondary-900 dark:text-white">{user?.name}</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700">
                <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">{user?.email}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                >
                  <LogOut size={16} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

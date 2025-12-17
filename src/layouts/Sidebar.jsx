import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { NAVIGATION } from '../constants/navigation'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'
import { useTranslation } from '../locales/translations'

export default function Sidebar() {
  const location = useLocation()
  const { hasPermission } = useAuthStore()
  const { sidebarCollapsed, language } = useUIStore()
  const [expandedMenus, setExpandedMenus] = useState({})
  const t = useTranslation(language)

  const toggleMenu = (name) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const isActive = (path) => location.pathname === path

  if (sidebarCollapsed) return null

  return (
    <aside className="w-64 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
        <h1 className="text-xl font-bold text-primary-700 dark:text-primary-400">CIDCO Mitra</h1>
        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">Admin Panel</p>
      </div>

      <nav className="p-4 space-y-1">
        {NAVIGATION.map((item) => {
          if (item.permission && !hasPermission(item.permission)) return null

          if (item.children) {
            const isExpanded = expandedMenus[item.name]
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isExpanded && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.children.map((child) => {
                      if (child.permission && !hasPermission(child.permission)) return null
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`
                            block px-3 py-2 text-sm rounded-md transition-colors
                            ${isActive(child.path)
                              ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                              : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                            }
                          `}
                        >
                          {child.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NAVIGATION } from '../constants/navigation'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'

export default function Sidebar() {
  const location = useLocation()
  const { hasPermission } = useAuthStore()
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (name) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const isActive = (path) => location.pathname === path

  const closeMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarCollapsed(true)
    }
  }

  useEffect(() => {
    // Start closed on mobile
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true)
    }
  }, [setSidebarCollapsed])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !sidebarCollapsed && window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarCollapsed, setSidebarCollapsed])

  useEffect(() => {
    closeMobile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const mobileOpen = !sidebarCollapsed

  const navContent = (
    <>
      <div className="p-6 border-b border-secondary-200 dark:border-secondary-700 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-primary-700 dark:text-primary-400">CIDCO Mitra</h1>
          <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">Admin Panel</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarCollapsed(true)}
          className="lg:hidden p-1.5 rounded-md text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="p-4 space-y-1" aria-label="Main">
        {NAVIGATION.map((item) => {
          if (item.permission && !hasPermission(item.permission)) return null

          if (item.children) {
            const isExpanded = expandedMenus[item.name]
            return (
              <div key={item.name}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.name)}
                  aria-expanded={!!isExpanded}
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
                          onClick={closeMobile}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive(child.path)
                              ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                              : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                          }`}
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
              onClick={closeMobile}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarCollapsed(true)}
        aria-hidden="true"
      />

      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 h-screen sticky top-0 overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 overflow-y-auto transform transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        {navContent}
      </aside>
    </>
  )
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUIStore = create(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'light',
      language: 'en',
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setSidebarCollapsed: (collapsed) => set({ 
        sidebarCollapsed: collapsed 
      }),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      
      setLanguage: (lang) => set({ language: lang })
    }),
    {
      name: 'ui-storage'
    }
  )
)

export default useUIStore

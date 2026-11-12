import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,

      login: (userData) => set({ user: userData, isAuthenticated: true, isInitializing: false }),

      logout: () => set({ user: null, isAuthenticated: false, isInitializing: false }),

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      setInitializing: (value) => set({ isInitializing: value }),

      initializeAuth: async () => {
        const token = localStorage.getItem('token')
        const onLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/login')

        // Dev-only: skip /auth/me on login page (php artisan serve is single-threaded).
        // Production: keep token and let AuthGuard redirect authenticated users away.
        if (!token) {
          set({ user: null, isAuthenticated: false, isInitializing: false })
          return
        }

        // Dev: skip /auth/me on login page so php artisan serve isn't blocked
        if (onLoginPage && import.meta.env.DEV) {
          set({ isInitializing: false })
          return
        }

        try {
          const { authService } = await import('../services/authService')
          const response = await authService.me()
          const user = response.user || response.data || response
          if (user) {
            set({ user, isAuthenticated: true, isInitializing: false })
          } else {
            localStorage.removeItem('token')
            set({ user: null, isAuthenticated: false, isInitializing: false })
          }
        } catch {
          localStorage.removeItem('token')
          set({ user: null, isAuthenticated: false, isInitializing: false })
        }
      },

      hasPermission: (permission) => {
        const state = get()
        return state.user?.permissions?.includes(permission) || false
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore

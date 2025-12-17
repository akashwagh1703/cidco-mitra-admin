import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateUser: (userData) => set((state) => ({ 
        user: { ...state.user, ...userData } 
      })),
      
      hasPermission: (permission) => {
        const state = useAuthStore.getState()
        return state.user?.permissions?.includes(permission) || false
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)

export default useAuthStore

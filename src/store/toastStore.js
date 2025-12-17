import { create } from 'zustand'

const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now()
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, toast.duration || 3000)
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
  
  success: (message) => useToastStore.getState().addToast({ 
    type: 'success', 
    message 
  }),
  
  error: (message) => useToastStore.getState().addToast({ 
    type: 'error', 
    message 
  }),
  
  info: (message) => useToastStore.getState().addToast({ 
    type: 'info', 
    message 
  }),
  
  warning: (message) => useToastStore.getState().addToast({ 
    type: 'warning', 
    message 
  })
}))

export default useToastStore

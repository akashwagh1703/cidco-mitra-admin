import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from auth-storage (zustand persist)
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage)
        const token = state?.user?.token || localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (e) {
        console.error('Error parsing auth storage:', e)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on login page 401 errors
    const isLoginPage = window.location.pathname === '/cidco-mitra-admin/login'
    
    if (error.response?.status === 401 && !isLoginPage) {
      localStorage.removeItem('token')
      localStorage.removeItem('auth-storage')
      window.location.href = '/cidco-mitra-admin/login'
    }
    return Promise.reject(error)
  }
)

export default api

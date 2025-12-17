import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const data = response.data
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  },

  logout: async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  },

  me: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}

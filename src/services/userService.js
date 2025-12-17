import api from './api'

export const userService = {
  getUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data
  },

  createUser: async (data) => {
    const response = await api.post('/admin/users', data)
    return response.data
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },

  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/admin/users/${id}/status`, { status })
    return response.data
  },

  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role })
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  }
}

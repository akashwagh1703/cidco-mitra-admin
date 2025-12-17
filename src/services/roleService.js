import api from './api'

export const roleService = {
  getRoles: async () => {
    const response = await api.get('/admin/roles')
    return response.data
  },

  createRole: async (data) => {
    const response = await api.post('/admin/roles', data)
    return response.data
  },

  updateRole: async (id, data) => {
    const response = await api.put(`/admin/roles/${id}`, data)
    return response.data
  },

  deleteRole: async (id) => {
    const response = await api.delete(`/admin/roles/${id}`)
    return response.data
  },

  getPermissions: async () => {
    const response = await api.get('/admin/permissions')
    return response.data
  }
}

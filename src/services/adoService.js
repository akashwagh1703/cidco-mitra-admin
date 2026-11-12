import api from './api'

export const adoService = {
  getAdos: async (params = {}) => {
    const response = await api.get('/admin/ados', { params })
    return response.data
  },

  createAdo: async (data) => {
    const response = await api.post('/admin/ados', data)
    return response.data
  },

  updateAdo: async (id, data) => {
    const response = await api.put(`/admin/ados/${id}`, data)
    return response.data
  },

  deleteAdo: async (id) => {
    const response = await api.delete(`/admin/ados/${id}`)
    return response.data
  },
}

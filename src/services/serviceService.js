import api from './api'

export const serviceService = {
  getServices: async (includeAppointments = false) => {
    const response = await api.get('/admin/services', {
      params: { include_appointments: includeAppointments }
    })
    return response.data
  },

  createService: async (data) => {
    const response = await api.post('/admin/services', data)
    return response.data
  },

  updateService: async (id, data) => {
    const response = await api.put(`/admin/services/${id}`, data)
    return response.data
  },

  deleteService: async (id) => {
    const response = await api.delete(`/admin/services/${id}`)
    return response.data
  }
}

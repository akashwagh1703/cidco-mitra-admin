import api from './api'

export const leadService = {
  getLeads: async (params, config = {}) => {
    const response = await api.get('/admin/leads', { params, ...config })
    return response.data
  },

  getLead: async (id) => {
    const response = await api.get(`/admin/leads/${id}`)
    return response.data
  },

  createLead: async (data) => {
    const response = await api.post('/admin/leads', data)
    return response.data
  },

  updateLead: async (id, data, options = {}) => {
    const response = await api.put(`/admin/leads/${id}`, data, {
      headers: options.trackerCell ? { 'X-Tracker-Cell': '1' } : undefined,
    })
    return response.data
  },

  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/admin/leads/${id}/status`, { status })
    return response.data
  },

  addNote: async (id, note) => {
    const response = await api.post(`/admin/leads/${id}/notes`, { note })
    return response.data
  },

  getTimeline: async (id) => {
    const response = await api.get(`/admin/leads/${id}/timeline`)
    return response.data
  },

  deleteLead: async (id) => {
    const response = await api.delete(`/admin/leads/${id}`)
    return response.data
  },

  exportLeads: async (params) => {
    const response = await api.get('/admin/leads/export', { 
      params,
      responseType: 'blob'
    })
    return response.data
  }
}

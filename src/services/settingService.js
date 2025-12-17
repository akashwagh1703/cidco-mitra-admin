import api from './api'

export const settingService = {
  getSettings: async () => {
    const response = await api.get('/admin/settings')
    return response.data
  },

  updateGeneral: async (data) => {
    const response = await api.put('/admin/settings/general', data)
    return response.data
  },

  updateBranding: async (formData) => {
    const response = await api.post('/admin/settings/branding', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  updateHomepage: async (data) => {
    const response = await api.put('/admin/settings/homepage', data)
    return response.data
  },

  updateSeo: async (formData) => {
    const response = await api.post('/admin/settings/seo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  updateEmail: async (data) => {
    const response = await api.put('/admin/settings/email', data)
    return response.data
  }
}

import api from './api'

export const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },

  getAdvanceLeadPnl: async (period = 'month') => {
    const response = await api.get('/admin/dashboard/advance-lead-pnl', {
      params: { period },
    })
    return response.data
  },

  getInsights: async () => {
    const response = await api.get('/admin/dashboard/insights')
    return response.data
  },
}

import api from './api'

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/admin/notifications')
    return response.data
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/admin/notifications/${id}/read`)
    return response.data
  },

  markAllAsRead: async () => {
    const response = await api.patch('/admin/notifications/read')
    return response.data
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/admin/notifications/${id}`)
    return response.data
  }
}

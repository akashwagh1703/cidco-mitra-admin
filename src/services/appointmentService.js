import api from './api';

export const appointmentService = {
  // Get all appointments with filters
  getAppointments: async (params = {}) => {
    const response = await api.get('/admin/appointments', { params });
    return response.data;
  },

  // Get single appointment
  getAppointment: async (id) => {
    const response = await api.get(`/admin/appointments/${id}`);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, data) => {
    const response = await api.put(`/admin/appointments/${id}`, data);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await api.delete(`/admin/appointments/${id}`);
    return response.data;
  },

  // Get appointment stats
  getStats: async () => {
    const response = await api.get('/admin/appointments/stats');
    return response.data;
  },

  // Get calendar data
  getCalendar: async (month, year) => {
    const response = await api.get('/admin/appointments/calendar', {
      params: { month, year }
    });
    return response.data;
  },

  // Service schedules
  getSchedules: async (serviceId) => {
    const response = await api.get(`/admin/services/${serviceId}/schedules`);
    return response.data;
  },

  createSchedule: async (serviceId, data) => {
    const response = await api.post(`/admin/services/${serviceId}/schedules`, data);
    return response.data;
  },

  updateSchedule: async (serviceId, scheduleId, data) => {
    const response = await api.put(`/admin/services/${serviceId}/schedules/${scheduleId}`, data);
    return response.data;
  },

  deleteSchedule: async (serviceId, scheduleId) => {
    const response = await api.delete(`/admin/services/${serviceId}/schedules/${scheduleId}`);
    return response.data;
  },

  getAvailableSlots: async (serviceId, date) => {
    const response = await api.get(`/admin/services/${serviceId}/available-slots`, {
      params: { date }
    });
    return response.data;
  },
};

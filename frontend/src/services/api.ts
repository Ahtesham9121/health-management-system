import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
};

// Hospital API
export const hospitalAPI = {
  getAll: (params?: Record<string, string | number>) =>
    api.get('/hospitals', { params }),
  getById: (id: number) => api.get(`/hospitals/${id}`),
  create: (data: Record<string, unknown>) => api.post('/hospitals', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/hospitals/${id}`, data),
  delete: (id: number) => api.delete(`/hospitals/${id}`),
};

// Doctor API
export const doctorAPI = {
  getAll: (params?: Record<string, string | number>) =>
    api.get('/doctors', { params }),
  getById: (id: number) => api.get(`/doctors/${id}`),
  getByHospital: (hospitalId: number) => api.get(`/doctors/hospital/${hospitalId}`),
  create: (data: Record<string, unknown>) => api.post('/doctors', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/doctors/${id}`, data),
  delete: (id: number) => api.delete(`/doctors/${id}`),
};

// Appointment API
export const appointmentAPI = {
  book: (data: Record<string, unknown>) => api.post('/appointments', data),
  getByTracking: (trackingId: string) => api.get(`/appointments/track/${trackingId}`),
  getMyAppointments: () => api.get('/appointments/my'),
  getRecent: () => api.get('/appointments/recent'),
  cancel: (id: number) => api.put(`/appointments/${id}/cancel`),
};

// Location API
export const locationAPI = {
  getStates: () => api.get('/states'),
  getCities: (stateId?: number) => api.get('/cities', { params: stateId ? { stateId } : {} }),
};

// Speciality API
export const specialityAPI = {
  getAll: () => api.get('/specialities'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

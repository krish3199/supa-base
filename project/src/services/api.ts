import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
};

// Clients API
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id: string) => api.get(`/clients/${id}`),
  create: (clientData: any) => api.post('/clients', clientData),
  update: (id: string, clientData: any) => api.put(`/clients/${id}`, clientData),
  delete: (id: string) => api.delete(`/clients/${id}`),
};

// Expenses API
export const expensesAPI = {
  getAll: () => api.get('/expenses'),
  getById: (id: string) => api.get(`/expenses/${id}`),
  create: (expenseData: any) => api.post('/expenses', expenseData),
  update: (id: string, expenseData: any) => api.put(`/expenses/${id}`, expenseData),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Payments API
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (paymentData: any) => api.post('/payments', paymentData),
  update: (id: string, paymentData: any) => api.put(`/payments/${id}`, paymentData),
  delete: (id: string) => api.delete(`/payments/${id}`),
};

// Employees API
export const employeesAPI = {
  getAll: () => api.get('/employees'),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (employeeData: any) => api.post('/employees', employeeData),
  update: (id: string, employeeData: any) => api.put(`/employees/${id}`, employeeData),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getChartData: () => api.get('/dashboard/charts'),
  getRecentActivities: () => api.get('/dashboard/activities'),
};

export default api;
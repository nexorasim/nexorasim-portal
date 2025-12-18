import axios from 'axios';
import { ENV } from '../config/env';
import { getAuthToken } from '../utils/auth';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: any) => 
    api.post('/auth/register', data),
  verifyOTP: (phone: string, otp: string) => 
    api.post('/auth/verify-otp', { phone, otp }),
  sendOTP: (phone: string) => 
    api.post('/auth/send-otp', { phone }),
  googleAuth: (token: string) => 
    api.post('/auth/google', { token }),
};

export const esimAPI = {
  getPlans: () => api.get('/esim/plans'),
  getPlan: (id: string) => api.get(`/esim/plans/${id}`),
  purchasePlan: (planId: string, paymentData: any) => 
    api.post('/esim/purchase', { plan_id: planId, ...paymentData }),
  getOrders: () => api.get('/esim/orders'),
  activateESIM: (orderId: string) => 
    api.post(`/esim/activate/${orderId}`),
};

export const paymentAPI = {
  getMethods: () => api.get('/payment/methods'),
  processPayment: (data: any) => 
    api.post('/payment/process', data),
  addFunds: (amount: number, method: string) => 
    api.post('/payment/add-funds', { amount, method }),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  getWallet: () => api.get('/user/wallet'),
  createTicket: (data: any) => api.post('/user/tickets', data),
  getTickets: () => api.get('/user/tickets'),
};

export default api;
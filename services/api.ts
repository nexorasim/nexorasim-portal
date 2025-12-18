import axios, { AxiosError } from 'axios';
import { ENV } from '../config/env';
import { getAuthToken } from '../utils/auth';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token and request id, support cancellation via AbortController provided by caller
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  (config.headers as any)['x-client'] = 'nexorasim-app';
  return config;
});

// Normalize errors and handle retry-after if provided
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message || error.message;
    const normalized = new Error(`API ${status || 'ERR'}: ${message}`);
    (normalized as any).status = status;
    return Promise.reject(normalized);
  }
);

export const authAPI = {
  login: (email: string, password: string, signal?: AbortSignal) =>
    api.post('/auth/login', { email, password }, { signal }),
  register: (data: any, signal?: AbortSignal) => api.post('/auth/register', data, { signal }),
  verifyOTP: (phone: string, otp: string, signal?: AbortSignal) =>
    api.post('/auth/verify-otp', { phone, otp }, { signal }),
  sendOTP: (phone: string, signal?: AbortSignal) => api.post('/auth/send-otp', { phone }, { signal }),
  googleAuth: (token: string, signal?: AbortSignal) => api.post('/auth/google', { token }, { signal }),
};

export const esimAPI = {
  getPlans: (signal?: AbortSignal) => api.get('/esim/plans', { signal }),
  getPlan: (id: string, signal?: AbortSignal) => api.get(`/esim/plans/${id}`, { signal }),
  purchasePlan: (planId: string, paymentData: any, signal?: AbortSignal) =>
    api.post('/esim/purchase', { plan_id: planId, ...paymentData }, { signal }),
  getOrders: (signal?: AbortSignal) => api.get('/esim/orders', { signal }),
  activateESIM: (orderId: string, signal?: AbortSignal) => api.post(`/esim/activate/${orderId}`, undefined, { signal }),
};

export const paymentAPI = {
  getMethods: (signal?: AbortSignal) => api.get('/payment/methods', { signal }),
  processPayment: (data: any, signal?: AbortSignal) => api.post('/payment/process', data, { signal }),
  addFunds: (amount: number, method: string, signal?: AbortSignal) => api.post('/payment/add-funds', { amount, method }, { signal }),
};

export const userAPI = {
  getProfile: (signal?: AbortSignal) => api.get('/user/profile', { signal }),
  updateProfile: (data: any, signal?: AbortSignal) => api.put('/user/profile', data, { signal }),
  getWallet: (signal?: AbortSignal) => api.get('/user/wallet', { signal }),
  createTicket: (data: any, signal?: AbortSignal) => api.post('/user/tickets', data, { signal }),
  getTickets: (signal?: AbortSignal) => api.get('/user/tickets', { signal }),
};

export default api;
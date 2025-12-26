import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRooms = () => api.get('/rooms');
export const bookRoom = (roomId, bookingData) => api.post(`/bookings/${roomId}`, bookingData);
export const createPayment = (amount) => api.post('/payments/create-order', { amount });
export const verifyPayment = (paymentData) => api.post('/payments/verify-payment', paymentData);

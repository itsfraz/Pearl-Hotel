import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const bookingService = {
  // User functions
  createBooking: async (bookingData) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(`${API_URL}/bookings`, bookingData, config);
    return response.data;
  },

  getMyBookings: async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/bookings`, config);
    return response.data;
  },

  getBookingById: async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/bookings/${id}`, config);
    return response.data;
  },

  cancelBooking: async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.put(`${API_URL}/bookings/${id}/cancel`, {}, config);
    return response.data;
  },

  // Admin functions
  getAllBookings: async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/bookings/admin`, config);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.put(`${API_URL}/bookings/${id}/status`, { status }, config);
    return response.data;
  }
};

export default bookingService;

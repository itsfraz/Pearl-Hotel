import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const spaService = {
  getAllServices: async () => {
    const response = await axios.get(`${API_URL}/spa`);
    return response.data;
  },

  getAllServicesAdmin: async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/spa/admin`, config);
    return response.data;
  },

  getServiceById: async (id) => {
    const response = await axios.get(`${API_URL}/spa/${id}`);
    return response.data;
  },

  createService: async (serviceData) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/spa`, serviceData, config);
    return response.data;
  },

  updateService: async (id, serviceData) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/spa/${id}`, serviceData, config);
    return response.data;
  },

  deleteService: async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/spa/${id}`, config);
    return response.data;
  },

  createBooking: async (bookingData) => {
    // Optional: Add auth token if user is logged in, but route is public for now
    // We can conditionally add it
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.post(`${API_URL}/spa/bookings`, bookingData, config);
    return response.data;
  }
};

export default spaService;

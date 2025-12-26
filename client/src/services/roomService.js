import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const roomService = {
  getAllRooms: async () => {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data;
  },

  getRoomById: async (id) => {
    const response = await axios.get(`${API_URL}/rooms/${id}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/bookings`, bookingData, config);
    return response.data;
  },

  // Admin methods
  createRoom: async (roomData) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/rooms`, roomData, config);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/rooms/${id}`, roomData, config);
    return response.data;
  },

  deleteRoom: async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/rooms/${id}`, config);
    return response.data;
  }
};

export default roomService;

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const eventService = {
  // Venues
  getVenues: async () => {
    const response = await axios.get(`${API_URL}/events/venues`);
    return response.data;
  },
  
  // Packages
  getPackages: async () => {
    const response = await axios.get(`${API_URL}/events/packages`);
    return response.data;
  },

  // Enquiries
  createEnquiry: async (enquiryData) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.post(`${API_URL}/events/enquiries`, enquiryData, config);
    return response.data;
  },

  // Admin
  getAllVenuesAdmin: async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/events/venues/admin`, config);
    return response.data;
  },

  // Admin Stats
  getEventStats: async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/events/stats`, config);
    return response.data;
  },

  getAllPackagesAdmin: async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/events/packages/admin`, config);
    return response.data;
  },
  createPackage: async (data) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/events/packages`, data, config);
    return response.data;
  },
  updatePackage: async (id, data) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/events/packages/${id}`, data, config);
    return response.data;
  },
  deletePackage: async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/events/packages/${id}`, config);
    return response.data;
  },

  // Event Types
  getAllEventTypesAdmin: async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/events/event-types/admin`, config);
    return response.data;
  },
  createEventType: async (data) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/events/event-types`, data, config);
    return response.data;
  },
  updateEventType: async (id, data) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/events/event-types/${id}`, data, config);
    return response.data;
  },
  deleteEventType: async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/events/event-types/${id}`, config);
    return response.data;
  },

  // Catering
  getAllCateringAdmin: async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/events/catering/admin`, config);
    return response.data;
  },
  createCatering: async (data) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/events/catering`, data, config);
    return response.data;
  },
  updateCatering: async (id, data) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/events/catering/${id}`, data, config);
    return response.data;
  },
  deleteCatering: async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/events/catering/${id}`, config);
    return response.data;
  },

  getAllEnquiriesAdmin: async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/events/enquiries`, config);
    return response.data;
  },

  createVenue: async (data) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/events/venues`, data, config);
    return response.data;
  },
  
  updateVenue: async (id, data) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/events/venues/${id}`, data, config);
    return response.data;
  },

  deleteVenue: async (id) => {
     const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/events/venues/${id}`, config);
    return response.data;
  },
  
  updateEnquiryStatus: async (id, status) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/events/enquiries/${id}`, { status }, config);
    return response.data;
  }
};

export default eventService;

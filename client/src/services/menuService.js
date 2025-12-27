import axios from 'axios';

const API_URL = 'http://localhost:5000/api/menu';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all menu items
const getAllMenuItems = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.restaurant) params.append('restaurant', filters.restaurant);
    if (filters.isAvailable !== undefined) params.append('isAvailable', filters.isAvailable);
    
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single menu item
const getMenuItem = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create menu item (Admin only)
const createMenuItem = async (menuData) => {
  try {
    const response = await axios.post(API_URL, menuData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (id, menuData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, menuData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete menu item (Admin only)
const deleteMenuItem = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Toggle menu item availability (Admin only)
const toggleMenuItemAvailability = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/toggle-availability`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const menuService = {
  getAllMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability
};

export default menuService;

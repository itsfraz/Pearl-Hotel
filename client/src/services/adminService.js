import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getDashboardStats = async () => {
    const token = authService.getToken();
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/bookings/stats`, config);
    return response.data;
};

const adminService = {
    getDashboardStats
};

export default adminService;

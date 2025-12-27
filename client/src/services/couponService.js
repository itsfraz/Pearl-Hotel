import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getCoupons = async () => {
    const token = authService.getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/coupons`, config);
    return response.data;
};

const createCoupon = async (couponData) => {
    const token = authService.getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/coupons`, couponData, config);
    return response.data;
};

const deleteCoupon = async (id) => {
    const token = authService.getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/coupons/${id}`, config);
    return response.data;
};

const couponService = {
    getCoupons,
    createCoupon,
    deleteCoupon
};

export default couponService;

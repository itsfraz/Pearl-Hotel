import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { FaCalendarAlt, FaDoorOpen, FaCreditCard, FaDownload, FaUser, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const currentUser = await authService.getCurrentUser();
            
            if (!currentUser) {
                setError('Please login to view your profile');
                setLoading(false);
                return;
            }
            
            setUser(currentUser);

            const token = authService.getToken();
            if (!token) {
                setError('Authentication required');
                setLoading(false);
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            
            const res = await axios.get(`${API_URL}/bookings`, config);
            setBookings(res.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.response?.data?.message || 'Failed to load profile data');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        
        try {
            const token = authService.getToken();
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            
            await axios.put(`${API_URL}/bookings/${id}/cancel`, {}, config);
            
            // Refresh bookings
            await fetchData();
            
            toast.success("Booking cancelled successfully!");
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error(error.response?.data?.message || "Failed to cancel booking");
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Confirmed': 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase',
            'Cancelled': 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase',
            'Completed': 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase',
            'Pending': 'px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase'
        };
        
        return <span className={badges[status] || badges['Pending']}>{status || 'Pending'}</span>;
    };

    const calculateNights = (checkIn, checkOut) => {
        const nights = Math.max(1, Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
        ));
        return nights;
    };

    const filteredBookings = bookings.filter(b => {
        const isPast = new Date(b.checkOut) < new Date();
        return activeTab === 'upcoming' 
            ? !isPast && b.status !== 'Cancelled' 
            : (isPast || b.status === 'Cancelled');
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-surface-50 pt-24 flex items-center justify-center px-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUser className="text-3xl text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Required</h2>
                    <p className="text-slate-600 mb-6">{error || 'Please login to view your profile'}</p>
                    <a 
                        href="/login" 
                        className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 pt-24 px-4 pb-20">
            <div className="container mx-auto max-w-6xl">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-8">
                    <div className="bg-gradient-to-r from-primary to-slate-800 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold font-display border-4 border-white/30">
                                {user.firstName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/90">
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-secondary" />
                                        <span>{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-secondary" />
                                            <span>{user.phone}</span>
                                        </div>
                                    )}
                                    {user.idType && user.idNumber && (
                                        <div className="flex items-center gap-2">
                                            <FaIdCard className="text-secondary" />
                                            <span>{user.idType}: {user.idNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {user.isAdmin && (
                                <div className="px-4 py-2 bg-secondary text-primary font-bold rounded-full text-sm">
                                    ADMIN
                                </div>
                            )}
                        </div>
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-8">
                        <h2 className="text-2xl font-display font-bold text-primary mb-6">My Bookings</h2>
                        
                        {/* Tabs */}
                        <div className="flex gap-8 border-b border-slate-100 mb-8">
                            <button 
                                onClick={() => setActiveTab('upcoming')}
                                className={`pb-4 px-2 font-bold text-sm uppercase tracking-wider transition-all ${
                                    activeTab === 'upcoming' 
                                        ? 'text-primary border-b-2 border-primary' 
                                        : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                Upcoming Stays ({bookings.filter(b => new Date(b.checkOut) >= new Date() && b.status !== 'Cancelled').length})
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`pb-4 px-2 font-bold text-sm uppercase tracking-wider transition-all ${
                                    activeTab === 'history' 
                                        ? 'text-primary border-b-2 border-primary' 
                                        : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                Booking History ({bookings.filter(b => new Date(b.checkOut) < new Date() || b.status === 'Cancelled').length})
                            </button>
                        </div>

                        {/* Bookings List */}
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaCalendarAlt className="text-3xl text-slate-400" />
                                </div>
                                <p className="text-slate-500 mb-4 text-lg">No bookings found in this category.</p>
                                <a 
                                    href="/rooms" 
                                    className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Browse Rooms
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredBookings.map(booking => (
                                    <div 
                                        key={booking._id} 
                                        className="bg-surface-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-4 mb-3">
                                                    {getStatusBadge(booking.status)}
                                                    <span className="text-xs font-mono text-slate-400">
                                                        ID: {booking._id?.slice(-6).toUpperCase()}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-500">
                                                        {calculateNights(booking.checkIn, booking.checkOut)} Night(s)
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-xl font-display font-bold text-primary mb-3">
                                                    {booking.room?.name || booking.room?.type || "Room"} 
                                                    {booking.room?.roomNumber && ` - #${booking.room.roomNumber}`}
                                                </h3>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-secondary" />
                                                        <span>
                                                            {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                                                                month: 'short', day: 'numeric', year: 'numeric' 
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-secondary" />
                                                        <span>
                                                            {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                                                                month: 'short', day: 'numeric', year: 'numeric' 
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaCreditCard className="text-secondary" />
                                                        <span className="font-bold">₹{booking.totalPrice?.toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                {booking.specialRequests && (
                                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                        <p className="text-xs text-blue-600 font-semibold mb-1">Special Requests:</p>
                                                        <p className="text-sm text-slate-700">{booking.specialRequests}</p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-row lg:flex-col items-center gap-3">
                                                {booking.status === 'Confirmed' && activeTab === 'upcoming' && (
                                                    <button 
                                                        onClick={() => handleCancel(booking._id)}
                                                        className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                )}
                                                <button className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                                                    <FaDownload /> Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

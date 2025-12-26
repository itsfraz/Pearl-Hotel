import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { FaCalendarAlt, FaDoorOpen, FaCreditCard, FaTimes, FaDownload } from 'react-icons/fa';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);

                if (currentUser) {
                    const token = authService.getToken();
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    const res = await axios.get('/api/bookings', config);
                    setBookings(res.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            const token = await authService.getToken();
            await axios.put(`/api/bookings/${id}/cancel`, {}, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh bookings
            const res = await axios.get('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
            setBookings(res.data);
            alert("Booking cancelled successfully.");
        } catch (error) {
            alert("Failed to cancel booking.");
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Confirmed': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Confirmed</span>;
            case 'Cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Cancelled</span>;
            case 'Completed': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Completed</span>;
            default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">Pending</span>;
        }
    };

    const filteredBookings = bookings.filter(b => {
        const isPast = new Date(b.checkOut) < new Date();
        return activeTab === 'upcoming' ? !isPast && b.status !== 'Cancelled' : (isPast || b.status === 'Cancelled');
    });

    if (!user) return <div className="p-10 text-center">Please login.</div>;

    return (
        <div className="min-h-screen bg-surface-50 pt-24 px-4 pb-20">
            <div className="container mx-auto max-w-5xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-primary p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold font-display">
                                {user.firstName[0]}
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold">Hello, {user.firstName}!</h1>
                                <p className="text-white/70">{user.email}</p>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="p-8">
                        <div className="flex gap-8 border-b border-slate-100 mb-8">
                            <button 
                                onClick={() => setActiveTab('upcoming')}
                                className={`pb-4 px-2 font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Upcoming Stays
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`pb-4 px-2 font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Booking History
                            </button>
                        </div>

                        {loading ? (
                             <div className="flex justify-center p-10"><div className="animate-spin w-10 h-10 border-2 border-primary rounded-full border-t-transparent"></div></div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-500 mb-4">No bookings found in this category.</p>
                                <a href="/rooms" className="text-primary font-bold hover:underline">Find a room</a>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredBookings.map(booking => (
                                    <div key={booking._id} className="bg-surface-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:shadow-md transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                {getStatusBadge(booking.status)}
                                                <span className="text-xs font-mono text-slate-400">ID: {booking._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <h3 className="text-xl font-display font-bold text-primary mb-2">{booking.room?.name || "Room"}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-secondary" />
                                                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaDoorOpen className="text-secondary" />
                                                    {booking.room?.roomNumber}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaCreditCard className="text-secondary" />
                                                    ₹{booking.totalPrice}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {booking.status === 'Confirmed' && activeTab === 'upcoming' && (
                                                <button 
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            {/* Invoice Download Mock */}
                                            <button className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                                                <FaDownload /> Invoice
                                            </button>
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

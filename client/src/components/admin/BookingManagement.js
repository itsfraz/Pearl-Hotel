import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import { FaSearch, FaTimes } from 'react-icons/fa';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getAllBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingService.cancelBooking(id);
                // Refresh bookings
                const data = await bookingService.getAllBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to cancel booking", error);
                alert("Failed to cancel booking");
            }
        }
    };

    const filteredBookings = bookings.filter(booking => 
        booking._id.toLowerCase().includes(filter.toLowerCase()) ||
        booking.user?.email.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading bookings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-slate-800">Booking Management</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search Booking ID or Email..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none w-64"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-4">Booking ID</th>
                                <th className="p-4">Guest</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Dates</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.map(booking => (
                                <tr key={booking._id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4 font-mono text-xs text-slate-500">{booking._id.substring(0, 8)}...</td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{booking.user?.firstName} {booking.user?.lastName}</div>
                                        <div className="text-xs text-slate-500">{booking.user?.email}</div>
                                    </td>
                                    <td className="p-4 text-slate-700">{booking.room?.type} <span className="text-xs text-slate-400">({booking.room?.roomNumber})</span></td>
                                    <td className="p-4 text-sm text-slate-600">
                                        <div>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</div>
                                        <div>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4 font-bold text-slate-800">₹{booking.totalPrice}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {booking.status ? booking.status.toUpperCase() : 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {booking.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleCancel(booking._id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                                title="Cancel Booking"
                                            >
                                                <FaTimes />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">No bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;

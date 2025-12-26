import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import { FaSearch, FaTimes, FaCalendarAlt, FaUser, FaDoorOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getAllBookings();
            setBookings(data || []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingService.cancelBooking(id);
                toast.success("Booking cancelled successfully");
                // Refresh bookings
                await fetchBookings();
            } catch (error) {
                console.error("Failed to cancel booking", error);
                toast.error(error.response?.data?.message || "Failed to cancel booking");
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Confirmed': 'bg-green-100 text-green-700',
            'Cancelled': 'bg-red-100 text-red-700',
            'Completed': 'bg-blue-100 text-blue-700',
            'Pending': 'bg-yellow-100 text-yellow-700'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${badges[status] || badges['Pending']}`}>
                {status || 'Pending'}
            </span>
        );
    };

    const calculateNights = (checkIn, checkOut) => {
        return Math.max(1, Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
        ));
    };

    const filteredBookings = bookings.filter(booking => 
        booking._id?.toLowerCase().includes(filter.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(filter.toLowerCase()) ||
        booking.user?.firstName?.toLowerCase().includes(filter.toLowerCase()) ||
        booking.user?.lastName?.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-500">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-slate-800">Booking Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Total Bookings: {bookings.length}</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Search Booking ID, Email, or Name..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-80"
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
                                <th className="p-4">Nights</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.map(booking => (
                                <tr key={booking._id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-mono text-xs text-slate-500">
                                            {booking._id?.substring(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                                {booking.user?.firstName?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800">
                                                    {booking.user?.firstName} {booking.user?.lastName}
                                                </div>
                                                <div className="text-xs text-slate-500">{booking.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-700">
                                            {booking.room?.name || booking.room?.type || 'Room'}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            #{booking.room?.roomNumber}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <FaCalendarAlt className="text-secondary text-xs" />
                                            <span>{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaCalendarAlt className="text-secondary text-xs" />
                                            <span>{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="font-bold text-slate-700">
                                            {calculateNights(booking.checkIn, booking.checkOut)}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-800">
                                        ₹{booking.totalPrice?.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="p-4 text-right">
                                        {booking.status !== 'Cancelled' && (
                                            <button 
                                                onClick={() => handleCancel(booking._id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center gap-2 text-sm font-medium"
                                                title="Cancel Booking"
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center">
                                        <div className="text-slate-400">
                                            <FaCalendarAlt className="text-4xl mx-auto mb-3 opacity-50" />
                                            <p className="text-lg font-medium">No bookings found</p>
                                            <p className="text-sm mt-1">
                                                {filter ? 'Try a different search term' : 'Bookings will appear here'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Bookings</div>
                    <div className="text-2xl font-bold text-slate-800">{bookings.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Confirmed</div>
                    <div className="text-2xl font-bold text-green-600">
                        {bookings.filter(b => b.status === 'Confirmed').length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pending</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {bookings.filter(b => b.status === 'Pending').length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cancelled</div>
                    <div className="text-2xl font-bold text-red-600">
                        {bookings.filter(b => b.status === 'Cancelled').length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;

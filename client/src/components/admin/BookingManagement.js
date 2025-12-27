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

    const handleUpdateStatus = async (id, status) => {
        try {
            await bookingService.updateStatus(id, status);
            toast.success(`Booking marked as ${status}`);
            await fetchBookings();
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update booking status");
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
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-4 pl-6">Booking Details</th>
                                <th className="p-4">Guest</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Dates</th>
                                <th className="p-4">Nights</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.map(booking => (
                                <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="font-mono text-xs text-slate-500 bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                                            #{booking._id?.substring(0, 8)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/10">
                                                {booking.user?.firstName?.[0]?.toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="font-semibold text-slate-700 text-sm">
                                                    {booking.user?.firstName} {booking.user?.lastName}
                                                </div>
                                                <div className="text-[10px] text-slate-400">{booking.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-700 text-sm">
                                            {booking.room?.name || booking.room?.type || 'Room'}
                                        </div>
                                        <div className="text-[11px] text-slate-400 font-mono">
                                            Room {booking.room?.roomNumber}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-slate-600">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                {new Date(booking.checkIn).toLocaleDateString('en-US', { disable_year: 'true', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                {new Date(booking.checkOut).toLocaleDateString('en-US', { disable_year: 'true', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="font-bold text-slate-700 text-sm bg-slate-50 px-2 py-1 rounded">
                                            {calculateNights(booking.checkIn, booking.checkOut)}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-800 text-sm">
                                        ₹{booking.totalPrice?.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                            {booking.status === 'Confirmed' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking._id, 'Completed')}
                                                    className="bg-green-50 text-green-600 hover:bg-green-100 p-2 rounded-lg transition-colors mr-2"
                                                    title="Complete Stay"
                                                >
                                                    <FaDoorOpen />
                                                </button>
                                            )}
                                            {booking.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors mr-2"
                                                    title="Confirm Booking"
                                                >
                                                    <FaCalendarAlt />
                                                </button>
                                            )}
                                            {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                                <button 
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                                    title="Cancel Booking"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center text-slate-400">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-slate-50">
                   {filteredBookings.map(booking => (
                       <div key={booking._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                           <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-50">
                               <div>
                                   <div className="flex items-center gap-2 mb-1">
                                       <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#{booking._id?.substring(0,6)}</span>
                                       {getStatusBadge(booking.status)}
                                   </div>
                                   <h4 className="font-semibold text-slate-800 text-sm">
                                       {booking.user?.firstName} {booking.user?.lastName}
                                   </h4>
                               </div>
                               <div className="text-right">
                                   <div className="font-bold text-slate-800">₹{booking.totalPrice?.toLocaleString()}</div>
                                   <div className="text-[10px] text-slate-500">{calculateNights(booking.checkIn, booking.checkOut)} Nights</div>
                               </div>
                           </div>
                           
                           <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
                               <div className="flex flex-col gap-1 text-xs">
                                   <div className="flex items-center gap-1.5">
                                       <FaCalendarAlt className="text-green-500 text-[10px]" />
                                       <span>{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                   </div>
                                    <div className="flex items-center gap-1.5">
                                       <FaCalendarAlt className="text-red-500 text-[10px]" />
                                       <span>{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                   </div>
                               </div>
                               <div className="text-right text-xs">
                                   <div className="font-medium text-slate-700">{booking.room?.name || booking.room?.type}</div>
                                   <div className="text-slate-400">Room {booking.room?.roomNumber}</div>
                               </div>
                           </div>

                           <div className="grid grid-cols-2 gap-2">
                                {booking.status === 'Confirmed' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(booking._id, 'Completed')}
                                        className="col-span-2 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaDoorOpen /> Complete Stay
                                    </button>
                                )}
                                {booking.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                                        className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaCalendarAlt /> Confirm
                                    </button>
                                )}
                                {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                    <button 
                                        onClick={() => handleCancel(booking._id)}
                                        className={`py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2 ${booking.status === 'Pending' ? 'flex-1' : 'col-span-2'}`}
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                )}
                           </div>
                       </div>
                   ))}
                   {filteredBookings.length === 0 && (
                       <div className="text-center p-8 text-slate-400">
                           No bookings found.
                       </div>
                   )}
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

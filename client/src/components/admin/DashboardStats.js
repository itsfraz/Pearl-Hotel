import React from 'react';
import { FaBed, FaUser, FaMoneyBillWave, FaCalendarCheck } from 'react-icons/fa';

const DashboardStats = () => {
    // Placeholder data
    const stats = [
        { label: 'Total Bookings', value: '1,248', icon: <FaCalendarCheck />, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Total Revenue', value: '₹4,52,000', icon: <FaMoneyBillWave />, color: 'bg-green-500', trend: '+8.5%' },
        { label: 'Active Rooms', value: '45/50', icon: <FaBed />, color: 'bg-purple-500', trend: '90%' },
        { label: 'New Guests', value: '128', icon: <FaUser />, color: 'bg-orange-500', trend: '+22%' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                            <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                                {stat.trend}
                            </span>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex flex-col justify-center items-center text-slate-400">
                    <p>Revenue Chart Placeholder</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex flex-col justify-center items-center text-slate-400">
                    <p>Booking Trends Placeholder</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;

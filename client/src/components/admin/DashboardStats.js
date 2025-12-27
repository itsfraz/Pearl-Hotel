import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FaBed, FaUser, FaMoneyBillWave, FaCalendarCheck, FaSpinner } from 'react-icons/fa';
import adminService from '../../services/adminService';

const DashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
      <div className="animate-fade-in space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="bg-white/50 animate-pulse h-32 rounded-2xl shadow-sm border border-slate-100"></div>
           ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white/50 animate-pulse h-96 rounded-2xl shadow-sm border border-slate-100"></div>
           <div className="bg-white/50 animate-pulse h-96 rounded-2xl shadow-sm border border-slate-100"></div>
        </div>
      </div>
    );
    
    if (error) return <div className="text-red-500 p-6 bg-red-50 rounded-xl border border-red-100">{error}</div>;
    if (!stats) return null;

    // Process Data for Charts
    const revenueData = stats.monthlyRevenue.map(item => ({
        name: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }),
        revenue: item.revenue,
        bookings: item.bookings
    }));

    const statusData = stats.statusCounts.map(item => ({
        name: item._id,
        value: item.count
    }));

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']; // Modern palette: Indigo, Emerald, Amber, Red

    const summaryCards = [
        { 
            label: 'Total Bookings', 
            value: stats.totalBookings, 
            icon: <FaCalendarCheck />, 
            color: 'bg-blue-500/10 text-blue-600',
            trend: 'Lifetime',
            trendColor: 'text-blue-600 bg-blue-50'
        },
        { 
            label: 'Total Revenue', 
            value: `₹${stats.totalRevenue.toLocaleString()}`, 
            icon: <FaMoneyBillWave />, 
            color: 'bg-emerald-500/10 text-emerald-600',
            trend: 'Net Income',
            trendColor: 'text-emerald-600 bg-emerald-50'
        },
        { 
            label: 'Pending', 
            value: stats.statusCounts.find(s => s._id === 'Pending')?.count || 0, 
            icon: <FaUser />, 
            color: 'bg-amber-500/10 text-amber-600',
            trend: 'Action Needed',
            trendColor: 'text-amber-600 bg-amber-50'
        },
        { 
            label: 'Confirmed', 
            value: stats.statusCounts.find(s => s._id === 'Confirmed')?.count || 0, 
            icon: <FaBed />, 
            color: 'bg-indigo-500/10 text-indigo-600',
            trend: 'Active',
            trendColor: 'text-indigo-600 bg-indigo-50'
        },
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back! Here's what's happening today.</p>
               </div>
               <div className="flex gap-2">
                  {/* Date Filter or Export could go here */}
               </div>
            </div>
            
             {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${stat.color} dark:bg-opacity-20`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.trendColor} dark:bg-opacity-20`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-1 font-display">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display">Revenue Trends</h3>
                        {/* Legend or actions */}
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="name" 
                                    tick={{fill: '#94a3b8', fontSize: 12}} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    dy={10}
                                />
                                <YAxis 
                                    tick={{fill: '#94a3b8', fontSize: 12}} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value/1000}k`}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                                        padding: '12px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                    }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Booking Status Pie Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-slate-700 flex flex-col transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display mb-6">Booking Status</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value) => <span className="text-slate-500 dark:text-slate-400 text-sm font-medium ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;

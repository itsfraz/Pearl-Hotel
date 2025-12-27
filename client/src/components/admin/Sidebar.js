import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBed, FaCalendarCheck, FaTags, FaChartLine, FaUsers, FaHome, FaUtensils } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <FaChartLine />, label: 'Dashboard', exact: true },
    { path: '/admin/rooms', icon: <FaBed />, label: 'Rooms' },
    { path: '/admin/bookings', icon: <FaCalendarCheck />, label: 'Bookings' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/menu', icon: <FaUtensils />, label: 'Menu' },
    { path: '/admin/coupons', icon: <FaTags />, label: 'Coupons' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary font-display font-bold text-xl">
           P
        </div>
        <span className="font-display font-bold text-xl">Pearl<span className="text-secondary">Hotel</span></span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  (item.exact && location.pathname === item.path) || (!item.exact && location.pathname.startsWith(item.path))
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mb-1">
          <FaHome />
          <span className="font-medium text-sm">Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

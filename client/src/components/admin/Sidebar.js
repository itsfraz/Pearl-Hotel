import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBed, FaCalendarCheck, FaTags, FaChartLine, FaUsers, FaHome, FaUtensils } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
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
    <>
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-primary/30">
               P
            </div>
            <span className="font-display font-bold text-xl tracking-wide">Pearl<span className="text-secondary">Hotel</span></span>
          </div>
          {/* Mobile Close Button */}
          {/* Note: We rely on the parent (AdminDashboard) to provide the close function via overlay, 
             but having a button here is good UX for mobile */}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <div className="px-6 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Main Menu
          </div>
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose && onClose()} // Close on mobile click
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    (item.exact && location.pathname === item.path) || (!item.exact && location.pathname.startsWith(item.path))
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 translate-x-1'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <span className={`text-lg transition-transform duration-200 ${
                    (item.exact && location.pathname === item.path) || (!item.exact && location.pathname.startsWith(item.path)) ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm tracking-wide">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="px-3">
             <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200 group">
              <FaHome className="group-hover:text-primary transition-colors" />
              <span className="font-medium text-sm">Back to Home</span>
            </Link>
          </div>
          <div className="mt-4 px-4 text-xs text-slate-600 text-center">
            v1.0.0 Admin Panel
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

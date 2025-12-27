import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../../services/authService';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Positioned Fixed */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${isSidebarOpen ? 'lg:ml-64' : 'ml-0 lg:ml-64'}`}>
        
        {/* Top Navbar */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm transition-colors duration-300">
           <div className="flex items-center gap-4">
              {/* Mobile Hamburger Toggle */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Sidebar"
              >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
              </button>

              <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white hidden sm:block">Admin Panel</h2>
              <span className="sm:hidden font-display font-bold text-lg text-slate-800 dark:text-white">PearlHotel</span>
           </div>

           <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-slate-400 hover:text-primary dark:text-slate-400 dark:hover:text-yellow-400 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                 {isDarkMode ? (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                 )}
              </button>

              {/* Notifications (Placeholder) */}
              <button className="p-2 text-slate-400 hover:text-primary dark:hover:text-sky-400 transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
              </button>

              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Administrator</div>
                  </div>
                  
                  <div className="group relative">
                    <button className="flex items-center gap-2 focus:outline-none">
                       <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md ring-2 ring-white dark:ring-slate-700 transition-transform group-hover:scale-105">
                         {user.firstName[0]}{user.lastName[0]}
                       </div>
                    </button>
                    
                    {/* Simplified Dropdown on Hover/Focus could go here, for now using direct button next to it */}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    title="Logout"
                  >
                    <FaSignOutAlt className="text-lg" />
                  </button>
                </div>
              )}
           </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

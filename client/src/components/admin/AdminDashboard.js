import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../../services/authService';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
           <h2 className="font-bold text-xl text-slate-800">Admin Panel</h2>
           <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                    title="Logout"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              )}
           </div>
        </header>

        <main className="p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

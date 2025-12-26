import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
           <h2 className="font-bold text-lg text-slate-800">Admin Panel</h2>
           <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">Welcome, Admin</div>
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">A</div>
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

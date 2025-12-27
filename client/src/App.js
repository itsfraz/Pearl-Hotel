import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import RoomList from './components/RoomList';
import RoomDetails from './components/RoomDetails';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Amenities from './components/Amenities';
import Dining from './components/Dining';
import Contact from './components/Contact';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import RoomManagement from './components/admin/RoomManagement';
import BookingManagement from './components/admin/BookingManagement';
import UserManagement from './components/admin/UserManagement';
import MenuManagement from './components/admin/MenuManagement';
import DashboardStats from './components/admin/DashboardStats';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Navbar />
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/rooms/:id/details" element={<RoomDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/dining" element={<Dining />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute isAdmin><AdminDashboard /></ProtectedRoute>}>
                <Route index element={<DashboardStats />} />
                <Route path="rooms" element={<RoomManagement />} />
                <Route path="bookings" element={<BookingManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="coupons" element={<div className="p-10 text-center">Coupon Management Coming Soon</div>} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
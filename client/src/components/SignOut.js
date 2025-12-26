import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    authService.logout(); // Clear user session
    navigate('/login'); // Redirect to login page
  };

  return (
    <button
      onClick={handleSignOut}
      className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
    >
      Logout
    </button>
  );
};

export default SignOut;

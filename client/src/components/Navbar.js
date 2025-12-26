import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    };

    fetchUser();
    
    const handleStorageChange = async () => {
       const userData = await authService.getCurrentUser();
       setUser(userData);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300
          ${
            isActive
              ? "text-secondary-dark"
              : "text-slate-600 hover:text-primary"
          }
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {children}
        <span
          className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-secondary transform -translate-x-1/2 transition-all duration-300
          ${isActive ? "w-1/2" : "group-hover:w-1/3"}`}
        />
      </Link>
    );
  };

  return (
    <nav 
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 border-b border-transparent
        ${isScrolled || isMobileMenuOpen 
          ? "bg-white/80 backdrop-blur-md shadow-sm border-slate-200 py-3" 
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2"
          >
            <div className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary font-display font-bold text-xl transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              P
            </div>
            <span className={`font-display font-bold text-2xl tracking-tighter transition-colors duration-300
              ${isScrolled || isMobileMenuOpen ? "text-primary" : "text-white mix-blend-difference"}
            `}>
              Pearl<span className="text-secondary">Hotel</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-2 
             ${isScrolled ? "text-slate-800" : "text-white mix-blend-difference"}
          `}>
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/rooms">ROOMS</NavLink>
            <NavLink to="/contact">CONTACT</NavLink>
            
            <div className="w-px h-6 bg-current opacity-20 mx-4"></div>

            {user ? (
                <div className="flex items-center gap-4">
                  {user.isAdmin && (
                    <Link to="/admin" className="text-sm font-bold text-secondary hover:text-white transition-colors border border-secondary px-3 py-1 rounded-full uppercase tracking-wider">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all">
                    <FaUserCircle className="text-xl opacity-80" />
                    <span className="text-sm font-medium">
                      {user.firstName}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium hover:text-secondary transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-full hover:bg-secondary-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 shadow-md shadow-secondary/20"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 text-2xl transition-colors duration-300
              ${isScrolled || isMobileMenuOpen ? "text-primary" : "text-white"}
            `}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl transition-all duration-300 origin-top overflow-hidden
            ${isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col p-6 space-y-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-700 hover:text-primary">Home</Link>
            <Link to="/rooms" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-700 hover:text-primary">Rooms</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-700 hover:text-primary">Contact</Link>
            <hr className="border-slate-100" />
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 mb-4 p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors">
                   <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center font-bold font-display">
                      {user.firstName[0]}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-primary">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                   </div>
                </Link>
                <button onClick={handleLogout} className="w-full py-3 text-center text-white bg-slate-900 rounded-lg font-bold shadow-lg">Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 text-center bg-secondary text-primary rounded-lg font-bold shadow-lg hover:bg-secondary-dark">Book Now</Link>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 text-center text-slate-600 font-medium hover:text-primary">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
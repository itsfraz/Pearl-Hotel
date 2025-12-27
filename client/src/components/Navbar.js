import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaUser, FaCrown } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className="group relative px-4 py-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <span className={`text-sm font-semibold tracking-wide transition-all duration-300
          ${isActive 
            ? "text-secondary" 
            : isScrolled 
              ? "text-slate-700 hover:text-secondary" 
              : "text-white hover:text-secondary"
          }
        `}>
          {children}
        </span>
        <span
          className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent transform -translate-x-1/2 transition-all duration-300
          ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"}`}
        />
      </Link>
    );
  };

  // Hide navbar on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav 
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 ease-out
        ${isScrolled || isMobileMenuOpen 
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50 py-3" 
          : "bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm py-5"
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 relative z-10"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-secondary font-display font-bold text-xl transition-all duration-500 shadow-lg
              ${isScrolled ? 'scale-95 shadow-md' : 'scale-100 shadow-xl shadow-black/20'}
              group-hover:scale-110 group-hover:rotate-6
            `}>
              P
            </div>
            <div className="flex flex-col -space-y-1">
              <span className={`font-display font-bold text-2xl tracking-tight transition-all duration-300
                ${isScrolled || isMobileMenuOpen ? "text-primary" : "text-white drop-shadow-lg"}
              `}>
                Pearl<span className="text-secondary">Hotel</span>
              </span>
              <span className={`text-[10px] font-medium tracking-widest uppercase transition-all duration-300
                ${isScrolled || isMobileMenuOpen ? "text-slate-500" : "text-white/80"}
              `}>
                Luxury & Comfort
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/rooms">ROOMS</NavLink>
            <NavLink to="/contact">CONTACT</NavLink>
            
            <div className={`w-px h-6 mx-4 transition-colors duration-300
              ${isScrolled ? "bg-slate-300" : "bg-white/30"}
            `}></div>

            {user ? (
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 border-2
                      ${isScrolled 
                        ? "border-secondary text-secondary hover:bg-secondary hover:text-white" 
                        : "border-secondary/80 text-secondary hover:bg-secondary hover:text-white hover:border-secondary"
                      }
                    `}
                  >
                    <FaCrown className="text-sm" />
                    Admin
                  </Link>
                )}
                
                {/* User Menu Dropdown */}
                <div className="user-menu-container relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300
                      ${isScrolled 
                        ? "hover:bg-slate-100" 
                        : "hover:bg-white/10"
                      }
                    `}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className={`text-sm font-semibold transition-colors duration-300
                        ${isScrolled ? "text-slate-800" : "text-white"}
                      `}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div className={`text-xs transition-colors duration-300
                        ${isScrolled ? "text-slate-500" : "text-white/70"}
                      `}>
                        {user.email}
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
                      <div className="p-4 bg-gradient-to-br from-primary to-primary-light text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <div className="font-semibold">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-white/80">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-primary"
                        >
                          <FaUser className="text-slate-400" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
                        >
                          <FaSignOutAlt className="text-red-400" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300
                    ${isScrolled 
                      ? "text-slate-700 hover:text-primary hover:bg-slate-100" 
                      : "text-white hover:bg-white/10"
                    }
                  `}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="group relative px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-secondary to-secondary-dark rounded-full overflow-hidden shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                >
                  <span className="relative z-10">Book Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2.5 rounded-lg text-2xl transition-all duration-300
              ${isScrolled || isMobileMenuOpen 
                ? "text-primary hover:bg-slate-100" 
                : "text-white hover:bg-white/10"
              }
            `}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl transition-all duration-500 origin-top overflow-hidden
            ${isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col p-6 space-y-3">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`text-lg font-semibold px-4 py-3 rounded-xl transition-all duration-300
                ${location.pathname === '/' 
                  ? 'bg-secondary/10 text-secondary' 
                  : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                }
              `}
            >
              Home
            </Link>
            <Link 
              to="/rooms" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`text-lg font-semibold px-4 py-3 rounded-xl transition-all duration-300
                ${location.pathname === '/rooms' 
                  ? 'bg-secondary/10 text-secondary' 
                  : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                }
              `}
            >
              Rooms
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`text-lg font-semibold px-4 py-3 rounded-xl transition-all duration-300
                ${location.pathname === '/contact' 
                  ? 'bg-secondary/10 text-secondary' 
                  : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                }
              `}
            >
              Contact
            </Link>
            
            <div className="border-t border-slate-200 my-2"></div>
            
            {user ? (
              <>
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center gap-3 px-4 py-3 bg-secondary/10 text-secondary rounded-xl font-semibold"
                  >
                    <FaCrown />
                    Admin Panel
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary to-primary-light text-white rounded-xl"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <div className="font-bold">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-white/80">{user.email}</div>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full py-3.5 text-center text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-full py-3.5 text-center bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Book Now
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-full py-3.5 text-center text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
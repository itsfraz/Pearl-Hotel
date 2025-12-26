import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';

const BookingWidget = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    navigate('/rooms', { 
      state: { 
        searchParams: {
          checkIn,
          checkOut,
          capacity: guests
        }
      } 
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mt-6 md:-mt-24 relative z-20 max-w-5xl mx-auto border border-slate-100 flex flex-col md:flex-row gap-6 animate-slide-up mx-4 md:mx-auto">
      {/* Check In */}
      <div className="flex-1 space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Check In</label>
        <div className="relative group">
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()}
            className="w-full bg-surface-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 px-0 py-2 text-slate-800 font-display font-bold text-lg cursor-pointer transition-colors"
            dateFormat="dd MMM yyyy"
          />
          <FaCalendarAlt className="absolute right-0 top-3 text-slate-300 group-hover:text-primary transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Check Out */}
      <div className="flex-1 space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Check Out</label>
        <div className="relative group">
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn}
            className="w-full bg-surface-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 px-0 py-2 text-slate-800 font-display font-bold text-lg cursor-pointer transition-colors"
            dateFormat="dd MMM yyyy"
          />
          <FaCalendarAlt className="absolute right-0 top-3 text-slate-300 group-hover:text-primary transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Guests */}
      <div className="flex-1 space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Guests</label>
        <div className="relative group">
          <select 
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full bg-surface-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 px-0 py-2 text-slate-800 font-display font-bold text-lg cursor-pointer transition-colors appearance-none"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
          <FaUser className="absolute right-0 top-3 text-slate-300 group-hover:text-primary transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex items-end">
        <button 
          onClick={handleSearch}
          className="w-full md:w-auto px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <FaSearch />
          Check Availability
        </button>
      </div>
    </div>
  );
};

export default BookingWidget;

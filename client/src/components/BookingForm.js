import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import roomService from '../services/roomService';
import authService from '../services/authService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaCalendarAlt, FaSpinner } from 'react-icons/fa';

const BookingForm = ({ room, onClose, checkIn: initialCheckIn, checkOut: initialCheckOut, bookedDates = [] }) => {
  // Helper to get next day
  const getNextDay = (date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next;
  };

  const defaultCheckIn = initialCheckIn || new Date();
  const defaultCheckOut = initialCheckOut || getNextDay(defaultCheckIn);

  const calculateInitialPrice = () => {
    const days = Math.ceil(
      (new Date(defaultCheckOut) - new Date(defaultCheckIn)) / (1000 * 60 * 60 * 24)
    );
    return Math.max(1, days) * room.price;
  };

  const [booking, setBooking] = useState({
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    adults: 1,
    children: 0,
    youngChildren: 0,
    specialRequests: '',
    totalPrice: calculateInitialPrice()
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handlePayment = async (user) => {
    try {
       await roomService.createBooking({
          ...booking,
          room: room._id,
          paymentStatus: 'Pending',
          specialRequests: (booking.specialRequests ? booking.specialRequests + '. ' : '') + 'Pay on Arrival',
          couponCode: isCouponApplied ? couponCode : null
        });
        onClose();
        showSuccessMessage();
    } catch (error) {
      console.error(error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    return Math.max(1, Math.ceil(
      (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
    ));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post('/api/coupons/validate', { 
        code: couponCode, 
        orderAmount: booking.totalPrice 
      }, config);
      
      setDiscount(res.data.discount);
      setIsCouponApplied(true);
      setCouponMessage({ type: 'success', text: `Coupon applied: ₹${res.data.discount} off` });
    } catch (error) {
      setDiscount(0);
      setIsCouponApplied(false);
      setCouponMessage({ type: 'error', text: error.response?.data?.message || 'Invalid coupon' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    // Trigger payment flow
    handlePayment(user);
  };

  const calculateTotalPrice = (checkIn, checkOut, adults, children) => {
    const days = Math.max(1, Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    ));
    const totalPayingGuests = adults + children;
    const guestMultiplier = 1 + (Math.max(0, totalPayingGuests - 1) * 0.5);
    return Math.round(days * room.price * guestMultiplier);
  };

  const handleDateChange = (field, date) => {
    setBooking(prev => {
      const newBooking = {
        ...prev,
        [field]: date
      };
      if (newBooking.checkIn && newBooking.checkOut) {
        newBooking.totalPrice = calculateTotalPrice(
          newBooking.checkIn,
          newBooking.checkOut,
          newBooking.adults,
          newBooking.children
        );
      }
      return newBooking;
    });
  };

  const handleGuestChange = (type, value) => {
    let numValue = parseInt(value) || 0;
    numValue = Math.max(0, numValue);
    
    const otherGuests = type === 'adults' ? 
      booking.children : 
      (type === 'children' ? booking.adults : booking.adults + booking.children);
    
    const totalGuests = numValue + otherGuests;
    if (totalGuests > room.capacity) {
      numValue = room.capacity - otherGuests;
    }

    setBooking(prev => {
      const newBooking = {
        ...prev,
        [type]: numValue
      };
      newBooking.totalPrice = calculateTotalPrice(
        newBooking.checkIn,
        newBooking.checkOut,
        newBooking.adults,
        newBooking.children
      );
      return newBooking;
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const showSuccessMessage = () => {
    alert('Booking successful! Thank you for choosing Pearl Hotel.');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-primary font-display font-semibold text-lg">Select Dates</label>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-500 mb-2">Check-in</label>
                  <div className="relative group">
                    <DatePicker
                      selected={booking.checkIn}
                      onChange={(date) => handleDateChange('checkIn', date)}
                      minDate={new Date()}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      dateFormat="MMM d, yyyy"
                      excludeDateIntervals={bookedDates}
                    />
                    <FaCalendarAlt className="absolute right-3 top-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-2">Check-out</label>
                  <div className="relative group">
                    <DatePicker
                      selected={booking.checkOut}
                      onChange={(date) => handleDateChange('checkOut', date)}
                      minDate={booking.checkIn}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      dateFormat="MMM d, yyyy"
                      excludeDateIntervals={bookedDates}
                    />
                    <FaCalendarAlt className="absolute right-3 top-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-primary font-display font-semibold text-lg">Number of Guests</label>
              <p className="text-sm text-slate-500">Max capacity: {room.capacity} guests</p>
              
              {['adults', 'children', 'youngChildren'].map((type, idx) => (
                <div key={type} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700 capitalize">
                      {type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xs text-slate-400">
                      {type === 'adults' ? 'Age 13+' : type === 'children' ? 'Age 6-12' : 'Under 5 (Free)'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleGuestChange(type, booking[type] - 1)}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-30"
                      disabled={type === 'adults' ? booking.adults <= 1 : booking[type] <= 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-primary">{booking[type]}</span>
                    <button
                      type="button"
                      onClick={() => handleGuestChange(type, booking[type] + 1)}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-30"
                      disabled={type !== 'youngChildren' && (booking.adults + booking.children >= room.capacity)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-surface-100 p-6 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-slate-600 mb-2">
                <span>Total Estimate ({calculateNights()} night{calculateNights() !== 1 ? 's' : ''})</span>
                <span className="text-2xl font-display font-bold text-primary">{formatPrice(booking.totalPrice)}</span>
              </div>
              <p className="text-xs text-slate-400 text-right">Includes taxes & fees</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-surface-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-display font-bold text-primary border-b border-slate-200 pb-2">Booking Summary</h3>
              
              <div className="grid grid-cols-2 gap-4 pb-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Check-in</p>
                  <p className="font-medium text-slate-800">{booking.checkIn.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Check-out</p>
                  <p className="font-medium text-slate-800">{booking.checkOut.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="py-2 border-t border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                <div className="text-sm font-bold text-primary">
                  {calculateNights()} Night(s)
                </div>
              </div>

              <div className="py-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Guests</p>
                <div className="text-sm text-slate-700">
                  {booking.adults} Adults
                  {booking.children > 0 && `, ${booking.children} Children`}
                  {booking.youngChildren > 0 && `, ${booking.youngChildren} Infants`}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="font-bold text-slate-800">Subtotal</span>
                <span className="text-lg font-medium text-slate-600">{formatPrice(booking.totalPrice)}</span>
              </div>
              
              {isCouponApplied && (
                 <div className="flex justify-between items-center text-green-600">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">- {formatPrice(discount)}</span>
                 </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="font-bold text-xl text-slate-800">Total Due</span>
                <span className="text-2xl font-bold text-secondary-dark">{formatPrice(Math.max(0, booking.totalPrice - discount))}</span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-2">
               <label className="block text-slate-700 font-medium text-sm">Have a Coupon?</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={couponCode}
                   onChange={(e) => setCouponCode(e.target.value)}
                   disabled={isCouponApplied}
                   placeholder="Enter code"
                   className="flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase font-medium"
                 />
                 {isCouponApplied ? (
                   <button 
                     type="button" 
                     onClick={() => { setIsCouponApplied(false); setDiscount(0); setCouponCode(''); setCouponMessage(null); }}
                     className="px-4 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100"
                   >
                     Remove
                   </button>
                 ) : (
                    <button 
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 disabled:opacity-50"
                      disabled={!couponCode}
                    >
                      Apply
                    </button>
                 )}
               </div>
               {couponMessage && (
                 <p className={`text-xs font-bold ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                   {couponMessage.text}
                 </p>
               )}
            </div>

            <div className="space-y-2">
              <label className="block text-slate-700 font-medium">
                Special Requests <span className="text-sm font-normal text-slate-400">(Optional)</span>
              </label>
              <textarea
                value={booking.specialRequests}
                onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                placeholder="Airport pickup, dietary requirements, etc..."
                className="w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px] resize-none"
              ></textarea>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
      <div 
        ref={formRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fade-in"
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-[1001]">
          <div>
            <h2 className="text-2xl font-display font-bold text-primary">Book Your Stay</h2>
            <p className="text-sm text-slate-500">{room.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8">
             <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-slate-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 1 ? 'border-primary bg-primary text-secondary' : 'border-slate-300'}`}>1</div>
                  <span className="text-sm font-medium">Details</span>
                </div>
                <div className={`h-0.5 w-16 ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-slate-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 2 ? 'border-primary bg-primary text-secondary' : 'border-slate-300'}`}>2</div>
                  <span className="text-sm font-medium">Confirm</span>
                </div>
             </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 text-slate-600 hover:text-primary font-medium transition-colors"
            >
              Back
            </button>
          ) : <div></div>}
          
          <button
            type="button"
            onClick={step === 1 ? () => setStep(2) : handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-slate-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {step === 1 ? 'Continue' : 'Complete Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
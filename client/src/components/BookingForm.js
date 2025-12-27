import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import roomService from '../services/roomService';
import authService from '../services/authService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaCalendarAlt, FaSpinner, FaUtensils, FaPlane, FaSpa, FaHeart } from 'react-icons/fa';

const ADDONS = [
  { 
    id: 'breakfast', 
    name: 'Gourmet Breakfast', 
    price: 500, 
    type: 'per_person_per_night', 
    icon: FaUtensils, 
    desc: 'Daily buffet with international spread' 
  },
  { 
    id: 'airport_pickup', 
    name: 'VIP Airport Transfer', 
    price: 1899, 
    type: 'one_time', 
    icon: FaPlane, 
    desc: 'Private luxury sedan pickup' 
  },
  { 
    id: 'spa_access', 
    name: 'Wellness Spa Access', 
    price: 2500, 
    type: 'per_person', 
    icon: FaSpa, 
    desc: 'Full day access to thermal pools & sauna' 
  },
  { 
    id: 'romance_pack', 
    name: 'Honeymoon Package', 
    price: 4999, 
    type: 'one_time', 
    icon: FaHeart, 
    desc: 'Champagne, chocolates & flower decor' 
  }
];

const BookingForm = ({ room, onClose, checkIn: initialCheckIn, checkOut: initialCheckOut, bookedDates = [] }) => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Helper to get next day
  const getNextDay = (date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next;
  };

  const defaultCheckIn = initialCheckIn || new Date();
  const defaultCheckOut = initialCheckOut || getNextDay(defaultCheckIn);

  const [booking, setBooking] = useState({
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    adults: 1,
    children: 0,
    youngChildren: 0,
    specialRequests: '',
  });

  const [selectedAddons, setSelectedAddons] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Calculations
  const getNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const diff = new Date(booking.checkOut) - new Date(booking.checkIn);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getGuestCount = () => booking.adults + booking.children;

  const calculateBasePrice = () => {
    const nights = getNights();
    const guests = getGuestCount();
    const guestMultiplier = 1 + (Math.max(0, guests - 1) * 0.5);
    return Math.round(nights * room.price * guestMultiplier);
  };

  const calculateAddonPrice = (addon) => {
    const nights = getNights();
    const guests = getGuestCount();
    
    switch (addon.type) {
      case 'per_person_per_night': return addon.price * guests * nights;
      case 'per_person': return addon.price * guests;
      case 'per_stay': // Fallthrough
      case 'one_time': return addon.price;
      default: return addon.price;
    }
  };

  const getTotalAddonPrice = () => {
    let total = 0;
    selectedAddons.forEach(id => {
      const addon = ADDONS.find(a => a.id === id);
      if (addon) total += calculateAddonPrice(addon);
    });
    return total;
  };

  const getTotalPrice = () => {
    return calculateBasePrice() + getTotalAddonPrice();
  };

  // Handlers
  const handleDateChange = (field, date) => {
    setBooking(prev => ({ ...prev, [field]: date }));
  };

  const handleGuestChange = (type, val) => {
    let newVal = Math.max(0, parseInt(val) || 0);
    const otherGuests = type === 'adults' ? booking.children : (type === 'children' ? booking.adults : booking.adults + booking.children);
    
    // Validate Max Capacity
    if (type !== 'youngChildren' && (newVal + otherGuests > room.capacity)) {
        return; // Do nothing if exceeds capacity
    }
    // Validate Min Adults
    if (type === 'adults' && newVal < 1) newVal = 1;

    setBooking(prev => ({ ...prev, [type]: newVal }));
  };

  const toggleAddon = (id) => {
    const newSet = new Set(selectedAddons);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAddons(newSet);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/coupons/validate`, { 
        code: couponCode, 
        orderAmount: getTotalPrice()
      });
      
      setDiscount(res.data.discount);
      setIsCouponApplied(true);
      setCouponMessage({ type: 'success', text: `Coupon applied: ₹${res.data.discount} off` });
    } catch (error) {
      setDiscount(0);
      setIsCouponApplied(false);
      setCouponMessage({ type: 'error', text: error.response?.data?.message || 'Invalid coupon' });
    }
  };

  const handlePayment = async (user) => {
    try {
       const addonsList = Array.from(selectedAddons).map(id => {
          const addon = ADDONS.find(a => a.id === id);
          return {
              name: addon.name,
              price: addon.price,
              quantity: 1, // Simplified for now
              totalPrice: calculateAddonPrice(addon)
          };
       });

       await roomService.createBooking({
          ...booking,
          room: room._id,
          totalPrice: getTotalPrice(), // Ensure this matches backend expectation
          paymentStatus: 'Pending',
          specialRequests: (booking.specialRequests ? booking.specialRequests + '. ' : '') + 'Pay on Arrival',
          couponCode: isCouponApplied ? couponCode : null,
          addOns: addonsList
        });
        onClose();
        alert('Booking successful! Thank you for choosing Pearl Hotel.');
    } catch (error) {
      console.error(error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
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
    handlePayment(user);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Render Steps
  const renderStepOne = () => (
    <div className="space-y-8 animate-fade-in">
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
        
        {['adults', 'children', 'youngChildren'].map((type) => (
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
                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors disabled:opacity-30"
                disabled={type === 'adults' ? booking.adults <= 1 : booking[type] <= 0}
                >
                -
                </button>
                <span className="w-8 text-center font-semibold text-primary">{booking[type]}</span>
                <button
                type="button"
                onClick={() => handleGuestChange(type, booking[type] + 1)}
                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors disabled:opacity-30"
                disabled={type !== 'youngChildren' && (booking.adults + booking.children >= room.capacity)}
                >
                +
                </button>
            </div>
            </div>
        ))}
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h3 className="text-xl font-display font-bold text-primary mb-2">Enhance Your Stay</h3>
            <p className="text-slate-500 text-sm">Select from our premium add-ons to make your stay unforgettable.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADDONS.map(addon => {
                const isSelected = selectedAddons.has(addon.id);
                return (
                    <div 
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                            isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-slate-100 hover:border-slate-300 bg-white'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`p-3 rounded-full ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                <addon.icon className="text-xl" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold ${isSelected ? 'text-primary' : 'text-slate-700'}`}>{addon.name}</h4>
                                    <div className="text-right">
                                        <span className="block font-bold text-secondary-dark">{formatPrice(addon.price)}</span>
                                        <span className="text-xs text-slate-400 capitalize">
                                            {addon.type.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{addon.desc}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-surface-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-display font-bold text-primary border-b border-slate-200 pb-2">Booking Summary</h3>
            
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Dates</p>
                    <p className="font-medium text-slate-800">
                        {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">({getNights()} Nights)</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Guests</p>
                    <p className="font-medium text-slate-800">
                        {booking.adults} Adults, {booking.children} Kids
                    </p>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 py-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Room Charges</span>
                    <span className="font-medium">{formatPrice(calculateBasePrice())}</span>
                </div>
                
                {selectedAddons.size > 0 && (
                    <div className="border-t border-slate-100 pt-2 mt-2 space-y-2">
                        <p className="text-xs text-slate-400 font-bold uppercase">Add-ons</p>
                        {Array.from(selectedAddons).map(id => {
                            const addon = ADDONS.find(a => a.id === id);
                            return (
                                <div key={id} className="flex justify-between text-sm text-slate-600 pl-2 border-l-2 border-secondary/30">
                                    <span>{addon.name}</span>
                                    <span>{formatPrice(calculateAddonPrice(addon))}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-300">
                <span className="font-bold text-xl text-slate-800">Total</span>
                <div className="text-right">
                    <span className="text-2xl font-display font-bold text-secondary-dark">{formatPrice(getTotalPrice())}</span>
                    {discount > 0 && <p className="text-sm text-green-600 font-medium">Coupon Applied: -{formatPrice(discount)}</p>}
                </div>
            </div>
            {discount > 0 && (
                 <div className="text-right border-t border-dashed border-slate-300 pt-2">
                    <span className="text-lg font-bold text-slate-900">Final Pay: {formatPrice(getTotalPrice() - discount)}</span>
                 </div>
            )}
        </div>

        {/* Coupon */}
        <div className="flex gap-2">
             <input 
               type="text" 
               value={couponCode}
               onChange={(e) => setCouponCode(e.target.value)}
               disabled={isCouponApplied}
               placeholder="PROMO CODE"
               className="flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-mono text-sm uppercase"
             />
             {isCouponApplied ? (
               <button type="button" onClick={() => { setIsCouponApplied(false); setDiscount(0); setCouponCode(''); }} className="px-4 text-red-600 font-bold text-sm bg-red-50 rounded-lg">Remove</button>
             ) : (
                <button type="button" onClick={handleApplyCoupon} disabled={!couponCode} className="px-6 bg-slate-800 text-white font-bold rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50">Apply</button>
             )}
        </div>
        {couponMessage && <p className={`text-xs font-bold ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{couponMessage.text}</p>}

        <textarea
            value={booking.specialRequests}
            onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
            placeholder="Special Requests (Airport details, dietary restrictions, celebration notes...)"
            className="w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] text-sm"
        />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
      <div 
        ref={formRef}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-scale-in"
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-display font-bold text-primary">Book Your Stay</h2>
            <p className="text-sm text-slate-500 font-medium">{room.name} <span className="text-secondary mx-2">•</span> <span className="text-slate-400 font-normal">Step {step} of 3</span></p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1 shrink-0">
            <div 
                className="h-full bg-secondary transition-all duration-500 ease-out" 
                style={{ width: `${(step / 3) * 100}%` }}
            ></div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar flex-1">
            <form onSubmit={handleSubmit} id="booking-form">
                {step === 1 && renderStepOne()}
                {step === 2 && renderStepTwo()}
                {step === 3 && renderStepThree()}
            </form>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-100 p-6 flex justify-between items-center shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 text-slate-500 hover:text-primary font-bold transition-colors"
            >
              Back
            </button>
          ) : <div></div>}
          
          <button
            type="button"
            onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-primary to-slate-800 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
          >
            {loading ? <FaSpinner className="animate-spin" /> : null}
            {step === 1 ? 'Select Add-ons' : step === 2 ? 'Review & Pay' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
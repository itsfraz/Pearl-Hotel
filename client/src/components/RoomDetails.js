import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "./BookingForm";
import RoomDetailsSkeleton from "./common/RoomDetailsSkeleton";
import roomService from '../services/roomService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaWifi, FaSwimmingPool, FaUtensils, FaDumbbell, FaParking, FaHotTub, FaTv, FaWind, 
  FaBed, FaChevronLeft, FaChevronRight, FaCoffee, FaGlassMartini, 
  FaBell, FaSpa, FaSnowflake, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { MdPeople, MdRestaurant, MdKingBed, MdBalcony, MdKitchen } from 'react-icons/md';

const RoomDetails = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [isAvailable, setIsAvailable] = useState(null); // 'true', 'false', or null
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookedDateRanges, setBookedDateRanges] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        // Fetch room details
        const roomData = await roomService.getRoomById(id);
        setRoom(roomData);

        // Fetch booked dates for this room
        const bookingsData = await roomService.getRoomBookings(id);
        
        // Convert bookings to date intervals for DatePicker
        const ranges = bookingsData.map(booking => ({
          start: new Date(booking.checkIn),
          end: new Date(booking.checkOut)
        }));
        setBookedDateRanges(ranges);

        setError(null);
      } catch (err) {
        setError("Failed to fetch room details. Please try again later.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [id]);

  const getAmenityIcon = (amenity) => {
    const className = "text-primary text-xl";
    switch (amenity) {
      case 'WiFi': return <FaWifi className={className} />;
      case 'Swimming Pool': return <FaSwimmingPool className={className} />;
      case 'Restaurant': case 'Restaurant Access': return <MdRestaurant className={className} />;
      case 'Gym Access': return <FaDumbbell className={className} />;
      case 'Parking': return <FaParking className={className} />;
      case 'Hot Water': return <FaHotTub className={className} />;
      case 'TV': return <FaTv className={className} />;
      case 'Air Conditioning': return <FaWind className={className} />;
      case 'Mini Bar': return <FaGlassMartini className={className} />;
      case 'Room Service': return <FaBell className={className} />;
      case 'Spa Access': return <FaSpa className={className} />;
      case 'Coffee Maker': return <FaCoffee className={className} />;
      case 'Full Kitchen': case 'Kitchen': return <MdKitchen className={className} />;
      case 'Private Balcony': case 'Balcony': return <MdBalcony className={className} />;
      default: return <FaSnowflake className={className} />;
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => prev === room.images.length - 1 ? 0 : prev + 1);
  const prevImage = () => setCurrentImageIndex((prev) => prev === 0 ? room.images.length - 1 : prev - 1);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) return;
    
    setChecking(true);
    setAvailabilityMessage('');
    setIsAvailable(null);

    try {
      const res = await roomService.checkAvailability({
        roomId: room._id,
        checkIn,
        checkOut
      });
      
      setIsAvailable(res.available);
      setAvailabilityMessage(res.message);
    } catch (error) {
      console.error(error);
      setAvailabilityMessage('Error checking availability');
      setIsAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return <RoomDetailsSkeleton />;
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center py-12 px-8 bg-white rounded-2xl shadow-xl max-w-md border border-slate-100">
          <p className="text-primary text-xl font-display font-medium mb-6">{error || "Room not found"}</p>
          <button
            onClick={() => navigate('/rooms')}
            className="px-8 py-3 bg-primary text-white rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/rooms')}
          className="group mb-8 flex items-center text-slate-500 hover:text-primary transition-colors duration-300 font-medium"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all mr-3">
            <FaChevronLeft className="text-sm" />
          </div>
          Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Images & Details (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-slate-200 aspect-video shadow-2xl group">
                <img
                  src={room.images[currentImageIndex]}
                  alt={`Room view`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                >
                  <FaChevronRight />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative rounded-xl overflow-hidden aspect-video transition-all duration-300 ${
                      currentImageIndex === index ? 'ring-2 ring-primary ring-offset-2 scale-95 opacity-100' : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-display font-bold text-primary mb-2 line-clamp-1">{room.name || `${room.type} Room`}</h1>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-secondary/10 text-secondary-dark rounded-full text-sm font-semibold tracking-wide uppercase">
                        {room.type}
                    </span>
                    <span className="text-slate-400 text-sm">Room {room.roomNumber}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-primary">
                    {formatPrice(room.price)}
                  </p>
                  <p className="text-slate-400 text-sm">per night</p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg mb-10">
                {room.description || 'A comfortable and well-appointed room designed for your perfect stay.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-surface-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <MdPeople className="text-3xl text-secondary" />
                  <span className="text-sm font-medium text-slate-600">Up to {room.capacity} Guests</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <div className="text-3xl font-display font-bold text-secondary">{room.size?.split(' ')[0] || '400'}</div>
                  <span className="text-sm font-medium text-slate-600">Sq Ft</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <MdKingBed className="text-3xl text-secondary" />
                  <span className="text-sm font-medium text-slate-600 line-clamp-1">{room.bedType || 'Queen Bed'}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <FaWifi className="text-3xl text-secondary" />
                  <span className="text-sm font-medium text-slate-600">High-Speed Wifi</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {room.features && room.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-display font-bold text-primary mb-6 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                      Room Features
                    </h3>
                    <ul className="space-y-3">
                      {room.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-slate-600 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-secondary transition-colors"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-display font-bold text-primary mb-6 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-slate-600">
                           {getAmenityIcon(amenity)}
                           <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
               <div className="text-center mb-8">
                  <p className="text-slate-500 text-sm uppercase tracking-widest mb-1">Starting from</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold text-primary">{formatPrice(room.price)}</span>
                    <span className="text-slate-400">/ night</span>
                  </div>
               </div>

               <div className="space-y-6">
                 {/* Date Inputs */}
                 <div className="space-y-4">
                   <div className="relative group">
                     <label className="absolute -top-2.5 left-4 px-2 bg-white text-xs font-bold text-primary font-display uppercase tracking-wider z-10">Check-In</label>
                     <DatePicker
                       selected={checkIn}
                       onChange={(date) => setCheckIn(date)}
                       className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-sans text-slate-700 font-medium"
                       minDate={new Date()}
                       dateFormat="MMM d, yyyy"
                       excludeDateIntervals={bookedDateRanges}
                     />
                     <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
                   </div>

                   <div className="relative group">
                     <label className="absolute -top-2.5 left-4 px-2 bg-white text-xs font-bold text-primary font-display uppercase tracking-wider z-10">Check-Out</label>
                     <DatePicker
                       selected={checkOut}
                       onChange={(date) => setCheckOut(date)}
                       className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-sans text-slate-700 font-medium"
                       minDate={checkIn}
                       dateFormat="MMM d, yyyy"
                       excludeDateIntervals={bookedDateRanges}
                     />
                     <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
                   </div>
                 </div>

                 {/* Availability & Book Buttons */}
                 <div className="pt-4 space-y-3">
                   <button
                     className="w-full py-4 bg-white border-2 border-primary text-primary rounded-xl font-bold hover:bg-surface-50 transition-all duration-300 flex items-center justify-center gap-2"
                     onClick={handleCheckAvailability}
                     disabled={checking}
                   >
                     {checking ? <FaSpinner className="animate-spin" /> : 'Check Availability'}
                   </button>
                   
                   {isAvailable === false && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg animate-fade-in border border-red-100">
                        {availabilityMessage || "Dates are unavailable. Please try different dates."}
                      </div>
                   )}

                   {isAvailable === true && (
                      <div className="p-3 bg-green-50 text-green-600 text-sm text-center rounded-lg animate-fade-in border border-green-100">
                        Room is available!
                      </div>
                   )}

                   <button
                     className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-slate-800 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none bg-[length:200%_auto] hover:bg-right"
                     onClick={() => setShowBookingForm(true)}
                     disabled={isAvailable !== true}
                   >
                     Book Now
                   </button>
                 </div>
                 
                 <p className="text-center text-xs text-slate-400 mt-4">
                   You won't be charged yet
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm
          room={room}
          checkIn={checkIn}
          checkOut={checkOut}
          bookedDates={bookedDateRanges}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default RoomDetails;
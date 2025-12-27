import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RoomCard from "./RoomCard";
import RoomCardSkeleton from "./common/RoomCardSkeleton";
import roomService from '../services/roomService';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const RoomList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const amenitiesRef = useRef(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const location = useLocation();
  const [rooms, setRooms] = useState([]);

  const [filter, setFilter] = useState({
    type: "all",
    maxPrice: 50000,
    capacity: 1,
    amenities: [],
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await roomService.getAllRooms();
        setRooms(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch rooms. Please try again later.");
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (location.state?.searchParams) {
      const { capacity } = location.state.searchParams;
      setFilter(prev => ({
        ...prev,
        capacity: capacity || 1
      }));
    }
  }, [location.state]);

  const amenitiesList = [
    "WiFi", "Hot Water", "Room Service", "TV", "Air Conditioning",
    "Mini Bar", "Gym Access", "Swimming Pool", "Restaurant", "Parking"
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAmenityToggle = (amenity) => {
    setFilter(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const filteredRooms = rooms.filter((room) => {
    const typeMatch = filter.type === "all" || room.type === filter.type;
    const priceMatch = room.price <= filter.maxPrice;
    const capacityMatch = room.capacity >= filter.capacity;
    return typeMatch && priceMatch && capacityMatch; 
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) {
        setIsAmenitiesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4 animate-slide-up">
              Our <span className="text-secondary">Collection</span>
           </h1>
           <p className="text-slate-500 max-w-2xl mx-auto animate-fade-in">
              Discover our range of meticulously designed rooms and suites, tailored to provide an unforgettable experience.
           </p>
        </div>

        {/* Filter Section */}
        <div className="mb-16 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="flex items-center justify-between mb-0 md:mb-6 border-b md:border-b-0 border-slate-100 pb-4 md:pb-0">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/5 rounded-lg text-primary">
                  <FaFilter />
               </div>
               <h3 className="text-xl font-display font-bold text-primary">Filter Your Stay</h3>
             </div>
             <button 
               className="md:hidden text-slate-500 hover:text-primary transition-colors"
               onClick={() => setIsFilterExpanded(!isFilterExpanded)}
             >
               {isFilterExpanded ? <FaChevronUp /> : <FaChevronDown />}
             </button>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-300 ${isFilterExpanded ? 'mt-6 opacity-100' : 'hidden md:grid mt-0 opacity-100'}`}>
            {/* Room Type Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Room Type</label>
              <div className="relative">
                <select
                  className="w-full p-4 bg-surface-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none text-slate-600 font-medium cursor-pointer"
                  value={filter.type}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="all">All Types</option>
                  <option value="Suite">Suite</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Standard">Standard</option>
                  <option value="Simple">Simple</option>
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Max Price</label>
                 <span className="text-primary font-bold">{formatPrice(filter.maxPrice)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={filter.maxPrice}
                onChange={(e) => setFilter({ ...filter, maxPrice: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>

            {/* Number of People Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Guests</label>
              <div className="flex bg-surface-50 p-1 rounded-xl border border-slate-200">
                {[1, 3, 5].map((num) => (
                  <button
                    key={num}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      filter.capacity === num 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-slate-500 hover:text-primary'
                    }`}
                    onClick={() => setFilter({ ...filter, capacity: num })}
                  >
                    {num === 5 ? '5+' : `${num}-${num+1}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="space-y-3" ref={amenitiesRef}>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Amenities</label>
              <div className="relative">
                <button
                  onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}
                  className={`w-full p-4 text-left border rounded-xl flex justify-between items-center transition-all duration-300
                    ${isAmenitiesOpen 
                      ? 'bg-white border-primary ring-2 ring-primary/10' 
                      : 'bg-surface-50 border-slate-200 hover:border-primary'
                    }`}
                >
                  <span className="text-slate-600 font-medium truncate">
                    {filter.amenities.length === 0 
                      ? "Select Amenities" 
                      : `${filter.amenities.length} selected`}
                  </span>
                  <FaChevronDown className={`text-xs text-slate-400 transition-transform duration-300 ${isAmenitiesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isAmenitiesOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-slide-up">
                    <div className="p-3 max-h-60 overflow-y-auto custom-scrollbar">
                      {amenitiesList.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                             filter.amenities.includes(amenity) 
                               ? 'bg-primary border-primary' 
                               : 'border-slate-300'
                          }`}>
                            {filter.amenities.includes(amenity) && <div className="w-2 h-2 bg-secondary rounded-full" />}
                          </div>
                          <span className="text-slate-600 font-medium">{amenity}</span>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={filter.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <RoomCardSkeleton key={n} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 px-6 bg-red-50 rounded-2xl border border-red-100 max-w-lg mx-auto">
            <p className="text-lg text-red-500 font-medium">{error}</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-xl text-slate-400 font-medium">No rooms found matching your criteria</p>
            <button 
              onClick={() => setFilter({type: "all", maxPrice: 50000, capacity: 1, amenities: []})}
              className="mt-4 text-secondary font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaWifi, FaArrowRight } from 'react-icons/fa';

const RoomCard = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (isHovered) {
       interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === room.images.length - 1 ? 0 : prev + 1
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isHovered, room.images.length]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
        <img
          src={room.images[currentImageIndex]}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
          Available
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{room.description}</p>
        </div>

        <div className="flex items-center gap-4 mb-6 text-slate-400 text-sm">
          <div className="flex items-center gap-1">
            <FaBed /> <span>King Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <FaWifi /> <span>Free Wifi</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-6">
          <div>
            <span className="text-sm text-slate-400">Starting from</span>
            <div className="text-2xl font-bold text-secondary-dark">{formatPrice(room.price)}<span className="text-sm font-normal text-slate-400">/night</span></div>
          </div>
          <Link
            to={`/rooms/${room._id}`}
            className="w-12 h-12 bg-primary text-secondary rounded-full flex items-center justify-center transform group-hover:rotate-[-45deg] transition-all duration-300 hover:bg-secondary hover:text-primary shadow-lg"
          >
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

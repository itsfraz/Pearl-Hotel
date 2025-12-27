import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaUsers, FaArrowRight, FaExpand } from 'react-icons/fa';
import ImageCarousel from './ImageCarousel';
import ImageLightbox from './ImageLightbox';

const RoomCard = ({ room }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Get first 3 amenities to display
  const displayAmenities = room.amenities?.slice(0, 3) || [];

  return (
    <>
      <div 
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col h-full transform hover:-translate-y-1"
      >
        {/* Enhanced Image Section */}
        <div className="relative h-72 overflow-hidden rounded-t-2xl">
          <ImageCarousel
            images={room.images || []}
            alt={room.name}
            onImageClick={handleImageClick}
            className="h-full"
          />
          
          {/* Availability Badge */}
          <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm animate-pulse-subtle">
            Available
          </div>

          {/* Expand Icon Hint */}
          <button
            onClick={() => handleImageClick(0)}
            className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
            aria-label="View full size"
          >
            <FaExpand className="text-sm" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Room Name & Type */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-2xl font-display font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                {room.name}
              </h3>
              {room.type && (
                <span className="flex-shrink-0 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {room.type}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Room Features */}
          <div className="flex items-center gap-4 mb-6 text-slate-600 text-sm flex-wrap">
            {room.capacity && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                <FaUsers className="text-primary" />
                <span className="font-medium">{room.capacity} Guests</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
              <FaBed className="text-primary" />
              <span className="font-medium">King Bed</span>
            </div>
          </div>

          {/* Amenities Preview */}
          {displayAmenities.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {displayAmenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 font-medium"
                  >
                    {amenity}
                  </span>
                ))}
                {room.amenities && room.amenities.length > 3 && (
                  <span className="text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-semibold">
                    +{room.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price & CTA */}
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6 gap-4">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-secondary to-secondary-dark bg-clip-text text-transparent">
                  {formatPrice(room.price)}
                </span>
                <span className="text-sm font-normal text-slate-400">/night</span>
              </div>
            </div>
            <Link
              to={`/rooms/${room._id}`}
              className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 group/btn"
            >
              Book Now 
              <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <ImageLightbox
          images={room.images || []}
          initialIndex={lightboxIndex}
          alt={room.name}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default RoomCard;

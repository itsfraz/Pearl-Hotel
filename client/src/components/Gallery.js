import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Gallery = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-primary mb-4">Our Gallery</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`relative group overflow-hidden cursor-pointer rounded-xl ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''}`}
              onClick={() => openLightbox(index)}
            >
              <img 
                src={img} 
                alt={`Gallery image ${index + 1}`} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <span className="text-white font-medium tracking-widest uppercase border border-white/50 px-6 py-2 rounded-full backdrop-blur-sm">View</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in" onClick={closeLightbox}>
          <button 
             className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors text-2xl"
             onClick={closeLightbox}
          >
            <FaTimes />
          </button>

          <button 
             className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors text-4xl p-4"
             onClick={prevImage}
          >
            <FaChevronLeft />
          </button>

          <img 
             src={images[currentIndex]} 
             alt="Full screen view" 
             className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
             onClick={(e) => e.stopPropagation()}
          />

          <button 
             className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors text-4xl p-4"
             onClick={nextImage}
          >
            <FaChevronRight />
          </button>

          <div className="absolute bottom-6 left-0 right-0 text-center text-white/70 font-medium">
             {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;

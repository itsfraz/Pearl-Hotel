import React, { useState } from 'react';
import { FaPlayCircle, FaInfoCircle } from 'react-icons/fa';

const VirtualTour = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Using a sample Kuula.co or Matterport embed placeholder
    // In production, replace with actual hotel tour URL
    const tourUrl = "https://kuula.co/share/collection/7lVLq?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1";

    return (
        <section className="py-24 bg-surface-50 relative">
            <div className="container mx-auto px-4">
                 <div className="flex flex-col lg:flex-row items-center gap-12">
                     <div className="lg:w-1/3">
                         <span className="text-secondary font-bold uppercase tracking-wider text-sm mb-2 block">Immersive Experience</span>
                         <h2 className="text-4xl font-display font-bold text-primary mb-6">Explore Before You Arrive</h2>
                         <p className="text-slate-600 leading-relaxed mb-8">
                             Take a virtual walk through our luxurious suites, grand lobby, and serene spa. Experience the ambiance of Pearl Hotel from the comfort of your home.
                         </p>
                         <div className="flex flex-col gap-4">
                             <div className="flex items-center gap-3 text-slate-700 font-medium">
                                 <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                 360° Views of All Suites
                             </div>
                             <div className="flex items-center gap-3 text-slate-700 font-medium">
                                 <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                 Interactive Amenities Tour
                             </div>
                             <div className="flex items-center gap-3 text-slate-700 font-medium">
                                 <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                 VR Headset Compatible
                             </div>
                         </div>
                     </div>

                     <div className="lg:w-2/3 w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white">
                         {!isPlaying ? (
                             <div className="absolute inset-0 bg-slate-900 group cursor-pointer" onClick={() => setIsPlaying(true)}>
                                  <img 
                                      src="/images/slider/hotel1.jpg" 
                                      alt="Virtual Tour Cover" 
                                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                          <FaPlayCircle className="text-6xl text-white drop-shadow-lg" />
                                      </div>
                                  </div>
                                  <div className="absolute bottom-6 left-6 right-6 text-center">
                                      <p className="text-white font-bold text-lg tracking-widest uppercase">Click to Start Virtual Tour</p>
                                  </div>
                             </div>
                         ) : (
                             <iframe 
                                 width="100%" 
                                 height="100%" 
                                 src={tourUrl}
                                 allow="xr-spatial-tracking; gyroscope; accelerometer" 
                                 allowFullScreen 
                                 scrolling="no"
                                 frameBorder="0"
                                 className="w-full h-full bg-slate-900"
                                 title="Virtual Tour"
                             ></iframe>
                         )}
                     </div>
                 </div>
            </div>
        </section>
    );
};

export default VirtualTour;

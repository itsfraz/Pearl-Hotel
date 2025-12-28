import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaGlassCheers, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaWhatsapp,
  FaCheck,
  FaArrowRight,
  FaEnvelope,
  FaStar,
  FaRulerCombined
} from 'react-icons/fa';
import { MdEvent, MdRestaurantMenu, MdPhotoCamera } from 'react-icons/md';
import eventService from '../services/eventService';

const Events = () => {
  const [activeTab, setActiveTab] = useState('weddings');
  const [venues, setVenues] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiry, setEnquiry] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding',
    date: '',
    guestCount: '',
    requirements: ''
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    const fetchData = async () => {
       try {
         const [venuesData, packagesData] = await Promise.all([
           eventService.getVenues(),
           eventService.getPackages()
         ]);
         setVenues(venuesData);
         setPackages(packagesData);
       } catch (error) {
         console.error("Error fetching event data", error);
       } finally {
         setLoading(false);
       }
    };
    fetchData();
  }, []);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await eventService.createEnquiry(enquiry);
      alert('Enquiry sent successfully! Our team will contact you shortly.');
      setEnquiry({
        name: '',
        email: '',
        phone: '',
        eventType: 'Wedding',
        date: '',
        guestCount: '',
        requirements: ''
      });
    } catch (error) {
      console.error(error);
      alert('Failed to send enquiry. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-5xl"
          >
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium tracking-widest uppercase mb-6">
              Grand & Memorable
            </span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-wide drop-shadow-lg">
              Celebrate Your Moments With Us
            </h1>
            <p className="text-xl md:text-2xl font-light mb-10 text-slate-200 max-w-3xl mx-auto drop-shadow-md">
              Weddings • Corporate Events • Social Gatherings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('enquiry-form').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-secondary hover:bg-yellow-600 text-slate-900 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Plan Your Event
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full font-medium transition-all shadow-lg flex items-center justify-center gap-2">
                <FaArrowRight /> Explore Venues
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Event Types */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-slate-900 mb-4">Curated Experiences</h2>
            <div className="w-20 h-1 bg-secondary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Weddings', icon: FaGlassCheers, img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80' },
              { title: 'Corporate', icon: FaUsers, img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80' },
              { title: 'Social', icon: MdEvent, img: 'https://images.unsplash.com/photo-1519671482538-518b5c2bf7c6?auto=format&fit=crop&w=400&q=80' },
              { title: 'Dining', icon: MdRestaurantMenu, img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <div className="text-secondary text-3xl mb-2"><item.icon /></div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Venues Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="text-4xl font-serif text-slate-900 mb-2">Our Venues</h2>
               <p className="text-slate-500">Elegant spaces for every occasion</p>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {loading ? (
                <p>Loading venues...</p> 
             ) : venues.length > 0 ? (
               venues.map((venue) => (
                 <div key={venue._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
                    <div className="h-64 overflow-hidden relative">
                       <img 
                         src={venue.images[0] || 'https://via.placeholder.com/400'} 
                         alt={venue.name} 
                         className="w-full h-full object-cover"
                       />
                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur py-1 px-3 rounded-full text-xs font-bold shadow-sm">
                         {venue.area} sq ft
                       </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{venue.name}</h3>
                      <div className="flex gap-4 text-sm text-slate-500 mb-4">
                         <span className="flex items-center gap-1"><FaUsers /> {venue.capacityMin}-{venue.capacityMax} Guests</span>
                         <span className="flex items-center gap-1"><FaRulerCombined /> {venue.area} sqft</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-6 line-clamp-2">{venue.description}</p>
                      <button 
                        onClick={() => document.getElementById('enquiry-form').scrollIntoView({ behavior: 'smooth' })}
                        className="w-full py-3 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                 </div>
               ))
             ) : (
                // Fallback / Static if no venues found
                <div className="col-span-full text-center py-10 text-slate-400">
                  <p>No venues added yet. Admin needs to add venues.</p>
                </div>
             )}
           </div>
        </div>
      </section>

      {/* 4. Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-slate-900 mb-4">Event Packages</h2>
            <p className="text-slate-500">Tailored solutions for your perfect day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {loading ? <p>Loading packages...</p> : packages.length > 0 ? (
               packages.map((pkg) => (
                 <div key={pkg._id} className="border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all hover:border-secondary relative group bg-slate-50 hover:bg-white text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
                    <div className="text-secondary font-bold text-xl mb-6">₹{pkg.pricePerPerson} <span className="text-sm text-slate-400 font-normal">/ person</span></div>
                    
                    <ul className="space-y-4 text-slate-600 mb-8 text-left">
                       {pkg.inclusions.map((inc, i) => (
                         <li key={i} className="flex items-start gap-3">
                           <FaCheck className="text-emerald-500 mt-1 flex-shrink-0" />
                           <span>{inc}</span>
                         </li>
                       ))}
                    </ul>
                    <button 
                      onClick={() => document.getElementById('enquiry-form').scrollIntoView({ behavior: 'smooth' })}
                      className="w-full py-3 bg-white border border-slate-200 text-slate-800 font-bold rounded-xl group-hover:bg-secondary group-hover:text-slate-900 group-hover:border-secondary transition-all"
                    >
                      Choose {pkg.name}
                    </button>
                 </div>
               ))
             ) : (
                // Fallback Layout if NO packages exist yet
               ['Silver', 'Gold', 'Platinum'].map((tier, i) => (
                 <div key={i} className="border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all hover:border-secondary relative group bg-slate-50 hover:bg-white text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{tier} Package</h3>
                    <div className="text-secondary font-bold text-xl mb-6">₹{1000 * (i+1)} <span className="text-sm text-slate-400 font-normal">/ person</span></div>
                    <ul className="space-y-4 text-slate-600 mb-8 text-left">
                       <li className="flex items-start gap-3"><FaCheck className="text-emerald-500 mt-1" /> <span>Buffet Dinner</span></li>
                       <li className="flex items-start gap-3"><FaCheck className="text-emerald-500 mt-1" /> <span>Standard Decoration</span></li>
                       <li className="flex items-start gap-3"><FaCheck className="text-emerald-500 mt-1" /> <span>Sound System</span></li>
                    </ul>
                    <button onClick={() => document.getElementById('enquiry-form').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-white border border-slate-200 text-slate-800 font-bold rounded-xl group-hover:bg-secondary group-hover:text-slate-900 group-hover:border-secondary transition-all">
                      Choose {tier}
                    </button>
                    <p className="text-xs text-slate-400 mt-2">(Sample Data)</p>
                 </div>
               ))
             )}
          </div>
        </div>
      </section>

      {/* 8. Enquiry Form */}
      <section id="enquiry-form" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-serif text-slate-900 mb-6">Plan Your Perfect Event</h2>
              <p className="text-slate-600 mb-10 text-lg leading-relaxed">
                Whether you're planning a lavish wedding or an intimate corporate gathering, our team of experts is here to make it seamless and memorable.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: FaPhoneAlt, title: "Call Us", text: "+91 22 1234 5678" },
                  { icon: FaEnvelope, title: "Email Us", text: "events@pearlhotel.com" },
                  { icon: FaMapMarkerAlt, title: "Visit Us", text: "Marina District, Mumbai" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xl">
                      <item.icon />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Send an Enquiry</h3>
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary outline-none" 
                    value={enquiry.name}
                    onChange={(e) => setEnquiry({...enquiry, name: e.target.value})}
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary outline-none" 
                    value={enquiry.email}
                    onChange={(e) => setEnquiry({...enquiry, email: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary outline-none" 
                    value={enquiry.phone}
                    onChange={(e) => setEnquiry({...enquiry, phone: e.target.value})}
                    required
                  />
                   <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary outline-none bg-white"
                    value={enquiry.eventType}
                    onChange={(e) => setEnquiry({...enquiry, eventType: e.target.value})}
                   >
                    <option>Wedding</option>
                    <option>Corporate</option>
                    <option>Social</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input 
                     type="date" 
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary outline-none bg-white" 
                     value={enquiry.date}
                     onChange={(e) => setEnquiry({...enquiry, date: e.target.value})}
                     required
                   />
                   <input 
                     type="number" 
                     placeholder="Guest Count" 
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary outline-none" 
                     value={enquiry.guestCount}
                     onChange={(e) => setEnquiry({...enquiry, guestCount: e.target.value})}
                     required
                   />
                </div>
                <textarea 
                  placeholder="Tell us about your requirements..." 
                  rows="4" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary outline-none"
                  value={enquiry.requirements}
                  onChange={(e) => setEnquiry({...enquiry, requirements: e.target.value})}
                ></textarea>
                <button type="submit" className="w-full py-4 bg-secondary text-slate-900 font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-lg">
                  Submit Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Events;

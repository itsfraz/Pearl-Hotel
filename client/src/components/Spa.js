import React, { useState, useEffect } from 'react';
import spaService from '../services/spaService';
import { motion } from 'framer-motion';
import { 
  FaSpa, 
  FaHotTub, 
  FaPhoneAlt, 
  FaCalendarCheck, 
  FaCheckCircle,
  FaLeaf,
  FaQuoteLeft,
  FaStar,
  FaClock,
  FaWhatsapp
} from 'react-icons/fa';
import { MdOutlineSelfImprovement, MdCleanHands } from 'react-icons/md';
import { TbMassage, TbYoga } from 'react-icons/tb';

const Spa = () => {
  const [activeTab, setActiveTab] = useState('massage');

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    date: '',
    time: '',
    guestName: '',
    guestEmail: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await spaService.getAllServices();
        setServices(data);
        if (data.length > 0) {
           setBookingData(prev => ({ ...prev, serviceId: data[0]._id }));
        }
      } catch (error) {
        console.error("Failed to fetch spa services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await spaService.createBooking(bookingData);
      alert('Booking Request Sent Successfully! We will confirm shortly via email.');
      setBookingData({
        serviceId: services[0]?._id || '',
        date: '',
        time: '',
        guestName: '',
        guestEmail: ''
      });
    } catch (error) {
       console.error(error);
       alert('Failed to book. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800">
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-wide drop-shadow-lg">
              Relax. Rejuvenate. Renew.
            </h1>
            <p className="text-xl md:text-2xl font-light mb-10 text-neutral-100 max-w-2xl mx-auto drop-shadow-md">
              Experience holistic wellness designed to restore your body, mind, and soul.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <FaSpa /> Book a Spa Session
              </button>
              <button className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white rounded-full font-medium transition-all shadow-lg flex items-center justify-center gap-2">
                <FaPhoneAlt size={14} /> Contact Wellness Desk
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About The Spa */}
      <section className="py-20 px-4 md:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">About Our Sanctuary</span>
              <h2 className="text-4xl md:text-5xl font-serif mt-3 mb-6 text-neutral-900 leading-tight">
                A Serene Escape from <br /> <span className="italic text-emerald-800">Daily Stress</span>
              </h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                Our spa & wellness center offers a sanctuary of peace, combining modern therapies with traditional healing techniques. 
                Whether you seek deep relaxation, skin rejuvenation, or mindful balance, our certified therapists ensure a transformative experience.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <MdOutlineSelfImprovement size={24} />
                  </div>
                  <span className="font-medium text-neutral-800">Holistic Therapy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <FaLeaf size={24} />
                  </div>
                  <span className="font-medium text-neutral-800">Organic Products</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80" 
                  alt="Spa Interior" 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                  <p className="text-white text-lg font-light italic">"Tranquility is the new luxury."</p>
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-emerald-100 rounded-full opacity-50 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Services Offered */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">Our Menu</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-3 text-neutral-900">Curated Wellness Treatments</h2>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100"
              >
                <div className="h-64 overflow-hidden relative">
                   <img 
                    src={service.image} 
                    alt={service.name}  
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {service.isPopular && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      MOST BOOKED
                    </div>
                  )}
                   <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-neutral-900 text-sm font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <FaClock size={12} className="text-emerald-600" /> {service.duration} mins
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-semibold text-neutral-800 group-hover:text-emerald-700 transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-lg font-bold text-emerald-800">₹{service.price}</span>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <button className="w-full py-3 rounded-xl border border-emerald-600 text-emerald-700 font-medium hover:bg-emerald-600 hover:text-white transition-all">
                    Book Treatment
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif mb-6">Why Choose Our Wellness Center?</h2>
              <p className="text-emerald-100/80 text-lg mb-8 leading-relaxed">
                We don't just offer treatments; we create experiences. Our commitment to excellence ensures every visit leaves you feeling completely renewed.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <FaStar />, text: "Certified Expert Therapists" },
                  { icon: <FaLeaf />, text: "Premium Organic Oils" },
                  { icon: <MdCleanHands />, text: "Hygienic & Sanitized" },
                  { icon: <FaHotTub />, text: "Private Therapy Suites" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="text-emerald-300 text-xl">{item.icon}</div>
                    <span className="font-medium text-emerald-50">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=400&q=80" className="rounded-2xl shadow-lg mt-8" alt="Detail 1" />
               <img src="https://images.unsplash.com/photo-1591343395082-e21b8c25da35?auto=format&fit=crop&w=400&q=80" className="rounded-2xl shadow-lg" alt="Detail 2" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Booking Section */}
      <section id="booking-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-neutral-50 rounded-3xl p-8 md:p-12 shadow-xl border border-neutral-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif text-neutral-800 mb-4">✨ Pamper Yourself Today</h2>
              <p className="text-neutral-500">Reserve your wellness session in just a few clicks.</p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleBookingSubmit}>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Select Service</label>
                <select 
                  name="serviceId"
                  value={bookingData.serviceId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                  required
                >
                  <option value="">Select a Service</option>
                  {services.map((s) => <option key={s._id} value={s._id}>{s.name} - ₹{s.price}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={bookingData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Time</label>
                <input 
                  type="time" 
                  name="time"
                  value={bookingData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white" 
                  required
                />
              </div>

               <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Your Details</label>
                <input 
                  type="text" 
                  name="guestName"
                  placeholder="Full Name" 
                  value={bookingData.guestName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white mb-3" 
                  required
                />
                <input 
                  type="email" 
                  name="guestEmail"
                  placeholder="Email Address" 
                  value={bookingData.guestEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white" 
                  required
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  Confirm Booking
                </button>
                <p className="text-center text-xs text-neutral-400 mt-4">
                  *No payment required now. You will pay at the spa desk.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <FaQuoteLeft className="text-4xl text-emerald-200 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-neutral-800 mb-12">Stories of Relaxation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "One of the most relaxing spa experiences I've ever had. Clean, peaceful, and professional staff.",
                author: "Sarah J.",
                type: "Luxury Suite Guest"
              },
              {
                text: "The Aromatherapy massage was out of this world. Totally worth every penny!",
                author: "Michael R.",
                type: "Day Visitor"
              },
              {
                text: "My wife and I loved the couple's package. A perfect start to our honeymoon.",
                author: "David & Emily",
                type: "Honeymooners"
              }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4 text-yellow-400">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-neutral-600 italic mb-6">"{review.text}"</p>
                <h4 className="font-bold text-neutral-900">{review.author}</h4>
                <span className="text-xs text-emerald-600 uppercase tracking-widest">{review.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Footer CTA */}
      <section className="py-20 bg-emerald-950 text-white text-center mb-16 md:mb-0">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Reconnect with yourself.</h2>
          <p className="text-emerald-200/60 text-xl mb-10">Book your spa & wellness experience today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
                onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-white text-emerald-900 rounded-full font-bold hover:bg-neutral-200 transition-colors"
             >
               Book Now
             </button>
             <button className="px-8 py-3 bg-transparent border border-emerald-700 text-emerald-100 rounded-full font-medium hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2">
               <FaWhatsapp /> Chat on WhatsApp
             </button>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-emerald-100 md:hidden z-40">
        <button 
          onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <FaCalendarCheck /> Book Appointment
        </button>
      </div>
    </div>
  );
};

export default Spa;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import RoomCard from "./RoomCard";
import BookingWidget from "./BookingWidget";
import VirtualTour from "./VirtualTour";
import Gallery from "./Gallery";
import { 
  FaStar, FaQuoteLeft, FaFacebookF, FaTwitter, FaInstagram, 
  FaYoutube, FaWhatsapp, FaMapMarkerAlt, 
  FaPhone, FaEnvelope, FaClock, FaArrowRight, FaSpa, FaConciergeBell, FaSwimmingPool, FaWifi
} from 'react-icons/fa';

const Home = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroImages = [
    "/images/slider/hotel1.jpg",
    "/images/slider/hotel2.jpg",
    "/images/slider/hotel3.jpg",
    "/images/slider/hotel4.jpg"
  ];
  
  const galleryImages = [
    "/images/slider/hotel1.jpg",
    "/images/slider/hotel2.jpg",
    "/images/slider/hotel3.jpg",
    "/images/slider/hotel4.jpg",
    "/images/slider/hotel2.jpg",
    "/images/slider/hotel1.jpg"
  ];

  const featuredRooms = [
    {
      _id: "1",
      name: "Luxury Suite",
      description: "Spacious suite with ocean view, private balcony, and jacuzzi.",
      price: 24999,
      images: ["/images/slider/hotel1.jpg"] 
    },
    {
      _id: "2",
      name: "Deluxe Room",
      description: "Modern aesthetics with city skyline view and premium king bed.",
      price: 14999,
      images: ["/images/slider/hotel3.jpg"]
    },
    {
      _id: "3",
      name: "Family Suite",
      description: "Two-bedroom sanctuary perfect for families, featuring a living area.",
      price: 34999,
      images: ["/images/slider/hotel2.jpg"]
    }
  ];

  const testimonials = [
    {
      text: "The best hotel experience I've ever had! The staff was incredibly friendly, and the rooms were spotless.",
      author: "John Doe",
      role: "Business Traveler",
      rating: 5
    },
    {
      text: "Amazing amenities and a beautiful location. Highly recommended for anyone looking for a luxury stay!",
      author: "Jane Smith",
      role: "Vacation Traveler",
      rating: 5
    },
    {
      text: "Perfect for a relaxing getaway. The spa was heavenly and the service was impeccable!",
      author: "Emily Johnson",
      role: "Spa Enthusiast",
      rating: 5
    }
  ];

  const contactInfo = {
    address: "123 Luxury Avenue, Marina District, Mumbai, 400001",
    phone: "+91 (22) 1234-5678",
    email: "reservations@pearlhotel.com",
    hours: "24/7 Front Desk"
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans text-slate-600">
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden group">
        {/* Background Swiper */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="h-full w-full"
          >
            {heroImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img 
                    src={img} 
                    alt={`Pearl Hotel Ambience ${index + 1}`} 
                    className="w-full h-full object-cover object-center animate-slow-zoom"
                  />
                  {/* Overlay Gradient per slide for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="animate-slide-up">
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium tracking-widest uppercase mb-6">
              Welcome to Paradise
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight drop-shadow-lg">
              Pearl <span className="text-secondary italic">Hotel</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Experience the pinnacle of luxury, comfort, and personalized service in the heart of the city.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link
                to="/rooms"
                className="group relative px-8 py-4 bg-secondary text-primary font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Explore Rooms <FaArrowRight />
                </span>
              </Link>
              <button 
                onClick={() => document.getElementById('amenities').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
              >
                View Amenities
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Booking Widget Overlay */}
      <div className="container mx-auto px-4 relative z-30">
         <BookingWidget />
      </div>

      {/* Info Strip */}
      <div className="relative z-20 mt-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {[
            { icon: FaSpa, title: "Luxury Spa", desc: "Rejuvenate your senses" },
            { icon: FaSwimmingPool, title: "Infinity Pool", desc: "Swim with a view" },
            { icon: FaConciergeBell, title: "24/7 Service", desc: "Always here for you" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-2">
              <div className="p-3 bg-primary/5 rounded-full text-primary text-2xl">
                <item.icon />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-primary">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Rooms */}
      <section className="py-24 bg-surface-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-display text-4xl md:text-5xl font-bold mb-4">Exquisite Accommodation</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Designed for comfort and curated for luxury. Choose the perfect retreat for your stay.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/rooms" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors underline-offset-4 hover:underline">
              View All Rooms <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Virtual Tour */}
      <VirtualTour />

      {/* Gallery */}
      <Gallery images={galleryImages} />

      {/* Testimonials */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">Guest Stories</h2>
              <p className="text-slate-400">Memories made at Pearl Hotel</p>
            </div>
            <div className="hidden md:block">
              <FaQuoteLeft className="text-6xl text-white/10" />
            </div>
          </div>

          {/* Scrolling Ticker */}
          <div className="relative overflow-hidden w-full">
            <div className="flex animate-scroll gap-6 w-max">
              {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="w-[400px] p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <div className="flex text-secondary mb-4">
                    {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
                  </div>
                  <p className="text-xl text-slate-200 italic mb-6 leading-relaxed">"{t.text}"</p>
                  <div>
                    <div className="font-bold text-white">{t.author}</div>
                    <div className="text-sm text-slate-400">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="bg-slate-950 text-slate-400 py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand */}
            <div>
              <Link to="/" className="inline-block mb-6">
                 <span className="font-display font-bold text-3xl text-white">
                  Pearl<span className="text-secondary">Hotel</span>
                </span>
              </Link>
              <p className="mb-6 leading-relaxed text-sm">
                Where luxury meets tailored hospitality. Dedicated to providing an unforgettable experience for every guest.
              </p>
              <div className="flex gap-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Explore</h4>
              <ul className="space-y-3 text-sm">
                {['Home', 'Rooms', 'Dining', 'Spa & Wellness', 'Events'].map(item => (
                  <li key={item}><Link to="#" className="hover:text-secondary transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 text-secondary" />
                  <span>{contactInfo.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="text-secondary" />
                  <span>{contactInfo.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-secondary" />
                  <span>{contactInfo.email}</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Subscribe</h4>
              <p className="text-sm mb-4">Join our list for exclusive offers.</p>
              <form className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-slate-900 border border-slate-800 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                />
                <button className="bg-secondary text-primary font-bold py-3 rounded hover:bg-white transition-colors">
                  Subscribe
                </button>
              </form>
            </div>

          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} Pearl Hotel. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link to="#" className="hover:text-white">Privacy Policy</Link>
              <Link to="#" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
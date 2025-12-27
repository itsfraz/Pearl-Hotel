import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import menuService from '../services/menuService';
import { toast } from 'react-toastify';
import { 
  FaUtensils, FaCocktail, FaCoffee, FaClock, FaPhone, 
  FaEnvelope, FaStar, FaLeaf, FaFire, FaGlassMartini,
  FaChevronRight, FaAward, FaHeart, FaMapMarkerAlt
} from 'react-icons/fa';

const Dining = () => {
  const [activeMenu, setActiveMenu] = useState('breakfast');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuService.getAllMenuItems({ isAvailable: true });
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  // Group menu items by category
  const menuCategories = {
    breakfast: menuItems.filter(item => item.category === 'breakfast'),
    lunch: menuItems.filter(item => item.category === 'lunch'),
    dinner: menuItems.filter(item => item.category === 'dinner'),
    desserts: menuItems.filter(item => item.category === 'desserts'),
    beverages: menuItems.filter(item => item.category === 'beverages'),
    appetizers: menuItems.filter(item => item.category === 'appetizers')
  };

  // Only show categories that have items
  const availableCategories = Object.keys(menuCategories).filter(
    category => menuCategories[category].length > 0
  );

  // Set initial active menu to first available category
  useEffect(() => {
    if (availableCategories.length > 0 && !menuCategories[activeMenu]?.length) {
      setActiveMenu(availableCategories[0]);
    }
  }, [menuItems]);

  const restaurants = [
    {
      name: "The Pearl Restaurant",
      tagline: "Fine Dining Excellence",
      description: "Experience culinary artistry at its finest. Our award-winning chefs craft exquisite dishes using the freshest local ingredients and international flavors.",
      icon: FaUtensils,
      image: "/images/slider/hotel1.jpg",
      cuisine: "International & Continental",
      hours: "Breakfast: 7:00 AM - 11:00 AM | Lunch: 12:30 PM - 3:30 PM | Dinner: 7:00 PM - 11:00 PM",
      features: ["Private Dining", "Chef's Table", "Wine Pairing", "Vegetarian Options"]
    },
    {
      name: "Sky Lounge",
      tagline: "Rooftop Bar & Grill",
      description: "Elevate your evening with panoramic city views, handcrafted cocktails, and a sophisticated menu of grilled specialties and tapas.",
      icon: FaCocktail,
      image: "/images/slider/hotel2.jpg",
      cuisine: "Cocktails & Grills",
      hours: "Daily: 5:00 PM - 1:00 AM",
      features: ["Live Music", "Signature Cocktails", "Sunset Views", "Premium Spirits"]
    },
    {
      name: "Pearl Café",
      tagline: "All-Day Dining",
      description: "A casual yet elegant setting perfect for any time of day. Enjoy fresh pastries, artisan coffee, light meals, and decadent desserts.",
      icon: FaCoffee,
      image: "/images/slider/hotel3.jpg",
      cuisine: "Café & Bakery",
      hours: "24/7 Service",
      features: ["Fresh Pastries", "Artisan Coffee", "Healthy Options", "Takeaway Available"]
    }
  ];

  const specialties = [
    {
      title: "Farm to Table",
      description: "We source ingredients from local organic farms",
      icon: FaLeaf,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Master Chefs",
      description: "Award-winning culinary team with international experience",
      icon: FaAward,
      color: "from-secondary to-secondary-dark"
    },
    {
      title: "Signature Dishes",
      description: "Exclusive recipes crafted by our executive chef",
      icon: FaFire,
      color: "from-red-500 to-orange-600"
    },
    {
      title: "Curated Wines",
      description: "Premium wine selection from around the world",
      icon: FaGlassMartini,
      color: "from-purple-500 to-pink-600"
    }
  ];

  const getTagColor = (tag) => {
    switch(tag) {
      case "Chef's Special": return "bg-secondary text-primary";
      case "Popular": return "bg-blue-500 text-white";
      case "Healthy": return "bg-green-500 text-white";
      case "Vegetarian": return "bg-emerald-500 text-white";
      case "Vegan": return "bg-lime-500 text-white";
      case "Premium": return "bg-purple-600 text-white";
      case "Spicy": return "bg-red-500 text-white";
      case "New": return "bg-pink-500 text-white";
      default: return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-secondary mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/slider/hotel4.jpg" 
            alt="Fine Dining at Pearl Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 py-2 px-4 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium tracking-widest uppercase mb-6">
              <FaUtensils className="text-secondary" />
              Culinary Excellence
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Dining at <span className="text-secondary">Pearl Hotel</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Indulge in a symphony of flavors where every dish tells a story of passion, precision, and perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#reservations"
                className="group relative px-8 py-4 bg-secondary text-primary font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Make a Reservation <FaChevronRight />
                </span>
              </a>
              <a
                href="#menu"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300"
              >
                View Menu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Specialties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-display text-4xl md:text-5xl font-bold mb-4">What Makes Us Special</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Every detail is crafted to create an unforgettable dining experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialties.map((specialty, index) => (
              <div 
                key={index}
                className="group relative bg-surface-50 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${specialty.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className={`relative w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${specialty.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <specialty.icon />
                </div>
                <h3 className="font-display font-bold text-xl text-primary mb-3">{specialty.title}</h3>
                <p className="text-slate-600 leading-relaxed">{specialty.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Restaurants */}
      <section className="py-20 bg-surface-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-display text-4xl md:text-5xl font-bold mb-4">Our Dining Venues</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Three distinct experiences, one unforgettable destination
            </p>
          </div>

          <div className="space-y-12">
            {restaurants.map((restaurant, index) => (
              <div 
                key={index}
                className={`group flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500`}
              >
                <div className="lg:w-1/2 relative overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover min-h-[400px] group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 text-white mb-2">
                      <restaurant.icon className="text-3xl text-secondary" />
                      <span className="text-sm font-semibold tracking-widest uppercase">{restaurant.tagline}</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">{restaurant.name}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">{restaurant.description}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FaUtensils className="text-secondary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-primary">Cuisine</div>
                        <div className="text-slate-600">{restaurant.cuisine}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaClock className="text-secondary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-primary">Hours</div>
                        <div className="text-slate-600 text-sm">{restaurant.hours}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {restaurant.features.map((feature, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-primary/5 text-primary text-sm font-medium rounded-full border border-primary/10"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <a 
                    href="#reservations"
                    className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-4 transition-all duration-300"
                  >
                    Reserve a Table <FaChevronRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-display text-4xl md:text-5xl font-bold mb-4">Our Menu</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              A curated selection of our finest offerings
            </p>
          </div>

          {/* Menu Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(menuCategories).map((category) => (
              <button
                key={category}
                onClick={() => setActiveMenu(category)}
                className={`px-8 py-3 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                  activeMenu === category
                    ? 'bg-secondary text-primary shadow-lg shadow-secondary/30'
                    : 'bg-surface-50 text-slate-600 hover:bg-surface-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="max-w-7xl mx-auto">
            {menuCategories[activeMenu]?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuCategories[activeMenu].map((item) => (
                  <div 
                    key={item._id}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
                  >
                    {/* Image Section with Gradient Overlay */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      {item.image ? (
                        <>
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
                          <FaUtensils className="text-6xl text-slate-300" />
                        </div>
                      )}
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {/* Tag Badge */}
                        {item.tag && (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${getTagColor(item.tag)}`}>
                            {item.tag === 'Spicy' && <FaFire className="text-xs" />}
                            {item.tag === 'Vegan' && <FaLeaf className="text-xs" />}
                            {item.tag === "Chef's Special" && <FaAward className="text-xs" />}
                            {item.tag}
                          </span>
                        )}
                        
                        {/* Favorite Button */}
                        <button className="ml-auto p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group/fav">
                          <FaHeart className="text-slate-400 group-hover/fav:text-red-500 transition-colors" />
                        </button>
                      </div>

                      {/* Restaurant Badge */}
                      {item.restaurant && (
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-semibold text-primary shadow-lg">
                            <FaUtensils className="text-secondary text-xs" />
                            {item.restaurant}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Title and Price */}
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-display font-bold text-xl text-primary group-hover:text-secondary transition-colors duration-300 leading-tight pr-2">
                          {item.name}
                        </h4>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-2xl text-secondary whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Meta Information */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.preparationTime && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                            <FaClock className="text-secondary" />
                            {item.preparationTime} min
                          </span>
                        )}
                        {item.calories && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                            <FaFire className="text-orange-500" />
                            {item.calories} cal
                          </span>
                        )}
                      </div>

                      {/* Special Item Indicator */}
                      {item.isSpecialItem && (
                        <div className="flex items-center gap-2 text-secondary text-xs font-semibold mb-4">
                          <FaStar className="animate-pulse" />
                          <span>Chef's Recommendation</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <a 
                        href="#reservations"
                        className="block w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:from-secondary hover:to-secondary-dark transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-secondary/30 transform hover:-translate-y-0.5 group/btn"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Place Order
                          <FaChevronRight className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </a>
                    </div>

                    {/* Decorative Corner Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-secondary/10 blur-3xl"></div>
                  <FaUtensils className="relative text-7xl text-slate-300 mx-auto mb-6" />
                </div>
                <p className="text-slate-500 text-xl font-semibold mb-2">No items available in this category yet</p>
                <p className="text-slate-400 text-sm">Check back soon for delicious additions!</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-500 text-sm mb-4">
              <FaHeart className="inline text-red-500 mr-2" />
              All dishes can be customized to your dietary preferences
            </p>
          </div>
        </div>
      </section>

      {/* Reservations CTA */}
      <section id="reservations" className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready for an Unforgettable <span className="text-secondary">Dining Experience?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Reserve your table today and let us create memories that will last a lifetime
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <FaPhone className="text-3xl text-secondary mx-auto mb-4" />
                <div className="font-semibold mb-2">Call Us</div>
                <a href="tel:+912212345678" className="text-slate-300 hover:text-secondary transition-colors">
                  +91 (22) 1234-5678
                </a>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <FaEnvelope className="text-3xl text-secondary mx-auto mb-4" />
                <div className="font-semibold mb-2">Email Us</div>
                <a href="mailto:dining@pearlhotel.com" className="text-slate-300 hover:text-secondary transition-colors">
                  dining@pearlhotel.com
                </a>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <FaMapMarkerAlt className="text-3xl text-secondary mx-auto mb-4" />
                <div className="font-semibold mb-2">Visit Us</div>
                <div className="text-slate-300 text-sm">
                  123 Luxury Avenue, Mumbai
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-secondary text-primary font-bold rounded-full hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-secondary/50"
            >
              Make a Reservation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dining;

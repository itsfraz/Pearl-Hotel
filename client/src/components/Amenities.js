import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSwimmingPool, FaWifi, FaDumbbell, FaSpa, 
  FaParking, FaUtensils, FaCocktail, FaCoffee,
  FaCar, FaBed, FaConciergeBell, FaGamepad,
  FaTv, FaSnowflake, FaLock, FaFirstAid
} from 'react-icons/fa';

const Amenities = () => {
  const amenitiesList = [
    {
      category: "Wellness & Recreation",
      items: [
        { name: "Swimming Pool", description: "Temperature-controlled infinity pool with stunning views", icon: FaSwimmingPool },
        { name: "Fitness Center", description: "State-of-the-art gym equipment and personal trainers", icon: FaDumbbell },
        { name: "Luxury Spa", description: "Full-service spa offering massages and treatments", icon: FaSpa },
        { name: "Game Room", description: "Entertainment zone with various indoor games", icon: FaGamepad }
      ]
    },
    {
      category: "Dining & Refreshments",
      items: [
        { name: "Fine Dining Restaurant", description: "International cuisine with master chefs", icon: FaUtensils },
        { name: "Rooftop Bar", description: "Exclusive cocktails with panoramic city views", icon: FaCocktail },
        { name: "Café", description: "24/7 café serving fresh beverages and snacks", icon: FaCoffee }
      ]
    },
    {
      category: "Convenience & Services",
      items: [
        { name: "Free Wi-Fi", description: "High-speed internet throughout the property", icon: FaWifi },
        { name: "Valet Parking", description: "Secure parking with valet service", icon: FaParking },
        { name: "Airport Transfer", description: "Luxury car pickup and drop service", icon: FaCar },
        { name: "24/7 Room Service", description: "Round-the-clock in-room dining", icon: FaBed },
        { name: "Concierge", description: "Personalized assistance for all guest needs", icon: FaConciergeBell }
      ]
    },
    {
      category: "Room Features",
      items: [
        { name: "Smart TV", description: "55-inch 4K TVs with streaming services", icon: FaTv },
        { name: "Climate Control", description: "Individual temperature control in each room", icon: FaSnowflake },
        { name: "Digital Safe", description: "In-room electronic safes", icon: FaLock }
      ]
    },
    {
      category: "Safety & Security",
      items: [
        { name: "24/7 Security", description: "Round-the-clock security personnel", icon: FaLock },
        { name: "Medical Services", description: "On-call medical assistance", icon: FaFirstAid }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <div className="relative py-24 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1571896349842-6e53ce41be03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-slide-up">
            World-Class <span className="text-secondary">Amenities</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Experience the pinnacle of luxury and comfort. Every detail at Pearl Hotel is designed to elevate your stay.
          </p>
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {amenitiesList.map((category, index) => (
          <div key={index} className="mb-20 last:mb-0">
            <h2 className="flex items-center gap-4 text-3xl font-display font-bold text-slate-800 mb-10">
              <span className="w-8 h-1 bg-secondary rounded-full"></span>
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <item.icon className="text-2xl text-primary group-hover:text-secondary transition-colors duration-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden bg-primary p-12 lg:p-16 text-center shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Experience It All?
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Book your stay now and indulge in our premium amenities. Your perfect getaway is just a click away.
            </p>
            <Link 
              to="/rooms"
              className="inline-block px-10 py-4 bg-secondary text-primary font-bold rounded-full hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-secondary/50"
            >
              Book Your Stay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;

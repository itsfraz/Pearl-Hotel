import React, { useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const contactInfo = [
        {
            icon: FaPhone,
            title: "Phone",
            details: "+91 (22) 1234-5678",
            description: "Mon-Fri from 8am to 5pm"
        },
        {
            icon: FaEnvelope,
            title: "Email",
            details: "reservations@pearlhotel.com",
            description: "Online support 24/7"
        },
        {
            icon: FaMapMarkerAlt,
            title: "Location",
            details: "123 Luxury Avenue, Mumbai",
            description: "Marina District, 400001"
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your message. We will get back to you shortly.");
    };

    return (
        <div className="min-h-screen bg-surface-50 pt-20">
            {/* Header */}
            <div className="bg-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 animate-slide-up">Contact Us</h1>
                    <p className="text-slate-300 max-w-xl mx-auto px-4 animate-fade-in">
                        We are here to assist you. Reach out to us for any queries or special requests.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary text-2xl mb-6">
                                <info.icon />
                            </div>
                            <h3 className="text-xl font-display font-bold text-slate-800 mb-2">{info.title}</h3>
                            <p className="text-primary font-medium mb-1">{info.details}</p>
                            <p className="text-sm text-slate-400">{info.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    {/* Form */}
                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-display font-bold text-primary mb-2">Send us a Message</h2>
                        <p className="text-slate-500 mb-8">We'd love to hear from you. Please fill out the form below.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Name</label>
                                    <input type="text" className="w-full p-4 bg-surface-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Your Name" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email</label>
                                    <input type="email" className="w-full p-4 bg-surface-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="your@email.com" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Subject</label>
                                <input type="text" className="w-full p-4 bg-surface-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="How can we help?" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Message</label>
                                <textarea className="w-full p-4 bg-surface-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[150px] resize-none" placeholder="Your message..." required></textarea>
                            </div>
                            <button className="w-full py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Quick Info & Social */}
                    <div className="bg-slate-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl font-display font-bold mb-6">Connect With Us</h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Follow us on social media for exclusive offers, updates, and a glimpse into the Pearl Hotel experience.
                            </p>
                            <div className="flex gap-4">
                                {[FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300 backdrop-blur-sm">
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 mt-12">
                            <h3 className="text-xl font-display font-bold mb-4">Location</h3>
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-800 border border-white/10">
                                {/* Placeholder for Map */}
                                <div className="w-full h-full flex items-center justify-center text-slate-500 bg-white/5">
                                    <div className="text-center">
                                         <FaMapMarkerAlt className="text-3xl mx-auto mb-2 opacity-50" />
                                         <p className="text-sm">Google Map Integration</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

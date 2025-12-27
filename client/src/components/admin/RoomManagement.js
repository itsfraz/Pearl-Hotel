import React, { useState, useEffect } from 'react';
import roomService from '../../services/roomService';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaBed, FaDollarSign, FaList, FaImage, FaHashtag, FaUsers, 
  FaWifi, FaSwimmingPool, FaDumbbell, FaParking, FaHotTub, FaTv, FaWind, FaCoffee, FaGlassMartini, 
  FaBell, FaSpa, FaSnowflake, FaUtensils, FaCheck, FaRulerCombined, FaAlignLeft, FaShower, FaToilet,
  FaPhone, FaBroom, FaLock, FaVideo, FaFire, FaExclamationTriangle, FaShieldAlt,
  FaConciergeBell, FaClock, FaLightbulb, FaPlug, FaCouch, FaSoap, FaBath, FaSatelliteDish, 
  FaUserShield } from 'react-icons/fa';
import { MdRestaurant, MdKitchen, MdBalcony, MdLocalLaundryService, MdIron, 
  MdSecurity, MdFamilyRestroom, MdSmokeFree, MdPowerSettingsNew, MdElevator } from 'react-icons/md';
import { GiTowel, GiPillow, GiDesk } from 'react-icons/gi';
import { BiCloset } from 'react-icons/bi';

// Comprehensive Hotel Amenities List
const AVAILABLE_AMENITIES = [
  // 🛏️ Room Essentials
  { name: 'Free WiFi', icon: FaWifi },
  { name: 'Air Conditioning', icon: FaWind },
  { name: 'Comfortable Bed', icon: FaBed },
  { name: 'Fresh Linen', icon: GiPillow },
  { name: 'Wardrobe / Closet', icon: BiCloset },
  { name: 'Work Desk / Table', icon: GiDesk },
  { name: 'Seating Area', icon: FaCouch },
  { name: 'Power Sockets', icon: FaPlug },
  { name: 'Room Lighting', icon: FaLightbulb },
  
  // 🚿 Bathroom Essentials
  { name: 'Attached Bathroom', icon: FaToilet },
  { name: 'Hot & Cold Water', icon: FaHotTub },
  { name: 'Towels', icon: GiTowel },
  { name: 'Toiletries (Soap, Shampoo)', icon: FaSoap },
  { name: 'Shower', icon: FaShower },
  { name: 'Mirror', icon: FaBath },
  { name: 'Bathtub', icon: FaBath },
  
  // 📺 Basic Comfort & Tech
  { name: 'Flat-Screen TV', icon: FaTv },
  { name: 'Cable / Satellite Channels', icon: FaSatelliteDish },
  { name: 'Telephone', icon: FaPhone },
  { name: 'Mini Bar', icon: FaGlassMartini },
  { name: 'Coffee Maker', icon: FaCoffee },
  { name: 'Full Kitchen', icon: MdKitchen },
  { name: 'Private Balcony', icon: MdBalcony },
  
  // 🧹 Services
  { name: 'Daily Housekeeping', icon: FaBroom },
  { name: 'Room Service', icon: FaBell },
  { name: 'Wake-up Call', icon: FaClock },
  { name: 'Laundry Service', icon: MdLocalLaundryService },
  { name: 'Iron & Ironing Board', icon: MdIron },
  
  // 🔐 Safety & Security
  { name: 'Secure Door Lock', icon: FaLock },
  { name: 'CCTV in Common Areas', icon: FaVideo },
  { name: 'Fire Safety System', icon: FaFire },
  { name: 'Emergency Exit Information', icon: FaExclamationTriangle },
  { name: 'In-room Safe', icon: FaShieldAlt },
  
  // 🏨 Hotel-Level Amenities
  { name: '24×7 Front Desk', icon: FaConciergeBell },
  { name: 'Elevator / Lift', icon: MdElevator },
  { name: 'Power Backup', icon: MdPowerSettingsNew },
  { name: 'Parking', icon: FaParking },
  { name: 'Security', icon: MdSecurity },
  { name: 'Swimming Pool', icon: FaSwimmingPool },
  { name: 'Gym Access', icon: FaDumbbell },
  { name: 'Spa Access', icon: FaSpa },
  { name: 'Restaurant', icon: MdRestaurant },
  { name: 'Restaurant Access', icon: FaUtensils },
  
  // 🌐 Booking Filter Amenities
  { name: 'Family Rooms', icon: MdFamilyRestroom },
  { name: 'Non-Smoking Rooms', icon: MdSmokeFree },
  { name: 'Wheelchair Accessible', icon: FaUserShield },
];

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    roomNumber: '',
    price: '',
    capacity: '',
    description: '',
    size: '',
    bedType: '',
    amenities: [],
    features: '',
    images: ''
  });
  const [loading, setLoading] = useState(false);
  const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        name: selectedRoom.name || '',
        type: selectedRoom.type,
        roomNumber: selectedRoom.roomNumber,
        price: selectedRoom.price,
        capacity: selectedRoom.capacity,
        description: selectedRoom.description || '',
        size: selectedRoom.size || '',
        bedType: selectedRoom.bedType || '',
        amenities: selectedRoom.amenities || [],
        features: selectedRoom.features?.join(', ') || '',
        images: selectedRoom.images?.join(', ') || ''
      });
    } else {
      setFormData({
        name: '',
        type: '',
        roomNumber: '',
        price: '',
        capacity: '',
        description: '',
        size: '',
        bedType: '',
        amenities: [],
        features: '',
        images: ''
      });
    }
  }, [selectedRoom]);

  const fetchRooms = async () => {
    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const roomData = {
        name: formData.name,
        type: formData.type,
        roomNumber: formData.roomNumber,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        description: formData.description,
        size: formData.size,
        bedType: formData.bedType,
        amenities: formData.amenities,
        features: formData.features.split(',').map(item => item.trim()).filter(i => i),
        images: formData.images.split(',').map(item => item.trim()).filter(i => i),
      };

      if (selectedRoom) {
        await roomService.updateRoom(selectedRoom._id, roomData);
      } else {
        await roomService.createRoom(roomData);
      }
      
      clearForm();
      fetchRooms();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenityName) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter(a => a !== amenityName)
        : [...prev.amenities, amenityName]
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await roomService.deleteRoom(id);
        fetchRooms();
      } catch (error) {
        console.error('Error:', error);
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const clearForm = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-display font-bold text-primary">Manage Rooms</h2>
         <button 
           onClick={() => { clearForm(); document.getElementById('roomForm').scrollIntoView({ behavior: 'smooth' }); }}
           className="bg-secondary text-white px-4 py-2 rounded-lg font-bold hover:bg-secondary-dark transition-colors flex items-center gap-2"
         >
           <FaPlus /> Add New Room
         </button>
      </div>
      
      <div id="roomForm" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold text-slate-800">{selectedRoom ? 'Edit Room' : 'Add New Room'}</h3>
           {selectedRoom && <button onClick={clearForm} className="text-slate-400 hover:text-red-500"><FaTimes /></button>}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaBed /> Room Name</label>
            <input
              type="text"
              placeholder="e.g. Luxury Ocean View Suite"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaBed /> Room Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            >
              <option value="">Select Type</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Simple">Simple</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaHashtag /> Room Number</label>
            <input
              type="text"
              placeholder="e.g. 101"
              value={formData.roomNumber}
              onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaDollarSign /> Price (per night)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaUsers /> Capacity</label>
            <input
              type="number"
              placeholder="e.g. 2"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaRulerCombined /> Room Size</label>
            <input
              type="text"
              placeholder="e.g. 400 sq ft"
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaBed /> Bed Type</label>
            <input
              type="text"
              placeholder="e.g. 1 King Bed + 1 Sofa Bed"
              value={formData.bedType}
              onChange={(e) => setFormData({...formData, bedType: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaAlignLeft /> Description</label>
            <textarea
              placeholder="Describe the room features, views, and unique selling points..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaList /> Amenities</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-left flex justify-between items-center"
              >
                <span className="text-slate-600">
                  {formData.amenities.length === 0 ? 'Select amenities...' : `${formData.amenities.length} selected`}
                </span>
                <FaList className="text-slate-400" />
              </button>
              
              {showAmenitiesDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.name);
                    return (
                      <div
                        key={amenity.name}
                        onClick={() => toggleAmenity(amenity.name)}
                        className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-blue-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                          {isSelected && <FaCheck className="text-white text-xs" />}
                        </div>
                        <Icon className="text-primary text-lg" />
                        <span className="font-medium text-slate-700">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.amenities.map((amenity) => (
                  <span key={amenity} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2">
                    {amenity}
                    <FaTimes className="cursor-pointer hover:text-red-500" onClick={() => toggleAmenity(amenity)} />
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaList /> Features (comma-separated)</label>
            <textarea
              placeholder="Separate living area, Work desk, Marble bathroom, Deep soaking tub..."
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[80px]"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaImage /> Image URLs (comma-separated)</label>
            <textarea
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              value={formData.images}
              onChange={(e) => setFormData({...formData, images: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[80px]"
              required
            />
             <p className="text-xs text-slate-400">Enter full absolute URLs for images, separated by commas.</p>
          </div>
          
          <div className="md:col-span-2 flex gap-4 pt-4">
            <button 
              type="submit" 
              className={`flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : (selectedRoom ? 'Update Room' : 'Create Room')}
            </button>
            {selectedRoom && (
              <button 
                type="button" 
                onClick={clearForm} 
                className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
           <h3 className="text-xl font-bold text-slate-800">Inventory ({rooms.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Room No.</th>
                <th className="p-4">Type</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map(room => (
                <tr key={room._id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-mono font-medium text-slate-700">{room.roomNumber}</td>
                  <td className="p-4 font-medium text-slate-800">{room.type}</td>
                  <td className="p-4 text-slate-600">{room.capacity} Guests</td>
                  <td className="p-4 font-bold text-secondary-dark">₹{room.price}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => { setSelectedRoom(room); document.getElementById('roomForm').scrollIntoView({ behavior: 'smooth' }); }} 
                         className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                         title="Edit"
                       >
                         <FaEdit />
                       </button>
                       <button 
                         onClick={() => handleDelete(room._id)} 
                         className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                         title="Delete"
                       >
                         <FaTrash />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                   <td colSpan="5" className="p-8 text-center text-slate-400">No rooms found. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default RoomManagement;
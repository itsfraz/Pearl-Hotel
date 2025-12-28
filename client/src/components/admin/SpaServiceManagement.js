import React, { useState, useEffect } from 'react';
import spaService from '../../services/spaService';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSpa, FaDollarSign, FaClock, FaTags, FaAlignLeft, FaCheck, FaImage, FaStar, FaFire } from 'react-icons/fa';

const SpaServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration: '',
    price: '',
    description: '',
    image: '',
    isFeatured: false,
    isPopular: false,
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      setFormData({
        name: selectedService.name || '',
        category: selectedService.category || '',
        duration: selectedService.duration || '',
        price: selectedService.price || '',
        description: selectedService.description || '',
        image: selectedService.image || '',
        isFeatured: selectedService.isFeatured || false,
        isPopular: selectedService.isPopular || false,
        isActive: selectedService.isActive !== undefined ? selectedService.isActive : true
      });
      setImagePreview(selectedService.image || '');
    } else {
      setFormData({
        name: '',
        category: '',
        duration: '',
        price: '',
        description: '',
        image: '',
        isFeatured: false,
        isPopular: false,
        isActive: true
      });
      setImagePreview('');
    }
  }, [selectedService]);

  const fetchServices = async () => {
    try {
      const data = await spaService.getAllServicesAdmin();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration)
      };

      if (selectedService) {
        await spaService.updateService(selectedService._id, serviceData);
      } else {
        await spaService.createService(serviceData);
      }
      
      clearForm();
      fetchServices();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await spaService.deleteService(id);
        fetchServices();
      } catch (error) {
        console.error('Error:', error);
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const clearForm = () => {
    setSelectedService(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <FaSpa /> Spa Service Management
         </h2>
         <button 
           onClick={() => { clearForm(); document.getElementById('serviceForm').scrollIntoView({ behavior: 'smooth' }); }}
           className="bg-secondary text-white px-4 py-2 rounded-lg font-bold hover:bg-secondary-dark transition-colors flex items-center gap-2"
         >
           <FaPlus /> Add New Service
         </button>
      </div>
      
      <div id="serviceForm" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold text-slate-800">{selectedService ? 'Edit Service' : 'Add New Service'}</h3>
           {selectedService && <button onClick={clearForm} className="text-slate-400 hover:text-red-500"><FaTimes /></button>}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaSpa /> Service Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Aromatherapy Massage"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaTags /> Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            >
              <option value="">Select Category</option>
              <option value="Massage">Massage</option>
              <option value="Therapy">Therapy</option>
              <option value="Sauna">Sauna</option>
              <option value="Yoga">Yoga</option>
              <option value="Facial">Facial</option>
              <option value="Wellness">Wellness</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaClock /> Duration (min)</label>
            <input
              type="number"
              name="duration"
              placeholder="e.g. 60"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaDollarSign /> Price</label>
            <input
              type="number"
              name="price"
              placeholder="e.g. 2500"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaAlignLeft /> Description</label>
            <textarea
              name="description"
              placeholder="Describe the service benefits and process..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]"
              required
            />
          </div>

           <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><FaImage /> Image URL</label>
            <div className="flex gap-4 items-start">
               <input
                type="text"
                name="image"
                placeholder="https://example.com/spa-image.jpg"
                value={formData.image}
                onChange={handleInputChange}
                className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              {imagePreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
             <label className="flex items-center gap-3 cursor-pointer">
               <div className="relative">
                 <input
                   type="checkbox"
                   name="isActive"
                   checked={formData.isActive}
                   onChange={handleInputChange}
                   className="sr-only peer"
                 />
                 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
               </div>
               <span className="text-sm font-semibold text-slate-700">Active Service</span>
             </label>

             <label className="flex items-center gap-3 cursor-pointer">
               <div className="relative">
                 <input
                   type="checkbox"
                   name="isFeatured"
                   checked={formData.isFeatured}
                   onChange={handleInputChange}
                   className="sr-only peer"
                 />
                 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
               </div>
               <span className="text-sm font-semibold text-slate-700 flex items-center gap-1"><FaStar className="text-yellow-400" /> Featured</span>
             </label>

             <label className="flex items-center gap-3 cursor-pointer">
               <div className="relative">
                 <input
                   type="checkbox"
                   name="isPopular"
                   checked={formData.isPopular}
                   onChange={handleInputChange}
                   className="sr-only peer"
                 />
                 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
               </div>
               <span className="text-sm font-semibold text-slate-700 flex items-center gap-1"><FaFire className="text-orange-500" /> Popular</span>
             </label>
          </div>
          
          <div className="md:col-span-2 flex gap-4 pt-4">
            <button 
              type="submit" 
              className={`flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : (selectedService ? 'Update Service' : 'Create Service')}
            </button>
            {selectedService && (
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
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
           <h3 className="text-xl font-bold text-slate-800">Service List ({services.length})</h3>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4 pl-6">Service</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map(service => (
                <tr key={service._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                       {service.image ? (
                         <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                           <img src={service.image} alt="" className="w-full h-full object-cover" />
                         </div>
                       ) : (
                         <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                           <FaSpa />
                         </div>
                       )}
                       <div>
                         <div className="font-bold text-slate-800">{service.name}</div>
                         <div className="flex gap-1 mt-1">
                           {service.isFeatured && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1 rounded flex items-center gap-0.5"><FaStar /> Featured</span>}
                           {service.isPopular && <span className="text-[10px] bg-orange-100 text-orange-700 px-1 rounded flex items-center gap-0.5"><FaFire /> Hot</span>}
                         </div>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                      {service.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {service.duration} mins
                  </td>
                  <td className="p-4 font-bold text-emerald-600">₹{service.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={() => { setSelectedService(service); document.getElementById('serviceForm').scrollIntoView({ behavior: 'smooth' }); }} 
                         className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                         title="Edit"
                       >
                         <FaEdit />
                       </button>
                       <button 
                         onClick={() => handleDelete(service._id)} 
                         className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                         title="Delete"
                       >
                         <FaTrash />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                   <td colSpan="6" className="p-12 text-center text-slate-400">
                     No services found.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-slate-50">
           {services.map(service => (
             <div key={service._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex gap-3">
                      {service.image && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={service.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                         <h4 className="font-bold text-slate-800">{service.name}</h4>
                         <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{service.category}</span>
                      </div>
                   </div>
                   <span className="font-bold text-emerald-600 text-lg">₹{service.price}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 border-t border-b border-slate-50 py-2">
                   <div className="flex items-center gap-1.5">
                      <FaClock className="text-slate-400" /> {service.duration} mins
                   </div>
                   <div className="flex items-center gap-1.5 ml-auto">
                      <span className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                      {service.isActive ? 'Active' : 'Inactive'}
                   </div>
                </div>

                <div className="flex gap-2">
                   <button 
                     onClick={() => { setSelectedService(service); document.getElementById('serviceForm').scrollIntoView({ behavior: 'smooth' }); }} 
                     className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                   >
                     <FaEdit /> Edit
                   </button>
                   <button 
                     onClick={() => handleDelete(service._id)} 
                     className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                   >
                     <FaTrash /> Delete
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SpaServiceManagement;

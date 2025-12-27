import React, { useState, useEffect } from 'react';
import { FaTag, FaPlus, FaTrash, FaCalendarAlt, FaPercentage, FaMoneyBillWave, FaTimes } from 'react-icons/fa';
import couponService from '../../services/couponService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: 0,
    maxDiscount: '',
    expiryDate: new Date(),
    usageLimit: 100
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await couponService.getCoupons();
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await couponService.deleteCoupon(id);
      setCoupons(coupons.filter(c => c._id !== id));
      toast.success('Coupon deleted');
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCoupon = await couponService.createCoupon(formData);
      setCoupons([newCoupon, ...coupons]);
      setShowModal(false);
      resetForm();
      toast.success('Coupon created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderValue: 0,
      maxDiscount: '',
      expiryDate: new Date(),
      usageLimit: 100
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Coupon Management</h2>
           <p className="text-slate-500">Create and manage discount codes</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg hover:-translate-y-1"
        >
          <FaPlus /> Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
               <div className="absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(coupon._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                     <FaTrash />
                  </button>
               </div>
               
               <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                     <FaTag className="text-xl" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-800 font-mono tracking-wider">{coupon.code}</h3>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                     </span>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                     <span className="text-slate-500">Discount</span>
                     <span className="font-bold text-primary">
                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                     </span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                     <span className="text-slate-500">Expiry</span>
                     <span className="font-medium text-slate-700">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                     </span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                     <span className="text-slate-500">Usage</span>
                     <span className="font-medium text-slate-700">
                        {coupon.usedCount} / {coupon.usageLimit}
                     </span>
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                   {coupon.minOrderValue > 0 && (
                      <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded">Min: ₹{coupon.minOrderValue}</span>
                   )}
                   {coupon.maxDiscount && (
                      <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded">Max Disc: ₹{coupon.maxDiscount}</span>
                   )}
               </div>
            </div>
          ))}
          {coupons.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
               <FaTag className="text-4xl text-slate-300 mx-auto mb-4" />
               <p className="text-slate-500">No coupons active. Create one to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-xl text-slate-800">Create New Coupon</h3>
                 <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                    <FaTimes />
                 </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Coupon Code</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. SUMMER2024"
                      className="w-full p-3 border border-slate-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                        <select 
                           className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                           value={formData.discountType}
                           onChange={e => setFormData({...formData, discountType: e.target.value})}
                        >
                           <option value="PERCENTAGE">Percentage (%)</option>
                           <option value="FLAT">Flat Amount (₹)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Value</label>
                        <input 
                           type="number" 
                           required
                           min="0"
                           className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                           value={formData.discountValue}
                           onChange={e => setFormData({...formData, discountValue: e.target.value})}
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Min Order (₹)</label>
                        <input 
                           type="number" 
                           min="0"
                           className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                           value={formData.minOrderValue}
                           onChange={e => setFormData({...formData, minOrderValue: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Usage Limit</label>
                        <input 
                           type="number" 
                           min="1"
                           className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                           value={formData.usageLimit}
                           onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                        />
                    </div>
                 </div>

                 {formData.discountType === 'PERCENTAGE' && (
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Max Discount Amount (₹)</label>
                        <input 
                           type="number" 
                           min="0"
                           placeholder="Optional limit"
                           className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                           value={formData.maxDiscount}
                           onChange={e => setFormData({...formData, maxDiscount: e.target.value})}
                        />
                    </div>
                 )}

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Expiry Date</label>
                    <div className="w-full p-3 border border-slate-200 rounded-xl flex items-center bg-white">
                        <DatePicker 
                           selected={formData.expiryDate} 
                           onChange={date => setFormData({...formData, expiryDate: date})}
                           minDate={new Date()}
                           className="w-full outline-none"
                        />
                        <FaCalendarAlt className="text-slate-400" />
                    </div>
                 </div>

                 <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-colors mt-4 shadow-lg"
                 >
                    Create Coupon
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;

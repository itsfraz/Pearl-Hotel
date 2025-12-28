import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaMapMarkerAlt, FaUsers, FaRulerCombined, FaDollarSign, FaImage, FaChartLine, FaUtensils, FaLayerGroup, FaBoxOpen } from 'react-icons/fa';

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [venues, setVenues] = useState([]);
  const [packages, setPackages] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [catering, setCatering] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  
  // Generic Loading State
  const [loading, setLoading] = useState(false);

  // Selection States
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Forms
  const [venueForm, setVenueForm] = useState({ name: '', description: '', capacityMin: '', capacityMax: '', area: '', price: '', images: '', features: '', isActive: true });
  const [packageForm, setPackageForm] = useState({ name: '', type: 'Wedding', pricePerPerson: '', inclusions: '', isActive: true });
  const [typeForm, setTypeForm] = useState({ name: '', description: '', icon: '', isActive: true });
  const [menuForm, setMenuForm] = useState({ name: '', cuisine: '', pricePerPlate: '', description: '', isActive: true });

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'venues') fetchVenues();
    if (activeTab === 'packages') fetchPackages();
    if (activeTab === 'types') fetchEventTypes();
    if (activeTab === 'catering') fetchCatering();
    if (activeTab === 'enquiries') fetchEnquiries();
  }, [activeTab]);

  // --- Fetch Functions ---
  const fetchStats = async () => {
    try {
      const data = await eventService.getEventStats();
      setStats(data);
    } catch (error) { console.error(error); }
  };
  const fetchVenues = async () => {
    try { const data = await eventService.getAllVenuesAdmin(); setVenues(data); } catch (error) { console.error(error); }
  };
  const fetchPackages = async () => {
     try { const data = await eventService.getAllPackagesAdmin(); setPackages(data); } catch (error) { console.error(error); }
  };
  const fetchEventTypes = async () => {
     try { const data = await eventService.getAllEventTypesAdmin(); setEventTypes(data); } catch (error) { console.error(error); }
  };
  const fetchCatering = async () => {
     try { const data = await eventService.getAllCateringAdmin(); setCatering(data); } catch (error) { console.error(error); }
  };
  const fetchEnquiries = async () => {
     try { const data = await eventService.getAllEnquiriesAdmin(); setEnquiries(data); } catch (error) { console.error(error); }
  };

  // --- Form Filling Helpers ---
  useEffect(() => {
     if (selectedVenue) {
       setVenueForm({ ...selectedVenue, images: selectedVenue.images?.join(', ') || '', features: selectedVenue.features?.join(', ') || '' });
     } else { setVenueForm({ name: '', description: '', capacityMin: '', capacityMax: '', area: '', price: '', images: '', features: '', isActive: true }); }
  }, [selectedVenue]);

  useEffect(() => {
     if (selectedPackage) {
       setPackageForm({ ...selectedPackage, inclusions: selectedPackage.inclusions?.join(', ') || '' });
     } else { setPackageForm({ name: '', type: 'Wedding', pricePerPerson: '', inclusions: '', isActive: true }); }
  }, [selectedPackage]);

  useEffect(() => {
     if (selectedType) { setTypeForm(selectedType); } 
     else { setTypeForm({ name: '', description: '', icon: '', isActive: true }); }
  }, [selectedType]);

  useEffect(() => {
     if (selectedMenu) { setMenuForm(selectedMenu); } 
     else { setMenuForm({ name: '', cuisine: '', pricePerPlate: '', description: '', isActive: true }); }
  }, [selectedMenu]);


  // --- Submit Handlers ---
  const handleVenueSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { ...venueForm, capacityMin: parseInt(venueForm.capacityMin), capacityMax: parseInt(venueForm.capacityMax), area: parseInt(venueForm.area), price: parseFloat(venueForm.price), images: venueForm.images.split(',').filter(x=>x), features: venueForm.features.split(',').filter(x=>x) };
      selectedVenue ? await eventService.updateVenue(selectedVenue._id, data) : await eventService.createVenue(data);
      fetchVenues(); setSelectedVenue(null);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { ...packageForm, pricePerPerson: parseFloat(packageForm.pricePerPerson), inclusions: packageForm.inclusions.split(',').filter(x=>x) };
      selectedPackage ? await eventService.updatePackage(selectedPackage._id, data) : await eventService.createPackage(data);
      fetchPackages(); setSelectedPackage(null);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      selectedType ? await eventService.updateEventType(selectedType._id, typeForm) : await eventService.createEventType(typeForm);
      fetchEventTypes(); setSelectedType(null);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { ...menuForm, pricePerPlate: parseFloat(menuForm.pricePerPlate) };
      selectedMenu ? await eventService.updateCatering(selectedMenu._id, data) : await eventService.createCatering(data);
      fetchCatering(); setSelectedMenu(null);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  // --- Deletion Helpers ---
  const handleDelete = async (serviceFn, id, fetchFn) => {
    if(window.confirm('Are you sure?')) { await serviceFn(id); fetchFn(); }
  };

  const handleStatusUpdate = async (id, status) => {
    await eventService.updateEnquiryStatus(id, status); fetchEnquiries();
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
          { id: 'venues', label: 'Venues', icon: FaMapMarkerAlt },
          { id: 'packages', label: 'Packages', icon: FaBoxOpen },
          { id: 'types', label: 'Event Types', icon: FaLayerGroup },
          { id: 'catering', label: 'Catering', icon: FaUtensils },
          { id: 'enquiries', label: 'Enquiries', icon: FaUsers }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-bold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <tab.icon /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && stats && (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="text-slate-500 text-sm font-bold uppercase">Total Venues</div>
             <div className="text-3xl font-bold text-slate-800">{stats.totalVenues}</div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="text-slate-500 text-sm font-bold uppercase">Total Enquiries</div>
             <div className="text-3xl font-bold text-blue-600">{stats.totalEnquiries}</div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="text-slate-500 text-sm font-bold uppercase">Pending Leads</div>
             <div className="text-3xl font-bold text-orange-500">{stats.newEnquiries}</div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="text-slate-500 text-sm font-bold uppercase">Confirmed</div>
             <div className="text-3xl font-bold text-green-600">{stats.confirmedEnquiries}</div>
           </div>
         </div>
      )}

      {activeTab === 'venues' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
              <h3 className="font-bold text-lg mb-4">{selectedVenue ? 'Edit Venue' : 'Add Venue'}</h3>
              <form onSubmit={handleVenueSubmit} className="space-y-3">
                 <input className="w-full p-2 border rounded" placeholder="Venue Name" value={venueForm.name} onChange={e=>setVenueForm({...venueForm, name: e.target.value})} required />
                 <input className="w-full p-2 border rounded" type="number" placeholder="Price" value={venueForm.price} onChange={e=>setVenueForm({...venueForm, price: e.target.value})} required />
                 <div className="flex gap-2">
                   <input className="w-1/2 p-2 border rounded" type="number" placeholder="Min Cap" value={venueForm.capacityMin} onChange={e=>setVenueForm({...venueForm, capacityMin: e.target.value})} required />
                   <input className="w-1/2 p-2 border rounded" type="number" placeholder="Max Cap" value={venueForm.capacityMax} onChange={e=>setVenueForm({...venueForm, capacityMax: e.target.value})} required />
                 </div>
                 <input className="w-full p-2 border rounded" type="number" placeholder="Area (sq ft)" value={venueForm.area} onChange={e=>setVenueForm({...venueForm, area: e.target.value})} />
                 <textarea className="w-full p-2 border rounded" placeholder="Description" value={venueForm.description} onChange={e=>setVenueForm({...venueForm, description: e.target.value})} required />
                 <textarea className="w-full p-2 border rounded" placeholder="Images (comma sep)" value={venueForm.images} onChange={e=>setVenueForm({...venueForm, images: e.target.value})} />
                 <textarea className="w-full p-2 border rounded" placeholder="Features (comma sep)" value={venueForm.features} onChange={e=>setVenueForm({...venueForm, features: e.target.value})} />
                 <div className="flex gap-2">
                   <button type="submit" className="flex-1 bg-primary text-white py-2 rounded font-bold">{loading ? '...' : (selectedVenue ? 'Update' : 'ADD')}</button>
                   {selectedVenue && <button type="button" onClick={()=>setSelectedVenue(null)} className="px-3 bg-red-100 text-red-600 rounded">X</button>}
                 </div>
              </form>
           </div>
           <div className="lg:col-span-2 space-y-4">
              {venues.map(v => (
                <div key={v._id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                   <div>
                     <div className="font-bold">{v.name}</div>
                     <div className="text-sm text-slate-500">Cap: {v.capacityMin}-{v.capacityMax} | ₹{v.price}</div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={()=>setSelectedVenue(v)} className="text-blue-600 p-2"><FaEdit /></button>
                     <button onClick={()=>handleDelete(eventService.deleteVenue, v._id, fetchVenues)} className="text-red-600 p-2"><FaTrash /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* PACKAGES TAB */}
      {activeTab === 'packages' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
              <h3 className="font-bold text-lg mb-4">{selectedPackage ? 'Edit Package' : 'Add Package'}</h3>
              <form onSubmit={handlePackageSubmit} className="space-y-3">
                 <input className="w-full p-2 border rounded" placeholder="Package Name" value={packageForm.name} onChange={e=>setPackageForm({...packageForm, name: e.target.value})} required />
                 <input className="w-full p-2 border rounded" placeholder="Type (e.g. Wedding)" value={packageForm.type} onChange={e=>setPackageForm({...packageForm, type: e.target.value})} required />
                 <input className="w-full p-2 border rounded" type="number" placeholder="Price Per Person" value={packageForm.pricePerPerson} onChange={e=>setPackageForm({...packageForm, pricePerPerson: e.target.value})} required />
                 <textarea className="w-full p-2 border rounded" placeholder="Inclusions (comma sep)" value={packageForm.inclusions} onChange={e=>setPackageForm({...packageForm, inclusions: e.target.value})} required />
                 <div className="flex gap-2">
                   <button type="submit" className="flex-1 bg-primary text-white py-2 rounded font-bold">{loading ? '...' : (selectedPackage ? 'Update' : 'ADD')}</button>
                   {selectedPackage && <button type="button" onClick={()=>setSelectedPackage(null)} className="px-3 bg-red-100 text-red-600 rounded">X</button>}
                 </div>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {packages.map(p => (
                <div key={p._id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                   <div>
                     <div className="font-bold">{p.name} <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">{p.type}</span></div>
                     <div className="text-sm text-slate-500">₹{p.pricePerPerson} / person</div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={()=>setSelectedPackage(p)} className="text-blue-600 p-2"><FaEdit /></button>
                     <button onClick={()=>handleDelete(eventService.deletePackage, p._id, fetchPackages)} className="text-red-600 p-2"><FaTrash /></button>
                   </div>
                </div>
              ))}
           </div>
         </div>
      )}

      {/* EVENT TYPES TAB */}
      {activeTab === 'types' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
               <h3 className="font-bold text-lg mb-4">{selectedType ? 'Edit Type' : 'Add Event Type'}</h3>
               <form onSubmit={handleTypeSubmit} className="space-y-3">
                 <input className="w-full p-2 border rounded" placeholder="Type Name" value={typeForm.name} onChange={e=>setTypeForm({...typeForm, name: e.target.value})} required />
                 <input className="w-full p-2 border rounded" placeholder="Icon Class / URL" value={typeForm.icon} onChange={e=>setTypeForm({...typeForm, icon: e.target.value})} />
                 <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold">{loading ? '...' : (selectedType ? 'Update' : 'ADD')}</button>
               </form>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
               {eventTypes.map(t => (
                 <div key={t._id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                    <span className="font-bold">{t.name}</span>
                    <div className="flex gap-2">
                      <button onClick={()=>setSelectedType(t)} className="text-blue-600"><FaEdit /></button>
                      <button onClick={()=>handleDelete(eventService.deleteEventType, t._id, fetchEventTypes)} className="text-red-600"><FaTrash /></button>
                    </div>
                 </div>
               ))}
            </div>
        </div>
      )}

      {/* CATERING TAB */}
      {activeTab === 'catering' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
               <h3 className="font-bold text-lg mb-4">{selectedMenu ? 'Edit Menu' : 'Add Catering Menu'}</h3>
               <form onSubmit={handleMenuSubmit} className="space-y-3">
                 <input className="w-full p-2 border rounded" placeholder="Menu Name (e.g. Royal Buffet)" value={menuForm.name} onChange={e=>setMenuForm({...menuForm, name: e.target.value})} required />
                 <input className="w-full p-2 border rounded" placeholder="Cuisine" value={menuForm.cuisine} onChange={e=>setMenuForm({...menuForm, cuisine: e.target.value})} required />
                 <input className="w-full p-2 border rounded" type="number" placeholder="Price Per Plate" value={menuForm.pricePerPlate} onChange={e=>setMenuForm({...menuForm, pricePerPlate: e.target.value})} />
                 <textarea className="w-full p-2 border rounded" placeholder="Description" value={menuForm.description} onChange={e=>setMenuForm({...menuForm, description: e.target.value})} />
                 <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold">{loading ? '...' : (selectedMenu ? 'Update' : 'ADD')}</button>
               </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {catering.map(c => (
                <div key={c._id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                   <div>
                     <div className="font-bold">{c.name}</div>
                     <div className="text-sm text-slate-500">{c.cuisine} | ₹{c.pricePerPlate}/plate</div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={()=>setSelectedMenu(c)} className="text-blue-600 p-2"><FaEdit /></button>
                     <button onClick={()=>handleDelete(eventService.deleteCatering, c._id, fetchCatering)} className="text-red-600 p-2"><FaTrash /></button>
                   </div>
                </div>
              ))}
            </div>
         </div>
      )}

      {activeTab === 'enquiries' && (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr><th className="p-4">Guest</th><th className="p-4">Event</th><th className="p-4">Status</th></tr>
              </thead>
              <tbody>
                 {enquiries.map(enq => (
                   <tr key={enq._id} className="border-t border-slate-100 hover:bg-slate-50">
                     <td className="p-4">
                        <div className="font-bold">{enq.name}</div>
                        <div className="text-xs text-slate-500">{enq.email} | {enq.phone}</div>
                     </td>
                     <td className="p-4">
                        <div className="text-sm"><span className="font-bold">{enq.eventType}</span> on {enq.date}</div>
                        <div className="text-xs text-slate-500">{enq.guestCount} Guests</div>
                     </td>
                     <td className="p-4">
                       <select 
                         value={enq.status} onChange={e=>handleStatusUpdate(enq._id, e.target.value)} 
                         className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none ${enq.status==='New'?'bg-blue-100 text-blue-800':enq.status==='Confirmed'?'bg-green-100 text-green-800':'bg-slate-100'}`}
                       >
                         <option>New</option><option>Contacted</option><option>Confirmed</option><option>Cancelled</option>
                       </select>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
         </div>
      )}
    </div>
  );
};

export default EventManagement;

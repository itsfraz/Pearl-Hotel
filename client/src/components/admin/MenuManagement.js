import React, { useState, useEffect } from 'react';
import menuService from '../../services/menuService';
import { toast } from 'react-toastify';
import { 
  FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, 
  FaSearch, FaFilter, FaUtensils, FaStar, FaLeaf,
  FaTimes, FaSave, FaImage
} from 'react-icons/fa';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRestaurant, setFilterRestaurant] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'breakfast',
    tag: '',
    restaurant: 'The Pearl Restaurant',
    isAvailable: true,
    image: '',
    ingredients: '',
    allergens: '',
    preparationTime: '',
    calories: '',
    isSpecial: false,
    displayOrder: 0
  });

  const categories = ['breakfast', 'lunch', 'dinner', 'desserts', 'beverages', 'appetizers'];
  const tags = ['', 'Chef\'s Special', 'Popular', 'Healthy', 'Vegetarian', 'Vegan', 'Premium', 'Spicy', 'New'];
  const restaurants = ['The Pearl Restaurant', 'Sky Lounge', 'Pearl Café'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [menuItems, searchTerm, filterCategory, filterRestaurant]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuService.getAllMenuItems();
      setMenuItems(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch menu items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = [...menuItems];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    if (filterRestaurant !== 'all') {
      filtered = filtered.filter(item => item.restaurant === filterRestaurant);
    }

    setFilteredItems(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : 0,
        calories: formData.calories ? parseInt(formData.calories) : 0,
        displayOrder: parseInt(formData.displayOrder) || 0,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()).filter(i => i) : [],
        allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()).filter(a => a) : []
      };

      if (editingItem) {
        await menuService.updateMenuItem(editingItem._id, submitData);
        toast.success('Menu item updated successfully!');
      } else {
        await menuService.createMenuItem(submitData);
        toast.success('Menu item created successfully!');
      }

      resetForm();
      fetchMenuItems();
    } catch (error) {
      toast.error(error.message || 'Failed to save menu item');
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      tag: item.tag || '',
      restaurant: item.restaurant,
      isAvailable: item.isAvailable,
      image: item.image || '',
      ingredients: item.ingredients?.join(', ') || '',
      allergens: item.allergens?.join(', ') || '',
      preparationTime: item.preparationTime || '',
      calories: item.calories || '',
      isSpecial: item.isSpecial || false,
      displayOrder: item.displayOrder || 0
    });
    setShowForm(true);
    document.getElementById('menuForm')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await menuService.deleteMenuItem(id);
      toast.success('Menu item deleted successfully!');
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to delete menu item');
      console.error(error);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await menuService.toggleMenuItemAvailability(id);
      toast.success('Availability updated!');
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to update availability');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'breakfast',
      tag: '',
      restaurant: 'The Pearl Restaurant',
      isAvailable: true,
      image: '',
      ingredients: '',
      allergens: '',
      preparationTime: '',
      calories: '',
      isSpecial: false,
      displayOrder: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const getTagColor = (tag) => {
    const colors = {
      "Chef's Special": 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Popular': 'bg-blue-100 text-blue-800 border-blue-300',
      'Healthy': 'bg-green-100 text-green-800 border-green-300',
      'Vegetarian': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'Vegan': 'bg-lime-100 text-lime-800 border-lime-300',
      'Premium': 'bg-purple-100 text-purple-800 border-purple-300',
      'Spicy': 'bg-red-100 text-red-800 border-red-300',
      'New': 'bg-pink-100 text-pink-800 border-pink-300'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-3">
            <FaUtensils className="text-secondary" />
            Menu Management
          </h1>
          <p className="text-slate-600 mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary-dark transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {showForm ? <FaTimes /> : <FaPlus />}
          {showForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <div className="text-sm text-slate-600 mb-1">Total Items</div>
          <div className="text-3xl font-bold text-primary">{menuItems.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
          <div className="text-sm text-slate-600 mb-1">Available</div>
          <div className="text-3xl font-bold text-green-600">
            {menuItems.filter(item => item.isAvailable).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
          <div className="text-sm text-slate-600 mb-1">Special Items</div>
          <div className="text-3xl font-bold text-yellow-600">
            {menuItems.filter(item => item.isSpecial).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
          <div className="text-sm text-slate-600 mb-1">Categories</div>
          <div className="text-3xl font-bold text-purple-600">
            {new Set(menuItems.map(item => item.category)).size}
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div id="menuForm" className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-2">
            <FaSave className="text-secondary" />
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="e.g., Grilled Salmon"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="999"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all capitalize"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Restaurant */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Restaurant *
                </label>
                <select
                  name="restaurant"
                  value={formData.restaurant}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                >
                  {restaurants.map(rest => (
                    <option key={rest} value={rest}>{rest}</option>
                  ))}
                </select>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tag
                </label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                >
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag || 'None'}</option>
                  ))}
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>

              {/* Preparation Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Prep Time (minutes)
                </label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="15"
                />
              </div>

              {/* Calories */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="450"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none"
                placeholder="Describe the dish..."
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Ingredients (comma-separated)
              </label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                placeholder="Salmon, Butter, Herbs, Lemon"
              />
            </div>

            {/* Allergens */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Allergens (comma-separated)
              </label>
              <input
                type="text"
                name="allergens"
                value={formData.allergens}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                placeholder="Fish, Dairy"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FaImage /> Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-secondary rounded focus:ring-2 focus:ring-secondary"
                />
                <span className="text-sm font-medium text-slate-700">Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isSpecial"
                  checked={formData.isSpecial}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-secondary rounded focus:ring-2 focus:ring-secondary"
                />
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <FaStar className="text-yellow-500" /> Special Item
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary-dark transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaSave />
                {editingItem ? 'Update Item' : 'Create Item'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all capitalize appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
          </div>

          {/* Restaurant Filter */}
          <div className="relative">
            <FaUtensils className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterRestaurant}
              onChange={(e) => setFilterRestaurant(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none"
            >
              <option value="all">All Restaurants</option>
              {restaurants.map(rest => (
                <option key={rest} value={rest}>{rest}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
            <FaUtensils className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No menu items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-secondary/30"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUtensils className="text-6xl text-slate-300" />
                  </div>
                )}
                
                {/* Special Badge */}
                {item.isSpecial && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                    <FaStar className="animate-spin-slow" /> Chef's Special
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                  item.isAvailable 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {item.isAvailable ? '● Available' : '● Unavailable'}
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-xs text-slate-500 font-medium">Price</div>
                  <div className="text-2xl font-bold text-secondary">₹{item.price.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="font-display font-bold text-xl text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-1 bg-slate-100 rounded-md capitalize font-medium">
                      {item.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="truncate">{item.restaurant}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags & Info Pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {item.tag && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getTagColor(item.tag)} shadow-sm`}>
                      {item.tag}
                    </span>
                  )}
                  {item.preparationTime > 0 && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {item.preparationTime} min
                    </span>
                  )}
                  {item.calories > 0 && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaLeaf className="text-green-600" /> {item.calories} cal
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t-2 border-slate-100">
                  <button
                    onClick={() => handleToggleAvailability(item._id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      item.isAvailable
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                    }`}
                    title={item.isAvailable ? 'Click to disable' : 'Click to enable'}
                  >
                    {item.isAvailable ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
                    <span className="hidden sm:inline">{item.isAvailable ? 'Available' : 'Disabled'}</span>
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    title="Edit menu item"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    title="Delete menu item"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuManagement;

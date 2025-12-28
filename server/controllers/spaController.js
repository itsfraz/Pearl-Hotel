const SpaService = require('../models/SpaService');
const SpaBooking = require('../models/SpaBooking');

// --- Services ---

// @desc    Get all spa services
// @route   GET /api/spa/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await SpaService.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all spa services (Admin)
// @route   GET /api/spa/services/admin
// @access  Private/Admin
const getAdminServices = async (req, res) => {
  try {
    const services = await SpaService.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/spa/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await SpaService.findById(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a spa service
// @route   POST /api/spa/services
// @access  Private/Admin
const createService = async (req, res) => {
  const { name, category, duration, price, description, image, isFeatured, isPopular } = req.body;

  try {
    const service = new SpaService({
      name,
      category,
      duration,
      price,
      description,
      image,
      isFeatured, 
      isPopular
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a spa service
// @route   PUT /api/spa/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  const { name, category, duration, price, description, image, isActive, isFeatured, isPopular } = req.body;

  try {
    const service = await SpaService.findById(req.params.id);

    if (service) {
      service.name = name || service.name;
      service.category = category || service.category;
      service.duration = duration || service.duration;
      service.price = price || service.price;
      service.description = description || service.description;
      service.image = image || service.image;
      service.isActive = isActive !== undefined ? isActive : service.isActive;
      service.isFeatured = isFeatured !== undefined ? isFeatured : service.isFeatured;
      service.isPopular = isPopular !== undefined ? isPopular : service.isPopular;

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a spa service
// @route   DELETE /api/spa/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await SpaService.findById(req.params.id);

    if (service) {
      await service.deleteOne();
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Bookings ---

// @desc    Create spa booking
// @route   POST /api/spa/bookings
// @access  Public
const createBooking = async (req, res) => {
  const { serviceId, date, time, guestName, guestEmail, notes } = req.body;
  
  try {
    const booking = new SpaBooking({
      user: req.user ? req.user._id : null,
      service: serviceId,
      date,
      time,
      guestName,
      guestEmail,
      notes
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all spa bookings (Admin)
// @route   GET /api/spa/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await SpaBooking.find({})
      .populate('service', 'name price duration')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  createBooking,
  getAllBookings
};

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
  const { name, category, duration, duration_minutes, price, description, image, isFeatured, isPopular } = req.body;

  const dur = duration_minutes || duration;

  try {
    const service = new SpaService({
      name,
      category,
      duration: dur,
      duration_minutes: dur,
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
  const { name, category, duration, duration_minutes, price, description, image, isActive, isFeatured, isPopular } = req.body;

  try {
    const service = await SpaService.findById(req.params.id);

    if (service) {
      service.name = name || service.name;
      service.category = category || service.category;

      const dur = duration_minutes || duration;
      if (dur) {
        service.duration = dur;
        service.duration_minutes = dur;
      }

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
  
  let userId = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const jwt = require('jsonwebtoken');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      console.error('Guest booking or invalid token');
    }
  }

  try {
    // Validate service exists and fetch duration
    const service = await SpaService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const durationMinutes = service.duration_minutes || service.duration || 0;

    // Validate time against operating hours (10:00 - 22:00)
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    const closeTime = new Date();
    closeTime.setHours(22, 0, 0, 0);

    if (endTime > closeTime) {
      return res.status(400).json({ message: `Selected time plus service duration exceeds our closing time (10:00 PM). Please choose an earlier slot.` });
    }

    // Prevent double booking for same service, date and time
    const existingBooking = await SpaBooking.findOne({
      service: serviceId,
      date,
      time,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked. Please select another slot.' });
    }

    const booking = new SpaBooking({
      user: userId,
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

// @desc    Get all spa bookings for a user
// @route   GET /api/spa/bookings/mybookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await SpaBooking.find({ user: req.user._id })
      .populate('service', 'name price duration')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booked time slots for a service on a specific date
// @route   GET /api/spa/bookings/booked-slots
// @access  Public
const getBookedSlots = async (req, res) => {
  try {
    const { date, serviceId } = req.query;
    if (!date || !serviceId) {
      return res.status(400).json({ message: 'Date and serviceId are required' });
    }

    const bookings = await SpaBooking.find({
      date,
      service: serviceId,
      status: { $ne: 'Cancelled' }
    }).select('time');

    res.json(bookings.map(b => b.time));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a spa booking status
// @route   PUT /api/spa/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await SpaBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = status;
    await booking.save();
    res.json(booking);
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
  getAllBookings,
  getUserBookings,
  getBookedSlots,
  updateBookingStatus
};

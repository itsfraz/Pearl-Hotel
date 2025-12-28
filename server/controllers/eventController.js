const Venue = require('../models/Venue');
const EventPackage = require('../models/EventPackage');
const EventEnquiry = require('../models/EventEnquiry');
const EventType = require('../models/EventType');
const CateringMenu = require('../models/CateringMenu');

// --- STATS ---
const getEventStats = async (req, res) => {
  try {
    const totalVenues = await Venue.countDocuments();
    const totalEnquiries = await EventEnquiry.countDocuments();
    const newEnquiries = await EventEnquiry.countDocuments({ status: 'New' });
    const confirmedEnquiries = await EventEnquiry.countDocuments({ status: 'Confirmed' });
    
    // Calculate potential revenue (very basic)
    // In a real app, this would come from a Booking model linked to payments
    
    res.json({
      totalVenues,
      totalEnquiries,
      newEnquiries,
      confirmedEnquiries
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- VENUES ---
const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ isActive: true });
    res.json(venues);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAdminVenues = async (req, res) => {
  try {
    const venues = await Venue.find({});
    res.json(venues);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json(venue);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(venue);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const deleteVenue = async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Venue deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- PACKAGES ---
const getPackages = async (req, res) => {
  try {
    const packages = await EventPackage.find({ isActive: true });
    res.json(packages);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAdminPackages = async (req, res) => {
  try {
    const packages = await EventPackage.find({});
    res.json(packages);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createPackage = async (req, res) => {
  try {
    const pkg = await EventPackage.create(req.body);
    res.status(201).json(pkg);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const updatePackage = async (req, res) => {
  try {
    const pkg = await EventPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pkg);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const deletePackage = async (req, res) => {
  try {
    await EventPackage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- EVENT TYPES ---
const getEventTypes = async (req, res) => {
  try {
    const types = await EventType.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json(types);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAdminEventTypes = async (req, res) => {
  try {
    const types = await EventType.find({}).sort({ displayOrder: 1 });
    res.json(types);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createEventType = async (req, res) => {
  try {
    const type = await EventType.create(req.body);
    res.status(201).json(type);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const updateEventType = async (req, res) => {
  try {
    const type = await EventType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(type);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const deleteEventType = async (req, res) => {
  try {
    await EventType.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event type deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- CATERING ---
const getCatering = async (req, res) => {
  try {
    const menus = await CateringMenu.find({ isActive: true });
    res.json(menus);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAdminCatering = async (req, res) => {
  try {
    const menus = await CateringMenu.find({});
    res.json(menus);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCatering = async (req, res) => {
  try {
    const menu = await CateringMenu.create(req.body);
    res.status(201).json(menu);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const updateCatering = async (req, res) => {
  try {
    const menu = await CateringMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(menu);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const deleteCatering = async (req, res) => {
  try {
    await CateringMenu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- ENQUIRIES ---
const createEnquiry = async (req, res) => {
  try {
    const enquiry = await EventEnquiry.create({
      ...req.body,
      user: req.user ? req.user._id : null
    });
    res.status(201).json(enquiry);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await EventEnquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await EventEnquiry.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(enquiry);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

module.exports = {
  getEventStats,
  getVenues, getAdminVenues, createVenue, updateVenue, deleteVenue,
  getPackages, getAdminPackages, createPackage, updatePackage, deletePackage,
  getEventTypes, getAdminEventTypes, createEventType, updateEventType, deleteEventType,
  getCatering, getAdminCatering, createCatering, updateCatering, deleteCatering,
  createEnquiry, getEnquiries, updateEnquiryStatus
};

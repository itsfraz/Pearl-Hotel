const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check room availability
// @route   POST /api/rooms/check-availability
// @access  Public
const checkAvailability = async (req, res) => {
    const { roomId, checkIn, checkOut } = req.body;
    
    try {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid dates' });
        }
        
        const existingBooking = await Booking.findOne({
            room: roomId,
            status: { $ne: 'Cancelled' },
            $or: [
                { checkIn: { $lt: end }, checkOut: { $gt: start } }
            ]
        });
        
        res.json({ 
            available: !existingBooking,
            message: existingBooking ? 'Room is not available for selected dates' : 'Room is available'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
    const { name, type, roomNumber, price, capacity, description, size, bedType, amenities, features, images } = req.body;

    try {
        // Check if room number already exists
        const existingRoom = await Room.findOne({ roomNumber });
        if (existingRoom) {
            return res.status(400).json({ message: 'Room number already exists' });
        }

        const room = await Room.create({
            name,
            type,
            roomNumber,
            price,
            capacity,
            description,
            size,
            bedType,
            amenities,
            features,
            images,
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
    const { name, type, roomNumber, price, capacity, description, size, bedType, amenities, features, images } = req.body;

    try {
        const room = await Room.findById(req.params.id);

        if (room) {
            // Check if room number is being changed and if it already exists
            if (roomNumber && roomNumber !== room.roomNumber) {
                const existingRoom = await Room.findOne({ roomNumber });
                if (existingRoom) {
                    return res.status(400).json({ message: 'Room number already exists' });
                }
            }

            room.name = name !== undefined ? name : room.name;
            room.type = type || room.type;
            room.roomNumber = roomNumber || room.roomNumber;
            room.price = price !== undefined ? price : room.price;
            room.capacity = capacity !== undefined ? capacity : room.capacity;
            room.description = description !== undefined ? description : room.description;
            room.size = size !== undefined ? size : room.size;
            room.bedType = bedType !== undefined ? bedType : room.bedType;
            room.amenities = amenities !== undefined ? amenities : room.amenities;
            room.features = features !== undefined ? features : room.features;
            room.images = images !== undefined ? images : room.images;

            const updatedRoom = await room.save();
            res.json(updatedRoom);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
    try {
        // Check if room has any active bookings
        const activeBookings = await Booking.findOne({
            room: req.params.id,
            status: { $in: ['Pending', 'Confirmed'] }
        });

        if (activeBookings) {
            return res.status(400).json({ 
                message: 'Cannot delete room with active bookings. Please cancel all bookings first.' 
            });
        }

        const room = await Room.findByIdAndDelete(req.params.id);

        if (room) {
            res.json({ message: 'Room removed successfully' });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRooms, getRoomById, checkAvailability, createRoom, updateRoom, deleteRoom };
const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const checkRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        
        const rooms = await Room.find({});
        console.log(`\nTotal Rooms: ${rooms.length}\n`);
        
        rooms.forEach(room => {
            console.log(`ID: ${room._id}`);
            console.log(`Name: ${room.name}`);
            console.log(`Type: ${room.type}`);
            console.log(`Price: ${room.price}`);
            console.log(`Room Number: ${room.roomNumber}`);
            console.log('---');
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkRooms();

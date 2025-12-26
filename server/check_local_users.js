const mongoose = require('mongoose');
const User = require('./models/User');

const checkLocalUsers = async () => {
    try {
        // Force local connection for this check
        const localUri = 'mongodb://127.0.0.1:27017/pearl_hotel';
        console.log('Checking local DB:', localUri);
        await mongoose.connect(localUri);
        
        const users = await User.find({});
        console.log('Local Users count:', users.length);
        users.forEach(u => {
            console.log(`User: ${u.firstName} ${u.lastName}, Email: ${u.email}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkLocalUsers();

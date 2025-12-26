const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@pearlhotel.com';
        const password = 'adminpassword123';
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if admin already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Admin user already exists');
            // Update password AND isAdmin
            userExists.password = hashedPassword;
            userExists.isAdmin = true;
            await userExists.save();
            console.log('Existing user updated with new password and Admin privileges');
        } else {
            await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email,
                password: hashedPassword,
                phone: '0000000000',
                isAdmin: true,
                idType: 'Admin',
                idNumber: 'ADMIN123'
            });
            console.log('Admin user created successfully');
        }

        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();

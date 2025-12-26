const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const fs = require('fs');

const checkUsers = async () => {
    try {
        console.log('CWD:', process.cwd());
        try {
            const envContent = fs.readFileSync('.env', 'utf8');
            console.log('.env content length:', envContent.length);
            // console.log('.env content:', envContent); 
        } catch (e) {
            console.log('Could not read .env:', e.message);
        }
        
        console.log('Attempting to connect to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB:', process.env.MONGO_URI);
        const users = await User.find({});
        const output = `Users count: ${users.length}\n` + users.map(u => `User: ${u.firstName} ${u.lastName}, Email: ${u.email}, ID: ${u.idNumber}`).join('\n');
        fs.writeFileSync('users_output.txt', output);
        console.log('Written to users_output.txt');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkUsers();

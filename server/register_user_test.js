const axios = require('axios');

const register = async () => {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            firstName: 'Node',
            lastName: 'Script',
            email: 'nodescript@example.com',
            password: 'password123',
            phone: '1122334455',
            idType: 'PASSPORT',
            idNumber: 'NODE123'
        });
        console.log('Registered:', res.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
};

register();

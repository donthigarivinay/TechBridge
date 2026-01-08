const axios = require('axios');

async function debugRegister() {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/register', {
            name: 'Debug User',
            email: `debug-${Date.now()}@example.com`,
            password: 'password123',
            role: 'CLIENT'
        });
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

debugRegister();

// @ts-nocheck
const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testApi() {
  try {
    const token = jwt.sign({ id: 2, role: 'TOUR_MANAGER' }, 'supersecretjwtkey12345', { expiresIn: '1h' });
    
    console.log('Sending vehicle assignment request...');
    const res = await axios.put('http://localhost:5000/api/bookings/4/assign-vehicle', 
      { vehicleId: 1, vehicleName: 'Test Vehicle', vehicleNumber: 'TN0000', driverName: 'Test Driver' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Response:', res.data);
  } catch (err) {
    console.error('API Error:', err.response ? err.response.data : err.message);
  }
}
testApi();


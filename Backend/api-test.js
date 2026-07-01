// @ts-nocheck
async function testAuth() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'super_admin@travel.com', password: 'password123' })
    });
    const data = await res.json();
    console.log('Login Response:', data.success);

    const token = data.data.token;
    
    // Test creating a destination (protected route)
    const createRes = await fetch('http://localhost:5000/api/destinations', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Test Dest', location: 'Test Loc', description: 'Test desc' })
    });
    const createData = await createRes.json();
    console.log('Create Destination Response:', createData);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();


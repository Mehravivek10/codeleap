// scripts/add-test-user.js
const fetch = require('node-fetch');

async function addTestUser() {
  try {
    // This is the emulator's REST API endpoint for creating users
    const response = await fetch('http://localhost:18199/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-12345', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        returnSecureToken: true
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Error creating test user:', data.error);
      return;
    }

    console.log('Successfully created test user:');
    console.log('User ID:', data.localId);
    console.log('Email:', data.email);
    console.log('ID Token:', data.idToken);
    console.log('Refresh Token:', data.refreshToken);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addTestUser();

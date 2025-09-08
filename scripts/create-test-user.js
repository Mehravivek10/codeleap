// scripts/create-test-user.js
const { getAdminAuth } = require('../src/lib/firebase/admin');

async function createTestUser() {
  try {
    const auth = getAdminAuth();
    
    // Create a test user
    const userRecord = await auth.createUser({
      email: 'test@example.com',
      password: 'password123',
      emailVerified: true,
      displayName: 'Test User',
    });

    console.log('Successfully created test user:');
    console.log('UID:', userRecord.uid);
    console.log('Email:', userRecord.email);
    console.log('Password: password123');
    
    // Create a custom token for testing
    const token = await auth.createCustomToken(userRecord.uid);
    console.log('\nCustom token for testing:');
    console.log(token);
    
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

// Run the function
createTestUser().catch(console.error);
